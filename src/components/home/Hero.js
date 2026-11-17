"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import TLink from "../transition/TLink";
import RippleWater from "../fx/RippleWater";
import Intro from "./Intro";
import { useLang } from "@/i18n/LangProvider";
import styles from "./Hero.module.css";

// Einstieg: oben der Claim auf Weiß, darunter das Tiefseebecken über die volle
// Breite. Beim Scrollen zieht sich das Bild auf die Seitenränder zusammen;
// die Wasseroberfläche reagiert auf Maus und Finger.
export default function Hero({ slide, claim }) {
  const { ui } = useLang();
  const stage = useRef(null);
  const [state, setState] = useState("dom"); // dom | gl

  const drawScene = useCallback(
    async (ctx, w, h) => {
      const img = new window.Image();
      img.src = slide.image.src;
      await img.decode().catch(() => {});
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
    },
    [slide.image.src],
  );

  return (
    <section className={styles.hero} aria-label={ui.hero.label}>
      <h1 className={styles.claim}>
        <span className={styles.l1}>{claim[0]}</span>
        <span className={styles.l2}>
          {claim[1].replace(/\.$/, "")}
          <span className={styles.dot}>.</span>
        </span>
      </h1>

      <figure className={styles.figure}>
        <div ref={stage} className={styles.stage} data-state={state} data-dark-zone data-intro-stage>
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            sizes="100vw"
            preload
            loading="eager"
            quality={85}
            className={styles.img}
          />
          <RippleWater
            className={styles.canvas}
            drawScene={drawScene}
            interactiveRef={stage}
            onReady={() => setState("gl")}
            onFail={() => setState("dom")}
          />
        </div>
        <figcaption className={styles.caption}>
          <TLink href={`/projekte/${slide.slug}`} className={styles.capLink}>
            {ui.hero.tank}, {slide.title} <span aria-hidden="true">→</span>
          </TLink>
          <span className={styles.hint} data-on={state === "gl" || undefined} aria-hidden="true">
            {ui.hero.hint}
          </span>
        </figcaption>
      </figure>
      <Intro slide={slide} />
    </section>
  );
}
