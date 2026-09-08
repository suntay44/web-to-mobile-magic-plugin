# WebToMobile Plan: <project or target>

Plan Status: Planning complete — approval pending

Keep required sections brief. Record evidence once; reference it elsewhere.
Use `None — reason` for inapplicable sections and `Unknown — evidence needed` for unverified areas.

## Capabilities & Limits

State the input tier (URL → UI/UX only, or repo/local → full scope) and what this
plan can and cannot deliver as a result. See `output-contracts.md`.

## Source

Record target, audited revision (when available), and relevant uncommitted changes
so a later session can check whether findings are still current.

## Audit Findings

## Migration Fit Verdict

Recommended path: Expo React Native, Capacitor, PWA/PWABuilder, Stay Web, or Swift/Native.

Include the reason, app-store need, native API need, whether a web wrapper is enough, source reuse potential, and migration risk.

## Route To Mobile Navigation Map

Use a table with: Web Route, Mobile Destination, Navigator Pattern, Reason, Confidence.

## Target Mobile Architecture

## API Needs

Endpoints the mobile app will call, with mobile-auth/CORS/session flags. If no client-callable API exists, record it here as a blocker.

## Reusable Code

## Rewrite-Required Code

## Native Feature Gaps

Use a table with: Web Signal, Mobile Need, Suggested Native/Expo API, Status.

## Unknowns And Blockers

## Implementation Checklist

Order by dependencies; name blockers and the next unblocked item.

`- [ ] Action — source → target paths — done condition — command or Test Plan ID — [from-code|inferred|assumption]`

## Test Plan

## Acceptance Criteria

## Human Sign-Off Required

Items only a human can verify on a real device (pixel accuracy, animation feel, brand color, contrast, multi-OS testing).

## Approval

Record user approval and its scope when given; never infer it from checked items.
Implementation must not begin until the user approves this plan.
