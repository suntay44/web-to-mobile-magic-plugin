# WebToMobile Completion Plan: PartialExpoApp

## Source

Local path: `tests/fixtures/partial-expo-app`
Framework: Expo ~51.0.0 / React Native 0.74.0
Package manager: npm

## Audit Findings

Detected 2 screens. `ProfileScreen` is partial (returns null, has TODO and FIXME markers). `HomeScreen` is fully implemented.
Auth via Supabase detected. Secure storage via `expo-secure-store` detected. Navigation via `@react-navigation`.
No EAS build config (`eas.json` missing). Test libraries present (jest, @testing-library/react-native) but no test files found.

## Completion Status

| Area | Status |
|------|--------|
| Screens | Partial — 1 of 2 complete |
| Navigation | Implemented |
| Auth | Partial — Supabase configured, session handling missing |
| State | Implemented — Zustand |
| Storage | Configured |
| Tests | Missing — no test files found |
| Build config | Missing `eas.json` |

## Screen Inventory and Status

| Screen | File | Status |
|--------|------|--------|
| HomeScreen | `src/screens/HomeScreen.tsx` | Done |
| ProfileScreen | `src/screens/ProfileScreen.tsx` | Partial — returns null, no API integration |

## Implementation Checklist

- [ ] Complete `src/screens/ProfileScreen.tsx` — fetch user from Supabase, display name, avatar, and email.
- [ ] Add auth session handling in `src/lib/auth.ts` — persist session via `expo-secure-store`.
- [ ] Add `eas.json` with development and production build profiles.
- [ ] Write component test for `ProfileScreen` in `src/screens/__tests__/ProfileScreen.test.tsx` covering loading, data, and error states.
- [ ] Verify with `npm test`.

## Test Plan

- Run `npm test` after each checklist item.
- Add coverage for loading state, populated state, and error state in `ProfileScreen`.

## Build and Release Checklist

- [ ] Create `eas.json` with `development` and `production` profiles.
- [ ] Configure app signing in EAS dashboard.
- [ ] Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` as EAS environment variables.
- [ ] Run `eas build --platform all --profile production` and confirm success.

## Acceptance Criteria

- `ProfileScreen` loads and displays real user data from Supabase.
- Session persists across app restarts using `expo-secure-store`.
- All tests pass with `npm test`.
- EAS production build succeeds for both iOS and Android.

## Approval

Implementation must not begin until the user approves this plan.
