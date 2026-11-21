// Websites, die das Dashboard verwaltet. Weitere Seiten kommen hier dazu.
export const SITES = [
  {
    id: "zooquariumdesign",
    name: "Zooquariumdesign",
    dir: "apps/zooquariumdesign",
    // Name des Vercel-Projekts (für den Link zur Vorschau)
    vercelProject: process.env.VERCEL_PROJECT_ZOOQUARIUMDESIGN || "zqd",
    liveUrl: process.env.LIVE_URL_ZOOQUARIUMDESIGN || "https://vercel.zqd-xyz.app",
    ready: true,
  },
  { id: "architekturgarage", name: "Architekturgarage", ready: false },
  { id: "zqd", name: "ZQD GmbH", ready: false },
];

export function getSite(id) {
  const s = SITES.find((x) => x.id === id && x.ready);
  return s || null;
}
