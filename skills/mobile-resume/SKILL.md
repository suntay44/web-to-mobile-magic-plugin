---
name: mobile-resume
description: Orchestrate end-to-end completion of an unfinished Expo React Native or Swift mobile app. Use for /mobile-resume, resuming a partial mobile app, finishing an incomplete app, or developing remaining mobile features.
license: MIT
---

# MobileResume

One-command orchestrator for auditing and completing an unfinished mobile app.

The public invocation is:

```text
/mobile-resume [local_path | github_repo_url]
```

In Codex surfaces, users may invoke this as:

```text
$mobile-resume [local_path | github_repo_url]
```

## Route The Workflow

Use one phase skill at a time:

1. `mobile-app-audit` inspects the existing app and records what is complete, partial, and missing.
2. `mobile-completion-plan` creates `docs/mobile-resume/YYYY-MM-DD-mobile-completion-plan.md` with a completion checklist, test plan, and approval gate.
3. `expo-react-native-build` runs only after the user approved it and implements from the checklist — skip already-checked `- [x]` items, implement only `- [ ]` items.
4. `mobile-qa-release` verifies before completion.

Do not generate or edit app code until a plan exists and the user approved it.

## Target Classification

Classify the optional argument:

- No argument: use the current workspace as the mobile app source.
- `https://github.com/<owner>/<repo>`: clone or inspect the repo if permitted; otherwise ask for a local checkout.
- Local path: inspect files directly.

## Stack

Detect the existing stack from the audit and continue in that stack. Do not switch frameworks unless the user explicitly requests it.

## Output Rules

- Use the Markdown plan as external memory and the source of truth.
- Re-read only the relevant plan sections for each phase.
- Reference actual files, screens, navigators, dependencies, and commands.
