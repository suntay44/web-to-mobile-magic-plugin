# Dependency Substitutions

Web → mobile equivalents for common packages. Used by `web-to-mobile-audit` and `mobile-migration-plan` when building the Implementation Checklist.

Difficulty: **drop-in** (works unchanged or near-unchanged) · **config** (works with setup changes) · **rewrite** (API differs significantly)

---

## Routing

| Web | Mobile equivalent | Difficulty | Notes |
|-----|------------------|------------|-------|
| `react-router-dom` | `@react-navigation/native` | rewrite | Stack/Tab/Drawer navigators replace `<Route>`. No web URLs. |
| `@tanstack/react-router` | `@react-navigation/native` | rewrite | Same — no RN target exists. |
| `next/link`, `next/router` | `expo-router` or `@react-navigation/native` | rewrite | If using Expo Router, file-based routing is available. |
| `next/navigation` (App Router) | `expo-router` hooks | rewrite | `useRouter`, `usePathname`, `useSearchParams` have Expo equivalents. |

---

## Styling

| Web | Mobile equivalent | Difficulty | Notes |
|-----|------------------|------------|-------|
| `tailwindcss` | `nativewind` | config | Add Babel plugin and `tailwind.config.js` preset. Most class names work. |
| `styled-components` | `styled-components/native` | config | Import from `/native` instead of root. |
| `@emotion/react` | `@emotion/native` | config | Same pattern — use native primitives. |
| `sass` / `less` | Remove | rewrite | No CSS file support in RN. Use `StyleSheet` or a CSS-in-JS lib. |
| `bootstrap` | Remove | rewrite | No DOM. Use a RN UI library instead. |
| `class-variance-authority` (CVA) | Keep if using NativeWind | drop-in | Works with NativeWind className approach. |

---

## UI Components

| Web | Mobile equivalent | Difficulty | Notes |
|-----|------------------|------------|-------|
| `@radix-ui/*` | Remove | rewrite | DOM-only. Use RN primitives or `@rn-primitives/*`. |
| `shadcn/ui` | `react-native-reusables` | rewrite | Community RN port of shadcn patterns. |
| `@mui/material` | `react-native-paper` or `@rneui/themed` | rewrite | Different APIs, similar patterns. |
| `antd` | Remove | rewrite | No RN version. Rebuild with RN primitives. |
| `framer-motion` | `react-native-reanimated` | rewrite | Different API. Gesture-based animation uses `react-native-gesture-handler`. |
| `react-spring` | `react-native-reanimated` | rewrite | Same recommendation. |
| `next/image` | `expo-image` | config | Different props (`source`, `contentFit`). Handles caching and blurhash. |
| `next/font` | `expo-font` + `useFonts` hook | config | Load fonts in `_layout.tsx` or `App.tsx`. |

---

## Data Fetching & State

| Web | Mobile equivalent | Difficulty | Notes |
|-----|------------------|------------|-------|
| `@tanstack/react-query` | Same | drop-in | Works in RN unchanged. |
| `swr` | Same | drop-in | Works in RN unchanged. |
| `axios` | Same | drop-in | Works in RN unchanged. |
| `ky` | Same | drop-in | Works in RN unchanged. |
| `graphql` + `@apollo/client` | Same | drop-in | Works in RN unchanged. |
| `urql` | Same | drop-in | Works in RN unchanged. |
| `@trpc/client` | Same | drop-in | Works in RN if server is accessible. |
| `zustand` | Same | drop-in | Works in RN unchanged. |
| `jotai` | Same | drop-in | Works in RN unchanged. |
| `redux` + `@reduxjs/toolkit` | Same | drop-in | Works in RN unchanged. |
| `recoil` | Same | drop-in | Works in RN unchanged. |

---

## Auth

| Web | Mobile equivalent | Difficulty | Notes |
|-----|------------------|------------|-------|
| `@clerk/nextjs` | `@clerk/clerk-expo` | config | Different package and provider setup. Token storage uses `expo-secure-store`. |
| `@clerk/clerk-react` | `@clerk/clerk-expo` | config | Same. |
| `next-auth` / `@auth/core` | Manual OAuth or `expo-auth-session` | rewrite | No direct port. Mobile needs deep-link redirect URIs and PKCE. |
| `@supabase/supabase-js` | Same | config | Works in RN. Use `expo-secure-store` adapter for session storage. |
| `firebase` (Auth) | Same | config | Works in RN. Use `@react-native-firebase/auth` for native performance. |

---

## Storage

| Web | Mobile equivalent | Difficulty | Notes |
|-----|------------------|------------|-------|
| `localStorage` | `@react-native-async-storage/async-storage` | config | Async API — no synchronous access. |
| `sessionStorage` | In-memory state (Zustand, React state) | config | No session-scoped storage in RN. |
| `document.cookie` | `expo-secure-store` (for tokens) | rewrite | Cookies don't exist in RN. Secure store for sensitive data. |
| `IndexedDB` | `react-native-mmkv` or SQLite | rewrite | No IndexedDB in RN. MMKV for key-value, SQLite for relational. |

---

## Forms & Validation

| Web | Mobile equivalent | Difficulty | Notes |
|-----|------------------|------------|-------|
| `react-hook-form` | Same | drop-in | Works in RN unchanged. |
| `formik` | Same | drop-in | Works in RN unchanged. |
| `zod` | Same | drop-in | Works in RN unchanged. |
| `yup` | Same | drop-in | Works in RN unchanged. |
| `valibot` | Same | drop-in | Works in RN unchanged. |

---

## Maps, Media & Native

| Web | Mobile equivalent | Difficulty | Notes |
|-----|------------------|------------|-------|
| Google Maps embed | `react-native-maps` | rewrite | Requires API key config in `app.json`. |
| `react-dropzone` | `expo-document-picker` or `expo-image-picker` | rewrite | Native file/image picker replaces drag-and-drop. |
| `react-webcam` | `expo-camera` | rewrite | Native camera access. |
| HTML `<video>` | `expo-av` or `react-native-video` | rewrite | Native video player. |
| Web Push / Notifications | `expo-notifications` | rewrite | Requires push token setup and server integration. |
| Geolocation API | `expo-location` | config | Permission setup required in `app.json`. |
