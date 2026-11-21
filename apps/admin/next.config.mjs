/** @type {import('next').NextConfig} */
const nextConfig = {
  // Projektdaten und Texte werden als Ganzes gespeichert
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  poweredByHeader: false,
  // Dashboard nie in Suchmaschinen aufnehmen
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] }];
  },
};

export default nextConfig;
