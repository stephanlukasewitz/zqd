"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./Transition.module.css";

// Seitenübergang: Die aktuelle Seite verschwimmt ins Weiße, die neue Seite
// wird darunter geladen und klart aus der Unschärfe auf.

const Ctx = createContext({ navigate: () => {} });
export const useTransitionNav = () => useContext(Ctx);

const IN = 380;

export default function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState("idle"); // idle | cover | reveal
  const timer = useRef(null);

  const navigate = useCallback(
    (href) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        router.push(href);
        return;
      }
      router.prefetch(href);
      setPhase("cover");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        router.push(href);
        timer.current = setTimeout(
          () => setPhase((p) => (p === "cover" ? "reveal" : p)),
          2500,
        );
      }, IN);
    },
    [router],
  );

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (phase === "cover") setPhase("reveal");
  }

  useEffect(() => {
    if (phase !== "reveal") return;
    clearTimeout(timer.current);
    const anchor = window.location.hash && document.querySelector(window.location.hash);
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(anchor || 0, { immediate: true, force: true });
    else if (anchor) anchor.scrollIntoView();
    else window.scrollTo(0, 0);
    const t = setTimeout(() => setPhase("idle"), 800);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <Ctx.Provider value={{ navigate }}>
      {children}
      <div className={styles.veil} data-phase={phase} aria-hidden="true" />
    </Ctx.Provider>
  );
}
