# WebToMobile Pressure Scenarios

Use these scenarios to verify that `skills/web-to-mobile/SKILL.md` changes agent behavior instead of acting like a generic prompt enhancer.

## Resume An Approved Plan

Prompt: `/mobile-resume .` with an approved matching plan, completed items,
and unchanged source/config since its recorded evidence.

Expected behavior:

- Reuse the plan, read the next item's relevant sections, and skip completed work.
- Continue without repeating the audit or asking for unchanged approval.
- If only verification remains, proceed to QA with fresh command evidence.
- A newer plan for a different target must not replace the matching plan.

## Resume With Stale Or Unapproved Evidence

Prompt: `/mobile-resume .` with a matching plan whose auth dependency changed
since audit, or whose checkboxes are populated but approval is absent.

Expected behavior:

- Refresh affected findings and audit if freshness cannot be established.
- Preserve completed work; surface changed scope for approval before implementation.
- Never treat checked items as approval or static scanner status as runtime proof.

## Compact Executable Plan

Prompt: plan a small app with several tasks sharing a verification command and
one task blocked on an unresolved API decision.

Expected behavior:

- Keep required sections; distinguish inapplicable sections from unknowns.
- Record the shared command once and reference it from tasks with file paths and done conditions.
- Order tasks by dependencies; identify the blocker and next unblocked action.
- Read relevant framework/package reference sections without loading unrelated guidance.

## Scenario 1: Next.js App Conversion

Prompt:

```text
/web-to-mobile ./fixtures/nextjs-shop
```

Expected behavior:

- Agent inspects the repo before suggesting implementation.
- Agent identifies framework, routes, scripts, auth/API/state/styling where present.
- Agent creates `docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md`.
- Agent waits for approval before editing code.

## Scenario 2: Live Website Only

Prompt:

```text
/web-to-mobile https://example.com
```

Expected behavior:

- Agent inspects public pages with available tools.
- Agent explains implementation limits without source access.
- Agent creates a plan based on observable pages and explicit unknowns.
- Agent does not pretend it can faithfully port private code it cannot see.

## Scenario 3: GitHub Repo URL

Prompt:

```text
/web-to-mobile https://github.com/example/sample-dashboard
```

Expected behavior:

- Agent clones or inspects the repo if permitted.
- Agent asks for a local checkout if repo access is blocked.
- Agent maps routes to mobile screens.
- Agent creates an implementation checklist with file-specific tasks.

## Scenario 4: User Asks To Skip Planning

Prompt:

```text
Just generate the React Native app from this website. Skip the audit.
```

Expected behavior:

- Agent still audits first and creates the Markdown plan.
- Agent only skips the full migration workflow if the user explicitly asks for a throwaway prototype.

## Scenario 5: Simple Static Site

Prompt:

```text
/web-to-mobile ./fixtures/static-portfolio
```

Expected behavior:

- Agent creates a lightweight plan.
- Agent does not invent a complex SaaS architecture.
- Agent maps simple pages to a small mobile navigation model.

## Scenario 6: Authenticated SaaS App

Prompt:

```text
/web-to-mobile ./fixtures/authenticated-saas
```

Expected behavior:

- Agent identifies auth, API, storage, navigation, permissions, and mobile UX risks.
- Agent creates a phased implementation checklist.
- Agent includes verification for auth, protected screens, API calls, forms, and storage.

## Scenario 7: Existing Partial Expo App

Prompt:

```text
/mobile-resume ./fixtures/partial-expo-app
```

Expected behavior:

- Agent runs `mobile-app-audit` before suggesting any implementation.
- Agent identifies partial screens, incomplete markers (TODO/FIXME), and missing config.
- Agent creates `docs/mobile-resume/YYYY-MM-DD-mobile-completion-plan.md`.
- Agent waits for approval before editing code.

## Scenario 8: GitHub Repo With Incomplete Mobile App

Prompt:

```text
/mobile-resume https://github.com/example/unfinished-mobile-app
```

Expected behavior:

- Agent clones or inspects the repo if permitted.
- Agent asks for a local checkout if repo access is blocked.
- Agent identifies what is complete, partial, and missing.
- Agent creates a completion plan with file-specific checklist items.

## Scenario 9: User Asks To Skip Audit For Mobile Resume

Prompt:

```text
Just start building the missing screens, skip the audit.
```

Expected behavior:

- Agent still audits and creates a completion plan before writing any code.
- Agent only skips the full workflow if the user explicitly asks for a throwaway prototype.

## Scenario 11: QA Scan of Partial Mobile App

Prompt:

```text
/mobile-scan ./my-unfinished-app
```

Expected behavior:

- Agent runs `mobile-app-audit.mjs` and lint/typecheck/test/build commands.
- Agent does not read individual source files unless a command failure requires diagnosis.
- Agent produces `docs/mobile-qa/YYYY-MM-DD-qa-report.md` with pass/fail verdicts per check.
- Agent returns a Shippable / Needs Work / Blocked verdict with rationale.

## Scenario 12: Deep Senior Review of Partial Mobile App

Prompt:

```text
/mobile-review ./my-unfinished-app
```

Expected behavior:

- Agent runs `mobile-app-audit.mjs` and uses JSON to identify 5–10 critical files.
- Agent reads only targeted files — not the full codebase.
- Agent produces `docs/mobile-review/YYYY-MM-DD-deep-review.md` with severity-tagged findings across architecture, code quality, robustness, performance, and security.
- Agent provides a prioritized top-5 action list and a Production-Ready / Needs Refactor / Rewrite Recommended verdict.

## Scenario 10: Design Parity Check After Build

Prompt:

```text
Check that the mobile app matches the original website's design and features.
```

Expected behavior:

- Agent runs `mobile-parity-check` against the Route To Mobile Navigation Map in the plan.
- Agent confirms each mapped web route has a corresponding mobile screen with all interactions.
- Agent checks design tokens, typography, and assets in code and flags deviations with file and line references.
- Agent lists items requiring human visual sign-off rather than claiming full parity.
- Agent does not mark parity complete for items it cannot verify programmatically.
