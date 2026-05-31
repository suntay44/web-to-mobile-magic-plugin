import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseJson(path) {
  try {
    return JSON.parse(read(path));
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${error.message}`);
  }
}

const requiredFiles = [
  "README.md",
  "LICENSE",
  ".codex-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  "commands/web-to-mobile.md",
  "commands/mobile-resume.md",
  "commands/mobile-audit.md",
  "commands/mobile-qa.md",
  "commands/mobile-scan.md",
  "commands/mobile-review.md",
  "scripts/web-repo-audit.mjs",
  "scripts/mobile-app-audit.mjs",
  "scripts/install.mjs",
  "tests/fixtures/react-web/package.json",
  "tests/fixtures/react-web/src/App.tsx",
  "tests/fixtures/react-web/tailwind.config.js",
  "tests/fixtures/partial-expo-app/package.json",
  "tests/fixtures/partial-expo-app/app.json",
  "tests/fixtures/partial-expo-app/src/screens/HomeScreen.tsx",
  "tests/fixtures/partial-expo-app/src/screens/ProfileScreen.tsx",
  "skills/web-to-mobile/SKILL.md",
  "skills/web-to-mobile-audit/SKILL.md",
  "skills/mobile-migration-plan/SKILL.md",
  "skills/expo-react-native-build/SKILL.md",
  "skills/mobile-qa-release/SKILL.md",
  "skills/mobile-resume/SKILL.md",
  "skills/mobile-app-audit/SKILL.md",
  "skills/mobile-completion-plan/SKILL.md",
  "skills/mobile-parity-check/SKILL.md",
  "skills/mobile-qa-scan/SKILL.md",
  "skills/mobile-deep-review/SKILL.md",
  "skills/mobile-migration-plan/references/plan-template.md",
  "examples/sample-web-to-mobile-plan.md",
  "examples/sample-mobile-completion-plan.md",
  "references/output-contracts.md",
  "references/dependency-substitutions.md",
  "references/framework-migration-notes.md",
  "tests/pressure-scenarios.md"
];

for (const file of requiredFiles) {
  assert(existsSync(join(root, file)), `Missing required file: ${file}`);
}

function walk(dir, files = []) {
  for (const entry of readdirSync(join(root, dir))) {
    const relative = join(dir, entry);
    const absolute = join(root, relative);
    if (statSync(absolute).isDirectory()) {
      walk(relative, files);
    } else {
      files.push(relative);
    }
  }
  return files;
}

for (const file of walk(".")) {
  assert(!file.endsWith(".DS_Store"), `Remove local metadata file: ${file}`);
}

const codex = parseJson(".codex-plugin/plugin.json");
const claude = parseJson(".claude-plugin/plugin.json");
const cursor = parseJson(".cursor-plugin/plugin.json");

for (const [name, manifest] of [
  [".codex-plugin/plugin.json", codex],
  [".claude-plugin/plugin.json", claude],
  [".cursor-plugin/plugin.json", cursor]
]) {
  assert(manifest.name === "web-to-mobile", `${name} must use name web-to-mobile`);
  assert(manifest.version === "0.1.0", `${name} must use version 0.1.0`);
  assert(manifest.skills === "./skills/", `${name} must point skills to ./skills/`);
  assert(manifest.license === "MIT", `${name} must use MIT license`);
}

assert(codex.interface?.displayName === "WebToMobile", "Codex manifest must include displayName");
assert(Array.isArray(codex.interface?.defaultPrompt), "Codex manifest must include default prompts");
assert(claude.commands === "./commands/", "Claude manifest must expose commands");
assert(cursor.commands === "./commands/", "Cursor manifest must expose commands");

const commandSkillMap = {
  "commands/web-to-mobile.md": "web-to-mobile",
  "commands/mobile-resume.md": "mobile-resume",
  "commands/mobile-scan.md": "mobile-qa-scan",
  "commands/mobile-review.md": "mobile-deep-review",
  "commands/mobile-audit.md": "mobile-app-audit",
  "commands/mobile-qa.md": "mobile-qa-release",
};

for (const [commandFile, skillName] of Object.entries(commandSkillMap)) {
  const body = read(commandFile);
  assert(
    body.includes(`\`${skillName}\``),
    `${commandFile} must reference skill \`${skillName}\``
  );
  assert(
    body.includes("SKILL.md"),
    `${commandFile} must include a fallback path to SKILL.md`
  );
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  assert(words <= 80, `${commandFile} is too long: ${words} words (max 80)`);
}

const command = read("commands/web-to-mobile.md");
assert(command.includes("Invoke the `web-to-mobile` skill"), "Command must invoke the orchestrator skill");

const readme = read("README.md");
assert(readme.includes("six commands"), "README must describe the current six-command surface");
assert(readme.includes("--refresh"), "README must document safe installer refresh behavior");
assert(!readme.includes("$web-to-mobile and $mobile-resume invocation style works"), "README must avoid overpromising Codex invocation syntax");

const installer = read("scripts/install.mjs");
assert(installer.includes("--refresh"), "Installer must support --refresh");
assert(installer.includes("isOwnedSymlink"), "Installer refresh/unlink must guard user-owned files");
assert(!installer.includes("--force"), "Installer must not expose a broad --force mode");

const auditScript = read("scripts/web-repo-audit.mjs");
for (const phrase of [
  "dependencyMatches",
  "browserApiUsage",
  "mobileRisks",
  "routeConfidence",
  "scanInlineRoutes",
  "renderingModel",
  "internalApiRoutes",
  "serverSignals"
]) {
  assert(auditScript.includes(phrase), `Audit script missing ${phrase}`);
}

const contracts = read("references/output-contracts.md");
for (const phrase of [
  "Scope Boundaries",
  "Capability Tiers",
  "Capability Downgrade",
  "Confidence Labels",
  "API Needs",
  "Evidence-Backed Verdicts",
  "Human Sign-Off Required"
]) {
  assert(contracts.includes(phrase), `Output contracts missing section: ${phrase}`);
}

const fixtureAudit = JSON.parse(execFileSync(
  "node",
  ["scripts/web-repo-audit.mjs", "tests/fixtures/react-web"],
  { cwd: root, encoding: "utf8" }
));

assert(fixtureAudit.frameworks.includes("React"), "Fixture audit must detect React");
assert(fixtureAudit.frameworks.includes("Vite"), "Fixture audit must detect Vite");
assert(fixtureAudit.scripts.dev === "vite", "Fixture audit must detect package scripts");
assert(fixtureAudit.dependencyMatches.auth.includes("@supabase/supabase-js"), "Fixture audit must detect auth libraries");
assert(fixtureAudit.dependencyMatches.api.includes("axios"), "Fixture audit must detect API/data libraries");
assert(fixtureAudit.dependencyMatches.styling.includes("tailwindcss"), "Fixture audit must detect styling libraries");
assert(fixtureAudit.routes.some((route) => route.route === "/dashboard"), "Fixture audit must detect inline routes");
assert(fixtureAudit.browserApiUsage.window?.length, "Fixture audit must detect window usage");
assert(fixtureAudit.browserApiUsage.localStorage?.length, "Fixture audit must detect localStorage usage");
assert(fixtureAudit.browserApiUsage.cookie?.length, "Fixture audit must detect cookie usage");
assert(typeof fixtureAudit.renderingModel === "string", "Fixture audit must report renderingModel");
assert(Array.isArray(fixtureAudit.internalApiRoutes), "Fixture audit must report internalApiRoutes array");
assert(Array.isArray(fixtureAudit.serverSignals), "Fixture audit must report serverSignals array");
assert(typeof fixtureAudit.inputClassification === "string", "Fixture audit must report inputClassification");
assert(fixtureAudit.inputClassification === "web-frontend", "Fixture audit must classify react-web fixture as web-frontend");

const skill = read("skills/web-to-mobile/SKILL.md");

const requiredSkillPhrases = [
  "name: web-to-mobile",
  "description:",
  "docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md",
  "Do not generate or edit app code",
  "the user approved it",
  "Default to Expo React Native",
  "Use Swift/SwiftUI only when",
  "Use the Markdown plan as external memory",
  "mobile-parity-check"
];

for (const phrase of requiredSkillPhrases) {
  assert(skill.includes(phrase), `Skill is missing required phrase: ${phrase}`);
}

const skillFiles = walk("skills").filter((file) => file.endsWith("/SKILL.md"));

for (const file of skillFiles) {
  const body = read(file);
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  assert(words <= 500, `${file} is too large for progressive disclosure: ${words} words`);

  const descriptionLine = body.split("\n").find((line) => line.startsWith("description: "));
  assert(descriptionLine, `${file} missing description`);
  const description = descriptionLine.replace(/^description: /, "");
  assert(description.length <= 240, `${file} description is too long: ${description.length} chars`);
}

const skillChecks = {
  "skills/web-to-mobile-audit/SKILL.md": [
    "name: web-to-mobile-audit",
    "node scripts/web-repo-audit.mjs",
    "Framework and runtime",
    "route/page inventory",
    "Capability Tier",
    "Early Disqualification",
    "already-mobile",
    "backend-only",
    "dependency-substitutions.md",
    "ui-ux-spec.md",
    "End with a clear handoff to `mobile-migration-plan`"
  ],
  "skills/mobile-migration-plan/SKILL.md": [
    "name: mobile-migration-plan",
    "docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md",
    "references/plan-template.md",
    "framework-migration-notes.md",
    "dependency-substitutions.md",
    "ui-ux-spec.md",
    "API Needs",
    "[from-code]",
    "Reusable Code",
    "Rewrite-Required Code",
    "Unknowns And Blockers",
    "Implementation Checklist",
    "Do not edit app code before approval"
  ],
  "skills/expo-react-native-build/SKILL.md": [
    "name: expo-react-native-build",
    "The user approved implementation",
    "Update checklist items",
    "End by handing off to `mobile-qa-release`"
  ],
  "skills/mobile-qa-release/SKILL.md": [
    "name: mobile-qa-release",
    "Do not claim completion without fresh evidence",
    "Verification Notes",
    "Release Readiness"
  ]
};

for (const [path, phrases] of Object.entries(skillChecks)) {
  const body = read(path);
  for (const phrase of phrases) {
    assert(body.includes(phrase), `${path} is missing required phrase: ${phrase}`);
  }
}

const mobileAudit = JSON.parse(execFileSync(
  "node",
  ["scripts/mobile-app-audit.mjs", "tests/fixtures/partial-expo-app"],
  { cwd: root, encoding: "utf8" }
));

assert(mobileAudit.frameworks.some((f) => f.includes("Expo")), "Mobile fixture audit must detect Expo");
assert(mobileAudit.dependencyMatches.navigation.includes("@react-navigation/native"), "Mobile fixture audit must detect navigation");
assert(mobileAudit.screens.some((s) => s.status === "partial"), "Mobile fixture audit must detect partial screens");
assert(mobileAudit.incompleteMarkers.todo?.length > 0, "Mobile fixture audit must detect TODO markers");
assert(mobileAudit.completionRisks.includes("partial-screens"), "Mobile fixture audit must flag partial-screens risk");
assert(typeof mobileAudit.brokenScreenCount === "number", "Mobile fixture audit must include brokenScreenCount field");

const paritySkillChecks = {
  "skills/mobile-parity-check/SKILL.md": [
    "name: mobile-parity-check",
    "Route To Mobile Navigation Map",
    "human visual sign-off",
    "End by handing off to `mobile-qa-release`",
    "Parity Review",
  ],
};

for (const [path, phrases] of Object.entries(paritySkillChecks)) {
  const body = read(path);
  for (const phrase of phrases) {
    assert(body.includes(phrase), `${path} is missing required phrase: ${phrase}`);
  }
}

const scanReviewSkillChecks = {
  "skills/mobile-qa-scan/SKILL.md": [
    "name: mobile-qa-scan",
    "node scripts/mobile-app-audit.mjs",
    "docs/mobile-qa/",
    "Do not read source files",
    "Verdict",
  ],
  "skills/mobile-deep-review/SKILL.md": [
    "name: mobile-deep-review",
    "node scripts/mobile-app-audit.mjs",
    "docs/mobile-review/",
    "severity",
    "Verdict",
  ],
};

for (const [path, phrases] of Object.entries(scanReviewSkillChecks)) {
  const body = read(path);
  for (const phrase of phrases) {
    assert(body.includes(phrase), `${path} is missing required phrase: ${phrase}`);
  }
}

const mobileResumeSkillChecks = {
  "skills/mobile-resume/SKILL.md": [
    "name: mobile-resume",
    "docs/mobile-resume/YYYY-MM-DD-mobile-completion-plan.md",
    "Do not generate or edit app code",
    "the user approved it",
    "Use the Markdown plan as external memory",
  ],
  "skills/mobile-app-audit/SKILL.md": [
    "name: mobile-app-audit",
    "node scripts/mobile-app-audit.mjs",
    "Screen completion status",
    "End with a clear handoff to `mobile-completion-plan`",
  ],
  "skills/mobile-completion-plan/SKILL.md": [
    "name: mobile-completion-plan",
    "docs/mobile-resume/YYYY-MM-DD-mobile-completion-plan.md",
    "Implementation Checklist",
    "Completion Status",
    "Screen Inventory",
    "Do not edit app code before approval",
  ],
};

for (const [path, phrases] of Object.entries(mobileResumeSkillChecks)) {
  const body = read(path);
  for (const phrase of phrases) {
    assert(body.includes(phrase), `${path} is missing required phrase: ${phrase}`);
  }
}

const pressure = read("tests/pressure-scenarios.md");
const requiredScenarios = [
  "Next.js App Conversion",
  "Live Website Only",
  "GitHub Repo URL",
  "User Asks To Skip Planning",
  "Simple Static Site",
  "Authenticated SaaS App",
  "Existing Partial Expo App",
  "GitHub Repo With Incomplete Mobile App",
  "User Asks To Skip Audit For Mobile Resume",
  "Design Parity Check After Build",
  "QA Scan of Partial Mobile App",
  "Deep Senior Review of Partial Mobile App",
];

for (const scenario of requiredScenarios) {
  assert(pressure.includes(scenario), `Pressure tests missing scenario: ${scenario}`);
}

console.log("WebToMobile plugin structure is valid.");
