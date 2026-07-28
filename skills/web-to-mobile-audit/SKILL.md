---
name: web-to-mobile-audit
description: Audit a website, GitHub repo, local folder, or workspace before web-to-mobile work. Use to inspect framework, routes, UI, auth, APIs, state, styling, assets, tests, and mobile risks.
license: MIT
---

# WebToMobile Audit

Inspect the source before anyone plans or builds a mobile app. Accept: current workspace (no argument), live URL, GitHub repo URL, or local path.

## Capability Tier

Declare the tier up front (see
`../mobile-migration-plan/references/output-contracts.md`):

- **URL only** → UI/UX inspection only; no component logic, state, API, or authed pages.
- **Repo or local** → full source analysis.

If repo/local access fails, announce the downgrade and drop to the URL tier. Never silently do less.

## Early Disqualification

Resolve this skill's directory from the loaded `SKILL.md`, then run
`node <skill-dir>/scripts/web-repo-audit.mjs <target-path>` for local repos.
Do not resolve the script from the user's working directory. Check
`inputClassification`:

- `already-mobile` → stop. Repo has Expo/React Native/`ios`/`android`. Redirect to `/mobile-resume` or `/mobile-review`.
- `backend-only` → stop. No frontend to port. Ask for the web client repo.
- `static-html` → URL-tier scope only. No component logic to reuse.
- `web-frontend` or `unknown` → proceed.

## What To Identify (Repo/Local)

The audit JSON covers framework, deps, scripts, routes, rendering model, internal API routes, and browser-API risks — do not re-read those files unless a value is ambiguous. Additionally identify:

- Framework and runtime (from JSON `frameworks` array).
- route/page inventory and layout hierarchy.
- API clients, data fetching, server actions, RPC, GraphQL, REST.
- Rendering model: `renderingModel` + `internalApiRoutes`. Server Actions,
  server-only data access, and SSR loaders may require new client-callable
  endpoints. Existing Route Handlers and `pages/api` endpoints are HTTP
  endpoints; review their auth, CORS, deployment URL, and mobile compatibility
  instead of treating them as automatically unavailable.
- Auth: sessions, cookies, OAuth, protected routes.
- State, forms, validation, query/cache libraries.
- Styling system and design tokens.
- Browser-only deps and DOM assumptions.
- Env vars, tests, lint, build commands.

## What To Identify (URL Only)

Use the available browser/fetch tools. Check `/sitemap.xml` and `/robots.txt` first. Then: page inventory, navigation and key flows, native-sensitive features (forms, login, upload, maps, camera), responsive pain points, discoverable API calls, unknowns needing source access.

## Output

Consult `../mobile-migration-plan/references/dependency-substitutions.md` when
listing dep risks — tag each as drop-in / config / rewrite. Write findings into
`## Audit Findings` in the plan file (repo/local:
`docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md`; URL-only:
`docs/web-to-mobile/YYYY-MM-DD-ui-ux-spec.md`). Use concrete evidence. Tag
findings `[from-code]`, `[inferred]`, or `[assumption]`. Return a brief summary.
Add `Plan Status: Audit complete — planning pending` near the top so the planning
phase can recognize and update this same file. End with a clear handoff to
`mobile-migration-plan`.
