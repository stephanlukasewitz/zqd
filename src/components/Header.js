"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { nav } from "@/content/site";
import styles from "./Header.module.css";

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Startseite beginnt mit dem dunklen Hero – so blitzt der Header beim Laden nicht weiß auf.
  const [onDark, setOnDark] = useState(pathname === "/");
  const [hidden, setHidden] = useState(false);
  const menuButton = useRef(null);
  const panel = useRef(null);

  // Liegt der Header über einer dunklen Fläche (z. B. dem Hero-Bild)?
  useEffect(() => {
    const zones = document.querySelectorAll("[data-dark-zone]");
    if (!zones.length) return;
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setOnDark(visible.size > 0);
      },
      { rootMargin: "0px 0px -92% 0px" },
    );
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, [pathname]);

  // Am Seitenende übernimmt der Footer die Rolle der Navigation (F00).
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([e]) => setHidden(e.isIntersecting),
      { rootMargin: "0px 0px -35% 0px" },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, [pathname]);

  // Menü bei Navigation schließen.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setOnDark(pathname === "/");
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
    panel.current?.querySelector("a")?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const dark = onDark || open;

  return (
    <header
      className={`${styles.header} ${dark ? "on-dark" : ""} ${
        hidden && !open ? styles.hidden : ""
      } ${open ? styles.isOpen : ""}`}
      style={{ viewTransitionName: "site-header" }}
      data-on-dark={dark || undefined}
    >
      <div className={styles.bar}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="ZQD – zur Startseite"
          transitionTypes={["page"]}
        >
          <Logo className={styles.logoFull} priority />
          <Logo variant="mark" className={styles.logoMark} />
        </Link>

        <nav className={styles.nav} aria-label="Hauptnavigation">
          <ul>
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.link}
                    aria-current={active ? "page" : undefined}
                    transitionTypes={["page"]}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
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
          <span className={styles.burger} aria-hidden="true" />
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
                <Link
                  href={item.href}
                  className={styles.panelLink}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className={styles.panelIndex}>0{i + 1}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  );
}
