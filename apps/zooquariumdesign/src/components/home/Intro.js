"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./Intro.module.css";

// Intro beim ersten Aufruf der Startseite (einmal pro Besuch).
// Ein Skript im <head> setzt html[data-intro] schon vor dem ersten Bild – nur dann
// ist dieses Overlay sichtbar. Ablauf:
//   1. Schriftzug + Ladestand (folgt dem echten Laden des Hero-Bilds)
//   2. Ein Bildfenster öffnet sich
//   3. Das Fenster wächst exakt auf das Hero-Bild, der Schriftzug fliegt auf das Header-Logo
//   4. Overlay weg – Seite steht deckungsgleich darunter
// Klick, Scrollen oder Taste beenden das Intro sofort.

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Intro({ slide }) {
  const root = useRef(null);
  const mark = useRef(null);
  const count = useRef(null);
  const shot = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.hasAttribute("data-intro")) return;
    window.__introRunning = true;

    const lenis = window.__lenis;
    lenis?.stop();
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";

    const anims = [];
    let finished = false;
    const run = (el, frames, opts) => {
      const a = el.animate(frames, { fill: "forwards", ...opts });
      anims.push(a);
      return a.finished.catch(() => {});
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      anims.forEach((a) => a.cancel());
      html.removeAttribute("data-intro");
      html.style.overflow = "";
      window.__lenis?.start();
      try {
        sessionStorage.setItem("zqd:intro", "1");
      } catch {}
      cleanup();
    };
    const skip = () => finish();
    const events = ["wheel", "touchstart", "keydown", "pointerdown"];
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, skip));

    // Ziele messen: Hero-Bild und Header-Logo
    const stage = document.querySelector("[data-intro-stage]");
    const logo = document.querySelector("[data-intro-logo]");
    if (!stage || !logo) return finish();
    const vw = window.innerWidth;
    const S = stage.getBoundingClientRect();
    const L = logo.getBoundingClientRect();

    // Bild liegt genau auf dem Hero-Bild; sichtbar ist zunächst nur ein Fenster
    Object.assign(shot.current.style, {
      left: `${S.left}px`,
      top: `${S.top}px`,
      width: `${S.width}px`,
      height: `${S.height}px`,
    });
    const winW = Math.min(vw < 760 ? vw * 0.72 : vw * 0.34, 560);
    const winH = Math.min(winW * 0.56, S.height);
    const side = (S.width - winW) / 2;
    const closed = `inset(0px ${side}px ${S.height}px ${side}px)`;
    const windowed = `inset(0px ${side}px ${S.height - winH}px ${side}px)`;
    const open = "inset(0px 0px 0px 0px)";
    shot.current.style.clipPath = closed;

    // Schriftzug: liegt auf dem Header-Logo, startet groß in der Mitte des weißen Bereichs
    Object.assign(mark.current.style, {
      left: `${L.left}px`,
      top: `${L.top}px`,
      width: `${L.width}px`,
      height: `${L.height}px`,
    });
    const startW = Math.min(vw < 760 ? vw * 0.8 : vw * 0.46, 680);
    const scale = startW / L.width;
    const startH = L.height * scale;
    const centerY = (L.bottom + S.top) / 2 - 10;
    const x0 = (vw - startW) / 2 - L.left;
    const y0 = centerY - startH / 2 - L.top;
    const from = `translate(${x0}px, ${y0}px) scale(${scale})`;
    mark.current.style.transform = from;
    count.current.style.top = `${centerY + startH / 2 + 16}px`;

    // Ladestand: folgt dem Hero-Bild, mindestens ~0,7 s
    let loaded = false;
    const probe = new window.Image();
    probe.src = shot.current.querySelector("img")?.currentSrc || slide.image.src;
    probe.decode().then(
      () => (loaded = true),
      () => (loaded = true),
    );
    const counting = new Promise((resolve) => {
      const t0 = performance.now();
      let shown = 0;
      const tick = (t) => {
        if (finished) return resolve();
        const elapsed = t - t0;
        const target = loaded ? 100 : Math.min(90, (elapsed / 700) * 90);
        shown += (Math.max(target, shown) - shown) * (loaded && elapsed > 700 ? 0.3 : 0.14);
        if (loaded && elapsed > 700 && 100 - shown < 1.5) shown = 100;
        const n = Math.min(100, Math.round(shown));
        if (count.current) count.current.textContent = `${n} %`;
        if (n >= 100) return resolve();
        if (elapsed > 6000) return resolve();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    (async () => {
      run(mark.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: OUT });
      run(count.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 150, easing: OUT });
      await counting;
      if (finished) return;
      await sleep(80);

      // 2. Fenster öffnet sich
      run(count.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: EASE });
      await run(shot.current, [{ clipPath: closed }, { clipPath: windowed }], { duration: 600, easing: OUT });
      if (finished) return;
      await sleep(100);

      // 3. Fenster wächst auf das Hero-Bild, Schriftzug fliegt ins Header-Logo, danach erscheint der Claim
      run(root.current, [{ backgroundColor: "#ffffff" }, { backgroundColor: "rgba(255,255,255,0)" }], {
        duration: 500,
        easing: EASE,
      });
      run(mark.current, [{ transform: from }, { transform: "none" }], { duration: 950, easing: EASE });
      const grow = run(shot.current, [{ clipPath: windowed }, { clipPath: open }], { duration: 950, easing: EASE });
      // Claim erst, wenn der Schriftzug den Bereich verlassen hat
      await sleep(480);
      if (!finished) html.setAttribute("data-intro", "reveal");
      await grow;
      if (finished) return;

      // 4. Übergabe an die Seite
      finish();
    })();

    return () => {
      cleanup();
      anims.forEach((a) => a.cancel());
    };
  }, [slide.image.src]);

  return (
    <div ref={root} className={styles.intro} aria-hidden="true">
      <div ref={shot} className={styles.shot}>
        <Image src={slide.image} alt="" fill sizes="100vw" loading="eager" quality={85} className={styles.img} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={mark} className={styles.mark} src="/brand/zqd-wordmark.svg" alt="" />
      <span ref={count} className={styles.count}>
        0 %
      </span>
    </div>
  );
}
