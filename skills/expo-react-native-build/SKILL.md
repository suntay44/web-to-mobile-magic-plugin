---
name: expo-react-native-build
description: Implement an approved web-to-mobile plan in Expo React Native. Use after a Markdown plan exists and the user approved implementation. Executes checklist items and ports reusable web logic.
license: MIT
---

# Expo React Native Build

## Required Gates

Before editing code, confirm:

1. A plan exists under `docs/web-to-mobile/` (migration) or `docs/mobile-resume/` (completion).
2. The plan has an Implementation Checklist.
3. The user approved implementation — if not, return to `mobile-migration-plan` or `mobile-completion-plan`.
4. The approved stack is Expo React Native; otherwise use the plan's handoff.

## Pre-Build Validation

Before screen/component code, verify:

- `app.json` has `name`, `slug`, and `version` set.
- `npx expo-doctor` and `npx expo install --check` pass. Use
  `npx expo install --fix` for dependency alignment; plan SDK upgrades instead
  of silently changing major versions.
- Referenced environment variables appear in `.env.example` or the plan.
- If the plan targets EAS Build, `eas.json` exists with at least one build profile.

If a required value is missing, add it to the plan's Unknowns/Blockers section and ask the user before continuing.

## Build Rules

- Read the checklist, approval, blockers, and sections needed for the current item.
  Reuse unchanged context; do not reload the full plan per edit.
- **Skip `- [x]` items. Implement only `- [ ]` items.**
- Keep changes scoped to the approved plan.
- Follow the plan's reuse/rewrite decisions and mobile-native gaps.
- Use the source repo's package manager and style.
- Reuse TypeScript types, API clients, validation schemas, state patterns, assets, and non-DOM business logic where practical.
- Rewrite DOM components, CSS-dependent UI, browser storage, cookies, and OAuth redirects for mobile.
- For web dependency replacements, read the matching entries in
  `../mobile-migration-plan/references/dependency-substitutions.md`.
- Update checklist items from `- [ ]` to `- [x]` when their done condition is verified.
  Record command, exit code, and key output once; reference shared results.
- Update the plan with deviations, blockers, and the next unblocked item at handoff.

## Expo Implementation Guidance

Cover the approved navigation and screen mappings, API/environment configuration,
mobile auth and secure session storage, native permissions, accessible mobile
layouts, and loading/empty/error states.

## Stop Conditions

Stop and update the plan before continuing when:

- The source audit was wrong.
- A dependency cannot run in React Native.
- Auth or API behavior requires a product decision.
- The implementation needs scope beyond the approved checklist.

End by handing off to `mobile-qa-release`.
