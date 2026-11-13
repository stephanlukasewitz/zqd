"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Section.module.css";

// H05: Ein Schnitt durch ein Aquarienhaus. Jede Disziplin hebt ihren Teil der
// Zeichnung hervor – Generalplanung heißt: alles in einer Hand.
const DISCIPLINES = [
  {
    id: "zoo",
    label: "Zoologie",
    text: "Tierbedürfnisse, Haltungsrichtlinien, Vergesellschaftung und die Abläufe hinter den Kulissen.",
  },
  {
    id: "arch",
    label: "Architektur",
    text: "Gebäude, Gehege, Besucherwege und Einblicke – vom Masterplan bis zum Detail.",
  },
  {
    id: "tech",
    label: "Fachplanung",
    text: "Tragwerk, Gebäudetechnik und Wassertechnik – abgestimmt in einem Planungsteam.",
  },
];

export default function Section({ children }) {
  const [active, setActive] = useState(null);
  const [auto, setAuto] = useState(0);
  const [touched, setTouched] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  // Solange niemand interagiert, wandert die Hervorhebung langsam durch die Disziplinen.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!inView || touched || reduce) return;
    const t = setInterval(() => setAuto((a) => (a + 1) % (DISCIPLINES.length + 1)), 2600);
    return () => clearInterval(t);
  }, [inView, touched]);

  const shown = touched ? active : auto < DISCIPLINES.length ? DISCIPLINES[auto].id : null;
  const pick = (id) => {
    setTouched(true);
    setActive((a) => (a === id ? null : id));
  };

  return (
    <div ref={root} className={styles.wrap} data-active={shown || undefined}>
      <div className={styles.side}>
        <ul className={styles.list}>
          {DISCIPLINES.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                className={styles.item}
                aria-pressed={shown === d.id}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  setTouched(true);
                  setActive(d.id);
                }}
                onClick={() => pick(d.id)}
              >
                <span className={styles.label}>{d.label}</span>
                <span className={styles.text}>{d.text}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.copy}>{children}</div>
      </div>

      <figure
        className={styles.figure}
        onPointerLeave={() => setActive(null)}
      >
        <Drawing />
        <figcaption className={styles.caption}>
          <span>Schnitt A–A, Aquarienhaus (schematisch)</span>
          <span>ZQD Generalplanung</span>
        </figcaption>
      </figure>
    </div>
  );
}

function Fish({ x, y, s = 1, d = 0 }) {
  return (
    <g className={styles.fishMove} style={{ "--d": `${d}s` }}>
      <path
        className={`${styles.zoo} ${styles.fish}`}
        transform={`translate(${x} ${y}) scale(${s})`}
        d="M-18 0 C-10 -9 8 -9 16 0 C8 9 -10 9 -18 0 Z M16 0 L28 -8 L26 0 L28 8 Z"
      />
    </g>
  );
}

function Drawing() {
  return (
    <svg viewBox="0 0 1000 640" className={styles.svg} role="img" aria-labelledby="schnitt-title">
      <title id="schnitt-title">
        Schematischer Schnitt durch ein Aquarienhaus mit Kuppel, Becken, Besucherbereich und Technikraum.
      </title>
      <defs>
        <clipPath id="basin-clip">
          <rect x="432" y="200" width="426" height="358" />
        </clipPath>
      </defs>

      <path className={styles.ground} d="M0 400 H120 M880 400 H1000" />

      {/* Wasser */}
      <rect x="432" y="258" width="426" height="300" className={styles.water} />
      <g clipPath="url(#basin-clip)">
        <path
          className={`${styles.zoo} ${styles.wave}`}
          d="M300 258 q25 -9 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0"
        />
        <Fish x={560} y={380} d={0} />
        <Fish x={680} y={450} s={0.8} d={-3} />
        <Fish x={620} y={310} s={0.6} d={-6} />
        <path className={`${styles.zoo} ${styles.kelp}`} d="M480 558 C470 520 495 500 482 460 C472 430 490 410 484 380" />
        <path className={`${styles.zoo} ${styles.kelp}`} d="M505 558 C515 530 495 505 508 480 C516 462 504 448 510 430" style={{ animationDelay: "-1.5s" }} />
      </g>

      {/* Zoologie: Felsen, Landteil, Tier */}
      <path className={styles.zoo} d="M700 558 L716 488 L748 452 L782 470 L812 420 L858 428" />
      <path className={styles.zoo} d="M760 258 L770 236 L812 222 L858 226" />
      <g className={styles.zoo}>
        <ellipse cx="808" cy="200" rx="9" ry="17" />
        <circle cx="809" cy="179" r="6" />
        <path d="M816 178 L823 181 L816 183" />
      </g>

      {/* Architektur: Hülle, Becken, Besucherebene, Mensch */}
      <g className={styles.arch}>
        <path d="M120 400 V214 M880 400 V214" className={styles.thick} />
        <path d="M120 214 Q500 -46 880 214" className={styles.thick} />
        <path d="M430 400 V560 H860 V240" className={styles.thick} />
        <path d="M120 400 H430" className={styles.thick} />
        <path d="M120 400 V590 H430 V560" />
        <path d="M425 262 V400 M434 262 V400" className={styles.glass} />
        <g className={styles.person}>
          <circle cx="352" cy="324" r="10" />
          <path d="M352 336 V372 M352 372 L342 400 M352 372 L362 400 M352 346 L374 360" />
        </g>
        <g className={styles.person}>
          <circle cx="314" cy="352" r="7" />
          <path d="M314 361 V382 M314 382 L307 400 M314 382 L321 400 M314 368 L328 356" />
        </g>
      </g>

      {/* Fachplanung: Tragwerk der Kuppel, Lüftung, Pumpe, Filter, Leitungen */}
      <g className={styles.tech}>
        <path d="M250 214 L300 103 M380 214 L410 56 M500 214 V40 M620 214 L590 56 M750 214 L700 103" className={styles.rib} />
        <path d="M120 214 H880" className={styles.rib} />
        <path d="M150 262 H410" className={styles.duct} />
        <circle cx="200" cy="510" r="24" />
        <path d="M188 510 H212 M200 498 V522" />
        <rect x="270" y="460" width="70" height="104" />
        <path d="M640 560 V600 H370 V540 H340" className={styles.pipe} />
        <path d="M270 512 H224" className={styles.pipe} />
        <path d="M200 486 V430 H430" className={styles.pipe} />
      </g>

    </svg>
  );
}
