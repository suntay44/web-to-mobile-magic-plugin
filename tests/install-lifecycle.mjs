import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const temporaryRoot = mkdtempSync(join(tmpdir(), "web-to-mobile-installer-"));
const claudeDirectory = join(temporaryRoot, ".claude");
const userOwnedCommand = join(claudeDirectory, "commands", "mobile-audit.md");
const environment = {
  ...process.env,
  WEBTOMOBILE_CLAUDE_DIR: claudeDirectory,
  WEBTOMOBILE_INSTALL_MODE: "copy",
};

function run(...args) {
  return execFileSync(process.execPath, ["scripts/install.mjs", ...args], {
    cwd: root,
    env: environment,
    encoding: "utf8",
  });
}

try {
  mkdirSync(join(claudeDirectory, "commands"), { recursive: true });
  writeFileSync(userOwnedCommand, "user-owned\n", "utf8");

  run();
  const copiedSkill = join(claudeDirectory, "skills", "web-to-mobile");
  if (!existsSync(join(copiedSkill, ".web-to-mobile-owned.json"))) {
    throw new Error("Copied skill is missing its ownership marker");
  }
  if (readFileSync(userOwnedCommand, "utf8") !== "user-owned\n") {
    throw new Error("Installer overwrote a user-owned command");
  }

  run("--refresh");
  if (!existsSync(join(copiedSkill, ".web-to-mobile-owned.json"))) {
    throw new Error("Refresh did not recreate copied skill ownership");
  }

  run("--unlink");
  if (existsSync(copiedSkill)) {
    throw new Error("Uninstall did not remove an owned copied skill");
  }
  if (readFileSync(userOwnedCommand, "utf8") !== "user-owned\n") {
    throw new Error("Uninstall removed a user-owned command");
  }

  console.log("Installer copy/refresh/unlink lifecycle is valid.");
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
