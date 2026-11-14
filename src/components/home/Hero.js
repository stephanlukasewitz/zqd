"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import TLink from "../transition/TLink";
import Reveal from "../fx/Reveal";
import WaterImage from "../fx/WaterImage";
import { withDot } from "../fx/Dot";
import styles from "./Hero.module.css";

const INTERVAL = 6000;

// Hero als Index: links Claim und vier Projekte, rechts das Bild zum aktiven
// Projekt. Überfahren wechselt sofort, sonst läuft es langsam von selbst.
export default function Hero({ slides, claim }) {
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const [gl, setGl] = useState(false);
  const count = slides.length;
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hold || reduce) return;
    const t = setTimeout(next, INTERVAL);
    return () => clearTimeout(t);
  }, [index, hold, next]);

  return (
    <section className={styles.hero} aria-label="Einstieg">
      <div className={styles.text}>
        <h1 className={styles.claim}>
          <Reveal className={styles.l1}>{withDot(claim[0])}</Reveal>
          <Reveal className={styles.l2} delay={120}>
            {claim[1]}
          </Reveal>
        </h1>

        <ol className={styles.list} onPointerLeave={() => setHold(false)}>
          {slides.map((s, i) => (
            <li key={s.slug} data-on={i === index || undefined}>
              <TLink
                href={`/projekte/${s.slug}`}
                className={styles.row}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  setHold(true);
                  setIndex(i);
                }}
                onFocus={() => {
                  setHold(true);
                  setIndex(i);
                }}
              >
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.name}>{s.name}</span>
                <span className={styles.place}>{s.place}</span>
              </TLink>
              <span
                key={`${index}-${hold}`}
                className={styles.timer}
                data-run={(i === index && !hold) || undefined}
                style={{ "--dur": `${INTERVAL}ms` }}
                aria-hidden="true"
              />
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.media} data-gl={gl || undefined}>
        {slides.map((s, i) => (
          <div key={s.slug} className={styles.slide} data-active={i === index || undefined}>
            <Image
              src={s.image}
              alt={s.alt}
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
              preload={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              className={styles.img}
            />
          </div>
        ))}
        <WaterImage
          className={styles.canvas}
          sources={slides.map((s) => s.image.src)}
          index={index}
          onReady={() => setGl(true)}
        />
      </div>
    </section>
  );
}
