---
name: expo-react-native-build
description: Implement an approved web-to-mobile plan in Expo React Native. Use after a Markdown plan exists and the user approved implementation. Executes checklist items and ports reusable web logic.
license: MIT
---

# Expo React Native Build

Implement the approved plan — works for both web-to-mobile migrations and mobile app completions.

## Required Gates

Before editing code, confirm:

1. A plan exists under `docs/web-to-mobile/` (migration) or `docs/mobile-resume/` (completion).
2. The plan has an Implementation Checklist.
3. The user approved implementation — if not, return to `mobile-migration-plan` or `mobile-completion-plan`.

## Pre-Build Validation

Before writing any screen or component code, verify:

- `app.json` has `name`, `slug`, and `version` set.
- Any environment variables referenced in source code have corresponding entries in `.env.example` or are documented in the plan.
- If the plan targets EAS Build, `eas.json` exists with at least one build profile.

If a required value is missing, add it to the plan's Unknowns/Blockers section and ask the user before continuing.

## Build Rules

- Re-read the plan before editing.
- **Skip `- [x]` items. Implement only `- [ ]` items.**
- Keep changes scoped to the approved plan.
- Follow the plan's reusable code, rewrite-required code, mobile-native gaps, and unknowns/blockers sections.
- Use the source repo's package manager and style.
- Prefer Expo React Native unless the approved plan selected Swift/SwiftUI.
- Reuse TypeScript types, API clients, validation schemas, state patterns, assets, and non-DOM business logic where practical.
- Rewrite DOM components, CSS-dependent UI, browser storage, cookies, and OAuth redirects for mobile.
- Update checklist items from `- [ ]` to `- [x]` as they are completed.
- Add a short implementation note in the plan if reality differs from the original plan.

## Expo Implementation Guidance

When creating or updating an Expo app, cover:

- Navigation: stack, tabs, drawers, or file-based routing as appropriate.
- Screens mapped from web routes.
- API client and environment configuration.
- Auth flow with mobile-safe session handling.
- Secure storage for tokens or session data.
- Native permissions for camera, media, location, push, or files.
- Mobile layout, accessibility labels, loading states, empty states, and error states.

## Stop Conditions

Stop and update the plan before continuing when:

- The source audit was wrong.
- A dependency cannot run in React Native.
- Auth or API behavior requires a product decision.
- The implementation needs scope beyond the approved checklist.

End by handing off to `mobile-qa-release`.
