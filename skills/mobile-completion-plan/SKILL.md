---
name: mobile-completion-plan
description: Create the required Markdown completion plan for an unfinished mobile app after audit. Covers completion status by area, screen inventory, implementation checklist, test plan, and build checklist. Includes approval gate.
license: MIT
---

# Mobile Completion Plan

Create the Markdown source of truth for completing an unfinished mobile app.

## Required Input

Use audit findings from `mobile-app-audit`. If no audit exists, stop and audit first.

## Plan File

Create:

```text
docs/mobile-resume/YYYY-MM-DD-mobile-completion-plan.md
```

Use the current local date. If that filename exists, append a short suffix such as `-2`.

## Required Sections

The plan must include:

- **Source**: repo, framework, SDK version.
- **Audit Findings**: from the audit phase (may already be written to the file).
- **Completion Status**: Done / Partial / Broken / Missing for each area (screens, nav, API, auth, state, permissions, assets, tests, build config). Broken items are higher priority than partial.
- **Screen Inventory and Status**: each screen listed with its file path and status (implemented / partial / broken).
- **Implementation Checklist**: Markdown checkboxes with specific file paths and verification commands.
- **Test Plan**: what to run and what to add.
- **Build and Release Checklist**: `app.json`, `eas.json`, signing, env vars.
- **Acceptance Criteria**: conditions that define completion.
- **Approval**: do not edit app code before approval.

The Implementation Checklist must be executable. Example: `- [ ] Complete \`screens/ProfileScreen.tsx\` — replace stub with real data from \`src/api/user.ts\`.`

Avoid vague items like "finish the UI" or "add error handling everywhere". List broken screens before partial screens in the checklist.

## Approval Gate

After writing the plan:

1. Summarize what is done, partial, broken, and missing.
2. Link or point to the plan file.
3. Ask the user to approve implementation.

Do not edit app code before approval.
