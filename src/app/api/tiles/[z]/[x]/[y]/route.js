import { site } from "@/content/site";

// Kachel-Proxy für die Karte auf der Kontaktseite: Besucher laden Kacheln nur
// von dieser Website, OpenStreetMap sieht keine Besucher-IP. Erlaubt sind nur
// Kacheln rund um das Büro, damit der Proxy nicht als freier Kartendienst dient.

const MIN_Z = 11;
const MAX_Z = 18;
const RADIUS_DEG = 0.12; // rund 10 km um das Büro

function tileBounds(z, x, y) {
  const n = 2 ** z;
  const lng = (x / n) * 360 - 180;
  const lng2 = ((x + 1) / n) * 360 - 180;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
  const lat2 = (Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 1)) / n))) * 180) / Math.PI;
  return { west: lng, east: lng2, north: lat, south: lat2 };
}

export async function GET(_req, { params }) {
  const { z: zs, x: xs, y: ys } = await params;
  const z = Number(zs);
  const x = Number(xs);
  const y = Number(String(ys).replace(/\.png$/, ""));
  if (![z, x, y].every(Number.isInteger) || z < MIN_Z || z > MAX_Z) {
    return new Response("Not found", { status: 404 });
  }
  const b = tileBounds(z, x, y);
  const { lat, lng } = site.geo;
  if (
    b.east < lng - RADIUS_DEG ||
    b.west > lng + RADIUS_DEG ||
    b.north < lat - RADIUS_DEG ||
    b.south > lat + RADIUS_DEG
  ) {
    return new Response("Not found", { status: 404 });
  }

  let res;
  try {
    res = await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`, {
      headers: { "User-Agent": `${new URL(site.url).hostname} website map (tile proxy)` },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return new Response("Tile unavailable", { status: 502 });
  }
  if (!res.ok) return new Response("Tile unavailable", { status: 502 });

  return new Response(res.body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400",
    },
  });
}
