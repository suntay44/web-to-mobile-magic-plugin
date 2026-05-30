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

Use the JSON for: framework, screens (implemented/partial/broken counts), incomplete markers, nav, auth, state, storage, test libraries, build config, and completion risks.

**2. Run commands**

Discover commands in this priority order: check `scripts` in `package.json` first, then fall back to the tool directly, then check `devDependencies` for the tool.

- **Lint**: `npm run lint` → `eslint .` → skip if eslint not in devDeps.
- **Typecheck**: `npm run typecheck` → `tsc --noEmit` → skip if no tsconfig.
- **Tests**: `npm test` → `jest` → skip if no test library detected.
- **Build smoke check**: `npm run build` → `expo export` → skip if no expo in deps.

Record pass/fail and captured output for each — no ✅ without captured output (see `references/output-contracts.md`). If a command is missing, record as "not configured."

**3. Write the QA Report**

Create `docs/mobile-qa/YYYY-MM-DD-qa-report.md` with:

- **Summary**: app name, framework, date.
- **Build Health**: lint, typecheck, build — ✅ Pass / ⚠️ Warning / ❌ Fail per check.
- **Test Coverage**: test libraries present, test file count, test run result.
- **Structure Overview**: screen counts (implemented/partial/broken), nav type, key deps.
- **Bundle Size**: report `expo export` output size. ⚠️ Warn if >2 MB total, ❌ flag if >5 MB.
- **Incomplete Markers**: TODO/FIXME/placeholder counts by file.
- **Risks and Blockers**: from audit `completionRisks` plus command failures.
- **Verdict**: `Shippable` / `Needs Work` / `Blocked` — with one-sentence rationale per area and an overall verdict.

Return a brief summary to chat linking the report file.
