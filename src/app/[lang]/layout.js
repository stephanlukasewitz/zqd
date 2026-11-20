import { Archivo } from "next/font/google";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransitionProvider from "@/components/transition/TransitionProvider";
import SmoothScroll from "@/components/fx/SmoothScroll";
import PerfGuard from "@/components/fx/PerfGuard";
import { LangProvider } from "@/i18n/LangProvider";
import { isLocale, localize, locales, ogLocales } from "@/i18n/config";
import { dictFor } from "@/i18n/dict";
import { getLang } from "@/i18n/server";
import { site } from "@/content/site";
import "../globals.css";

const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const INTRO_SCRIPT = `try{if(/[?&]v=2(&|$)/.test(location.search))document.documentElement.setAttribute("data-static","")}catch(e){}try{var p=location.pathname.replace(/\\/$/,"");if((p===""||p==="/en"||p==="/tr")&&!sessionStorage.getItem("zqd:intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){var h=document.documentElement;h.setAttribute("data-intro","");setTimeout(function(){if(!window.__introRunning)h.removeAttribute("data-intro")},4000)}}catch(e){}`;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata() {
  const lang = await getLang();
  const d = dictFor(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: d.meta.title, template: "%s – ZQD" },
    description: d.meta.description,
    openGraph: { type: "website", locale: ogLocales[lang], siteName: "ZQD Zooquariumdesign" },
  };
}

export const viewport = {
  themeColor: "#ffffff",
};

// Strukturierte Firmendaten (Schema.org) für Suchmaschinen
function orgData(lang, d) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.legalName,
    alternateName: ["ZQD", "Zooquariumdesign", "Architekturgarage"],
    description: d.meta.description,
    url: new URL(localize("/", lang), site.url).toString(),
    logo: new URL("/brand/zqd-logo.svg", site.url).toString(),
    image: new URL("/apple-icon.png", site.url).toString(),
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      postalCode: site.zip,
      addressLocality: site.city,
      addressCountry: "DE",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: "Worldwide",
    knowsAbout: ["Zoo architecture", "Zoo masterplanning", "Animal enclosures", "Aquariums", "General planning"],
    inLanguage: lang,
  };
}

export default async function RootLayout({ children }) {
  const lang = await getLang();
  if (!isLocale(lang)) notFound();
  const d = dictFor(lang);
  return (
    <html lang={lang} className={sans.variable} suppressHydrationWarning>
      <head>
        {/* Intro nur beim ersten Aufruf der Startseite pro Besuch, nicht bei „Bewegung reduzieren“.
            ?v=2: Vergleichsvariante ohne Tiefen-Effekte (data-static).
            Muss vor dem ersten Bild laufen – daher als echtes Inline-Skript im <head>.
            Der Sprachwechsel lädt die Seite neu (siehe Header), so wird dieses Layout
            nie im Browser neu gerendert. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <LangProvider lang={lang} ui={d.ui} values={d.values}>
          <a href="#inhalt" className="skip-link">
            {d.ui.skip}
          </a>
          <TransitionProvider>
            <Header nav={d.nav} />
            <main id="inhalt">{children}</main>
            <Footer />
          </TransitionProvider>
          <SmoothScroll />
          <PerfGuard />
        </LangProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData(lang, d)).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
