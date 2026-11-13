"use client";

import Image from "next/image";
import { useState } from "react";
import TLink from "../transition/TLink";
import Reveal from "../fx/Reveal";
import WaterImage from "../fx/WaterImage";
import { Dot } from "../fx/Frame";
import styles from "./Hero.module.css";

// Hero als Planausschnitt: die Panoramascheibe des Tiefseebeckens im
// Tropen-Aquarium (15,00 × 7,50 m) – im exakten Seitenverhältnis, mit Maßketten.
export default function Hero({ slide }) {
  const [gl, setGl] = useState(false);

  return (
    <section className={styles.hero} aria-label="Einstieg">
      <h1 className={styles.claim}>
        <Reveal className={styles.l1}>
          Erfahrung als Fundament
          <Dot />
        </Reveal>
        <Reveal className={styles.l2} delay={120}>
          Entwicklung als Anspruch.
        </Reveal>
      </h1>

      <figure className={styles.plan}>
        {/* Maßkette oben: Breite der Scheibe */}
        <div className={styles.dimX} aria-hidden="true">
          <span>15,00 m</span>
        </div>

        <TLink
          href={`/projekte/${slide.slug}`}
          className={styles.window}
          aria-label={`Projekt ansehen: ${slide.title}`}
        >
          <div className={styles.media} data-gl={gl || undefined}>
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="(max-width: 760px) 100vw, 86vw"
              preload
              loading="eager"
              className={styles.img}
            />
            <WaterImage
              className={styles.canvas}
              sources={[slide.image.src]}
              index={0}
              onReady={() => setGl(true)}
            />
          </div>
        </TLink>

        {/* Maßkette seitlich: Höhe der Scheibe */}
        <div className={styles.dimY} aria-hidden="true">
          <span>7,50 m</span>
        </div>

        <figcaption className={styles.caption}>
          <span>Panoramascheibe Tiefseebecken, {slide.title}</span>
          <TLink href={`/projekte/${slide.slug}`} className="tlink">
            Projekt ansehen <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </figcaption>
      </figure>
    </section>
  );
}
