"use client";

import { useEffect } from "react";

// Sparmodus für langsame Geräte: misst nach dem Laden kurz die Bildrate. Liegt sie
// dauerhaft unter 40 fps, bekommt <html> das Attribut data-lite – dann zeigt der Hero
// das Wasser als ruhiges Foto und die Bilderwolke verzichtet auf die Weichzeichner.
// Gilt für den Rest des Besuchs. ?full in der Adresse schaltet den Sparmodus zum Testen ab.

const KEY = "zqd:lite";
const MIN_FPS = 40;

function enable() {
  document.documentElement.setAttribute("data-lite", "");
  window.dispatchEvent(new Event("zqd:lite"));
}

export default function PerfGuard() {
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).has("full")) {
        sessionStorage.removeItem(KEY);
        return;
      }
      if (sessionStorage.getItem(KEY) === "1") return enable();
    } catch {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let t0 = 0;
    let frames = 0;
    const begin = performance.now() + 1000; // Ladespitze abwarten
    const tick = (t) => {
      if (document.hidden) return; // im Hintergrund nicht messen
      if (t < begin) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!t0) t0 = t;
      frames++;
      const elapsed = t - t0;
      if (elapsed >= 2500) {
        if ((frames * 1000) / elapsed < MIN_FPS) {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          enable();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}
