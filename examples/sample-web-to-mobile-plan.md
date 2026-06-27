# WebToMobile Plan: Sample Dashboard

## Capabilities & Limits

Full repo scope. This plan can reuse source-backed API and type code, but it cannot resolve mobile auth redirects or app-store release decisions without human confirmation.

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

## Migration Fit Verdict

Recommended path: Expo React Native.

| Signal | Verdict | Reason |
| --- | --- | --- |
| App-store need | Yes | Product requires a native app install path. |
| Native API need | Medium | Auth storage and deep links need mobile-native handling. |
| Web wrapper enough | No | Dashboard navigation and session handling need native UX work. |
| Source reuse potential | Medium | API client and types are reusable; DOM UI and CSS need rewrite. |
| Migration risk | Medium | OAuth redirect and cookie session behavior are blockers until confirmed. |

## Route To Mobile Navigation Map

| Web Route | Mobile Destination | Navigator Pattern | Reason | Confidence |
| --- | --- | --- | --- | --- |
| `/` | `HomeScreen` | Stack root | Public landing content can become the initial screen. | `[from-code]` |
| `/login` | `AuthStack/LoginScreen` | Auth flow | OAuth redirect needs mobile auth session handling. | `[from-code]` |
| `/dashboard` | `DashboardTabs` | Tabs | Dashboard is a primary signed-in area. | `[from-code]` |
| `/settings` | `SettingsScreen` | Stack screen | Settings is a secondary signed-in screen with native form controls. | `[from-code]` |

## Target Mobile Architecture

- Expo app with file-based or stack/tab navigation.
- Shared API client adapted from `src/lib/api.ts`.
- Secure token/session storage with platform storage instead of browser cookies.
- Component rewrite from DOM/Tailwind to React Native primitives and styles.

## API Needs

| Endpoint or Source | Mobile Auth / CORS / Session Notes | Status |
| --- | --- | --- |
| `src/lib/api.ts` base URL | Confirm mobile-accessible base URL and token/session format. | Needs confirmation |

## Reusable Code

- Reuse TypeScript types, API request shapes, validation schemas, and static assets.

## Rewrite-Required Code

- Rewrite DOM components, route layouts, CSS/Tailwind styles, browser storage, and OAuth callback behavior.

## Native Feature Gaps

| Web Signal | Mobile Need | Suggested Native/Expo API | Status |
| --- | --- | --- | --- |
| OAuth redirect | Mobile-safe auth redirect and callback | `expo-auth-session` + deep links | Blocker until configured |
| Browser cookie session | Secure token/session storage | `expo-secure-store` | Rewrite |
| Dense dashboard layout | Small-screen navigation and scrolling | React Navigation tabs + RN layout | Rewrite |

## Unknowns And Blockers

- Confirm production API base URL is callable from mobile.
- Confirm OAuth redirect URIs for iOS and Android.
- Confirm whether push notifications are in v1 or deferred.

## Implementation Checklist

- [ ] Create Expo app shell and navigation from route map — source routes `/`, `/login`, `/dashboard`, `/settings` → mobile destinations above — `npm run lint` — `[from-code]`.
- [ ] Port shared API client from `src/lib/api.ts` to mobile API layer — verify with unit test or smoke call — `[from-code]`.
- [ ] Implement `HomeScreen` from `/` route content — run component smoke check — `[from-code]`.
- [ ] Implement `AuthStack/LoginScreen` with mobile-safe auth flow — verify login/logout manually — `[from-code]`.
- [ ] Implement `DashboardTabs` from `/dashboard` route — verify dashboard API data loads — `[from-code]`.
- [ ] Implement `SettingsScreen` from `/settings` route — verify settings form validation and submission — `[from-code]`.
- [ ] Run `npm run lint` — record exit code and key output — `[from-code]`.
- [ ] Run `npm run typecheck` — record exit code and key output — `[from-code]`.
- [ ] Run `npm test` — record exit code and key output — `[from-code]`.
- [ ] Run Expo smoke test — record environment and result — `[assumption]`.

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

## Human Sign-Off Required

- Pixel-level layout accuracy on a real device.
- Animation and transition feel.
- Brand color rendering on screen.
- Accessibility contrast ratios in rendered UI.
- Real-device testing on target iOS and Android versions.

## Approval

Implementation must not begin until the user approves this plan.
