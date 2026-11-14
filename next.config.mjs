import { SEGMENTS, defaultLocale } from "./src/i18n/config.js";

// Öffentliche Adressen → interne Routen unter app/[lang]/.
//   /projekte          → /de/projekte   (Deutsch ohne Präfix)
//   /en/projects/xyz   → /en/projekte/xyz
//   /tr/projeler       → /tr/projekte
const localized = Object.entries(SEGMENTS).flatMap(([lang, map]) =>
  Object.entries(map)
    .filter(([intern, pub]) => intern !== pub)
    .flatMap(([intern, pub]) => [
      { source: `/${lang}/${pub}`, destination: `/${lang}/${intern}` },
      { source: `/${lang}/${pub}/:rest*`, destination: `/${lang}/${intern}/:rest*` },
    ]),
);

// Interne Pfadnamen in anderen Sprachen auf die öffentlichen umleiten (keine doppelten Adressen).
const canonical = Object.entries(SEGMENTS).flatMap(([lang, map]) =>
  Object.entries(map)
    .filter(([intern, pub]) => intern !== pub)
    .flatMap(([intern, pub]) => [
      { source: `/${lang}/${intern}`, destination: `/${lang}/${pub}`, permanent: true },
      // Vorschaubilder (…/opengraph-image) liegen unter dem internen Pfad und werden nicht umgeleitet
      {
        source: `/${lang}/${intern}/:rest((?!(?:.*/)?opengraph-image).*)`,
        destination: `/${lang}/${pub}/:rest`,
        permanent: true,
      },
    ]),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  experimental: {
    // 404 für Adressen, die zu keiner Route passen (Wurzel-Layout liegt unter [lang])
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  async redirects() {
    return [
      // Deutsch hat kein Präfix
      { source: `/${defaultLocale}`, destination: "/", permanent: true },
      {
        source: `/${defaultLocale}/:path((?!(?:.*/)?opengraph-image).*)`,
        destination: "/:path",
        permanent: true,
      },
      ...canonical,
    ];
  },
  async rewrites() {
    return {
      beforeFiles: localized,
      afterFiles: [
        // Alles ohne Sprachpräfix ist Deutsch
        { source: "/", destination: `/${defaultLocale}` },
        {
          source: "/:path((?!en(?:/|$)|tr(?:/|$)|de(?:/|$)|api/|_next/|brand/|icon\\.svg|apple-icon\\.png|sitemap\\.xml|robots\\.txt|llms\\.txt).*)",
          destination: `/${defaultLocale}/:path`,
        },
      ],
    };
  },
};

export default nextConfig;
