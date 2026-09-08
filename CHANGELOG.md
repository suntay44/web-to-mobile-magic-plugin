# Changelog

All notable changes to WebToMobile are documented here.

## Unreleased

- Add the Claude marketplace catalog required for Git repository installation,
  plus separate instructions for plugin ZIP uploads and individual skill uploads.
- Fix first-time manual installs, honor `CLAUDE_CONFIG_DIR`, and report failed or
  conflicting installs with a nonzero exit status instead of success.
- Guard ZIP installations nested inside another Git repository from updating
  that parent repository; distinguish same-version Git updates from no-op updates.
- Clarify marketplace versus manual updates, project destinations, and symlink lifetime.
- Resume matching plans with approval and evidence checks instead of restarting every audit.
- Reduce repeated plan/reference reads and duplicated planning instructions.
- Make checklists dependency-aware with done conditions, shared verification references,
  and a clear next action; preserve approval for unchanged scope.

## 0.3.0

- Package audit scanners and migration references with their consuming skills.
- Correct Next.js App Router page and API discovery.
- Reuse audit-created plan files across audit and planning phases.
- Route non-Expo migration verdicts to explicit implementation handoffs.
- Reduce mobile screen false positives from normal placeholder props.
- Add ownership markers for copied Windows installations.
- Require maintained Node.js LTS releases and validate on Node.js 22 and 24.
- Update Expo media, QA, accessibility, and dependency guidance.
- Add current Codex marketplace metadata and listing assets.
- Improve repository metadata, contributor guidance, and answer-focused README
  copy.

## 0.2.0

- Added plan-first web-to-mobile and mobile-resume workflows.
- Added web and mobile audit scanners, QA, parity, and review skills.
