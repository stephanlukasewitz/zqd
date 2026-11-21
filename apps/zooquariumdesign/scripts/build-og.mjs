// Zugeschnittene Fotos für die Link-Vorschaubilder (rechte Hälfte, 700 × 630).
// Läuft automatisch vor dem Build (package.json) – Quelle sind die Titelbilder aus content/.
import sharp from "sharp";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const out = "src/assets/og";
mkdirSync(out, { recursive: true });
const read = (rel) => JSON.parse(readFileSync(path.join("content", rel), "utf8"));
const file = (src) => path.join("public", src.replace(/^\//, ""));

const home = read("home.json");
const jobs = [[file(home.hero.image.src), `${out}/home.jpg`]];
for (const slug of read("projects/index.json")) {
  const cover = read(`projects/${slug}.json`).images?.[0];
  if (cover) jobs.push([file(cover.src), `${out}/${slug}.jpg`]);
}

let made = 0;
for (const [src, dest] of jobs) {
  if (!existsSync(src)) continue;
  await sharp(src).resize(700, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
  made++;
}
console.log(`${made} Vorschaufotos erzeugt`);
