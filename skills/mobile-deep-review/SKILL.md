---
name: mobile-deep-review
description: Senior-level deep review of an existing mobile app. Reads up to 10 targeted files to analyze architecture, code quality, robustness, performance, and security. Produces a prioritized findings report with specific suggestions.
license: MIT
---

# Mobile Deep Review

Perform a senior-level analysis of a mobile app codebase.

## Token Rule

Use the audit script JSON to identify which files to read. Read at most 8–10 targeted files. Do not scan the full codebase blindly.

## Steps

**1. Audit script**

```bash
node scripts/mobile-app-audit.mjs <target-path>
```

Use the JSON to identify: framework, partial screens, nav structure, auth, state, storage, test coverage, build config, and completion risks.

**2. Targeted file reads**

Based on the JSON, read the following if they exist — stop at 10 files:

- App entry point and navigation config.
- 2–3 screens flagged as partial or highest-risk.
- API client or data fetching layer.
- Auth module and session handling.
- State management store.
- Any file with the highest incomplete marker count.

**3. Analyze across six dimensions**

For each file read, note findings with severity — Critical / High / Medium / Low:

- **Architecture**: folder structure, separation of concerns, component design.
- **Code Quality**: naming, DRY violations, dead code, complexity.
- **Robustness**: error handling, null safety, edge cases, loading/empty/error states.
- **Performance**: unnecessary re-renders, heavy operations on render, unoptimized assets, missing memoization.
- **Security**: hardcoded secrets, insecure storage, exposed API keys, unsafe navigation params.
- **What's Unfinished**: incomplete screens, missing flows, deferred features.

**4. Write the Deep Review Report**

Create `docs/mobile-review/YYYY-MM-DD-deep-review.md` with:

- **Summary**: app name, framework, files reviewed, date.
- One section per dimension above.
- Each finding: severity, file path and line, description, suggested fix.
- **Priority List**: top 5 actions ranked by impact.
- **Verdict**: Production-Ready / Needs Refactor / Rewrite Recommended.

Return a brief summary to chat linking the report file.
