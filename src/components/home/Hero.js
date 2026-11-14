"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import TLink from "../transition/TLink";
import RippleWater from "../fx/RippleWater";
import styles from "./Hero.module.css";

// Vollbild-Hero: das Tiefseebecken des Tropen-Aquariums unter einer simulierten
// Wasseroberfläche. Bild und Schrift brechen sich in den Wellen von Maus/Finger.
export default function Hero({ slide, claim }) {
  const root = useRef(null);
  const title = useRef(null);
  const [state, setState] = useState("dom"); // dom | gl

  const drawScene = useCallback(
    async (ctx, w, h, rect) => {
      const img = new window.Image();
      img.src = slide.image.src;
      await img.decode().catch(() => {});

      // Bild „cover“ einpassen
      const ir = img.naturalWidth / img.naturalHeight;
      const r = w / h;
      let sw = img.naturalWidth,
        sh = img.naturalHeight,
        sx = 0,
        sy = 0;
      if (r > ir) {
        sh = sw / r;
        sy = (img.naturalHeight - sh) / 2;
      } else {
        sw = sh * r;
        sx = (img.naturalWidth - sw) / 2;
      }
      ctx.fillStyle = "#05090d";
      ctx.fillRect(0, 0, w, h);
      if (img.naturalWidth) ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, w, h);

      // Schrift Wort für Wort an den Positionen im DOM zeichnen – stimmt bei jedem Umbruch.
      const k = w / rect.width;
      const words = title.current?.querySelectorAll("[data-w]") || [];
      words.forEach((word) => {
        const wr = word.getBoundingClientRect();
        const cs = getComputedStyle(word);
        const size = parseFloat(cs.fontSize) * k;
        ctx.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`;
        ctx.textBaseline = "alphabetic";
        if ("letterSpacing" in ctx) ctx.letterSpacing = `${parseFloat(cs.letterSpacing) * k}px`;
        const m = ctx.measureText(word.textContent);
        const box = wr.height * k;
        const baseline = (wr.top - rect.top) * k + (box + m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2;
        ctx.fillStyle = cs.color;
        ctx.fillText(word.textContent, (wr.left - rect.left) * k, baseline);
      });
    },
    [slide.image.src],
  );

  return (
    <section ref={root} className={styles.hero} data-dark-zone data-state={state} aria-label="Einstieg">
      <div className={styles.fallback}>
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          sizes="100vw"
          preload
          loading="eager"
          className={styles.img}
        />
      </div>

      <RippleWater
        className={styles.canvas}
        drawScene={drawScene}
        interactiveRef={root}
        onReady={() => setState("gl")}
        onFail={() => setState("dom")}
      />

      <h1 ref={title} className={styles.claim}>
        <span className={styles.l1}>
          <Words text={claim[0].replace(/\.$/, "")} />
          <span data-w className={styles.dot}>
            .
          </span>
        </span>
        <span className={styles.l2}>
          <Words text={claim[1]} />
        </span>
      </h1>

      <div className={styles.foot}>
        <p className={styles.hint} aria-hidden="true">
          Bewegen Sie das Wasser
        </p>
        <TLink href={`/projekte/${slide.slug}`} className={styles.caption}>
          <span>Tiefseebecken · {slide.title}</span>
          <span className={styles.view}>Projekt ansehen →</span>
        </TLink>
      </div>
    </section>
  );
}

function Words({ text }) {
  const parts = text.split(" ");
  return parts.map((w, i) => (
    <span key={i}>
      <span data-w>{w}</span>
      {i < parts.length - 1 ? " " : ""}
    </span>
  ));
}
