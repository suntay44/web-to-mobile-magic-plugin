---
name: mobile-parity-check
description: Verify design and functional parity between the implemented mobile app and its web source. Use after expo-react-native-build in the web-to-mobile workflow to check feature completeness, visual alignment, and key user flows.
license: MIT
---

# Mobile Parity Check

Verify that the mobile implementation faithfully matches the web source before QA.

## Required Input

Use the approved plan under `docs/web-to-mobile/` — specifically the Route To Mobile Navigation Map, Reusable Code, and Acceptance Criteria sections. If no plan exists, stop and return to `mobile-migration-plan`.

## Functional Parity

For each route in the Route To Mobile Navigation Map:

- Confirm the mapped mobile screen exists and is implemented.
- Confirm all interactions from the web route (forms, buttons, links, data display) are present in the mobile screen.
- Note any web feature that was deferred — it must appear in the plan as an explicit deferral, not a silent omission.

## Design Parity

Check what the agent can verify in code:

- Colors: confirm design tokens or hardcoded values match the web source palette.
- Typography: confirm font family, size scale, and weight usage aligns with the web source.
- Spacing and layout: confirm component hierarchy and padding constants are consistent.
- Icons and assets: confirm correct assets are used, not placeholders.

Flag deviations with the specific file and line where the mismatch occurs.

## Human Review Required

Mark the following for explicit human visual sign-off — the agent cannot verify these in code:

- Pixel-level layout accuracy on device.
- Animation and transition feel.
- Brand color rendering on screen.
- Accessibility contrast ratios in the rendered UI.

See Human Sign-Off Required in
`../mobile-migration-plan/references/output-contracts.md`.

## Plan Update

Add a "Parity Review" section to the plan listing: agent-verified items, agent-flagged deviations, and items requiring human visual sign-off.

## Handoff

End by handing off to `mobile-qa-release`.
