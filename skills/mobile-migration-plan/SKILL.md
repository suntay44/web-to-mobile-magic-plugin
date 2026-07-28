---
name: mobile-migration-plan
description: Create an approval-gated web-to-mobile plan with a route map, stack verdict, reuse/rewrite split, checklist, tests, and acceptance criteria.
license: MIT
---

# Mobile Migration Plan

## Required Input

Use `web-to-mobile-audit` findings. If none exist, stop and audit first. Use its
recommended stack unless the evidence changes.

## Plan File

For repo/local input create:

```text
docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md
```

For URL-only input create `docs/web-to-mobile/YYYY-MM-DD-ui-ux-spec.md` and
limit scope to layout, navigation, and visual direction (see
`references/output-contracts.md`).

Use the current local date. If the audit already created the current run's file
with `Plan Status: Audit complete — planning pending`, update that file in place
and preserve its Audit Findings. Never add `-2` solely because the audit created
the planned filename. Add a numeric suffix only for a distinct migration run
when the existing file is already planned, approved, or completed. Use
`references/plan-template.md` as the template when available.

## Required Sections

Follow `references/plan-template.md` in order, including Capabilities & Limits,
Migration Fit Verdict, API Needs, Reusable Code, Rewrite-Required Code, Native
Feature Gaps, Unknowns And Blockers, Implementation Checklist, and Human
Sign-Off Required.

The Migration Fit Verdict must choose Expo React Native, Capacitor,
PWA/PWABuilder, Stay Web, or Swift/Native. Do not force native migration when a
wrapper or PWA is enough.

The verdict controls the next phase:

- **Expo React Native** → request approval, then hand off to
  `expo-react-native-build`.
- **Capacitor**, **PWA/PWABuilder**, or **Stay Web** → end this workflow after
  approval with an explicit web-stack handoff. Do not invoke the Expo builder or
  mobile parity phase.
- **Swift/Native** → end with a native-team implementation handoff. This plugin
  can plan that path but does not claim a bundled Swift implementation phase.

Before the checklist, consult `references/framework-migration-notes.md` and
`references/dependency-substitutions.md` for the reuse/rewrite split, mobile
equivalents, and difficulty.

The Route To Mobile Navigation Map must contain Web Route, Mobile Destination,
Navigator Pattern, Reason, and Confidence. Use tabs for primary areas, stacks
for detail, auth flows for login/signup, modals for focused flows, and explicit
deferrals.

The Implementation Checklist needs checkboxes, file paths, source → target
mappings, verification commands, and a confidence label (`[from-code]`,
`[inferred]`, `[assumption]`) per item.

Avoid vague items. Keep reusable, rewrite-required, mobile-native gaps, and
unknowns/blockers distinct.

## Approval Gate

After writing the plan:

1. Summarize the plan briefly.
2. Link or point to the plan file.
3. Ask the user to approve implementation.
4. Set `Plan Status: Planning complete — approval pending`.

Do not edit app code before approval.
