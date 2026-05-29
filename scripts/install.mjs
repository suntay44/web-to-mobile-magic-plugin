#!/usr/bin/env node
/**
 * WebToMobile global installer.
 * Symlinks commands → ~/.claude/commands/ and skills → ~/.claude/skills/
 * so all six slash commands work in Claude Code CLI and Desktop App.
 *
 * Usage:
 *   node scripts/install.mjs           # install missing commands/skills
 *   node scripts/install.mjs --refresh # refresh WebToMobile-owned symlinks
 *   node scripts/install.mjs --unlink  # remove WebToMobile-owned symlinks
 */
import { existsSync, lstatSync, mkdirSync, readlinkSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { symlink, copyFile, cp } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { homedir, platform } from "node:os";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const home = homedir();
const isWindows = platform() === "win32";
const unlink = process.argv.includes("--unlink");
const refresh = process.argv.includes("--refresh");

const CLAUDE_DIR = join(home, ".claude");
const COMMANDS_DEST = join(CLAUDE_DIR, "commands");
const SKILLS_DEST = join(CLAUDE_DIR, "skills");

const ok   = (msg) => console.log(`  ✓  ${msg}`);
const skip = (msg) => console.log(`  ·  ${msg}`);
const warn = (msg) => console.log(`  ⚠  ${msg}`);

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function pathExists(path) {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

function symlinkTarget(dest) {
  const target = readlinkSync(dest);
  return isAbsolute(target) ? target : resolve(dirname(dest), target);
}

function isOwnedSymlink(dest) {
  if (!pathExists(dest)) return false;
  const stat = lstatSync(dest);
  return stat.isSymbolicLink() && symlinkTarget(dest).startsWith(root);
}

async function linkOrCopy(src, dest, label) {
  if (pathExists(dest)) {
    if (refresh && isOwnedSymlink(dest)) {
      unlinkSync(dest);
    } else if (refresh) {
      warn(`${label} — exists but is not a WebToMobile symlink; skipped`);
      return;
    } else {
      skip(`${label} — already exists`);
      return;
    }
  }
  try {
    if (isWindows) {
      const isDir = statSync(src).isDirectory();
      isDir ? await cp(src, dest, { recursive: true }) : await copyFile(src, dest);
      ok(`${label} (copied)`);
    } else {
      await symlink(src, dest);
      ok(`${label} (symlinked)`);
    }
  } catch (err) {
    warn(`${label} — ${err.message}`);
  }
}

function removeLink(dest, label) {
  if (!pathExists(dest)) { skip(`${label} — not installed`); return; }
  try {
    if (!isOwnedSymlink(dest)) {
      warn(`${label} — exists but is not a WebToMobile symlink; skipped`);
      return;
    }
    unlinkSync(dest);
    ok(`${label} removed`);
  } catch (err) {
    warn(`${label} — ${err.message}`);
  }
}

async function main() {
  const mode = unlink ? "Uninstall" : refresh ? "Refresh" : "Install";
  console.log(`\nWebToMobile — ${mode}\n`);

  if (!existsSync(CLAUDE_DIR)) {
    warn(`~/.claude/ not found — is Claude Code installed?`);
    warn(`Expected: ${CLAUDE_DIR}`);
    console.log("\nFor project-level install instead, run from your project root:");
    console.log("  mkdir -p .claude/commands .claude/skills");
    console.log(`  cp ${join(root, "commands")}/* .claude/commands/`);
    console.log(`  cp -r ${join(root, "skills")}/* .claude/skills/`);
    process.exit(0);
  }

  const commandFiles = readdirSync(join(root, "commands")).filter((f) => f.endsWith(".md"));
  const skillDirs    = readdirSync(join(root, "skills")).filter((d) =>
    statSync(join(root, "skills", d)).isDirectory()
  );

  if (unlink) {
    console.log("Removing commands from ~/.claude/commands/");
    for (const f of commandFiles) removeLink(join(COMMANDS_DEST, f), `/${f.replace(".md", "")}`);
    console.log("\nRemoving skills from ~/.claude/skills/");
    for (const d of skillDirs) removeLink(join(SKILLS_DEST, d), d);
    console.log("\n✓ Uninstall complete.\n");
    return;
  }

  console.log("Installing commands → ~/.claude/commands/");
  ensureDir(COMMANDS_DEST);
  for (const f of commandFiles) {
    await linkOrCopy(
      join(root, "commands", f),
      join(COMMANDS_DEST, f),
      `/${f.replace(".md", "")}`
    );
  }

  console.log("\nInstalling skills → ~/.claude/skills/");
  ensureDir(SKILLS_DEST);
  for (const d of skillDirs) {
    await linkOrCopy(join(root, "skills", d), join(SKILLS_DEST, d), d);
  }

  console.log("\n✅ Done. Restart Claude Code to pick up the new commands.\n");
  console.log("Available slash commands:");
  for (const f of commandFiles) console.log(`  /${f.replace(".md", "")}`);

  console.log("\n── Cursor ──────────────────────────────────────────────");
  console.log("  Copy commands/ into .cursor/rules/ in your project.");
  console.log("  Cursor loads these as AI rules (slash commands coming soon).");

  console.log("\n── Codex ───────────────────────────────────────────────");
  console.log("  Add this repo as a Codex plugin via .codex-plugin/plugin.json.");

  console.log("\n── Validate ────────────────────────────────────────────");
  console.log("  node tests/validate-structure.mjs\n");
}

main().catch((err) => { console.error("Install error:", err.message); process.exit(1); });
