# Output Contracts

Shared behavioral rules for all WebToMobile skills.

> *Audience: the AI agent. Skills load these rules during a run. You only need to read this if you are customizing the plugin.*

## Scope Boundaries — Helper, Not Magician

WebToMobile is a **skill/plugin that runs inside an AI coding agent**. It audits, plans, implements, and verifies a website-to-mobile migration. Stay inside this line.

**In scope:**

- Inspect a website (URL) or web source (repo/local) and report findings.
- Produce a Markdown plan and gate on user approval.
- Implement an approved Expo React Native plan. Other verdicts receive an
  explicit handoff; this plugin does not claim a bundled Swift, Capacitor, or
  PWA implementation phase.
- Verify build health, parity, and release readiness with evidence.

**Out of scope — do not drift into becoming something else:**

- Not a hosting, deployment, or CI/CD service. Do not provision infrastructure.
- Not a backend generator. We port/consume an existing API; we do not build one.
- Not a no-code builder or design tool. We do not replace Figma or a designer.
- Not an app-store submission agent. We list release tasks; the human submits.
- Not a credential handler. Never request, store, or transmit secrets/keys.

If a request falls outside this line, say so and point to the human-owned step.

## Capability Tiers — What Input Allows

State the active tier at the top of every plan or report.

- **URL only** → UI/UX scope only. We can infer layout, navigation, and visual direction from public pages. We cannot see component logic, state, API calls, or anything behind auth. Output is a *visual starting point*, written to `docs/web-to-mobile/YYYY-MM-DD-ui-ux-spec.md`.
- **GitHub repo or local path** → full scope. We reuse real logic, map routes, plan rewrites, and implement. Output is the full plan, `docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md`.

## Capability Downgrade

If repo/local access was intended but fails (private repo, clone blocked, missing files), announce the downgrade explicitly: state what failed, drop to the URL/UI-UX tier, and note the reduced scope in the plan. Never silently do less than promised.

## Confidence Labels

Tag planned and reported items so facts and guesses are never voiced in the same confident tone:

- `[from-code]` — verified by reading the source.
- `[inferred]` — deduced from rendered pages or indirect signals.
- `[assumption]` — a guess that needs user confirmation.

## API Needs

Mobile apps need an API to talk to. When the audit detects server-coupled
rendering (server actions, SSR data loaders, or server-only tRPC procedures),
the plan must include an **API Needs** list: the endpoints the mobile app will
call, plus flags for mobile auth, CORS, and session handling. Existing Next.js
Route Handlers and `pages/api` routes are deployed HTTP endpoints; review their
public origin and mobile compatibility rather than declaring them unavailable.
If no client-callable API exists, say so — that is a blocker the human must
resolve, not something we invent.

## Migration Fit Verdict

Every web-to-mobile plan must state the recommended path before implementation: **Expo React Native**, **Capacitor**, **PWA/PWABuilder**, **Stay Web**, or **Swift/Native**. This keeps the workflow honest when a native migration is not justified. Include the reason, app-store need, native API need, whether a web wrapper is enough, source reuse potential, and migration risk.

## Completion States

- **implemented** — no incomplete marker was detected; runtime behavior still
  requires validation.
- **partial** — has TODO, FIXME, an explicit placeholder/not-implemented
  comment, or `return null` without `@ts-ignore`. UI input `placeholder` props
  are not incomplete markers.
- **broken** — `@ts-ignore` combined with `return null`.

Report all three in Completion Status and Screen Inventory.

## Approval Gate

Used by plan/orchestrator skills:

1. Write the plan completely.
2. Summarize done / partial / broken / missing and what the checklist covers.
3. Link the plan file.
4. Ask the user to approve implementation.
5. Do not edit app code until the user approves.

## Resume Safety

Used by `expo-react-native-build`: read the Implementation Checklist first, skip `- [x]` items, implement only `- [ ]` items. Never re-implement completed work.

## Plan-Free Fallback

Used by QA/review skills: if no plan file exists, run generic checks, note the absence in the report, and skip checklist updates.

## Evidence-Backed Verdicts

No ✅ without proof beneath it. Paste the actual command, its exit code, and key output. Record failures with the exact error. Never claim a passing verdict for an area you did not verify.

## Human Sign-Off Required

Some things AI cannot judge from code. Every build workflow closes with an explicit hand-back checklist for the human:

- Pixel-level layout accuracy on a real device.
- Animation and transition feel.
- Brand color rendering on screen.
- Accessibility contrast ratios in the rendered UI.
- Real-device testing across target OS versions.

## Error Recovery

On a failed step: record the exact error, state what was attempted, list what remains unverified, and do not claim success for the unverified area.

## Report Structure

Reports written to `docs/` open with a **Summary** (app/target, framework, date, scope/tier) and close with a **Verdict** using that skill's allowed values. Evidence-backed findings only.

## Checklist Format

```markdown
- [ ] Action — specific file path — verification command — `[from-code|inferred|assumption]`
- [x] Completed action — short note on what was done
```

Items must be executable. No vague items like "improve error handling" with no target file.
