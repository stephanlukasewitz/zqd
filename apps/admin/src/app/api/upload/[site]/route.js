import sharp from "sharp";
import { getSite } from "@/lib/sites";
import { getRepo } from "@/lib/repo";
import { getSession } from "@/lib/session";

// Bild hochladen: wird auf Web-Größe gebracht und als Datei-Inhalt bei GitHub abgelegt.
// Erst beim Speichern des Formulars wird es einem Pfad zugeordnet.
const KINDS = {
  photo: { max: 2400, format: "jpeg" },
  hero: { max: 2560, format: "jpeg" },
  portrait: { max: 1600, format: "jpeg" },
  logo: { max: 800, format: "png" },
};

export async function POST(req, { params }) {
  if (!(await getSession())) return Response.json({ error: "Nicht angemeldet." }, { status: 401 });
  if (!getSite((await params).site)) return Response.json({ error: "Unbekannt" }, { status: 404 });
  const kind = KINDS[new URL(req.url).searchParams.get("kind")] || KINDS.photo;
  const input = Buffer.from(await req.arrayBuffer());
  if (input.length > 8 * 1024 * 1024) return Response.json({ error: "Datei zu groß (max. 8 MB)." }, { status: 413 });
  try {
    let img = sharp(input, { failOn: "error" }).rotate().resize({ width: kind.max, height: kind.max, fit: "inside", withoutEnlargement: true });
    img = kind.format === "png" ? img.png({ compressionLevel: 9 }) : img.flatten({ background: "#fff" }).jpeg({ quality: 84, mozjpeg: true });
    const { data, info } = await img.toBuffer({ resolveWithObject: true });
    const blob = await getRepo().createBlob(data);
    return Response.json({ blob, width: info.width, height: info.height });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Das Bild konnte nicht verarbeitet werden." }, { status: 400 });
  }
}
