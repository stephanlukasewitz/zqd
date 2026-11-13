import { Archivo, Newsreader } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransitionProvider from "@/components/transition/TransitionProvider";
import SmoothScroll from "@/components/fx/SmoothScroll";
import { site } from "@/content/site";
import "./globals.css";

const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ZQD – Architektur und Generalplanung für Zoos und Aquarien",
    template: "%s – ZQD",
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "ZQD Zooquariumdesign",
  },
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#inhalt" className="skip-link">
          Zum Inhalt springen
        </a>
        <TransitionProvider>
          <Header />
          <main id="inhalt">{children}</main>
          <Footer />
        </TransitionProvider>
        <SmoothScroll />
      </body>
    </html>
  );
}
