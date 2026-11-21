/** @type {import('next').NextConfig} */
const nextConfig = {
  // Projektdaten und Texte werden als Ganzes gespeichert
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  poweredByHeader: false,
};

export default nextConfig;
