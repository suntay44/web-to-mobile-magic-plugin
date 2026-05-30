---
name: web-to-mobile-audit
description: Audit a website, GitHub repo, local folder, or workspace before web-to-mobile work. Use to inspect framework, routes, UI, auth, APIs, state, styling, assets, tests, and mobile risks.
license: MIT
---

# WebToMobile Audit

Inspect the source before anyone plans or builds a mobile app.

## Inputs

Accept one target:

- No target: current workspace.
- Live website URL.
- GitHub repository URL.
- Local folder path.

## Capability Tier

Declare the tier up front (see `references/output-contracts.md`):

- **URL only** → UI/UX inspection only; no component logic, state, API, or authed pages.
- **Repo or local** → full source analysis.

If repo/local access was intended but fails (private repo, clone blocked), announce the downgrade and drop to the URL tier. Never silently do less.

## Required Behavior

Do not propose implementation until the audit is complete or the inspection limits are documented.

For local repos, first run the bundled audit script when available:

```bash
node scripts/web-repo-audit.mjs <target-path>
```

Use the JSON as a starting point. It covers framework, deps, scripts, routes, rendering model, internal API routes, browser-API risks, and config files — do not re-read those files unless a value is ambiguous.

For local or GitHub repos, identify:

- Framework and runtime.
- Package manager and useful scripts.
- Routing system and route/page inventory.
- Layout hierarchy and shared UI components.
- API clients, data fetching, server actions, RPC, GraphQL, or REST usage.
- Rendering model and backend coupling: SSR / server actions / internal API routes vs a SPA on an external API (`renderingModel`, `internalApiRoutes`). Server-coupled apps expose no portable API — record an API Needs blocker.
- Auth model, sessions, cookies, OAuth redirects, protected routes.
- State management, forms, validation, query/cache libraries.
- Styling system and design tokens.
- Assets: images, fonts, icons, media.
- Browser-only dependencies and DOM assumptions.
- Tests, lint, typecheck, build commands, and CI hints.
- Environment variables and deployment assumptions.

For live websites, use WebFetch. Check `/sitemap.xml` and `/robots.txt` first for page inventory. Then identify:

- Visible sitemap or page inventory.
- Navigation model and key user flows.
- Forms, login, checkout, upload, media, map, camera, or other native-sensitive features.
- Responsive behavior and mobile pain points.
- Public API calls if discoverable.
- Unknowns that need source access.

## Output

Write raw findings into `## Audit Findings`. For repo/local input use `docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md`; for URL-only input use `docs/web-to-mobile/YYYY-MM-DD-ui-ux-spec.md` (create with just that section if the full plan is not ready). Use concrete evidence: file paths, routes, dep names, script names, URLs, risks, and unknowns. Tag findings `[from-code]`, `[inferred]`, or `[assumption]`. Return a brief summary to chat. End with a clear handoff to `mobile-migration-plan`.
