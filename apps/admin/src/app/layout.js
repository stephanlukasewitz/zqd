import localFont from "next/font/local";
import "./globals.css";

const archivo = localFont({ src: "../assets/archivo-400.ttf", variable: "--font", display: "swap" });

export const metadata = {
  title: { default: "ZQD Verwaltung", template: "%s · ZQD Verwaltung" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
