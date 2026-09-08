import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync,
  realpathSync, rmSync, symlinkSync, writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const temporaryRoot = mkdtempSync(join(tmpdir(), "web-to-mobile-installer-"));

function run(destination, mode, args = [], options = {}) {
  const env = {
    ...process.env,
    CLAUDE_CONFIG_DIR: join(temporaryRoot, "unused-config"),
    WEBTOMOBILE_CLAUDE_DIR: destination,
    WEBTOMOBILE_INSTALL_MODE: mode,
    ...options.env,
  };
  const result = spawnSync(process.execPath, [join(options.root || root, "scripts/install.mjs"), ...args], {
    cwd: temporaryRoot,
    env,
    encoding: "utf8",
    timeout: 15000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, options.status ?? 0, result.stdout + result.stderr);
  return result.stdout + result.stderr;
}

try {
  for (const mode of process.platform === "win32" ? ["copy"] : ["copy", "symlink"]) {
    const destination = join(temporaryRoot, `${mode} project`, ".claude");
    const installedSkill = join(destination, "skills/web-to-mobile");
    const installedCommand = join(destination, "commands/web-to-mobile.md");

    // First install: no existing .claude directory, unrelated working directory.
    run(destination, mode);
    assert.equal(readFileSync(join(installedSkill, "SKILL.md"), "utf8"),
      readFileSync(join(root, "skills/web-to-mobile/SKILL.md"), "utf8"));
    assert.ok(existsSync(installedCommand));
    assert.ok(!existsSync(join(temporaryRoot, "unused-config")), "Explicit destination must take precedence");
    if (mode === "copy") {
      assert.ok(existsSync(join(installedSkill, ".web-to-mobile-owned.json")));
      writeFileSync(join(installedSkill, "SKILL.md"), "stale installed copy\n");
    } else {
      assert.ok(lstatSync(installedSkill).isSymbolicLink());
      assert.equal(realpathSync(installedSkill), realpathSync(join(root, "skills/web-to-mobile")));
    }

    run(destination, mode, ["--refresh"]);
    assert.equal(readFileSync(join(installedSkill, "SKILL.md"), "utf8"),
      readFileSync(join(root, "skills/web-to-mobile/SKILL.md"), "utf8"));
    run(destination, mode); // Idempotent when all installed entries are owned.

    // Execute a scanner through its installed path, outside the plugin checkout.
    const audit = JSON.parse(execFileSync(process.execPath, [
      join(destination, "skills/mobile-app-audit/scripts/mobile-app-audit.mjs"),
      join(root, "tests/fixtures/partial-expo-app"),
    ], { cwd: temporaryRoot, encoding: "utf8" }));
    assert.ok(audit.frameworks.some((framework) => framework.includes("Expo")));
    assert.ok(existsSync(join(destination, "skills/mobile-migration-plan/references/output-contracts.md")));

    run(destination, mode, ["--unlink"]);
    assert.ok(!existsSync(installedSkill));
    assert.ok(!existsSync(installedCommand));

    const userOwnedCommand = join(destination, "commands/mobile-audit.md");
    writeFileSync(userOwnedCommand, "user-owned\n");
    for (const args of [[], ["--refresh"]]) {
      const output = run(destination, mode, args, { status: 1 });
      assert.ok(!output.includes("✅ Done"));
      assert.equal(readFileSync(userOwnedCommand, "utf8"), "user-owned\n");
    }
    run(destination, mode, ["--unlink"]);
    assert.equal(readFileSync(userOwnedCommand, "utf8"), "user-owned\n");

    if (mode === "symlink") {
      const foreignLink = join(destination, "commands/mobile-qa.md");
      symlinkSync(join(temporaryRoot, "missing-user-target"), foreignLink);
      run(destination, mode, ["--refresh"], { status: 1 });
      assert.ok(lstatSync(foreignLink).isSymbolicLink(), "Preserve foreign dangling symlinks");
      run(destination, mode, ["--unlink"]);
      assert.ok(lstatSync(foreignLink).isSymbolicLink());
    }
  }

  const customConfig = join(temporaryRoot, "custom-config");
  run("", "copy", [], { env: { CLAUDE_CONFIG_DIR: customConfig } });
  assert.ok(existsSync(join(customConfig, "skills/web-to-mobile/SKILL.md")));
  run("", "copy", ["--unlink"], { env: { CLAUDE_CONFIG_DIR: customConfig } });

  const invalidDestination = join(temporaryRoot, "invalid-destination");
  mkdirSync(invalidDestination);
  writeFileSync(join(invalidDestination, "commands"), "user-owned file\n");
  const failed = run(invalidDestination, "copy", [], { status: 1 });
  assert.ok(!failed.includes("✅ Done"));
  assert.equal(readFileSync(join(invalidDestination, "commands"), "utf8"), "user-owned file\n");

  // Force a copy-marker write failure to verify per-item errors affect the exit status.
  const failedCopy = join(temporaryRoot, "failed-copy");
  mkdirSync(join(failedCopy, "commands/web-to-mobile.md.web-to-mobile-owned.json"), { recursive: true });
  assert.ok(!run(failedCopy, "copy", [], { status: 1 }).includes("✅ Done"));

  const absent = join(temporaryRoot, "absent");
  run(absent, "copy", ["--unlink"]);
  assert.ok(!existsSync(absent));

  // An extracted source ZIP inside another repo must not run git pull on its parent.
  const parentRepo = join(temporaryRoot, "parent-repo");
  const extractedRepo = join(parentRepo, "downloaded-plugin");
  mkdirSync(extractedRepo, { recursive: true });
  cpSync(join(root, "scripts"), join(extractedRepo, "scripts"), { recursive: true });
  execFileSync("git", ["init", parentRepo], { stdio: "ignore" });
  const rejected = run(absent, "copy", ["--update"], { root: extractedRepo, status: 1 });
  assert.ok(rejected.includes("not a git checkout"));
  assert.ok(!rejected.includes("Updating local repo"));

  // Exercise --update through a local Git remote, including a same-version change.
  const upstream = join(temporaryRoot, "upstream");
  const checkout = join(temporaryRoot, "checkout");
  const updateDestination = join(temporaryRoot, "updated-config");
  for (const folder of ["scripts", "commands", "skills/example", ".codex-plugin"]) {
    mkdirSync(join(upstream, folder), { recursive: true });
  }
  cpSync(join(root, "scripts/install.mjs"), join(upstream, "scripts/install.mjs"));
  writeFileSync(join(upstream, "commands/example.md"), "original command\n");
  writeFileSync(join(upstream, "skills/example/SKILL.md"), "example skill\n");
  writeFileSync(join(upstream, ".codex-plugin/plugin.json"), '{"version":"0.3.0"}\n');
  const git = (...args) => execFileSync("git", ["-C", upstream, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const commit = () => git("-c", "user.name=Installer Test", "-c", "user.email=installer-test@example.invalid",
    "-c", "commit.gpgsign=false", "commit", "-am", "Installer fixture");
  git("init", "-b", "main");
  git("add", ".");
  commit();
  execFileSync("git", ["clone", upstream, checkout], { stdio: "ignore" });
  run(updateDestination, "copy", [], { root: checkout });
  writeFileSync(join(upstream, "commands/example.md"), "updated command\n");
  commit();
  const updated = run(updateDestination, "copy", ["--update"], { root: checkout });
  assert.ok(!updated.includes("Already at latest"));
  assert.equal(readFileSync(join(updateDestination, "commands/example.md"), "utf8"), "updated command\n");
  assert.ok(run(updateDestination, "copy", ["--update"], { root: checkout }).includes("Already at latest"));
  writeFileSync(join(checkout, "commands/example.md"), "local edits\n");
  const dirty = run(updateDestination, "copy", ["--update"], { root: checkout, status: 1 });
  assert.ok(dirty.includes("Local changes detected"));
  assert.equal(readFileSync(join(checkout, "commands/example.md"), "utf8"), "local edits\n");

  console.log("Installer fresh/copy/symlink/refresh/unlink, conflicts, config paths, and failures are valid.");
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
