# WebToMobile v0.1.0 Next Steps

This file tracks the practical work needed to make the first public release stable, useful, and easy to maintain.

## Release Readiness

- [ ] Commit the latest README, installer, manifest, and validation updates.
- [ ] Push `main` to GitHub.
- [ ] Run final validation:
  - `node --check scripts/install.mjs`
  - `node tests/validate-structure.mjs`
  - Codex plugin validation
  - Skill validation for every `skills/*/SKILL.md`
- [ ] Tag the first release:
  - `git tag v0.1.0`
  - `git push origin main --tags`
- [ ] Add a short GitHub release note summarizing the initial command set and supported workflows.

## User Experience

- [ ] Keep `/web-to-mobile` as the primary entry point for users starting from a website, GitHub repo, or local web project.
- [ ] Keep `/mobile-resume`, `/mobile-scan`, `/mobile-review`, `/mobile-audit`, and `/mobile-qa` as supporting commands.
- [ ] Keep README install instructions accurate for Claude Code, Cursor, and Codex.
- [ ] Keep URL-only expectations clear: URL input supports UI/UX planning, while repo/local source access supports deeper migration and implementation.
- [ ] Keep `--update` as the normal user update path and `--refresh` as the local/manual update path.

## Validation And Trust

- [ ] Add GitHub Actions to run:
  - `node --check scripts/install.mjs`
  - `node tests/validate-structure.mjs`
- [ ] Keep validators enforcing:
  - command-to-skill wiring
  - skill word-count limits
  - manifest URLs
  - no broad `--force` installer mode
  - audit script output fields
- [ ] Keep fixtures minimal: one web fixture and one partial mobile fixture are enough for v0.1.0.

## Migration Quality

- [ ] Improve audit detection only where it directly helps web-to-mobile migration quality.
- [ ] Prioritize common web stacks:
  - Next.js App Router
  - React Router
  - Vite React
  - Remix
- [ ] Improve dependency substitution notes for:
  - auth
  - routing
  - storage/cookies
  - API/data fetching
  - forms/validation
  - CSS/Tailwind/UI libraries
- [ ] Keep plans separating:
  - reusable code
  - rewrite-required code
  - mobile-native gaps
  - unknowns and blockers
  - human sign-off items

## Defer Until After v0.1.0

- Docs website
- Large example app collection
- Custom agents
- Hooks
- Release automation
- Marketplace sync scripts
- Many framework-specific fixtures

## Maintenance Rule

Only add work that clearly improves at least one of these:

- install clarity
- migration quality
- agent accuracy
- token efficiency
- validation and contributor trust
