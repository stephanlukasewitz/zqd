import { site } from "@/content/site";

// Alle Suchmaschinen und KI-Crawler dürfen die Website lesen.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
