# WebToMobile

<div align="center">

<br />

<img width="1920" height="600" alt="WebToMobile — open-source AI plugin that converts any website or web app into a native Expo React Native mobile app, for Claude Code, Cursor, and Codex" src="https://github.com/user-attachments/assets/13ad5b52-bdd9-4ad8-8568-4e542d50074e" />




### Open-Source AI Skills & Plugin for Coding Agents
### ⭐ Stars are appreciated!

**Turn websites and web repos into audited mobile migration plans and Expo React Native implementation workflows.**<br />
Plan-first. Approval-gated. Works with Claude Code, Cursor, and Codex.

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/suntay44/web-to-mobile-magic-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/suntay44/web-to-mobile-magic-plugin/actions/workflows/ci.yml)
[![GitHub release](https://img.shields.io/github/v/release/suntay44/web-to-mobile-magic-plugin)](https://github.com/suntay44/web-to-mobile-magic-plugin/releases)
[![Works with Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-darkorange)](https://claude.ai/code)
[![Works with Codex](https://img.shields.io/badge/Codex-Plugin-blue)](https://chatgpt.com/codex)
[![Works with Cursor](https://img.shields.io/badge/Cursor-Plugin-black)](https://cursor.sh)
[![Expo React Native](https://img.shields.io/badge/Target-Expo%20React%20Native-4630EB)](https://expo.dev)

<br />

</div>

---

## What It Does

**WebToMobile is an open-source AI plugin and skill set for planning and
implementing website-to-mobile migrations with Expo React Native.** It runs
inside Claude Code, Cursor, or Codex. Point it at a URL, a GitHub repository, or
a local web project; it audits the source, writes an approval-gated migration
plan, implements approved Expo work, and records verification evidence.

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

**Claude marketplace installs:** run these in a terminal, then restart Claude Code:

```bash
claude plugin marketplace update web-to-mobile-marketplace
claude plugin update web-to-mobile@web-to-mobile-marketplace
```

For the Claude plugin UI, use its marketplace/plugin update controls.

**Manual installs:** run from your retained WebToMobile checkout:

```bash
node scripts/install.mjs --update
```

`--update` pulls WebToMobile from GitHub and refreshes manually installed Claude
commands and skills. It does not update marketplace installations.

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
| You manually installed from a source ZIP | Extract the latest source ZIP into the same retained folder, then run `node scripts/install.mjs --refresh` |

`--update` refuses to run if you have local uncommitted changes. It will ask you to commit/stash or update manually first.

For a project-level manual install, use the same `WEBTOMOBILE_CLAUDE_DIR` destination
for refresh and uninstall. Keep the checkout at the same path on macOS/Linux:
the installed symlinks depend on it. Run `--unlink` before moving it, then reinstall.

---

## Commands

These are the short names for manual installs. Marketplace/plugin installs use
the `web-to-mobile:` prefix, for example `/web-to-mobile:mobile-scan`.

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

Choose one installation method below. The GitHub marketplace method does not
require a manual clone or the Node installer. Running the bundled audit scripts
and the manual installer requires [Node.js](https://nodejs.org) v22 or v24 LTS;
Git-based installation also requires Git.

### Claude Code — CLI and Desktop App

**Plugin marketplace install** (run in the Claude Code terminal CLI):

```text
/plugin marketplace add suntay44/web-to-mobile-magic-plugin
/plugin install web-to-mobile@web-to-mobile-marketplace
```

Or run the equivalent commands in your normal terminal:

```bash
claude plugin marketplace add https://github.com/suntay44/web-to-mobile-magic-plugin
claude plugin install web-to-mobile@web-to-mobile-marketplace
```

This installs for your user across projects. For only your current project,
run the install command from that project's folder with `--scope local`.
If the desktop Code surface does not offer `/plugin`, use its plugin browser
or the terminal commands above. Adding a marketplace alone does not install the plugin.

Restart Claude Code after installation. Plugin commands are namespaced, for
example `/web-to-mobile:web-to-mobile` and `/web-to-mobile:mobile-resume`.
The repository provides `.claude-plugin/marketplace.json` for this install path.
See [Claude's marketplace documentation](https://code.claude.com/docs/en/plugin-marketplaces).

Choose the marketplace install above or the manual install below to avoid
duplicate commands. The manual install keeps the short `/web-to-mobile` names.

**Manual global install** (short commands available in every project):

```bash
git clone https://github.com/suntay44/web-to-mobile-magic-plugin
cd web-to-mobile-magic-plugin
node scripts/install.mjs
```

For GitHub **Download ZIP**, extract the source archive and open a terminal in
the extracted folder containing `scripts/install.mjs`, then run the last command.
Keep this folder after installation. `npm install` is not needed for the installer.

This symlinks commands and skills on macOS/Linux. On Windows it creates
ownership-marked copies so refresh and uninstall can distinguish plugin files
from user-owned files. It creates missing configuration directories and respects
`CLAUDE_CONFIG_DIR` when configured; otherwise it uses `~/.claude`.
Existing user-owned files are preserved and reported as conflicts with a nonzero
exit status. Restart Claude Code, then open your app project to use the commands.

Useful installer commands:

| Command | Use |
|---------|-----|
| `node scripts/install.mjs` | First install |
| `node scripts/install.mjs --update` | Pull latest release and refresh installed links |
| `node scripts/install.mjs --refresh` | Refresh local edits or a manual `git pull` |
| `node scripts/install.mjs --unlink` | Remove WebToMobile-owned links or copies |

**Manual project-level install** (macOS/Linux): from the WebToMobile checkout,
set the destination to your app project's `.claude` directory. Replace the path below.

```bash
WEBTOMOBILE_CLAUDE_DIR="/absolute/path/to/your-app/.claude" node scripts/install.mjs
```

This override takes precedence over `CLAUDE_CONFIG_DIR`. It uses the same guarded
installer instead of overwriting existing project files with `cp`. On Windows,
the marketplace install with `--scope local` above provides a project-local alternative.

After a manual install, open Claude Code in your app project and use a command
from the [Commands](#commands) table. Installed skills include their audit scripts
and references; the app project does not need a copy of the WebToMobile repository.

### Claude plugin uploads and ZIP downloads

In Claude's **Customize → Plugins**, use **Add marketplace** with this repository's
GitHub URL, then install WebToMobile. See [Claude's plugin installation guide](https://claude.com/docs/cowork/guide/plugins).

For a plugin file upload, clone or download/extract the source as described in
the manual install section, then package from that repository root
(macOS/Linux with `zip` installed; use a new output filename if one already exists):

```bash
zip -r ../web-to-mobile.zip .claude-plugin/plugin.json commands skills LICENSE -x '*.DS_Store'
```

Upload that ZIP through **Plugins**. It contains `.claude-plugin/plugin.json`,
`commands/`, and `skills/` at the archive root. GitHub's **Download ZIP** is a
source archive with an extra folder; extract it before packaging or running the
manual installer. See [Anthropic's plugin packaging example](https://github.com/anthropics/knowledge-work-plugins/blob/main/cowork-plugin-management/skills/create-cowork-plugin/SKILL.md).

**Customize → Skills → Upload a skill** expects a single skill folder, not this
multi-skill plugin. Install the complete plugin so sibling skills and references
remain available. See [Claude's skill upload format](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills).

The local Node installer configures Claude Code; it does not install into Claude's
chat or Cowork plugin UI. App implementation still requires a coding environment
with source access and the required build tools.

If installation fails, include the exact error, Claude surface (Code, Cowork, or
chat), and whether you used Add marketplace, Upload plugin, Upload a skill, or
the terminal installer when reporting it.

### Cursor

Cursor does not yet have a native slash command system equivalent to Claude Code's.

1. Copy `commands/*.md` into `.cursor/rules/` in your project.
2. The `skills/` directory should be in your workspace so the AI can read skill files when referenced.

The `.cursor-plugin/plugin.json` file supplies package metadata; today the
included command files still need to be copied into project rules.

### Codex and ChatGPT desktop

Add this repository as a plugin marketplace from the Codex CLI:

```bash
codex plugin marketplace add suntay44/web-to-mobile-magic-plugin
```

Then browse the WebToMobile marketplace in ChatGPT desktop or Codex CLI and
install the plugin. The repository includes
`.agents/plugins/marketplace.json`, and Codex reads:

```
.codex-plugin/plugin.json
```

After installation, ask Codex directly:

```text
Use the web-to-mobile skill on this repo.
Use the web-to-mobile skill on https://github.com/you/your-web-app.
Use the mobile-resume skill on ./my-unfinished-app.
```

Plugins are available in ChatGPT desktop and Codex CLI; they are not currently
available in the IDE extension. Exact skill shortcuts depend on the surface.

---

## Troubleshooting

### Claude cannot add the GitHub marketplace

Use the repository URL in **Add marketplace**, not Upload a skill, and install
the plugin after the catalog is added. `Marketplace file not found` means the
downloaded revision lacks `.claude-plugin/marketplace.json`; older WebToMobile
revisions did not include it. Git/authentication/network errors are different:
include the exact error and check whether `git ls-remote https://github.com/suntay44/web-to-mobile-magic-plugin`
succeeds in your terminal. See [Claude's marketplace troubleshooting](https://code.claude.com/docs/en/plugin-marketplaces#troubleshooting).

### Claude commands do not appear

For marketplace installs, use `/web-to-mobile:web-to-mobile`, not `/web-to-mobile`.
Check `claude plugin list` and restart Claude Code after installation. For manual
installs, check the destination printed by the installer and any conflict/error
messages. Keep the source folder in place on macOS/Linux; deleting it breaks
the symlinks. The manual installer does not configure the Cowork/chat plugin UI.

### Codex marketplace does not appear

Run `codex plugin marketplace list --json` and confirm
`web-to-mobile-marketplace` is present. Upgrade the local marketplace snapshot
with `codex plugin marketplace upgrade web-to-mobile-marketplace`.

---

## Stack

| Default | Alternate |
|---------|-----------|
| Expo React Native implementation | Capacitor, PWA, Stay Web, or Swift/Native planning handoff |

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
│   ├── mobile-migration-plan/ # Route map + checklist + shared references
│   ├── mobile-parity-check/   # Design + functional parity vs. web
│   ├── mobile-resume/         # Orchestrator: resume unfinished app
│   ├── mobile-app-audit/      # Inspect existing mobile app
│   ├── mobile-completion-plan/# Completion status + checklist + approval
│   ├── mobile-qa-scan/        # QA report (command-driven)
│   ├── mobile-deep-review/    # Senior review (code-driven)
│   ├── expo-react-native-build/# Build from approved checklist
│   └── mobile-qa-release/     # Verify: perf, a11y, layout, release
├── references/                # Contributor links to packaged skill references
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
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
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

Yes. It ships skill instructions for all three. Claude Code uses slash commands
like `/web-to-mobile`; Codex CLI and ChatGPT desktop can install the packaged
plugin; Cursor reads the included commands and skills as workspace rules.

### Is WebToMobile free and open source?

Yes. It is MIT-licensed and free to use, modify, and distribute.

### Does it build my backend or submit to the App Store?

No. WebToMobile is a helper, not a magician. It reuses or consumes your existing API, lists release steps, and hands store submission to you. It never generates a backend, provisions infrastructure, or handles secrets.

### What does it target — iOS, Android, or both?

The bundled build phase targets Expo React Native, which can build for iOS and
Android from one codebase. The planning phase can recommend Capacitor, a PWA,
staying on the web, or Swift/Native when that is a better fit, but those verdicts
end with an explicit implementation handoff.

---

## License

MIT © [Next Level Builder](LICENSE)
