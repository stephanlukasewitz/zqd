"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Split.module.css";

// Geteilte Seite: links scrollt der Inhalt, rechts steht ein Bild, das zum
// jeweils aktiven Abschnitt wechselt. Auf dem Handy steht jedes Bild im Abschnitt.
export default function Split({ sections }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.split}>
      <div className={styles.content}>
        {sections.map((s, i) => (
          <section
            key={i}
            ref={(el) => (refs.current[i] = el)}
            data-i={i}
            className={styles.section}
            data-kind={s.kind || undefined}
          >
            <div className={styles.inline}>
              <Image src={s.image} alt={s.alt} fill sizes="100vw" className={styles.img} />
            </div>
            {s.content}
          </section>
        ))}
      </div>

      <aside className={styles.panel} aria-hidden="true">
        <div className={styles.frame}>
          {sections.map((s, i) => (
            <div key={i} className={styles.layer} data-on={i === active || undefined}>
              <Image
                src={s.image}
                alt=""
                fill
                sizes="50vw"
                preload={i === 0}
                loading={i < 2 ? "eager" : "lazy"}
                className={styles.img}
              />
            </div>
          ))}
        </div>
        <p className={styles.caption}>
          <span key={active}>{sections[active].caption}</span>
          <span>
            {String(active + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
          </span>
        </p>
      </aside>
    </div>
  );
}
