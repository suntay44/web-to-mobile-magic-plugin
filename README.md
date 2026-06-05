<div align="center">

<br />

<img width="1920" height="600" alt="WebToMobile — open-source AI plugin that converts any website or web app into a native Expo React Native mobile app, for Claude Code, Cursor, and Codex" src="https://github.com/user-attachments/assets/13ad5b52-bdd9-4ad8-8568-4e542d50074e" />




### Open-Source AI Skills & Plugin for Coding Agents
### ⭐ Stars are appreciated!

**Turn websites and web repos into audited mobile migration plans and Expo React Native implementation workflows.**<br />
Plan-first. Approval-gated. Works with Claude Code, Cursor, and Codex.

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Works with Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-darkorange)](https://claude.ai/code)
[![Works with Codex](https://img.shields.io/badge/Codex-Plugin-blue)](https://chatgpt.com/codex)
[![Works with Cursor](https://img.shields.io/badge/Cursor-Plugin-black)](https://cursor.sh)
[![Expo React Native](https://img.shields.io/badge/Target-Expo%20React%20Native-4630EB)](https://expo.dev)

<br />

</div>

---

## What It Does

**WebToMobile is an open-source AI plugin and skill set that converts a website or web app into a native mobile app** (Expo React Native) — directly inside Claude Code, Cursor, or Codex. Point it at a URL, a GitHub repo, or a local web project, and it audits the source, writes an approval-gated migration plan, builds the mobile app, and verifies the result.

It gives AI coding agents six commands for website-to-mobile work:

- Convert a website or web repo into an Expo React Native migration plan
- Finish an unfinished mobile app
- Run QA checks and senior-style mobile reviews
- Keep the workflow audit-first, plan-first, and approval-gated

It is a **helper, not a magician**. The quality of the result depends on the source you provide.

---

## Input Matters

| You provide | What WebToMobile can do |
|-------------|--------------------------|
| Live website URL | UI/UX-focused mobile plan from public pages: layout, navigation, visual hierarchy, and a mobile shell. It cannot see private code, API logic, state, auth, or anything behind login. |
| GitHub repo or local path | Full source-backed migration plan: routes, framework, scripts, auth, APIs, styling, browser-only APIs, env vars, reusable logic, rewrite-required code, mobile-native gaps, and blockers. |

> **Rule of thumb:** URL gets you a faithful *interface*. Repo gets you a faithful *app*.

---

## Scope

WebToMobile runs inside your AI coding agent. It audits your web source, writes an approval-gated plan, implements the approved checklist in Expo React Native, and verifies the result with real evidence.

It deliberately does **not** replace your backend, deploy infrastructure, submit to app stores, or handle secrets.

| Not this | Because |
|----------|---------|
| Hosting, deployment, or CI/CD | We're a coding helper, not infrastructure. We list the release steps; your pipeline runs them. |
| Backend / API generation | We reuse or consume your existing API. If a website is server-coupled with no client API, we flag it as a blocker — we don't invent one. |
| No-code builder or design tool | We don't replace Figma or a designer. We translate what exists. |
| App Store / Play Store submission | We produce the release checklist; a human submits. |
| Secret/credential handling | We never request, store, or transmit keys or tokens. |

Outputs are evidence-backed and confidence-labeled: `[from-code]`, `[inferred]`, or `[assumption]`. Human-only checks like pixel fidelity, animation feel, brand judgment, and real-device testing are called out explicitly.

---

## Why It Helps

Going from a website to a mobile app usually means a lot of manual back-and-forth: explaining your project, hunting for which parts can be reused, and hoping nothing important gets missed. WebToMobile turns that into a repeatable flow.

- **One command instead of many prompts.** You point it at your source once; it does the audit instead of you re-explaining the project each turn.
- **Reusable vs. rewrite is decided for you.** The audit separates code you can port directly from code that needs a mobile rewrite, so you are not guessing.
- **Web routes become a mobile navigation map.** The plan maps routes like `/dashboard`, `/settings`, or `/products/:id` into reviewed mobile destinations such as tabs, stacks, detail screens, auth flows, or modals.
- **Risks surface before you build.** Auth, API, storage, browser-only APIs, routing, and server-coupling issues are flagged in the plan — not discovered halfway through.
- **The plan is your memory.** Progress lives in a Markdown checklist you can read, resume, and review — not buried in chat history.
- **Checks happen before "done."** Verification is part of the workflow, not something you have to remember to ask for.

> Results depend on your project's size, framework, and how much source access you give the agent. A URL gives less than a full repo.

---

## Updating

Most users should update with one command from the cloned repo:

```bash
node scripts/install.mjs --update
```

`--update` pulls the latest WebToMobile from GitHub, then refreshes the installed Claude commands and skills.

Use `--refresh` only when you already have the version you want locally:

```bash
node scripts/install.mjs --refresh
```

Common cases:

| Use case | Command |
|----------|---------|
| You want the latest release from GitHub | `node scripts/install.mjs --update` |
| You edited the plugin locally and want Claude to use your edits | `node scripts/install.mjs --refresh` |
| You already ran `git pull` yourself | `node scripts/install.mjs --refresh` |
| You installed from a ZIP download | Download the latest ZIP, replace the folder, then run `node scripts/install.mjs --refresh` |

`--update` refuses to run if you have local uncommitted changes. It will ask you to commit/stash or update manually first.

---

## Commands

| Command | Scenario | What it does |
|---------|----------|--------------|
| `/web-to-mobile` | **Start from a website or web app** | Audit, plan, approve, build, parity-check, and QA an Expo React Native migration |
| `/mobile-resume` | **Finish an unfinished mobile app** | Audit the app, plan remaining work, approve, build, and QA |
| `/mobile-scan` | **Fast QA report** | Run commands only and produce a Shippable / Needs Work / Blocked report |
| `/mobile-review` | **Deep senior review** | Read targeted files and report architecture, quality, robustness, performance, and security issues |
| `/mobile-audit` | **Mobile audit only** | Inspect an existing mobile app and report complete, partial, and missing areas |
| `/mobile-qa` | **Final verification** | Verify a mobile app against its approved plan before completion |

---

## Typical Use

```
/web-to-mobile https://yourwebsite.com          # UI/UX only — visual starting point
/web-to-mobile https://github.com/you/your-web-app   # full port — reuses real logic
/web-to-mobile ./local-web-project                   # full port — reuses real logic
```

```
/mobile-resume ./my-unfinished-app
/mobile-resume https://github.com/you/unfinished-app
```

```
/mobile-scan ./my-app
/mobile-review ./my-app
```

Build commands follow:

```text
Audit -> Markdown plan -> your approval -> implementation -> verification
```

`/mobile-scan` is command-driven and cheaper. `/mobile-review` is code-driven and deeper. Both start from audit output to stay token-efficient.

---

## How It Works

WebToMobile uses small audit scripts first, then targeted reads only when needed.

```
Audit script -> JSON summary -> targeted reads -> Markdown plan/report -> approval gate -> build or review
```

The Markdown plan acts as external memory between phases, so the agent does not need to keep re-reading or re-explaining the whole project.

---

## Install

**Prerequisites:** [Node.js](https://nodejs.org) v18+ and at least one of: Claude Code (CLI or Desktop), Cursor, or Codex.

```bash
git clone https://github.com/suntay44/web-to-mobile-magic-plugin
cd web-to-mobile-magic-plugin
```

### Claude Code — CLI and Desktop App

**Global install** (commands available in every project):

```bash
node scripts/install.mjs
```

This symlinks commands to `~/.claude/commands/` and skills to `~/.claude/skills/`. Restart Claude Code after running.

Useful installer commands:

| Command | Use |
|---------|-----|
| `node scripts/install.mjs` | First install |
| `node scripts/install.mjs --update` | Pull latest release and refresh installed links |
| `node scripts/install.mjs --refresh` | Refresh local edits or a manual `git pull` |
| `node scripts/install.mjs --unlink` | Remove WebToMobile-owned links |

**Project-level install** (commands available in this project only):

```bash
mkdir -p .claude/commands .claude/skills
cp commands/* .claude/commands/
cp -r skills/. .claude/skills/
```

After install, type any command from the [Commands](#commands) table in Claude Code. If the Skill tool is unavailable, each command can read its matching `SKILL.md` directly from `skills/` or `~/.claude/skills/`.

### Cursor

Cursor does not yet have a native slash command system equivalent to Claude Code's.

1. Copy `commands/*.md` into `.cursor/rules/` in your project.
2. The `skills/` directory should be in your workspace so the AI can read skill files when referenced.

The `.cursor-plugin/plugin.json` manifest is ready for when Cursor's plugin API adds slash command support.

### Codex

In Codex, go to **Settings → Plugins → Add Plugin** and point it to this repository using the HTTPS URL:

```text
https://github.com/suntay44/web-to-mobile-magic-plugin
```

Do not use the SSH form (`git@github.com:suntay44/web-to-mobile-magic-plugin.git`) unless your machine already has GitHub SSH keys configured. Codex reads:

```
.codex-plugin/plugin.json
```

After installation, ask Codex directly:

```text
Use the web-to-mobile skill on this repo.
Use the web-to-mobile skill on https://github.com/you/your-web-app.
Use the mobile-resume skill on ./my-unfinished-app.
```

Some Codex surfaces may expose skill shortcuts or default prompts, but exact invocation depends on the Codex interface.

If you see `Permission denied (publickey)`, Codex is trying to clone with SSH. Retry with the HTTPS URL above.

---

## Troubleshooting

### Codex: `Permission denied (publickey)`

Use HTTPS unless your machine already has GitHub SSH keys configured:

```text
https://github.com/suntay44/web-to-mobile-magic-plugin
```

---

## Stack

| Default | Alternate |
|---------|-----------|
| Expo React Native | Swift / SwiftUI (iOS-only, on request) |

---

## Repository Layout

```
web-to-mobile/
├── commands/
│   ├── web-to-mobile.md       # /web-to-mobile
│   ├── mobile-resume.md       # /mobile-resume
│   ├── mobile-scan.md         # /mobile-scan
│   ├── mobile-review.md       # /mobile-review
│   ├── mobile-audit.md        # /mobile-audit (standalone)
│   └── mobile-qa.md           # /mobile-qa (standalone)
├── skills/
│   ├── web-to-mobile/         # Orchestrator: web → mobile
│   ├── web-to-mobile-audit/   # Inspect web source
│   ├── mobile-migration-plan/ # Route map + checklist + approval
│   ├── mobile-parity-check/   # Design + functional parity vs. web
│   ├── mobile-resume/         # Orchestrator: resume unfinished app
│   ├── mobile-app-audit/      # Inspect existing mobile app
│   ├── mobile-completion-plan/# Completion status + checklist + approval
│   ├── mobile-qa-scan/        # QA report (command-driven)
│   ├── mobile-deep-review/    # Senior review (code-driven)
│   ├── expo-react-native-build/# Build from approved checklist
│   └── mobile-qa-release/     # Verify: perf, a11y, layout, release
├── references/
│   ├── output-contracts.md        # Shared behavioral rules for all skills
│   ├── dependency-substitutions.md# Web → mobile dep swap map (drop-in/config/rewrite)
│   └── framework-migration-notes.md# Per-framework reuse/rewrite guide
├── scripts/
│   ├── web-repo-audit.mjs     # Summarizes a web project as JSON
│   ├── mobile-app-audit.mjs   # Summarizes a mobile app as JSON
│   └── install.mjs            # Global install / uninstall / refresh
├── examples/
│   ├── sample-web-to-mobile-plan.md
│   └── sample-mobile-completion-plan.md
├── tests/
│   ├── fixtures/react-web/
│   ├── fixtures/partial-expo-app/
│   ├── pressure-scenarios.md
│   └── validate-structure.mjs
├── roadmap/                  # Maintainer release checklists and implementation briefs
├── .claude-plugin/plugin.json
├── .cursor-plugin/plugin.json
├── .codex-plugin/plugin.json
└── LICENSE
```

---

## Validate

```bash
node tests/validate-structure.mjs
```

Checks manifests, command wiring, skill frontmatter, token-size limits, required workflow gates, audit script correctness against fixtures, and pressure-test scenario coverage.

---

## FAQ

### How do I convert a website into a mobile app?

Install WebToMobile in Claude Code, Cursor, or Codex, then run `/web-to-mobile` with your website URL, GitHub repo, or local project path. It audits the source, writes a migration plan you approve, builds an Expo React Native app, and verifies it.

### Can I turn a React, Next.js, or Vite web app into a React Native app?

Yes. When you give WebToMobile your repository or local source, it reads your actual code — reusing TypeScript types, API clients, validation schemas, and business logic, while flagging DOM components, CSS, and browser APIs that need a mobile rewrite. Next.js App Router, Pages Router, Remix, Vite, Nuxt, SvelteKit, and Astro are all recognized.

### Can it convert a website from just a URL?

A URL gives you a UI/UX-focused result only — layout, navigation, and visual direction inferred from public pages. It cannot see code, state, APIs, or anything behind a login. For a faithful port, provide the GitHub repo or local source.

### Does it work with Claude Code, Cursor, and Codex?

Yes. It ships as a plugin/skill for all three. Claude Code uses slash commands like `/web-to-mobile`; Codex and Cursor invoke the same skills through their own interfaces.

### Is WebToMobile free and open source?

Yes. It is MIT-licensed and free to use, modify, and distribute.

### Does it build my backend or submit to the App Store?

No. WebToMobile is a helper, not a magician. It reuses or consumes your existing API, lists release steps, and hands store submission to you. It never generates a backend, provisions infrastructure, or handles secrets.

### What does it target — iOS, Android, or both?

Both. The default output is Expo React Native, which builds for iOS and Android from one codebase. Swift/SwiftUI is available on request for iOS-only native work.

---

## License

MIT © [Next Level Builder](LICENSE)
