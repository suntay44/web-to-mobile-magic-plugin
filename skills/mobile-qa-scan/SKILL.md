---
name: mobile-qa-scan
description: QA scan of an existing mobile app. Runs audit script and commands (lint, typecheck, test, build) to produce a structured QA report with pass/fail verdicts. Does not read source files unless a command failure requires diagnosis.
license: MIT
---

# Mobile QA Scan

Produce a structured QA report for an existing mobile app without deep source file reads.

## Token Rule

Run commands and use the audit script JSON. Do not read source files unless a command fails and the error cannot be diagnosed from its output alone.

## Steps

**1. Audit script**

```bash
node scripts/mobile-app-audit.mjs <target-path>
```

Use the JSON for: framework, screens, incomplete markers, nav, auth, state, storage, test libraries, build config, and completion risks.

**2. Run commands**

Run each command that exists in `scripts` and record pass/fail and output:

- Lint (e.g. `eslint`, `expo lint`).
- Typecheck (e.g. `tsc --noEmit`).
- Test suite (e.g. `jest`, `yarn test`).
- Build or export smoke check (e.g. `expo export`).

If a command is missing, record it as not configured.

**3. Write the QA Report**

Create `docs/mobile-qa/YYYY-MM-DD-qa-report.md` with these sections:

- **Summary**: app name, framework, date.
- **Build Health**: lint, typecheck, build — ✅ Pass / ⚠️ Warning / ❌ Fail per check.
- **Test Coverage**: test libraries present, test files found, test run result.
- **Structure Overview**: screen count, partial screens, nav type, key deps.
- **Incomplete Markers**: TODO/FIXME/placeholder counts by file.
- **Risks and Blockers**: from audit `completionRisks` plus command failures.
- **Verdict**: Shippable / Needs Work / Blocked — with one-sentence rationale.

Return a brief summary to chat linking the report file.
