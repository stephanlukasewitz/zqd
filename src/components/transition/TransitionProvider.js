"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// Seitenübergang: Der Inhalt (nicht der Header) wird weich, leicht unscharf und
// gleitet nach oben weg; die neue Seite klart von unten auf. Gesteuert über ein
// Attribut am <html>, animiert per CSS (opacity/transform/filter auf einer Ebene).

const Ctx = createContext({ navigate: () => {} });
export const useTransitionNav = () => useContext(Ctx);

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

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (phase === "out") setPhase("in");
  }

  useEffect(() => {
    document.documentElement.dataset.transition = phase;
    if (phase !== "in") return;
    clearTimeout(timer.current);
    const anchor = window.location.hash && document.querySelector(window.location.hash);
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(anchor || 0, { immediate: true, force: true });
    else if (anchor) anchor.scrollIntoView();
    else window.scrollTo(0, 0);
    const t = setTimeout(() => setPhase("idle"), IN);
    return () => clearTimeout(t);
  }, [phase]);

  return <Ctx.Provider value={{ navigate }}>{children}</Ctx.Provider>;
}
