import { locales } from "@/i18n/config";
import { dictFor } from "@/i18n/dict";
import { renderOg, size, contentType } from "@/server/og";

// Vorschaubild für alle Seiten einer Sprache (Projektseiten haben ein eigenes).
export { size, contentType };
export const alt = "ZQD Zooquariumdesign";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({ params }) {
  const { lang } = await params;
  const d = dictFor(lang);
  return renderOg({
    photo: "home.jpg",
    kicker: d.home.service,
    lines: d.home.claim,
    dotLast: true,
  });
}
