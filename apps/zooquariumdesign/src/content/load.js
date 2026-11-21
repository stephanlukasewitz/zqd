import fs from "node:fs";
import path from "node:path";

// Inhalte liegen als JSON in content/ (bearbeitet über das Admin-Dashboard).
// Nur auf dem Server lesbar; Client-Komponenten bekommen Inhalte als Props.
const ROOT = path.join(process.cwd(), "content");
const cache = new Map();

export function readContent(rel) {
  if (!cache.has(rel)) cache.set(rel, JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")));
  return cache.get(rel);
}
