// Suchmaschinen: nichts crawlen
export default function robots() {
  return { rules: { userAgent: "*", disallow: "/" } };
}
