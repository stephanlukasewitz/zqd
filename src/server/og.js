import { ImageResponse } from "next/og";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Vorschaubilder für geteilte Links (1200 × 630): links weiße Fläche mit Schriftzug
// und Titel, rechts das Foto – kein Text auf dem Bild, wie auf der Website.
// Ausgabe als JPEG, damit die Bilder klein bleiben und überall schnell laden.

export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

const font = readFile(join(process.cwd(), "src/assets/fonts/archivo-400.ttf"));
const wordmark = readFile(join(process.cwd(), "public/brand/zqd-wordmark.svg"), "base64").then(
  (b) => `data:image/svg+xml;base64,${b}`,
);

const PANEL = 500;

// photo: Dateiname in src/assets/og (zugeschnitten von scripts/build-og.mjs), z. B. "eismeer-hagenbeck.jpg".
// Der feste Ordner hält die Server-Funktion schlank – nur diese kleinen Fotos werden mitgeliefert.
export async function renderOg({ photo, kicker, lines, dotLast = false }) {
  const [fontData, logo, img] = await Promise.all([
    font,
    wordmark,
    sharp(join(process.cwd(), "src", "assets", "og", photo))
      .resize(size.width - PANEL, size.height, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82 })
      .toBuffer(),
  ]);

  const last = lines.length - 1;
  const long = lines.join(" ").length > 34;
  // Lange Einzelwörter (z. B. „Elefantenfreilaufhalle“) müssen in die Textspalte passen
  const longestWord = Math.max(...lines.join(" ").split(" ").map((w) => w.length));
  const fontSize = Math.min(long ? 48 : 60, Math.floor((PANEL - 104) / (longestWord * 0.52)));

  const png = new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#ffffff" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: PANEL,
            flexShrink: 0,
            overflow: "hidden",
            height: "100%",
            padding: "56px 52px 60px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={logo} width={236} height={19} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {kicker && (
              <div style={{ fontSize: 22, color: "#6b6b6b", marginBottom: 18, letterSpacing: -0.2 }}>{kicker}</div>
            )}
            {lines.map((l, i) => {
              // Wort für Wort setzen, damit der rote Punkt beim Umbruch am letzten Wort bleibt
              const dot = dotLast && i === last;
              const words = (dot ? l.replace(/\.$/, "") : l).split(" ");
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    fontSize,
                    lineHeight: 1.02,
                    letterSpacing: long ? -1.8 : -2.4,
                    color: i > 0 && dotLast ? "#a3a3a3" : "#111111",
                  }}
                >
                  {words.map((w, j) => (
                    <span key={j} style={{ display: "flex", marginRight: j < words.length - 1 ? "0.24em" : 0 }}>
                      {w}
                      {dot && j === words.length - 1 && <span style={{ color: "#c4000f" }}>.</span>}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={`data:image/jpeg;base64,${img.toString("base64")}`}
          width={size.width - PANEL}
          height={size.height}
        />
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo", data: fontData, weight: 400, style: "normal" }] },
  );

  const jpg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  return new Response(jpg, { headers: { "Content-Type": contentType } });
}
