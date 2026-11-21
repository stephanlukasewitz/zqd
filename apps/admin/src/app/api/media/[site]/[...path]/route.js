import sharp from "sharp";
import { getSite } from "@/lib/sites";
import { getRepo } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { mediaPath } from "@/lib/content";

// Vorschaubilder für das Dashboard: Datei aus dem Entwurf (sonst main), verkleinert als WebP.
export async function GET(req, { params }) {
  if (!(await getSession())) return new Response("Nicht angemeldet", { status: 401 });
  const { site: id, path } = await params;
  const site = getSite(id);
  const rel = "/media/" + path.map(decodeURIComponent).join("/");
  if (!site || path.some((p) => p === ".." || p.includes("/"))) return new Response("Nicht gefunden", { status: 404 });
  const file = await getRepo().read(mediaPath(site, rel));
  if (!file) return new Response("Nicht gefunden", { status: 404 });
  const w = Math.min(1200, Math.max(80, parseInt(new URL(req.url).searchParams.get("w"), 10) || 480));
  const out = await sharp(file.data).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
  return new Response(out, {
    headers: { "Content-Type": "image/webp", "Cache-Control": "private, max-age=604800", ETag: `"${file.version}-${w}"` },
  });
}
