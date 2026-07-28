---
name: mobile-qa-release
description: Verify a web-to-mobile implementation before completion. Use after build work to run lint, typecheck, tests, Expo smoke checks, device checks, update the checklist, and document risks.
license: MIT
---

# Mobile QA Release

Verify before claiming the mobile migration is complete.

## Verification Rules

Do not claim completion without fresh evidence. Paste each command, its exit
code, and key output beneath the check — no ✅ without proof (see
`../mobile-migration-plan/references/output-contracts.md`). Work from the
approved Markdown plan (under `docs/web-to-mobile/` or `docs/mobile-resume/`
depending on the workflow) and the implementation changes. If no plan file
exists, proceed with generic checks, note the absence in the report, and skip
checklist update steps.

Run relevant checks from the plan and repo, such as:

- Dependency install or resolution.
- Lint.
- Typecheck.
- Unit tests.
- Integration or component tests.
- Expo start, export, build, or prebuild smoke check.
- iOS simulator, Android emulator, browser preview, or physical-device smoke test when available.
- Manual checks for navigation, auth, forms, API calls, storage, media, permissions, loading states, and error states.

**Performance:**

- Run `npx expo-doctor`, `npx expo install --check`, and `npx expo export` for
  Expo projects. Compare per-platform JavaScript/assets against the project's
  recorded baseline or budget; if none exists, record a baseline without
  inventing a universal threshold.
- Observe cold-start time on simulator or device; note if sluggish.
- Spot-check scroll and transition FPS on list screens; note jank.
- Confirm images are appropriately sized and not loading full-resolution web assets.

**Accessibility:**

- Confirm every interactive element has an accessible name. Native text
  children may already provide one; add `accessibilityLabel` when the visible
  content does not describe the action (for example, icon-only controls).
- Confirm text respects system font scaling (no fixed-height containers that clip scaled text).
- Confirm `accessibilityRole` is set on custom interactive components.
- Note any color-only information that may fail contrast requirements.

**Responsive Layout:**

- Spot-check core screens at 375px width (small phone) and 430px width (large phone).
- Confirm portrait and landscape orientations do not break layout on core screens.

If a check cannot be run, state why and record the risk in the plan.

## Plan Updates

Before final response:

- Mark completed verification checklist items with `- [x]`.
- Leave incomplete items unchecked.
- Add a "Verification Notes" section if the plan does not already have one.
- Record commands run, pass/fail status, and remaining risks.

## Release Readiness

Confirm or document:

- All mapped web routes have mobile destinations or explicit deferrals.
- Auth/session behavior works or has a documented blocker.
- API calls work or have documented failures.
- Native permissions are configured or deferred.
- App can start/build in the available environment.
- Performance and accessibility checks passed or risks are documented.
- Parity review completed or deferred items documented (web-to-mobile flow only).
- Remaining manual QA and store-release tasks are listed.

Only then provide a concise completion summary with evidence.
