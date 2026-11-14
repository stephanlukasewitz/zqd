"use client";

import Image from "next/image";
import { withDot } from "../fx/Dot";
import { useState } from "react";
import TLink from "../transition/TLink";
import Reveal from "../fx/Reveal";
import WaterImage from "../fx/WaterImage";
import styles from "./Hero.module.css";

// Hero: der Claim auf Weiß, darunter ein Bild über die volle Breite.
export default function Hero({ slide, claim }) {
  const [gl, setGl] = useState(false);
  return (
    <section className={styles.hero} aria-label="Einstieg">
      <h1 className={styles.claim}>
        <Reveal className={styles.l1}>{withDot(claim[0])}</Reveal>
        <Reveal className={styles.l2} delay={120}>
          {withDot(claim[1])}
        </Reveal>
      </h1>

      <TLink href={`/projekte/${slide.slug}`} className={styles.band} aria-label={`Projekt ansehen: ${slide.title}`}>
        <div className={styles.media} data-gl={gl || undefined}>
          <Image src={slide.image} alt={slide.alt} fill sizes="100vw" preload loading="eager" className={styles.img} />
          <WaterImage className={styles.canvas} sources={[slide.image.src]} index={0} onReady={() => setGl(true)} />
        </div>
      </TLink>

      <div className={styles.caption}>
        <span>{slide.title}</span>
        <TLink href={`/projekte/${slide.slug}`} className="tlink">
          Projekt ansehen <span className="arrow" aria-hidden="true">→</span>
        </TLink>
      </div>
    </section>
  );
}
