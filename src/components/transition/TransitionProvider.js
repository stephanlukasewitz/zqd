"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// Seitenübergang: Der Inhalt (nicht der Header) wird weich, leicht unscharf und
// gleitet nach oben weg; die neue Seite klart von unten auf. Gesteuert über ein
// Attribut am <html>, animiert per CSS (opacity/transform/filter auf einer Ebene).

const Ctx = createContext({ navigate: () => {} });
export const useTransitionNav = () => useContext(Ctx);

// Browser-Zurück/Vor: dort stellt der Browser die Position selbst wieder her
let popped = false;

const OUT = 420;
const IN = 900;

export default function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState("idle"); // idle | out | in
  const timer = useRef(null);

  const navigate = useCallback(
    (href) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        router.push(href);
        return;
      }
      router.prefetch(href);
      setPhase("out");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        router.push(href, { scroll: false });
        // Sicherheitsnetz, falls die Navigation ausbleibt
        timer.current = setTimeout(() => setPhase((p) => (p === "out" ? "in" : p)), 2500);
      }, OUT);
    },
    [router],
  );

  useEffect(() => {
    const onPop = () => (popped = true);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    // Jeder Seitenwechsel (auch ohne Überblendung) startet oben – außer Zurück/Vor
    if (phase === "out" || !popped) setPhase("in");
  }
  // Markierung nach dem Seitenwechsel zurücksetzen (nicht während des Renderns)
  useEffect(() => {
    popped = false;
  }, [pathname]);

  useEffect(() => {
    document.documentElement.dataset.transition = phase;
    if (phase !== "in") return;
    clearTimeout(timer.current);
    const anchor = window.location.hash && document.querySelector(window.location.hash);
    const restore = window.__restoreScroll;
    delete window.__restoreScroll;
    const targetY = () => (anchor ? anchor.getBoundingClientRect().top + window.scrollY : restore || 0);
    const apply = () => {
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(anchor || targetY(), { immediate: true, force: true });
      else window.scrollTo(0, targetY());
    };
    apply();

    // Nachprüfen: Auslaufendes weiches Scrollen, ein gerade geschlossenes Menü oder
    // nachladende Inhalte können die Position noch verschieben. Solange man nicht selbst
    // scrollt, wird sie in den ersten Momenten erneut gesetzt.
    let user = false;
    const mark = () => (user = true);
    const events = ["wheel", "touchstart", "keydown", "pointerdown"];
    events.forEach((e) => window.addEventListener(e, mark, { passive: true, once: true }));
    const check = () => {
      if (!user && Math.abs(window.scrollY - targetY()) > 4) apply();
    };
    let raf = requestAnimationFrame(() => (raf = requestAnimationFrame(check)));
    const checks = [120, 350, 800].map((ms) => setTimeout(check, ms));

    const t = setTimeout(() => setPhase("idle"), IN);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      checks.forEach(clearTimeout);
      events.forEach((e) => window.removeEventListener(e, mark));
    };
  }, [phase]);

  return <Ctx.Provider value={{ navigate }}>{children}</Ctx.Provider>;
}
