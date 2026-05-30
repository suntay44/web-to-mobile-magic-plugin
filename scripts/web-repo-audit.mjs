#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const root = process.argv[2] || ".";
const maxFiles = Number(process.env.WEBTOMOBILE_MAX_FILES || 120);
const routeRoots = ["app", "pages", "src/app", "src/pages", "routes", "src/routes", "app/routes"];
const apiRouteRoots = ["app/api", "src/app/api", "pages/api", "src/pages/api"];
const serverPatterns = [
  ["server-actions", /["']use server["']/g],
  ["getServerSideProps", /\bgetServerSideProps\b/g],
  ["getStaticProps", /\bgetStaticProps\b/g],
  ["trpc-router", /createTRPCRouter|initTRPC/g],
];
const sourceExts = new Set([".ts", ".tsx", ".js", ".jsx", ".vue", ".svelte", ".astro", ".html"]);
const ignoreDirs = new Set([".git", "node_modules", ".next", "dist", "build", ".expo", ".turbo", "coverage"]);
const browserPatterns = [
  ["window", /\bwindow\b/g],
  ["document", /\bdocument\b/g],
  ["localStorage", /\blocalStorage\b/g],
  ["sessionStorage", /\bsessionStorage\b/g],
  ["cookie", /\bdocument\.cookie\b|\bcookies?\(/g],
  ["navigator", /\bnavigator\b/g],
  ["matchMedia", /\bmatchMedia\b/g],
  ["IntersectionObserver", /\bIntersectionObserver\b/g]
];
const routePatterns = [
  ["jsx-route-path", /<Route\b[^>]*\bpath=["'`]([^"'`]+)["'`]/g],
  ["object-route-path", /\bpath\s*:\s*["'`]([^"'`]+)["'`]/g],
  ["file-route-link", /\bto=["'`]([^"'`]+)["'`]/g],
  ["href-route", /\bhref=["'`](\/[^"'`#?]+)["'`]/g]
];
const dependencyGroups = {
  auth: ["@clerk/nextjs", "@clerk/clerk-react", "next-auth", "@auth/core", "@supabase/supabase-js", "firebase", "aws-amplify", "lucia", "better-auth"],
  api: ["@tanstack/react-query", "swr", "axios", "graphql", "@apollo/client", "urql", "@trpc/client", "@trpc/react-query", "ky"],
  state: ["zustand", "redux", "@reduxjs/toolkit", "jotai", "recoil", "mobx", "valtio"],
  forms: ["react-hook-form", "formik", "zod", "yup", "valibot"],
  styling: ["tailwindcss", "styled-components", "@emotion/react", "sass", "less", "class-variance-authority", "bootstrap"],
  ui: ["@mui/material", "antd", "chakra-ui", "@chakra-ui/react", "@radix-ui/react-dialog", "shadcn", "framer-motion"],
  routing: ["react-router", "react-router-dom", "@tanstack/react-router"],
  mobileCandidate: ["expo", "react-native", "expo-router", "@react-navigation/native", "nativewind"]
};

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
    } else if (sourceExts.has(extname(entry))) {
      files.push(path);
    }
    if (files.length >= maxFiles) break;
  }
  return files;
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function sampleBrowserApiUsage(files) {
  const usage = {};
  for (const file of files) {
    let text = "";
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const [name, pattern] of browserPatterns) {
      const count = countMatches(text, pattern);
      if (!count) continue;
      usage[name] ||= [];
      if (usage[name].length < 8) {
        usage[name].push({ file: relative(root, file), count });
      }
    }
  }
  return usage;
}

function scanInlineRoutes(files) {
  const seen = new Set();
  const routes = [];
  for (const file of files) {
    let text = "";
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const [source, pattern] of routePatterns) {
      for (const match of text.matchAll(pattern)) {
        const route = match[1];
        if (!route?.startsWith("/") || route.startsWith("//")) continue;
        const key = `${route}:${file}:${source}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (routes.length < 80) {
          routes.push({ route, file: relative(root, file), source });
        }
      }
    }
  }
  return routes;
}

function routeFromFile(base, file) {
  let route = relative(base, file)
    .replace(/\.[^.]+$/, "")
    .replace(/(^|\/)(page|index)$/, "$1")
    .replace(/\[(\w+)\]/g, ":$1")
    .replace(/\([^)]*\)\//g, "")
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");
  return `/${route}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}

const packageJson = readJson(join(root, "package.json"));
const allDeps = {
  ...(packageJson?.dependencies || {}),
  ...(packageJson?.devDependencies || {})
};

const frameworks = [];
for (const [name, label] of [
  ["next", "Next.js"],
  ["react", "React"],
  ["vite", "Vite"],
  ["@remix-run/react", "Remix"],
  ["astro", "Astro"],
  ["vue", "Vue"],
  ["svelte", "Svelte"],
  ["expo", "Expo"],
  ["react-native", "React Native"]
]) {
  if (allDeps[name]) frameworks.push(label);
}

// Early disqualification: detect inputs that are already mobile or have no
// frontend to port, so the audit skill can stop and redirect immediately.
const backendOnlyMarkers = ["express", "fastify", "koa", "hapi", "@nestjs/core", "nestjs", "django", "flask", "rails"];
const isMobile =
  frameworks.some((f) => ["Expo", "React Native"].includes(f)) ||
  existsSync(join(root, "ios")) ||
  existsSync(join(root, "android"));
const hasWebFrontend = frameworks.some((f) => !["Expo", "React Native"].includes(f));
const isBackendOnly =
  !isMobile &&
  !hasWebFrontend &&
  backendOnlyMarkers.some((d) => allDeps[d]);
const hasStaticHtml =
  !isMobile && !hasWebFrontend && !isBackendOnly &&
  existsSync(root) && readdirSync(root).some((f) => f.endsWith(".html"));

const inputClassification = isMobile
  ? "already-mobile"
  : hasWebFrontend
    ? "web-frontend"
    : isBackendOnly
      ? "backend-only"
      : hasStaticHtml
        ? "static-html"
        : "unknown";

const dependencyMatches = {};
for (const [group, names] of Object.entries(dependencyGroups)) {
  dependencyMatches[group] = names.filter((name) => allDeps[name]);
}

const sourceFiles = walk(root, []);

const routes = [];
const seenRoutes = new Set();
for (const routeRoot of routeRoots) {
  const absolute = join(root, routeRoot);
  if (!existsSync(absolute)) continue;
  for (const file of walk(absolute, [])) {
    const route = routeFromFile(absolute, file);
    const key = `${route}:${file}`;
    if (seenRoutes.has(key)) continue;
    seenRoutes.add(key);
    routes.push({ route, file: relative(root, file), source: "file-system" });
  }
}

for (const route of scanInlineRoutes(sourceFiles)) {
  const key = `${route.route}:${route.file}:${route.source}`;
  if (seenRoutes.has(key)) continue;
  seenRoutes.add(key);
  routes.push(route);
}

const packageManager = existsSync(join(root, "pnpm-lock.yaml"))
  ? "pnpm"
  : existsSync(join(root, "yarn.lock"))
    ? "yarn"
    : existsSync(join(root, "package-lock.json"))
      ? "npm"
      : "unknown";

const interestingFiles = [
  "next.config.js",
  "next.config.mjs",
  "vite.config.ts",
  "vite.config.js",
  "tailwind.config.ts",
  "tailwind.config.js",
  "tsconfig.json",
  ".env.example",
  "app.json",
  "app.config.ts"
].filter((file) => existsSync(join(root, file)));

const routeCount = routes.length;
const routeConfidence = routeCount > 0
  ? "detected-from-files"
  : sourceFiles.length > 0
    ? "not-detected-check-router-config"
    : "no-source-files-detected";

// Backend coupling: a mobile app needs a client-callable API. Detect whether the
// web app is server-coupled (SSR/server actions/internal API routes) vs a SPA hitting
// an external API. Server-coupled apps have no portable API — that is a human blocker.
const internalApiRoutes = [];
for (const apiRoot of apiRouteRoots) {
  const absolute = join(root, apiRoot);
  if (!existsSync(absolute)) continue;
  for (const file of walk(absolute, [])) {
    if (internalApiRoutes.length < 40) internalApiRoutes.push(relative(root, file));
  }
}

const serverSignals = [];
for (const file of sourceFiles) {
  let text = "";
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const [name, pattern] of serverPatterns) {
    if (!serverSignals.includes(name) && pattern.test(text)) serverSignals.push(name);
  }
}

const serverCoupled =
  internalApiRoutes.length > 0 ||
  serverSignals.some((s) => ["server-actions", "getServerSideProps", "trpc-router"].includes(s));
const renderingModel = serverCoupled
  ? "server-coupled"
  : dependencyMatches.api.length > 0
    ? "client-spa-external-api"
    : "unknown";

const mobileRisks = [];
const browserApiUsage = sampleBrowserApiUsage(sourceFiles);
if (Object.keys(browserApiUsage).length) mobileRisks.push("browser-only-apis");
if (dependencyMatches.auth.length) mobileRisks.push("mobile-auth-session-handling");
if (dependencyMatches.api.length) mobileRisks.push("api-data-layer-port");
if (dependencyMatches.styling.includes("tailwindcss")) mobileRisks.push("web-styling-port");
if (dependencyMatches.ui.length) mobileRisks.push("dom-ui-component-rewrite");
if (renderingModel === "server-coupled") mobileRisks.push("backend-not-portable-needs-api");

console.log(JSON.stringify({
  root,
  packageManager,
  scripts: packageJson?.scripts || {},
  frameworks,
  dependencyMatches,
  dependencyNames: Object.keys(allDeps).sort(),
  sourceFilesScanned: sourceFiles.length,
  inputClassification,
  routes,
  routeConfidence,
  renderingModel,
  internalApiRoutes,
  serverSignals,
  browserApiUsage,
  mobileRisks,
  interestingFiles
}, null, 2));
