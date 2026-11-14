// Zugeschnittene Fotos für die Link-Vorschaubilder (rechte Hälfte, 700 × 630).
// Aufruf nach neuen Projekten: node scripts/build-og.mjs
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";

const out = "src/assets/og";
await mkdir(out, { recursive: true });

const jobs = [["src/assets/home/hero-2.jpg", `${out}/home.jpg`]];
for (const slug of await readdir("src/assets/projects")) {
  jobs.push([`src/assets/projects/${slug}/01.jpg`, `${out}/${slug}.jpg`]);
}

for (const [src, dest] of jobs) {
  await sharp(src).resize(700, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
}
console.log(jobs.length, "Vorschaufotos erzeugt");
