"use client";

import Image from "next/image";
import { useRef } from "react";
import TLink from "../transition/TLink";
import styles from "./Reel.module.css";

// Horizontale Projektstrecke: wischen, scrollen oder per Pfeil blättern.
export default function Reel({ items, total }) {
  const track = useRef(null);
  const step = (dir) => {
    const el = track.current;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };
  return (
    <section className={styles.reel} aria-labelledby="reel-title">
      <div className={styles.head}>
        <h2 id="reel-title" className={styles.title}>
          Projekte
        </h2>
        <div className={styles.nav}>
          <button type="button" onClick={() => step(-1)} aria-label="Zurück">
            ←
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Weiter">
            →
          </button>
          <TLink href="/projekte" className="tlink">
            Alle {total} Projekte
          </TLink>
        </div>
      </div>
      <ul ref={track} className={styles.track}>
        {items.map((p, i) => (
          <li key={p.slug}>
            <TLink href={`/projekte/${p.slug}`} className={styles.card}>
              <div className={styles.media}>
                <Image src={p.image} alt={p.alt} fill sizes="(max-width: 760px) 86vw, 46vw" className={styles.img} />
              </div>
              <div className={styles.meta}>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.name}>{p.title}</span>
                <span className={styles.place}>{[p.zoo, p.city].filter(Boolean).join(", ")}</span>
              </div>
            </TLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
