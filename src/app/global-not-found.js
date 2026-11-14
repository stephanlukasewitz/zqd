import { Archivo } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sans = Archivo({ variable: "--font-sans", subsets: ["latin", "latin-ext"], display: "swap" });

export const metadata = {
  title: "404 – ZQD",
  robots: { index: false },
};

// Adressen ohne passende Route. Die Sprache ist hier unbekannt – daher Deutsch und Englisch.
export default function GlobalNotFound() {
  return (
    <html lang="de" className={sans.variable}>
      <body>
        <main style={{ padding: "calc(var(--header-h) + 8vw) var(--margin) 12vw", maxWidth: "68ch" }}>
          <Link href="/" aria-label="ZQD – zur Startseite" style={{ display: "inline-block", marginBottom: "12vh" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/zqd-wordmark.svg" alt="Zooquariumdesign" height="15" style={{ height: 15, width: "auto" }} />
          </Link>
          <h1 style={{ fontSize: "var(--fs-h2)", letterSpacing: "-0.04em", lineHeight: 1.05, fontWeight: 400 }}>
            Diese Seite gibt es nicht<span style={{ color: "var(--red)" }}>.</span>
          </h1>
          <p lang="en" style={{ marginTop: 16, color: "var(--mute)" }}>
            This page does not exist.
          </p>
          <p style={{ marginTop: 40 }}>
            <Link href="/" className="tlink">
              Zur Startseite <span className="arrow">→</span>
            </Link>
            <span style={{ margin: "0 14px", color: "var(--soft)" }}>·</span>
            <Link href="/en" className="tlink" lang="en">
              Home <span className="arrow">→</span>
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
