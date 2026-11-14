import { Archivo } from "next/font/google";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransitionProvider from "@/components/transition/TransitionProvider";
import SmoothScroll from "@/components/fx/SmoothScroll";
import { LangProvider } from "@/i18n/LangProvider";
import { isLocale, locales, ogLocales } from "@/i18n/config";
import { dictFor } from "@/i18n/dict";
import { getLang } from "@/i18n/server";
import { site } from "@/content/site";
import "../globals.css";

const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

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

export default async function RootLayout({ children }) {
  const lang = await getLang();
  if (!isLocale(lang)) notFound();
  const d = dictFor(lang);
  return (
    <html lang={lang} className={sans.variable}>
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
        </LangProvider>
      </body>
    </html>
  );
}
