import localFont from "next/font/local";
import "./globals.css";

const archivo = localFont({ src: "../assets/archivo-400.ttf", variable: "--font", display: "swap" });

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://zqd-gmbh.com"),
  title: "ZQD GmbH – Zooquariumdesign · Architekturgarage",
  description: "Die ZQD GmbH vereint Zooquariumdesign – Architektur für zoologische Einrichtungen – und die Architekturgarage.",
  // Erst indexieren, wenn die Seite unter der eigenen Domain live ist
  robots: process.env.SITE_LIVE === "1" ? undefined : { index: false, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
