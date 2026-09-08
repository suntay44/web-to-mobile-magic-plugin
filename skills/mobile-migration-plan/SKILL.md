---
name: mobile-migration-plan
description: Create an approval-gated web-to-mobile plan with a route map, stack verdict, reuse/rewrite split, checklist, tests, and acceptance criteria.
license: MIT
---

# Mobile Migration Plan

## Required Input

Use `web-to-mobile-audit` findings and recommended stack unless evidence changes.
If findings are missing, audit first.

## Plan File

Repo/local: `docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md`.
URL-only: `docs/web-to-mobile/YYYY-MM-DD-ui-ux-spec.md`; layout, navigation,
and visual direction only (see `references/output-contracts.md`).

Use the current local date for a new run. For the current run, update that file in place,
preserving Audit Findings, completed items, and approval history. An audit file marked
`Plan Status: Audit complete — planning pending` is the same run. Add a numeric
suffix only for a distinct run whose filename collides.

## Required Sections

Follow `references/plan-template.md` in order, including Capabilities & Limits,
Migration Fit Verdict, API Needs, Reusable Code, Rewrite-Required Code, Native
Feature Gaps, Unknowns And Blockers, Implementation Checklist, and Human
Sign-Off Required.

The Migration Fit Verdict chooses one path. Do not force native when a wrapper
or PWA suffices. The verdict controls the next phase:

- **Expo React Native** → approval, then `expo-react-native-build`.
- **Capacitor**, **PWA/PWABuilder**, **Stay Web** → approval, then explicit
  web-stack handoff; no Expo build or mobile parity phase.
- **Swift/Native** → native-team handoff after approval; no bundled implementation.

Read only the detected framework's section in `references/framework-migration-notes.md`
and relevant packages in `references/dependency-substitutions.md` for reuse/rewrite
decisions, equivalents, and difficulty. Reuse findings already in context.

In the Route To Mobile Navigation Map, use tabs for primary areas, stacks for
details, auth flows for login/signup, modals for focused flows, and explicit deferrals.

The Implementation Checklist needs checkboxes, file paths, source → target
mappings, an observable done condition, verification commands (or Test Plan IDs),
and a confidence label (`[from-code]`, `[inferred]`, `[assumption]`) per item.
Order by dependencies; identify blocked items and the next unblocked action.

Keep required sections compact: record evidence once and reference it elsewhere;
use `None` with a reason for inapplicable sections, and `Unknown` for unverified areas.
Keep reusable, rewrite-required, mobile-native gaps, and unknowns/blockers distinct.

## Approval Gate

For unapproved or changed scope, set `Plan Status: Planning complete — approval pending`,
link the plan, summarize scope/blockers, and request approval. Preserve existing
approval for unchanged scope. Do not edit app code before approval.
