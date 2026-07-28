#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";

const root = process.argv[2] || ".";
const maxFiles = Number(process.env.MOBILEAUDIT_MAX_FILES || 150);

const mobileSourceExts = new Set([".ts", ".tsx", ".js", ".jsx", ".swift", ".kt"]);
const ignoreDirs = new Set([".git", "node_modules", ".expo", "dist", "build", ".turbo", "coverage"]);
const screenRoots = ["screens", "src/screens", "app", "src/app", "views", "src/views"];
const testRoots = ["__tests__", "tests", "src/__tests__", "src/tests"];

const incompletePatterns = [
  ["todo", /\bTODO\b/g],
  ["fixme", /\bFIXME\b/g],
  ["placeholder", /(?:\/\/|\/\*|\*)[^\n]*\bplaceholder\b/gi],
  ["notImplemented", /(?:\/\/|\/\*|\*)[^\n]*\bnot\s+implemented\b/gi],
  ["returnNull", /return\s+null\s*;/g],
];

const navigationLibs = [
  "@react-navigation/native",
  "@react-navigation/native-stack",
  "@react-navigation/stack",
  "@react-navigation/bottom-tabs",
  "@react-navigation/drawer",
  "expo-router",
];
const navTypePatterns = [
  ["stack", /createStackNavigator|createNativeStackNavigator|Stack\.Navigator/g],
  ["tabs", /createBottomTabNavigator|createMaterialTopTabNavigator|Tabs\.Navigator|Tab\.Navigator/g],
  ["drawer", /createDrawerNavigator|Drawer\.Navigator/g],
  ["file-based", /expo-router|from ['"]expo-router['"]/g],
];
const authLibs = [
  "@clerk/clerk-expo",
  "expo-auth-session",
  "firebase",
  "@supabase/supabase-js",
  "aws-amplify",
  "react-native-app-auth",
];
const stateLibs = ["zustand", "redux", "@reduxjs/toolkit", "jotai", "recoil", "mobx", "valtio"];
const storageLibs = ["expo-secure-store", "@react-native-async-storage/async-storage", "react-native-mmkv"];
const testingLibs = ["jest", "@testing-library/react-native", "detox", "maestro"];

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function walk(dir, files = []) {
  if (!existsSync(dir) || files.length >= maxFiles) return files;
  for (const entry of readdirSync(dir)) {
    if (ignoreDirs.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path, files);
    } else if (mobileSourceExts.has(extname(entry))) {
      files.push(path);
    }
    if (files.length >= maxFiles) break;
  }
  return files;
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function scanIncompleteMarkers(files) {
  const found = {};
  for (const file of files) {
    let text = "";
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const [name, pattern] of incompletePatterns) {
      const count = countMatches(text, pattern);
      if (!count) continue;
      found[name] ||= [];
      if (found[name].length < 10) {
        found[name].push({ file: relative(root, file), count });
      }
    }
  }
  return found;
}

// Expo Router uses file-based routing — _layout files define structure, not screens.
// Group directories like (auth) or (tabs) are transparent routing segments, not screen names.
function isLayoutFile(filename) {
  return /^_layout\.(tsx?|jsx?)$/.test(filename);
}

function isExpoRouterScreen(filename) {
  return !isLayoutFile(filename) &&
    !/^\+api\.(tsx?|jsx?)$/.test(filename) &&
    !/^_/.test(filename);
}

function detectScreens(files, isExpoRouter) {
  const screens = [];
  for (const screenRoot of screenRoots) {
    const absolute = join(root, screenRoot);
    if (!existsSync(absolute)) continue;
    for (const file of walk(absolute, [])) {
      const name = basename(file);
      const isRouterRoot = screenRoot === "app" || screenRoot === "src/app";
      // Expo Router reserves layout/API files for navigation and server endpoints.
      if (isExpoRouter && isRouterRoot && !isExpoRouterScreen(name)) continue;
      const rel = relative(root, file);
      let text = "";
      try {
        text = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      const hasTodo = /\bTODO\b|\bFIXME\b/i.test(text);
      const hasPlaceholderComment = /(?:\/\/|\/\*|\*)[^\n]*\bplaceholder\b/i.test(text);
      const hasNotImplementedComment = /(?:\/\/|\/\*|\*)[^\n]*\bnot\s+implemented\b/i.test(text);
      const hasEmptyReturn = /return\s+null\s*;/.test(text);
      const hasTsIgnore = /@ts-ignore/.test(text);
      // broken = suppressed type errors combined with empty return (actively silenced breakage)
      const isBroken = hasTsIgnore && hasEmptyReturn;
      const isPartial = !isBroken &&
        (hasTodo || hasPlaceholderComment || hasNotImplementedComment || hasEmptyReturn);
      const status = isBroken ? "broken" : isPartial ? "partial" : "implemented";
      if (screens.length < 60) {
        screens.push({ file: rel, status });
      }
    }
  }
  return screens;
}

function detectTestFiles(files) {
  const tests = [];
  for (const testRoot of testRoots) {
    const absolute = join(root, testRoot);
    if (!existsSync(absolute)) continue;
    for (const file of walk(absolute, [])) {
      if (tests.length < 40) tests.push(relative(root, file));
    }
  }
  for (const file of files) {
    const rel = relative(root, file);
    if ((rel.includes(".test.") || rel.includes(".spec.")) && tests.length < 40) {
      if (!tests.includes(rel)) tests.push(rel);
    }
  }
  return tests;
}

function detectNavigationTypes(files) {
  const navigationTypes = new Set();
  for (const file of files) {
    let text = "";
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const [type, pattern] of navTypePatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(text)) navigationTypes.add(type);
    }
  }
  return [...navigationTypes];
}

const packageJson = readJson(join(root, "package.json"));
const appJson = readJson(join(root, "app.json"));

const allDeps = {
  ...(packageJson?.dependencies || {}),
  ...(packageJson?.devDependencies || {}),
};

const isExpoRouter = Boolean(allDeps["expo-router"]);

const frameworks = [];
if (allDeps["expo"]) frameworks.push(`Expo ${allDeps["expo"]}`);
if (allDeps["react-native"]) frameworks.push(`React Native ${allDeps["react-native"]}`);
if (isExpoRouter) frameworks.push("Expo Router (file-based routing)");
if (!allDeps["expo"] && !allDeps["react-native"] && existsSync(join(root, "ios"))) {
  frameworks.push("Swift/iOS (detected via ios/ directory)");
}

const dependencyMatches = {
  navigation: navigationLibs.filter((n) => allDeps[n]),
  auth: authLibs.filter((n) => allDeps[n]),
  state: stateLibs.filter((n) => allDeps[n]),
  storage: storageLibs.filter((n) => allDeps[n]),
  testing: testingLibs.filter((n) => allDeps[n]),
};

const sourceFiles = walk(root, []);
const screens = detectScreens(sourceFiles, isExpoRouter);
const navigationTypes = detectNavigationTypes(sourceFiles);
const incompleteMarkers = scanIncompleteMarkers(sourceFiles);
const testFiles = detectTestFiles(sourceFiles);

const packageManager = existsSync(join(root, "pnpm-lock.yaml"))
  ? "pnpm"
  : existsSync(join(root, "yarn.lock"))
    ? "yarn"
    : existsSync(join(root, "bun.lock")) || existsSync(join(root, "bun.lockb"))
      ? "bun"
    : existsSync(join(root, "package-lock.json"))
      ? "npm"
      : "unknown";

const configFiles = {
  appJson: existsSync(join(root, "app.json")),
  easJson: existsSync(join(root, "eas.json")),
  appConfig: ["app.config.ts", "app.config.js", "app.config.mjs"].some((file) =>
    existsSync(join(root, file))
  ),
  envExample: existsSync(join(root, ".env.example")),
  tsconfig: existsSync(join(root, "tsconfig.json")),
};

const partialScreens = screens.filter((s) => s.status === "partial");
const brokenScreens = screens.filter((s) => s.status === "broken");
const completionRisks = [];
if (partialScreens.length > 0) completionRisks.push("partial-screens");
if (brokenScreens.length > 0) completionRisks.push("broken-screens");
if (Object.keys(incompleteMarkers).length > 0) completionRisks.push("incomplete-markers-in-source");
const usesEas = Object.values(packageJson?.scripts || {}).some((script) =>
  /\beas(?:\s|$)/.test(script)
);
if (usesEas && !configFiles.easJson) completionRisks.push("missing-eas-config");
if (testFiles.length === 0) completionRisks.push("no-tests-detected");
const tokenAuthLibraries = [
  "@clerk/clerk-expo",
  "expo-auth-session",
  "@supabase/supabase-js",
  "react-native-app-auth",
];
if (tokenAuthLibraries.some((name) => allDeps[name]) && dependencyMatches.storage.length === 0) {
  completionRisks.push("auth-without-secure-storage");
}

console.log(
  JSON.stringify(
    {
      root,
      packageManager,
      scripts: packageJson?.scripts || {},
      frameworks,
      dependencyMatches,
      navigationTypes,
      sourceFilesScanned: sourceFiles.length,
      screens,
      partialScreenCount: partialScreens.length,
      brokenScreenCount: brokenScreens.length,
      incompleteMarkers,
      testFiles,
      testCount: testFiles.length,
      configFiles,
      completionRisks,
      appName: appJson?.expo?.name || appJson?.name || packageJson?.name || null,
      sdkVersion: appJson?.expo?.sdkVersion || null,
    },
    null,
    2
  )
);
