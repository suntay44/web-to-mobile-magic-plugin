#!/usr/bin/env node
/**
 * WebToMobile global installer.
 * Installs commands → ~/.claude/commands/ and skills → ~/.claude/skills/
 * so all six slash commands work in Claude Code CLI and Desktop App.
 * Uses symlinks on macOS/Linux and ownership-marked copies on Windows.
 *
 * Usage:
 *   node scripts/install.mjs           # install missing commands/skills
 *   node scripts/install.mjs --update  # pull latest from GitHub, then refresh install
 *   node scripts/install.mjs --refresh # refresh WebToMobile-owned symlinks
 *   node scripts/install.mjs --unlink  # remove WebToMobile-owned symlinks
 */
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { symlink, copyFile, cp, rm, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { homedir, platform } from "node:os";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const home = homedir();
const copyInstall = platform() === "win32" ||
  process.env.WEBTOMOBILE_INSTALL_MODE === "copy";
const unlink = process.argv.includes("--unlink");
const refresh = process.argv.includes("--refresh");
const update = process.argv.includes("--update");
const shouldRefresh = refresh || update;
const supportedFlags = new Set(["--unlink", "--refresh", "--update"]);

const CLAUDE_DIR = process.env.WEBTOMOBILE_CLAUDE_DIR
  ? resolve(process.env.WEBTOMOBILE_CLAUDE_DIR)
  : join(home, ".claude");
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
  const target = stat.isSymbolicLink() ? symlinkTarget(dest) : "";
  return stat.isSymbolicLink() && (target === root || target.startsWith(`${root}${sep}`));
}

function copyOwnershipMarker(dest) {
  if (!pathExists(dest)) return `${dest}.web-to-mobile-owned.json`;
  return statSync(dest).isDirectory()
    ? join(dest, ".web-to-mobile-owned.json")
    : `${dest}.web-to-mobile-owned.json`;
}

function isOwnedCopy(dest) {
  if (!pathExists(dest)) return false;
  const marker = copyOwnershipMarker(dest);
  if (!existsSync(marker)) return false;
  try {
    const ownership = JSON.parse(readFileSync(marker, "utf8"));
    return ownership.owner === "web-to-mobile" &&
      ownership.destination === resolve(dest);
  } catch {
    return false;
  }
}

function isOwnedInstallation(dest) {
  return isOwnedSymlink(dest) || isOwnedCopy(dest);
}

async function markOwnedCopy(src, dest) {
  const marker = copyOwnershipMarker(dest);
  await writeFile(marker, `${JSON.stringify({
    owner: "web-to-mobile",
    source: relative(root, src),
    destination: resolve(dest),
  }, null, 2)}\n`, "utf8");
}

async function removeOwnedInstallation(dest) {
  if (isOwnedSymlink(dest)) {
    unlinkSync(dest);
    return;
  }
  const marker = copyOwnershipMarker(dest);
  const isDir = statSync(dest).isDirectory();
  await rm(dest, { recursive: isDir, force: false });
  if (!isDir && existsSync(marker)) await rm(marker);
}

function runGit(args, options = {}) {
  return execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    stdio: options.stdio || ["ignore", "pipe", "pipe"],
  });
}

function readPluginVersion() {
  try {
    const manifest = JSON.parse(readFileSync(join(root, ".codex-plugin", "plugin.json"), "utf8"));
    return manifest.version || "unknown";
  } catch {
    return "unknown";
  }
}

function updateRepo() {
  try {
    runGit(["rev-parse", "--is-inside-work-tree"]);
  } catch {
    warn("This folder is not a git checkout.");
    warn("Download the latest ZIP from GitHub, replace this folder, then run: node scripts/install.mjs --refresh");
    process.exit(1);
  }

  const status = runGit(["status", "--porcelain"]).trim();
  if (status) {
    warn("Local changes detected; refusing to update automatically.");
    warn("Commit/stash your changes, or run git pull yourself, then: node scripts/install.mjs --refresh");
    process.exit(1);
  }

  const versionBefore = readPluginVersion();
  console.log("Updating local repo from GitHub...");
  try {
    execFileSync("git", ["-C", root, "pull", "--ff-only"], { stdio: "inherit" });
    const versionAfter = readPluginVersion();
    if (versionBefore !== versionAfter) {
      ok(`Updated ${versionBefore} -> ${versionAfter}`);
    } else {
      ok(`Already at latest (${versionAfter})`);
    }
  } catch {
    warn("git pull --ff-only failed. Resolve the git issue manually, then run: node scripts/install.mjs --refresh");
    process.exit(1);
  }
}

async function linkOrCopy(src, dest, label) {
  if (pathExists(dest)) {
    if (shouldRefresh && isOwnedInstallation(dest)) {
      await removeOwnedInstallation(dest);
    } else if (shouldRefresh) {
      warn(`${label} — exists but is not a WebToMobile-owned install; skipped`);
      return;
    } else {
      skip(`${label} — already exists`);
      return;
    }
  }
  try {
    if (copyInstall) {
      const isDir = statSync(src).isDirectory();
      isDir ? await cp(src, dest, { recursive: true }) : await copyFile(src, dest);
      await markOwnedCopy(src, dest);
      ok(`${label} (copied)`);
    } else {
      await symlink(src, dest);
      ok(`${label} (symlinked)`);
    }
  } catch (err) {
    warn(`${label} — ${err.message}`);
  }
}

async function removeLink(dest, label) {
  if (!pathExists(dest)) { skip(`${label} — not installed`); return; }
  try {
    if (!isOwnedInstallation(dest)) {
      warn(`${label} — exists but is not a WebToMobile-owned install; skipped`);
      return;
    }
    await removeOwnedInstallation(dest);
    ok(`${label} removed`);
  } catch (err) {
    warn(`${label} — ${err.message}`);
  }
}

async function main() {
  const unknownFlags = process.argv.slice(2).filter((arg) =>
    arg.startsWith("-") && !supportedFlags.has(arg)
  );
  if (unknownFlags.length) {
    warn(`Unknown option${unknownFlags.length > 1 ? "s" : ""}: ${unknownFlags.join(", ")}`);
    process.exit(1);
  }

  if (unlink && update) {
    warn("Choose either --unlink or --update, not both.");
    process.exit(1);
  }

  const mode = unlink ? "Uninstall" : update ? "Update" : refresh ? "Refresh" : "Install";
  console.log(`\nWebToMobile — ${mode}\n`);

  if (update) updateRepo();

  if (!existsSync(CLAUDE_DIR)) {
    warn(`~/.claude/ not found — is Claude Code installed?`);
    warn(`Expected: ${CLAUDE_DIR}`);
    console.log("\nFor project-level install instead, run from your project root:");
    console.log("  mkdir -p .claude/commands .claude/skills");
    console.log(`  cp ${join(root, "commands")}/* .claude/commands/`);
    console.log(`  cp -r ${join(root, "skills")}/. .claude/skills/`);
    process.exit(0);
  }

  const commandFiles = readdirSync(join(root, "commands")).filter((f) => f.endsWith(".md"));
  const skillDirs    = readdirSync(join(root, "skills")).filter((d) =>
    statSync(join(root, "skills", d)).isDirectory()
  );

  if (unlink) {
    console.log("Removing commands from ~/.claude/commands/");
    for (const f of commandFiles) await removeLink(join(COMMANDS_DEST, f), `/${f.replace(".md", "")}`);
    console.log("\nRemoving skills from ~/.claude/skills/");
    for (const d of skillDirs) await removeLink(join(SKILLS_DEST, d), d);
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
  console.log("  Add the repository marketplace with:");
  console.log("  codex plugin marketplace add suntay44/web-to-mobile-magic-plugin");
  console.log("  Then install WebToMobile from ChatGPT desktop or Codex CLI.");

  console.log("\n── Validate ────────────────────────────────────────────");
  console.log("  node tests/validate-structure.mjs\n");
}

main().catch((err) => { console.error("Install error:", err.message); process.exit(1); });
