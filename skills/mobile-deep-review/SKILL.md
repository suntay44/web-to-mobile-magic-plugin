---
name: mobile-deep-review
description: Senior-level deep review of an existing mobile app. Reads up to 15 targeted files to analyze architecture, code quality, robustness, performance, and security. Produces a prioritized findings report with specific suggestions.
license: MIT
---

# Mobile Deep Review

Perform a senior-level analysis of a mobile app codebase.

## Token Rule

Use the audit script JSON to identify which files to read. Read at most 15% of source files scanned, capped at 15 files. Do not scan the full codebase blindly.

## Steps

**1. Audit script**

```bash
node <mobile-app-audit-skill-dir>/scripts/mobile-app-audit.mjs <target-path>
```

Resolve `<mobile-app-audit-skill-dir>` from the installed sibling
`../mobile-app-audit` skill directory, not from the user's working directory.
Use the JSON to identify: framework, partial/broken screens, nav structure,
auth, state, storage, test coverage, build config, and completion risks.

**2. Targeted file reads**

Based on the JSON, prioritize reads in this order — stop at the file cap:

- App entry point and navigation config.
- All broken screens (highest priority).
- 2–3 screens flagged as partial.
- API client or data fetching layer.
- Auth module and session handling.
- State management store.
- Any file with the highest incomplete marker count.

**3. Analyze across six dimensions**

Tag each finding with an ID (`[F01]`, `[F02]`, …) and severity — Critical / High / Medium / Low:

- **Architecture**: folder structure, separation of concerns, component design.
- **Code Quality**: naming, DRY violations, dead code, complexity.
- **Robustness**: error handling, null safety, edge cases, loading/empty/error states.
- **Performance**: FlatList vs ScrollView on large lists, inline style objects recreated on render, missing `useCallback`/`useMemo`, heavy work on the JS thread, unoptimized assets.
- **Security**: hardcoded secrets, insecure AsyncStorage for tokens, exposed API keys, unsafe navigation params (object injection), deep link hijacking risk, debug flags left enabled.
- **What's Unfinished**: incomplete screens, missing flows, deferred features, broken screens.

**4. Write the Deep Review Report**

Create `docs/mobile-review/YYYY-MM-DD-deep-review.md` with:

- **Summary**: app name, framework, file cap used, files reviewed, date.
- One section per dimension above with tagged findings.
- Each finding: `[FXX]` ID, severity, file path and line, description, suggested fix.
- **Priority List**: top 5 actions ranked by impact, referencing finding IDs.
- **Verdict**: `Production-Ready` / `Needs Refactor` / `Rewrite Recommended`.

Return a brief summary to chat linking the report file.
