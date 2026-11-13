"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import TLink from "./transition/TLink";
import { nav } from "@/content/site";
import styles from "./Header.module.css";

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef(null);
  const panel = useRef(null);

  // Header weicht beim Runterscrollen zurück und kommt beim Hochscrollen wieder.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        if (Math.abs(y - last) > 6) setHidden(y > last && y > 240);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setHidden(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();
    panel.current?.querySelector("a")?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open]);

  return (
    <header
      className={`${styles.header} ${open ? "on-dark" : ""}`}
      data-hidden={(hidden && !open) || undefined}
      data-scrolled={scrolled || undefined}
      data-open={open || undefined}
    >
      <div className={styles.bar}>
        <TLink href="/" className={styles.brand} aria-label="ZQD – zur Startseite">
          <Logo variant="mark" priority />
        </TLink>

        <nav className={styles.nav} aria-label="Hauptnavigation">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href}>
                <TLink
                  href={item.href}
                  className={styles.link}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </TLink>
                {i < nav.length - 1 && <span aria-hidden="true">,</span>}
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuButton}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.menuLabel} data-open={open || undefined}>
            <span>Menü</span>
            <span aria-hidden="true">Schließen</span>
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={panel}
        className={styles.panel}
        data-open={open || undefined}
        inert={!open}
      >
        <nav aria-label="Menü">
          <ol className={styles.panelList}>
            {nav.map((item, i) => (
              <li key={item.href} style={{ "--i": i }}>
                <TLink
                  href={item.href}
                  className={styles.panelLink}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </TLink>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  );
}
