import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const expectedVersion = "0.3.0";

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
  ".codex-plugin/assets/icon.svg",
  ".codex-plugin/assets/logo.svg",
  ".agents/plugins/marketplace.json",
  ".claude-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  "package.json",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CITATION.cff",
  "commands/web-to-mobile.md",
  "commands/mobile-resume.md",
  "commands/mobile-audit.md",
  "commands/mobile-qa.md",
  "commands/mobile-scan.md",
  "commands/mobile-review.md",
  "scripts/web-repo-audit.mjs",
  "scripts/mobile-app-audit.mjs",
  "skills/web-to-mobile-audit/scripts/web-repo-audit.mjs",
  "skills/mobile-app-audit/scripts/mobile-app-audit.mjs",
  "scripts/install.mjs",
  "tests/fixtures/react-web/package.json",
  "tests/fixtures/react-web/.env.example",
  "tests/fixtures/react-web/src/App.tsx",
  "tests/fixtures/react-web/tailwind.config.js",
  "tests/fixtures/next-app-router/package.json",
  "tests/fixtures/next-app-router/app/page.tsx",
  "tests/fixtures/next-app-router/app/dashboard/page.tsx",
  "tests/fixtures/next-app-router/app/layout.tsx",
  "tests/fixtures/next-app-router/app/loading.tsx",
  "tests/fixtures/next-app-router/app/dashboard/Chart.tsx",
  "tests/fixtures/next-app-router/app/api/health/route.ts",
  "tests/fixtures/next-app-router/app/blog/[...slug]/page.tsx",
  "tests/fixtures/next-app-router-data/package.json",
  "tests/fixtures/next-app-router-data/app/profile/page.tsx",
  "tests/fixtures/partial-expo-app/package.json",
  "tests/fixtures/partial-expo-app/app.json",
  "tests/fixtures/partial-expo-app/src/navigation/AppNavigator.tsx",
  "tests/fixtures/partial-expo-app/src/screens/HomeScreen.tsx",
  "tests/fixtures/partial-expo-app/src/screens/ProfileScreen.tsx",
  "tests/fixtures/partial-expo-app/src/screens/LoginScreen.tsx",
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
  "skills/mobile-migration-plan/references/output-contracts.md",
  "skills/mobile-migration-plan/references/dependency-substitutions.md",
  "skills/mobile-migration-plan/references/framework-migration-notes.md",
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

const ignoredWalkDirs = new Set([".git", "node_modules", "graphify-out", ".claude"]);

function walk(dir, files = []) {
  for (const entry of readdirSync(join(root, dir))) {
    if (ignoredWalkDirs.has(entry)) continue;
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

const trackedFiles = (() => {
  try {
    return execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
      .split("\n")
      .filter(Boolean);
  } catch {
    return walk(".");
  }
})();
for (const file of trackedFiles) {
  assert(!file.endsWith(".DS_Store"), `Remove tracked local metadata file: ${file}`);
}

const codex = parseJson(".codex-plugin/plugin.json");
const claude = parseJson(".claude-plugin/plugin.json");
const cursor = parseJson(".cursor-plugin/plugin.json");
const packageJson = parseJson("package.json");
const marketplace = parseJson(".agents/plugins/marketplace.json");

for (const [name, manifest] of [
  [".codex-plugin/plugin.json", codex],
  [".claude-plugin/plugin.json", claude],
  [".cursor-plugin/plugin.json", cursor]
]) {
  assert(manifest.name === "web-to-mobile", `${name} must use name web-to-mobile`);
  assert(manifest.version === expectedVersion, `${name} must use version ${expectedVersion}`);
  assert(manifest.skills === "./skills/", `${name} must point skills to ./skills/`);
  assert(manifest.license === "MIT", `${name} must use MIT license`);
  assert(!Object.prototype.hasOwnProperty.call(manifest, "cloneUrl"), `${name} must not use unsupported cloneUrl`);
}

assert(codex.interface?.displayName === "WebToMobile", "Codex manifest must include displayName");
assert(Array.isArray(codex.interface?.defaultPrompt), "Codex manifest must include default prompts");
assert(codex.interface?.shortDescription.length <= 30, "Codex shortDescription must fit final directory limits");
assert(codex.interface?.category === "Developer Tools", "Codex category must be Developer Tools");
assert(codex.interface?.supportURL?.endsWith("/issues"), "Codex manifest must include the support URL");
assert(existsSync(join(root, ".codex-plugin", codex.interface?.composerIcon || "")), "Codex composerIcon must resolve");
assert(existsSync(join(root, ".codex-plugin", codex.interface?.logo || "")), "Codex logo must resolve");
assert(!codex.interface?.privacyPolicyURL, "Skills-only plugin must not claim GitHub's privacy policy as its own");
assert(!codex.interface?.termsOfServiceURL, "Skills-only plugin must not claim GitHub's terms as its own");
assert(claude.commands === "./commands/", "Claude manifest must expose commands");
assert(cursor.commands === "./commands/", "Cursor manifest must expose commands");
assert(packageJson.version === expectedVersion, "package.json version must match plugin manifests");
assert(packageJson.engines?.node === ">=22", "package.json must require a maintained Node.js LTS baseline");
assert(marketplace.plugins?.[0]?.name === "web-to-mobile", "Marketplace must list web-to-mobile");
assert(marketplace.plugins?.[0]?.category === "Developer Tools", "Marketplace category must be Developer Tools");
assert(marketplace.plugins?.[0]?.policy?.installation === "AVAILABLE", "Marketplace plugin must be available");

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
assert(readme.includes("--update"), "README must document normal update behavior");
assert(readme.includes("--refresh"), "README must document safe installer refresh behavior");
assert(readme.includes("You edited the plugin locally"), "README must explain the main refresh use case");
assert(!readme.includes("$web-to-mobile and $mobile-resume invocation style works"), "README must avoid overpromising Codex invocation syntax");
assert(readme.includes("Use the web-to-mobile skill on this repo."), "README must include concrete Codex usage wording");
assert(!/\d+-\d+%\s+(faster|less|fewer)/.test(readme), "README must not make unverifiable percentage benchmark claims");

const installer = read("scripts/install.mjs");
assert(installer.includes("--update"), "Installer must support --update");
assert(installer.includes("git pull"), "Installer update must pull from git");
assert(installer.includes("readPluginVersion"), "Installer update must display plugin version status");
assert(installer.includes("Already at latest"), "Installer update must explain no-op updates");
assert(installer.includes("--refresh"), "Installer must support --refresh");
assert(installer.includes("isOwnedSymlink"), "Installer refresh/unlink must guard user-owned files");
assert(installer.includes("isOwnedCopy"), "Installer must track copied Windows installs");
assert(installer.includes(".web-to-mobile-owned.json"), "Installer copies must use ownership markers");
assert(!installer.includes("--force"), "Installer must not expose a broad --force mode");

for (const manifestPath of [".codex-plugin/plugin.json", ".claude-plugin/plugin.json", ".cursor-plugin/plugin.json"]) {
  const manifestText = read(manifestPath);
  assert(manifestText.includes("https://github.com/suntay44/web-to-mobile-magic-plugin"), `${manifestPath} must use the real public repo URL`);
  assert(!manifestText.includes("https://github.com/webtomobile/web-to-mobile"), `${manifestPath} must not use placeholder repo URLs`);
}

const auditScript = read("skills/web-to-mobile-audit/scripts/web-repo-audit.mjs");
for (const phrase of [
  "dependencyMatches",
  "browserApiUsage",
  "mobileRisks",
  "routeConfidence",
  "scanInlineRoutes",
  "renderingModel",
  "internalApiRoutes",
  "serverSignals",
  "nextjsRouter",
  "vueVersion",
  "envVarNames"
]) {
  assert(auditScript.includes(phrase), `Audit script missing ${phrase}`);
}

const contracts = read("skills/mobile-migration-plan/references/output-contracts.md");
for (const phrase of [
  "Scope Boundaries",
  "Capability Tiers",
  "Capability Downgrade",
  "Confidence Labels",
  "API Needs",
  "Migration Fit Verdict",
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
assert(new Set(fixtureAudit.routes.map((route) => route.route)).size === fixtureAudit.routes.length, "Fixture audit must deduplicate routes by path");
assert(fixtureAudit.routes.find((route) => route.route === "/dashboard")?.sources.includes("href-route"), "Fixture audit must retain merged route sources");
assert(fixtureAudit.browserApiUsage.window?.length, "Fixture audit must detect window usage");
assert(fixtureAudit.browserApiUsage.localStorage?.length, "Fixture audit must detect localStorage usage");
assert(fixtureAudit.browserApiUsage.cookie?.length, "Fixture audit must detect cookie usage");
assert(typeof fixtureAudit.renderingModel === "string", "Fixture audit must report renderingModel");
assert(Array.isArray(fixtureAudit.internalApiRoutes), "Fixture audit must report internalApiRoutes array");
assert(Array.isArray(fixtureAudit.serverSignals), "Fixture audit must report serverSignals array");
assert(Object.prototype.hasOwnProperty.call(fixtureAudit, "nextjsRouter"), "Fixture audit must include nextjsRouter field");
assert(Object.prototype.hasOwnProperty.call(fixtureAudit, "vueVersion"), "Fixture audit must include vueVersion field");
assert(Array.isArray(fixtureAudit.envVarNames), "Fixture audit must include envVarNames array");
assert(fixtureAudit.envVarNames.includes("VITE_SUPABASE_URL"), "Fixture audit must extract env var names");
assert(typeof fixtureAudit.inputClassification === "string", "Fixture audit must report inputClassification");
assert(fixtureAudit.inputClassification === "web-frontend", "Fixture audit must classify react-web fixture as web-frontend");

const nextAppAudit = JSON.parse(execFileSync(
  "node",
  ["scripts/web-repo-audit.mjs", "tests/fixtures/next-app-router"],
  { cwd: root, encoding: "utf8" }
));

assert(nextAppAudit.frameworks.includes("Next.js"), "Next fixture audit must detect Next.js");
assert(nextAppAudit.nextjsRouter === "app-router", "Next fixture audit must detect App Router");
assert(nextAppAudit.serverSignals.includes("use-client-directive"), "Next fixture audit must detect use client directives");
assert(nextAppAudit.serverSignals.includes("server-components"), "Next fixture audit must detect server components");
assert(!nextAppAudit.serverSignals.includes("server-component-data-access"), "Static Next fixture must not report server component data access");
assert(!nextAppAudit.mobileRisks.includes("server-component-data-fetching-review"), "Static Next fixture must not flag server component data review");
assert(nextAppAudit.routes.some((route) => route.route === "/"), "Next fixture must detect the root page");
assert(nextAppAudit.routes.some((route) => route.route === "/dashboard"), "Next fixture must detect dashboard page");
assert(nextAppAudit.routes.some((route) => route.route === "/blog/:slug*"), "Next fixture must normalize catch-all routes");
assert(!nextAppAudit.routes.some((route) => route.route === "/layout"), "Next fixture must not treat layout as a route");
assert(!nextAppAudit.routes.some((route) => route.route === "/loading"), "Next fixture must not treat loading as a route");
assert(!nextAppAudit.routes.some((route) => route.route.includes("Chart")), "Next fixture must not treat colocated components as routes");
assert(!nextAppAudit.routes.some((route) => route.route.startsWith("/api")), "Next UI routes must exclude API handlers");
assert(nextAppAudit.internalApiRoutes.includes("app/api/health/route.ts"), "Next fixture must list Route Handlers separately");
assert(nextAppAudit.mobileRisks.includes("internal-api-mobile-compatibility-review"), "Next fixture must request mobile API compatibility review");
assert(nextAppAudit.renderingModel !== "server-coupled", "A Route Handler alone must not make a Next app server-coupled");

const nextAppDataAudit = JSON.parse(execFileSync(
  "node",
  ["scripts/web-repo-audit.mjs", "tests/fixtures/next-app-router-data"],
  { cwd: root, encoding: "utf8" }
));

assert(nextAppDataAudit.nextjsRouter === "app-router", "Next data fixture audit must detect App Router");
assert(nextAppDataAudit.serverSignals.includes("server-components"), "Next data fixture audit must detect server components");
assert(nextAppDataAudit.serverSignals.includes("server-component-data-access"), "Next data fixture audit must detect server component data access");
assert(nextAppDataAudit.mobileRisks.includes("server-component-data-fetching-review"), "Next data fixture audit must flag server component data review");

const skill = read("skills/web-to-mobile/SKILL.md");

const requiredSkillPhrases = [
  "name: web-to-mobile",
  "description:",
  "docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md",
  "Do not generate or edit app code",
  "the user approved it",
  "Default to Expo React Native",
  "Recommend Swift/SwiftUI planning only when",
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

  for (const match of body.matchAll(/`((?:\.\.\/|references\/)[^`]+\.(?:md|mjs))`/g)) {
    const resource = resolve(dirname(join(root, file)), match[1]);
    assert(existsSync(resource), `${file} references missing packaged resource: ${match[1]}`);
  }
}

assert(
  read("scripts/web-repo-audit.mjs").includes("../skills/web-to-mobile-audit/scripts/web-repo-audit.mjs"),
  "Contributor web audit command must delegate to the packaged scanner"
);
assert(
  read("scripts/mobile-app-audit.mjs").includes("../skills/mobile-app-audit/scripts/mobile-app-audit.mjs"),
  "Contributor mobile audit command must delegate to the packaged scanner"
);

const skillChecks = {
  "skills/web-to-mobile-audit/SKILL.md": [
    "name: web-to-mobile-audit",
    "node <skill-dir>/scripts/web-repo-audit.mjs",
    "Framework and runtime",
    "route/page inventory",
    "Capability Tier",
    "Early Disqualification",
    "already-mobile",
    "backend-only",
    "dependency-substitutions.md",
    "ui-ux-spec.md",
    "handoff to"
  ],
  "skills/mobile-migration-plan/SKILL.md": [
    "name: mobile-migration-plan",
    "docs/web-to-mobile/YYYY-MM-DD-web-to-mobile-plan.md",
    "references/plan-template.md",
    "Migration Fit Verdict",
    "PWA/PWABuilder",
    "Route To Mobile Navigation Map",
    "framework-migration-notes.md",
    "dependency-substitutions.md",
    "ui-ux-spec.md",
    "API Needs",
    "update that file in place",
    "The verdict controls the next phase",
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
    "approved stack is Expo React Native",
    "dependency-substitutions.md",
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
assert(Array.isArray(mobileAudit.navigationTypes), "Mobile fixture audit must include navigationTypes array");
assert(mobileAudit.navigationTypes.includes("stack"), "Mobile fixture audit must detect stack navigation");
assert(mobileAudit.navigationTypes.includes("tabs"), "Mobile fixture audit must detect tab navigation");
assert(mobileAudit.screens.some((s) => s.status === "partial"), "Mobile fixture audit must detect partial screens");
assert(mobileAudit.incompleteMarkers.todo?.length > 0, "Mobile fixture audit must detect TODO markers");
assert(mobileAudit.completionRisks.includes("partial-screens"), "Mobile fixture audit must flag partial-screens risk");
assert(typeof mobileAudit.brokenScreenCount === "number", "Mobile fixture audit must include brokenScreenCount field");
assert(
  mobileAudit.screens.find((screen) => screen.file.endsWith("LoginScreen.tsx"))?.status === "implemented",
  "A TextInput placeholder prop must not make a screen partial"
);
assert(
  !mobileAudit.incompleteMarkers.placeholder?.some((entry) => entry.file.endsWith("LoginScreen.tsx")),
  "A TextInput placeholder prop must not be reported as an incomplete marker"
);
assert(
  !mobileAudit.completionRisks.includes("missing-eas-config"),
  "Apps that do not invoke EAS must not be flagged for a missing eas.json"
);

const sampleWebPlan = read("examples/sample-web-to-mobile-plan.md");
for (const phrase of [
  "## Capabilities & Limits",
  "## Migration Fit Verdict",
  "Navigator Pattern",
  "## API Needs",
  "## Reusable Code",
  "## Rewrite-Required Code",
  "Suggested Native/Expo API",
  "## Unknowns And Blockers",
  "[from-code]",
  "## Human Sign-Off Required"
]) {
  assert(sampleWebPlan.includes(phrase), `Sample web-to-mobile plan missing phrase: ${phrase}`);
}

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
    "node <mobile-app-audit-skill-dir>/scripts/mobile-app-audit.mjs",
    "docs/mobile-qa/",
    "Do not read source files",
    "Verdict",
  ],
  "skills/mobile-deep-review/SKILL.md": [
    "name: mobile-deep-review",
    "node <mobile-app-audit-skill-dir>/scripts/mobile-app-audit.mjs",
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
    "node <skill-dir>/scripts/mobile-app-audit.mjs",
    "Screen completion status",
    "handoff to",
  ],
  "skills/mobile-completion-plan/SKILL.md": [
    "name: mobile-completion-plan",
    "docs/mobile-resume/YYYY-MM-DD-mobile-completion-plan.md",
    "Implementation Checklist",
    "Completion Status",
    "Screen Inventory",
    "Do not edit app code before approval",
    "update that file in place",
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
