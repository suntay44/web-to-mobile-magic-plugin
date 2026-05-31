---
name: web-to-mobile
description: Orchestrate website or web app conversion into a mobile app. Use for /web-to-mobile, web-to-mobile migration, Expo React Native app conversion, iOS app conversion, Android app conversion, website URL, GitHub repo, or local web project.
license: MIT
---

# WebToMobile

One-command orchestrator for turning a website or web app into a mobile app.

The public invocation is:

```text
/web-to-mobile [website_url | github_repo_url | local_path]
```

In Codex, users can ask: "Use the web-to-mobile skill on [website_url | github_repo_url | local_path]."

## Route The Workflow

Use one phase skill at a time:

1. `web-to-mobile-audit` inspects the target and records evidence.
2. `mobile-migration-plan` creates `docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md` with route map, checklist, test plan, acceptance criteria, and approval gate.
3. `expo-react-native-build` runs only after user approval and implements from the checklist.
4. `mobile-parity-check` verifies design and functional parity against the web source.
5. `mobile-qa-release` verifies build health, performance, and accessibility before completion.

Do not skip directly to build work. Do not generate or edit app code until a plan exists and the user approved it.

## Target Classification

Classify the optional argument:

- No argument: use the current workspace as the source web app.
- `http://` or `https://` non-GitHub URL: treat as a live website.
- `https://github.com/<owner>/<repo>`: treat as a GitHub repository.
- Local path: treat as a local source folder.

For live websites, inspect public pages with available browser/fetch tools. This is the UI/UX-only tier: you can plan layout, navigation, and visual direction, but not logic, state, or API behavior. Explain that a faithful code port requires repository or local source access (see `references/output-contracts.md`).

For GitHub repositories, clone or inspect the repo only when the environment and permissions allow it. If cloning is not possible, ask the user to provide a local checkout.

For local folders or current workspaces, inspect files directly before advising.

## Stack Default

Default to Expo React Native.

Use Swift/SwiftUI only when:

- The user explicitly asks for iOS-only.
- The approved plan requires deep Apple-native behavior.
- Native performance or Apple polish matters more than cross-platform delivery.
- The existing team/codebase is Swift-native.

## Output Rules

- Use the Markdown plan as external memory and the source of truth.
- Re-read only the relevant plan sections for each phase.
- Reference actual files, routes, dependencies, commands, or observed URLs.
- Keep simple static sites lightweight and split complex SaaS apps into phases.
