---
name: mobile-app-audit
description: Audit an existing unfinished Expo React Native or Swift mobile app. Identifies what is complete, partial, and missing across screens, navigation, APIs, auth, storage, tests, and build config. Use before mobile-completion-plan.
license: MIT
---

# MobileApp Audit

Inspect an existing mobile app before completion planning.

## Inputs

Accept one target:

- No target: current workspace.
- GitHub repository URL.
- Local folder path.

## Required Behavior

Do not propose implementation until the audit is complete.

For local repos, run the bundled audit script when available:

```bash
node scripts/mobile-app-audit.mjs <target-path>
```

The JSON covers screens, navigators, incomplete markers, missing config, and test coverage — do not re-read those files unless the JSON value is ambiguous.

## Completion States

The audit script reports three screen states:

- **implemented** — renders real data with no stubs or suppressed errors.
- **partial** — has TODO, FIXME, placeholder text, or `return null` without `@ts-ignore`.
- **broken** — has `@ts-ignore` combined with `return null` (type errors suppressed alongside empty render).

Report all three counts. Broken screens are higher priority than partial screens in the completion plan.

## Expo Router Awareness

For apps using `expo-router`, the `app/` directory uses file-based routing. The audit script excludes `_layout.*` files (navigator definitions) from the screen list. Group directories like `(auth)` or `(tabs)` are transparent routing segments — their children are the actual screens.

## What To Identify

- Framework: Expo SDK version, React Native version, or Swift/SwiftUI.
- Package manager and scripts: start, build, test, lint, typecheck, eas build.
- Navigation structure: stacks, tabs, drawers, file-based routing, and screen inventory.
- Screen completion status: implemented, partial, or broken (see Completion States above).
- API integration: implemented calls, stubbed or mocked endpoints, missing integrations.
- Auth flow: implemented, partial, or missing. Session handling and secure storage status.
- State management: complete, partial, or missing.
- Native permissions: configured, missing, or untested.
- Assets: present, placeholder, or missing.
- Tests: present, partial, or missing by area.
- Build config: `app.json`, `eas.json`, environment variables, signing.
- Known blockers: broken imports, missing deps, type errors, or failing builds.

## Output

Write raw findings directly into `## Audit Findings` in `docs/mobile-resume/YYYY-MM-DD-mobile-completion-plan.md` (create the file with just that section if the full plan is not ready). Use concrete evidence: file paths, screen names, dep names, error messages, and TODO locations. Return a brief summary to chat. End with a clear handoff to `mobile-completion-plan`.
