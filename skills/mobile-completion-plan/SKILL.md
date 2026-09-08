---
name: mobile-completion-plan
description: Plan completion of an audited unfinished mobile app with prioritized tasks, verification, acceptance criteria, and an approval gate.
license: MIT
---

# Mobile Completion Plan

## Required Input

Use audit findings from `mobile-app-audit`. If no audit exists, stop and audit first.

## Plan File

Use `docs/mobile-resume/YYYY-MM-DD-mobile-completion-plan.md`.

Use the current local date for a new run. For the current run, update that file in place,
preserving Audit Findings, completed items, and approval history. An audit file marked
`Plan Status: Audit complete — planning pending` is the same run. Add a numeric
suffix only for a distinct run whose filename collides.

## Required Sections

- **Source**: repo, framework, SDK version, audited revision when available, and relevant uncommitted changes.
- **Audit Findings**: preserve the audit's evidence.
- **Completion Status**: Done / Partial / Broken / Missing for screens, nav, API, auth, state, permissions, assets, tests, build config; distinguish unverified areas.
- **Screen Inventory and Status**: file path and implemented / partial / broken per screen; implemented does not imply runtime verification.
- **Implementation Checklist**: checkboxes with file paths, observable done conditions, and verification commands (or Test Plan IDs).
- **Test Plan**: what to run and what to add.
- **Build and Release Checklist**: app config, env vars, and signing; include `eas.json` only when EAS is targeted.
- **Acceptance Criteria**: conditions that define completion.
- **Approval**: do not edit app code before approval.

Order executable tasks by dependencies, prioritizing broken screens over partial
screens. Identify blocked items and the next unblocked action. Record evidence and
shared verification commands once, then reference them. Use `None` with a reason
for inapplicable sections and `Unknown` for unverified areas.

## Approval Gate

For unapproved or changed scope, set `Plan Status: Planning complete — approval pending`,
link the plan, summarize status/blockers, and request approval. Preserve existing
approval for unchanged scope. Do not edit app code before approval.
