"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import TLink from "./transition/TLink";
import { nav, site } from "@/content/site";
import { homeMedia, teamPhotos } from "@/content/media";
import styles from "./Header.module.css";

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

// Ein Bild je Menüpunkt – die Vorschau zeigt, was einen dort erwartet.
const PREVIEW = {
  "/": homeMedia.hero[0].image,
  "/projekte": homeMedia.hero[1].image,
  "/team": teamPhotos[0]?.image,
  "/kontakt": homeMedia.competence.image,
};

const NOTE = {
  "/": "Startseite",
  "/projekte": "Referenzen und Index",
  "/team": "Menschen und Partner",
  "/kontakt": "Anfrage und Anfahrt",
};

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(null);
  const [onDark, setOnDark] = useState(false);

  // Liegt der Header über einer dunklen Fläche (z. B. dem Hero)?
  useEffect(() => {
    const zones = document.querySelectorAll("[data-dark-zone]");
    if (!zones.length) return;
    const seen = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? seen.add(e.target) : seen.delete(e.target);
        setOnDark(seen.size > 0);
      },
      { rootMargin: "0px 0px -94% 0px" },
    );
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, [pathname]);
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
    setOnDark(false);
  }

  const toggle = () => {
    setOpened(true);
    setOpen((v) => !v);
  };

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

  const shown = hover || nav.find((n) => isActive(pathname, n.href))?.href || "/projekte";

  return (
    <header
      className={`${styles.header} ${onDark && !scrolled && !open ? "on-dark" : ""}`}
      data-on-dark={(onDark && !scrolled && !open) || undefined}
      data-hidden={(hidden && !open) || undefined}
      data-scrolled={scrolled || undefined}
      data-open={open || undefined}
    >
      <div className={styles.bar}>
        <TLink href="/" className={styles.brand} aria-label="ZQD – zur Startseite">
          <Logo variant="wordmark" priority />
        </TLink>


        <button
          ref={menuButton}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={toggle}
        >
          <span className={styles.menuLabel} data-open={open || undefined}>
            <span>Menü</span>
            <span aria-hidden="true">Schließen</span>
          </span>
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>
      </div>

      <div
        className={styles.scrim}
        data-open={open || undefined}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        id="site-menu"
        ref={panel}
        className={styles.panel}
        data-open={open || undefined}
        inert={!open}
        onPointerLeave={() => setHover(null)}
      >
        <nav className={styles.panelNav} aria-label="Menü">
          <ol className={styles.panelList}>
            {nav.map((item, i) => (
              <li key={item.href} style={{ "--i": i }}>
                <TLink
                  href={item.href}
                  className={styles.panelLink}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  data-dim={(hover && hover !== item.href) || undefined}
                  onPointerEnter={() => setHover(item.href)}
                  onFocus={() => setHover(item.href)}
                  onClick={() => setOpen(false)}
                >
                  <span className={styles.panelNum}>0{i + 1}</span>
                  <span className={styles.panelLabel}>{item.label}</span>
                  <span className={styles.panelNote}>{NOTE[item.href]}</span>
                </TLink>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.panelMedia} aria-hidden="true">
          {opened &&
            nav.map((item) =>
              PREVIEW[item.href] ? (
                <div
                  key={item.href}
                  className={styles.panelImg}
                  data-on={shown === item.href || undefined}
                >
                  <Image src={PREVIEW[item.href]} alt="" fill sizes="40vw" />
                </div>
              ) : null,
            )}
        </div>

        <div className={styles.panelFoot}>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone}</a>
          <span>
            {site.city}, {site.country}
          </span>
        </div>
      </div>
    </header>
  );
}
