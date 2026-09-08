---
name: mobile-resume
description: Resume an unfinished mobile app from an existing plan or audit and plan its completion. Build Expo React Native apps; hand Swift implementation to a native workflow.
license: MIT
---

# MobileResume

Invoke `/mobile-resume [local_path | github_repo_url]` or ask to use this skill.

## Route The Workflow

First look for a plan matching the target and requested work under `docs/mobile-resume/`
or `docs/web-to-mobile/`. Check Source, status/approval, unchecked items, and relevant
changes since its recorded evidence; do not choose by date alone. For a usable plan,
refresh only stale findings, preserve completed items, and continue its next phase.
Missing approval returns to planning; changed scope needs approval. If matching or
freshness cannot be established, audit first. Never infer approval from checkboxes.

Otherwise use one phase skill at a time:

1. `mobile-app-audit` records completion status and evidence.
2. `mobile-completion-plan` writes `docs/mobile-resume/YYYY-MM-DD-mobile-completion-plan.md`.
3. After approval, `expo-react-native-build` implements unchecked items for Expo/React
   Native. Hand Swift plans to the existing native workflow; never invoke the Expo builder.
4. `mobile-qa-release` verifies implementation before completion.

Do not generate or edit app code until a plan exists and the user approved it.

## Target Classification

- No argument: use the current workspace as the mobile app source.
- `https://github.com/<owner>/<repo>`: clone or inspect the repo if permitted; otherwise ask for a local checkout.
- Local path: inspect files directly.

## Stack

Continue in the audited stack unless the user explicitly requests a switch.

## Output Rules

- Use the Markdown plan as external memory and the source of truth.
- Re-read only the relevant plan sections for each phase.
- Reference actual files, screens, navigators, dependencies, and commands.
