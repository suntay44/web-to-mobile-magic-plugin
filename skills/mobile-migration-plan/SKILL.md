---
name: mobile-migration-plan
description: Create the required Markdown web-to-mobile migration plan after audit. Use for route-to-navigation mapping, Expo or Swift stack choice, reuse/rewrite plan, checklist, tests, acceptance criteria, and approval.
license: MIT
---

# Mobile Migration Plan

Create the Markdown source of truth for a web-to-mobile migration.

## Required Input

Use audit findings from `web-to-mobile-audit`. If no audit exists, stop and audit first.

## Target Stack

Use the stack the audit recommended. Revisit only if new Apple-native requirements emerge from the audit findings.

## Plan File

For repo/local input create:

```text
docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md
```

For URL-only input the scope is UI/UX only — create `docs/web-to-mobile/YYYY-MM-DD-ui-ux-spec.md` instead and limit the plan to layout, navigation, and visual direction (see `references/output-contracts.md`).

Use the current local date. If that filename exists, append a short suffix such as `-2`. Use `references/plan-template.md` as the template when available.

## Required Sections

Follow all sections in `references/plan-template.md` in order, including Capabilities & Limits, API Needs, and Human Sign-Off Required. The plan must cover Reusable Code, Rewrite-Required Code, Unknowns And Blockers, and the Implementation Checklist at minimum.

The Implementation Checklist must use Markdown checkboxes with specific file paths, source → target mappings, verification commands, and a confidence label (`[from-code]`, `[inferred]`, `[assumption]`) per item. Example: `- [ ] Port API client from \`src/api.ts\` to \`mobile/api.ts\` — \`[from-code]\`.`

Avoid vague checklist items like "improve UI" or "add best practices".

Always distinguish reusable code, rewrite-required code, mobile-native gaps, and unknowns/blockers. Do not merge them into one generic migration notes section.

## Approval Gate

After writing the plan:

1. Summarize the plan briefly.
2. Link or point to the plan file.
3. Ask the user to approve implementation.

Do not edit app code before approval.
