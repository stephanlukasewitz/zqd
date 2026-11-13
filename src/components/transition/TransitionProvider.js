"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./Transition.module.css";

// Seitenübergang: Eine dunkle Fläche steigt wie ein Wasserspiegel von unten auf
// (rote Kante = Wasserlinie), die neue Seite wird darunter geladen, dann läuft
// die Fläche nach oben ab. Nur transform – läuft auf der GPU.

const Ctx = createContext({ navigate: () => {} });
export const useTransitionNav = () => useContext(Ctx);

const IN = 520;

export default function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState("idle"); // idle | cover | reveal
  const target = useRef(null);
  const timer = useRef(null);

  const navigate = useCallback(
    (href) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const url = new URL(href, window.location.href);
      if (reduce || url.pathname === window.location.pathname) {
        router.push(href);
        return;
      }
      router.prefetch(href);
      target.current = url.pathname;
      setPhase("cover");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        router.push(href);
        // Sicherheitsnetz, falls die Navigation ausbleibt
        timer.current = setTimeout(() => setPhase((p) => (p === "cover" ? "reveal" : p)), 2500);
      }, IN);
    },
    [router],
  );

  // Neue Seite ist gerendert → Fläche ablaufen lassen.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (phase === "cover") setPhase("reveal");
  }

  useEffect(() => {
    if (phase !== "reveal") return;
    clearTimeout(timer.current);
    const anchor = window.location.hash && document.querySelector(window.location.hash);
    if (anchor) anchor.scrollIntoView();
    else window.scrollTo(0, 0);
    const t = setTimeout(() => setPhase("idle"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <Ctx.Provider value={{ navigate }}>
      {children}
      <div className={styles.curtain} data-phase={phase} aria-hidden="true">
        <span className={styles.line} />
      </div>
    </Ctx.Provider>
  );
}
