# Output Contracts

Shared behavioral rules for all WebToMobile skills.

## Completion States

Three screen completion states apply in both audit and plan skills:

- **implemented** — screen renders real data, no stubs, no suppressed errors.
- **partial** — has TODO, FIXME, placeholder text, or `return null` without `@ts-ignore`.
- **broken** — has `@ts-ignore` combined with `return null` (type errors silenced alongside empty render).

Report all three in Completion Status and Screen Inventory sections.

## Approval Gate

Used by: `mobile-migration-plan`, `mobile-completion-plan`, `web-to-mobile`, `mobile-resume`.

1. Write the plan completely.
2. Summarize: what is done / partial / missing, and what the checklist covers.
3. Link the plan file.
4. Ask the user explicitly to approve implementation.
5. Do not edit app code until the user approves.

## Resume Safety

Used by: `expo-react-native-build` when called from a resume workflow.

- Read the plan's Implementation Checklist before writing any code.
- Skip items already marked `- [x]`.
- Only implement items marked `- [ ]`.
- Do not re-implement completed work.

## Plan-Free Fallback

Used by: `mobile-qa-release`, `mobile-qa-scan`, `mobile-deep-review`.

If no plan file exists under `docs/`, proceed with generic checks. Note the absence of a plan in the report and skip checklist update steps.

## Error Recovery

If a required step fails (audit script error, missing dep, broken build):

1. Record the failure with the exact error message.
2. State what was attempted.
3. List what remains unverified as a result.
4. Do not claim a passing verdict for unverified areas.

## Report Structure

All reports written to `docs/` must include:

- **Summary** at the top: app name, framework, date, scope.
- **Verdict** at the bottom: one of the allowed verdict values for that skill.
- Evidence-backed findings only — no speculation without a file path or command output.

## Checklist Format

```markdown
- [ ] Action — specific file path — verification command or acceptance condition
- [x] Completed action — short note on what was done
```

Items must be executable. Avoid vague items like "improve error handling" with no target file.
