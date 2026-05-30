<div align="center">

<br />

# WEBSITES TO MOBILE

### AI Skills & Plugin for Coding Agents

**Turn websites and web repos into audited mobile migration plans and Expo React Native implementation workflows.**<br />
Plan-first. Approval-gated. Works with Claude Code, Cursor, and Codex.

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Works with Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-blueviolet)](https://claude.ai/code)
[![Works with Cursor](https://img.shields.io/badge/Cursor-Plugin-black)](https://cursor.sh)
[![Expo React Native](https://img.shields.io/badge/Target-Expo%20React%20Native-4630EB)](https://expo.dev)

<br />

</div>

---

## What It Does

WebToMobile gives AI coding agents six commands for web-to-mobile migration, unfinished mobile app completion, QA, and review.

Each build-oriented command audits first, plans before building, and gates on your approval before writing code. It's a **helper, not a magician** — what it can do for you depends entirely on what you give it.

---

## What You Give Determines What We Can Do

WebToMobile has two tiers of input. Be honest about which one you're using, because the output is very different.

### 🔗 You give a live URL → we help with **UI/UX only**

We can `WebFetch` your public pages, read the rendered HTML/CSS, and infer your visual structure. From that we can plan and scaffold the **look and feel** of a mobile app:

- Screen layout and navigation structure inferred from your pages
- Visual hierarchy, color, and typography direction
- A UI/UX-focused mobile shell you can wire up to your own backend

**What we cannot do from a URL:** see your component logic, your state management, your API calls, or anything behind a login. So the result is a *visual starting point*, not a working port of your app. We'll say so in the plan.

### 📦 You give a GitHub repo or local path → we do **much more than UI/UX**

With source access we read your actual code, and the scope expands dramatically:

- **Reuse real logic** — TypeScript types, API clients, validation schemas, state patterns, and non-DOM business logic ported directly
- **Map every route** to a mobile screen with a concrete migration checklist
- **Detect what needs rewriting** — DOM components, CSS layout, browser storage, cookies, OAuth redirects
- **Audit auth, data, and storage** and plan mobile-safe equivalents
- **Produce a real implementation plan**, then build it on your approval

> **Rule of thumb:** URL gets you a faithful *interface*. Repo gets you a faithful *app*.

---

## Helper, Not Magician — Where the Line Is

WebToMobile is a **skill/plugin that runs inside your AI coding agent**. It stays in its lane on purpose, so it does one job well instead of pretending to be a whole platform.

**What it does:** audit your web source, write an approval-gated plan, implement it in Expo React Native, and verify the result with real evidence.

**What it deliberately does *not* do:**

| Not this | Because |
|----------|---------|
| Hosting, deployment, or CI/CD | We're a coding helper, not infrastructure. We list the release steps; your pipeline runs them. |
| Backend / API generation | We reuse or consume your existing API. If a website is server-coupled with no client API, we flag it as a blocker — we don't invent one. |
| No-code builder or design tool | We don't replace Figma or a designer. We translate what exists. |
| App Store / Play Store submission | We produce the release checklist; a human submits. |
| Secret/credential handling | We never request, store, or transmit keys or tokens. |

Everything it produces is **evidence-backed and confidence-labeled** — facts from your code (`[from-code]`), inferences from your pages (`[inferred]`), and assumptions you must confirm (`[assumption]`) are never voiced in the same breath. Things only a human can judge — pixel fidelity, animation feel, brand color, contrast, real-device testing — are handed back to you explicitly, never silently claimed as done.

---

## Commands

| Command | Scenario | What it does |
|---------|----------|--------------|
| `/web-to-mobile` | **Start from scratch** | Convert a website, GitHub repo, or local web project into an Expo React Native app |
| `/mobile-resume` | **Finish what's started** | Audit an unfinished mobile app, plan what's left, and implement the remaining work |
| `/mobile-scan` | **QA report** | Run lint, typecheck, tests, and build checks — produce a structured pass/fail report |
| `/mobile-review` | **Deep senior review** | Read key source files and analyze architecture, code quality, robustness, performance, and security |
| `/mobile-audit` | **Mobile audit only** | Inspect an existing mobile app and report complete, partial, and missing areas |
| `/mobile-qa` | **Final verification** | Verify a mobile app against its approved plan before completion |

---

## The 4 Scenarios

### 1 — No mobile app yet
```
/web-to-mobile https://yourwebsite.com          # UI/UX only — visual starting point
/web-to-mobile https://github.com/you/your-web-app   # full port — reuses real logic
/web-to-mobile ./local-web-project                   # full port — reuses real logic
```
Audit → Migration plan → *(your approval)* → Build → Parity check → QA

> A URL gives us your interface; a repo gives us your app. See [What You Give Determines What We Can Do](#what-you-give-determines-what-we-can-do).

### 2 — Started but not done, wants to finish it
```
/mobile-resume ./my-unfinished-app
/mobile-resume https://github.com/you/unfinished-app
```
Audit → Completion plan → *(your approval)* → Build remaining → QA

### 3 — Wants a QA report (surface-level check)
```
/mobile-scan ./my-app
```
Runs commands only — no deep source reads. Produces a **Shippable / Needs Work / Blocked** verdict with a structured report covering build health, test coverage, structure, and risks.

### 4 — Wants a senior developer + QA deep review
```
/mobile-review ./my-app
```
Reads up to 10 targeted files identified from the audit. Produces severity-tagged findings (Critical / High / Medium / Low) across architecture, code quality, robustness, performance, and security — with a prioritized action list.

> **Difference between 3 and 4:** `/mobile-scan` is command-driven (cheap, fast). `/mobile-review` is code-driven (targeted, deep). Both start from the same audit script output to stay token-efficient.

---

## How It Works

Every command follows the same principle: **audit script first, targeted reads only, plan before code.**

```
Audit script → JSON summary (framework, screens, deps, risks)
     ↓
Commands or targeted file reads (depending on the command)
     ↓
Markdown plan or report written to docs/
     ↓
Approval gate (build commands only — scan and review skip this)
     ↓
Implementation or report delivered
```

The audit script summarizes a repo as structured JSON so the agent never blindly reads the entire codebase. Each skill loads one phase at a time. The Markdown plan acts as external memory between phases so context stays lean.

---

## Install

### Claude Code — CLI and Desktop App

**Global install** (commands available in every project):

```bash
node scripts/install.mjs
```

Symlinks all commands to `~/.claude/commands/` and all skills to `~/.claude/skills/`. Restart Claude Code after running. To uninstall: `node scripts/install.mjs --unlink`

To update an existing WebToMobile install:

```bash
node scripts/install.mjs --refresh
```

`--refresh` only replaces WebToMobile-owned symlinks. It skips user-owned files with the same names.

**Project-level install** (commands available in this project only):

```bash
mkdir -p .claude/commands .claude/skills
cp commands/* .claude/commands/
cp -r skills/* .claude/skills/
```

Once installed, these slash commands are available in both the CLI and Desktop App:

| Command | Trigger |
|---------|---------|
| `/web-to-mobile` | Type in chat |
| `/mobile-resume` | Type in chat |
| `/mobile-scan` | Type in chat |
| `/mobile-review` | Type in chat |
| `/mobile-audit` | Type in chat |
| `/mobile-qa` | Type in chat |

Each command works with or without the Skill tool. If the Skill tool is unavailable, the command reads its matching skill file directly from `skills/` or `~/.claude/skills/`.

### Cursor

Cursor does not yet have a native slash command system equivalent to Claude Code's. To use these commands in Cursor:

1. Copy `commands/*.md` into `.cursor/rules/` in your project — Cursor loads them as AI context rules.
2. The `skills/` directory should be in your workspace so the AI can read skill files when referenced.

The `.cursor-plugin/plugin.json` manifest is ready for when Cursor's plugin API adds slash command support.

### Codex

Add this repo as a Codex plugin using the manifest:

```
.codex-plugin/plugin.json
```

In Codex, install the plugin and ask Codex to use the `web-to-mobile` or `mobile-resume` skill. Some Codex surfaces may expose skill shortcuts or default prompts, but exact invocation depends on the Codex interface.

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
├── scripts/
│   ├── web-repo-audit.mjs     # Summarizes a web project as JSON
│   └── mobile-app-audit.mjs   # Summarizes a mobile app as JSON
├── examples/
│   ├── sample-web-to-mobile-plan.md
│   └── sample-mobile-completion-plan.md
├── tests/
│   ├── fixtures/react-web/
│   ├── fixtures/partial-expo-app/
│   ├── pressure-scenarios.md
│   └── validate-structure.mjs
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

## License

MIT © [Next Level Builder](LICENSE)
