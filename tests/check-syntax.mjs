import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const ignored = new Set([".git", "node_modules", "graphify-out"]);
const scripts = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignored.has(entry)) continue;
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      walk(path);
    } else if (extname(path) === ".mjs") {
      scripts.push(path);
    }
  }
}

walk(root);
for (const script of scripts) {
  execFileSync(process.execPath, ["--check", script], { stdio: "inherit" });
}

console.log(`Syntax check passed for ${scripts.length} modules.`);
