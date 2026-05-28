# WebToMobile Plan: Sample Dashboard

## Source

- Target: `https://github.com/example/sample-dashboard`
- Source type: GitHub repository
- Web framework: Next.js app router
- Default mobile target: Expo React Native

## Audit Findings

- Routes found: `/`, `/login`, `/dashboard`, `/settings`.
- Auth appears to use a browser cookie session and OAuth redirect.
- API calls are centralized in `src/lib/api.ts`.
- UI components are in `src/components`.
- Styling uses Tailwind utility classes.
- Existing checks: `npm run lint`, `npm run typecheck`, `npm test`.

## Route To Mobile Navigation Map

| Web Route | Mobile Destination | Notes |
| --- | --- | --- |
| `/` | `HomeScreen` | Public landing content can become the initial screen. |
| `/login` | `LoginScreen` | OAuth redirect needs mobile auth session handling. |
| `/dashboard` | `DashboardTabs` | Split dashboard widgets into tab screens if dense. |
| `/settings` | `SettingsScreen` | Use native form controls where possible. |

## Target Mobile Architecture

- Expo app with file-based or stack/tab navigation.
- Shared API client adapted from `src/lib/api.ts`.
- Secure token/session storage with platform storage instead of browser cookies.
- Component rewrite from DOM/Tailwind to React Native primitives and styles.

## Reuse And Rewrite Plan

- Reuse TypeScript types, API request shapes, validation schemas, and static assets.
- Rewrite DOM components, route layouts, CSS/Tailwind styles, browser storage, and OAuth callback behavior.

## Native Feature Gaps

- OAuth redirect must use mobile deep links or Expo AuthSession.
- Cookie storage must be replaced with secure platform storage.
- Dashboard layout must be redesigned for small screens.

## Implementation Checklist

- [ ] Create Expo app shell and navigation.
- [ ] Port shared API client from `src/lib/api.ts`.
- [ ] Implement `HomeScreen`.
- [ ] Implement `LoginScreen` with mobile-safe auth flow.
- [ ] Implement `DashboardTabs`.
- [ ] Implement `SettingsScreen`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm test`.
- [ ] Run Expo smoke test.

## Test Plan

- Verify navigation between all mapped screens.
- Verify login/logout flow.
- Verify dashboard API data loads.
- Verify settings form validation and submission.
- Run existing lint, typecheck, and tests.

## Acceptance Criteria

- All mapped web routes have mobile destinations.
- Auth flow works on mobile or remaining auth risk is documented.
- API client is reused or intentionally replaced.
- Verification commands pass or failures are documented.

## Approval

Implementation must not begin until the user approves this plan.
