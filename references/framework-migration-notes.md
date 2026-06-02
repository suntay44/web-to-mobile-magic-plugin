# Framework Migration Notes

Per-framework migration guidance. Used by `mobile-migration-plan` when writing Reusable Code, Rewrite-Required Code, and Unknowns sections. Match the detected framework from the audit JSON `frameworks` array.

> *Audience: the AI agent. The agent reads the section matching your framework. Useful for humans planning a migration by hand too.*

---

## Next.js — App Router (`app/` directory)

**Reusable:** TypeScript types, API client code that hits external URLs, Zod schemas, utility functions, non-DOM business logic, form validation, data fetching hooks that use `fetch` with external URLs.

**Rewrite-required:**
- Server Components → convert to regular React components with data fetched in a hook or query.
- Server Actions (`"use server"`) → expose as API endpoints (or use existing tRPC/REST routes if present); the mobile app calls them over HTTP.
- `next/image` → `expo-image` (different props).
- `next/font` → `expo-font` + `useFonts`.
- `next/link`, `useRouter` (App Router) → Expo Router or React Navigation.
- Metadata exports (`export const metadata`) → remove; handle with `expo-router`'s `<Stack.Screen options>`.
- Middleware (`middleware.ts`) → no equivalent; auth guards move to navigation-level checks.

**API Needs:** If data is fetched via Server Components or Server Actions with no external API, there is no portable API. The team must expose the data as HTTP endpoints before the mobile app can consume it. Flag as a blocker.

**Key risk:** `renderingModel: server-coupled` almost always means this gap exists. Check `internalApiRoutes` in the audit JSON.

---

## Next.js — Pages Router (`pages/` directory)

**Reusable:** Same as App Router above for utilities, types, and external API clients. `pages/api/` routes are internal and not callable from mobile directly.

**Rewrite-required:**
- `getServerSideProps` → fetch the same data from an external API endpoint in a `useEffect` or query hook.
- `getStaticProps` / `getStaticPaths` → data fetching moves entirely to the client.
- `next/link`, `useRouter` → React Navigation or Expo Router.
- `_app.tsx` / `_document.tsx` → becomes `App.tsx` or `_layout.tsx` in Expo.
- CSS Modules → `StyleSheet.create` or NativeWind.

**API Needs:** `pages/api/` routes are server-only. If the frontend calls its own `/api/` routes, those calls must be redirected to a standalone server or the logic must be extracted into a shared module callable from both.

---

## Vite + React (SPA)

**Reusable:** Almost everything. This is the cleanest migration path. Business logic, API clients, state management, form validation, and data fetching hooks all port directly if they don't use browser APIs.

**Rewrite-required:**
- CSS / Tailwind styling → NativeWind or `StyleSheet`.
- `<div>`, `<span>`, `<p>`, `<img>` → `<View>`, `<Text>`, `<Image>`.
- Browser-storage usage (localStorage, sessionStorage) → AsyncStorage or SecureStore.
- React Router DOM → React Navigation or Expo Router.
- DOM-dependent UI libraries → see `references/dependency-substitutions.md`.

**API Needs:** SPA almost always calls an external API. Reuse the same base URL. Check for `VITE_API_URL` or similar env vars — these need to move to Expo/EAS config.

---

## Remix

**Reusable:** Route-independent utilities, Zod schemas, external fetch calls inside loaders if they hit a real external API.

**Rewrite-required:**
- Loaders (`loader` exports) → data fetching moves to query hooks calling external endpoints.
- Actions (`action` exports) → either call the same external API or expose a REST endpoint.
- Remix file-based routing → React Navigation or Expo Router.
- `useFetcher`, `useActionData`, `useLoaderData` → replace with React Query / SWR hooks.
- `<Form>` (Remix) → `react-hook-form` with native `<TextInput>` / `<TouchableOpacity>`.

**API Needs:** Remix loaders/actions are server-side by definition. If the data source is a database or internal service, it is not callable from mobile. Exposing a REST or tRPC API layer is required.

---

## Nuxt (Vue)

**Reusable:** Business logic in plain `.js`/`.ts` composables with no DOM or Vue template dependency, Zod/Yup schemas, external API calls.

**Rewrite-required:**
- All Vue templates (`.vue` files) → React Native components.
- Vue Router → React Navigation.
- Nuxt composables (`useFetch`, `useAsyncData`) → React Query or `fetch` in hooks.
- Pinia / Vuex → Zustand or Jotai.
- Nuxt server routes (`server/api/`) → same gap as Next.js API routes.

**API Needs:** Check for `server/api/` directory. If present, those routes are server-only.

**Note:** This is a framework rewrite (Vue → React), not just a platform port. Scope accurately — the Implementation Checklist will be long.

---

## SvelteKit

**Reusable:** Plain TypeScript utility functions and schemas with no Svelte or browser dependency.

**Rewrite-required:**
- All Svelte components (`.svelte` files) → React Native components (full rewrite).
- SvelteKit load functions → data fetching hooks.
- Svelte stores → Zustand or Jotai.
- SvelteKit routing → React Navigation or Expo Router.

**API Needs:** `src/routes/api/` or `+server.ts` files are server-only. Same gap as Next.js.

**Note:** Framework rewrite (Svelte → React). Scope and timeline accordingly.

---

## Plain React (no meta-framework)

**Reusable:** All non-DOM logic, hooks, utilities, API clients, state, schemas. Often the cleanest migration after Vite React SPA.

**Rewrite-required:**
- HTML elements → RN primitives.
- CSS → StyleSheet or NativeWind.
- Browser APIs → RN/Expo equivalents.
- React Router DOM → React Navigation.

**API Needs:** Check how data is fetched. If calling an external API directly, the mobile app uses the same endpoints.

---

## Astro

**Reusable:** Content data (markdown, MDX) structure, utility functions without DOM dependency.

**Rewrite-required:**
- All `.astro` components → React Native components.
- Astro content collections → local JSON or a headless CMS API call.
- Islands (React, Vue, Svelte inside Astro) → extract and rewrite as RN components.
- Astro SSR endpoints → same server-coupling gap.

**Note:** Astro is primarily a content/static site tool. The migration produces a content-reading mobile app, not a feature-equivalent port.

---

## Static HTML (no framework)

Scope is UI/UX only regardless of input tier. There is no component logic, state, or API client to reuse. The plan covers layout, navigation structure, and visual direction only. Implementation starts from scratch in Expo React Native.
