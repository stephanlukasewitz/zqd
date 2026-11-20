"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import TLink from "./transition/TLink";
import { site } from "@/content/site";
import { langNames, locales, parsePath, switchLocale } from "@/i18n/config";
import { useLang } from "@/i18n/LangProvider";
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

export default function Header({ nav: labels }) {
  const publicPath = usePathname();
  const pathname = parsePath(publicPath).path;
  const { ui, values } = useLang();
  const nav = Object.entries(labels).map(([href, label]) => ({ href, label }));
  const NOTE = ui.navNote;
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(null);
  const [onDark, setOnDark] = useState(false);
  const [brandHidden, setBrandHidden] = useState(false);

  // Steht der große Schriftzug im Bild, tritt der kleine im Header zurück.
  useEffect(() => {
    const zone = document.querySelector("[data-brand-zone]");
    if (!zone) return;
    const io = new IntersectionObserver(([e]) => setBrandHidden(e.isIntersecting), {
      rootMargin: "-20% 0px 0px 0px",
    });
    io.observe(zone);
    return () => {
      io.disconnect();
      setBrandHidden(false);
    };
  }, [publicPath]);

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
  }, [publicPath]);
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

  const [lastPath, setLastPath] = useState(publicPath);
  if (lastPath !== publicPath) {
    setLastPath(publicPath);
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
        <TLink
          href="/"
          className={styles.brand}
          data-hidden={brandHidden || undefined}
          data-intro-logo
          aria-label={ui.home}
        >
          <Logo variant="wordmark" priority />
        </TLink>

        <div className={styles.actions}>
          <Lang className={styles.lang} path={publicPath} />

        <button
          ref={menuButton}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={toggle}
        >
          <span className={styles.menuLabel} data-open={open || undefined}>
            <span>{ui.menu}</span>
            <span aria-hidden="true">{ui.close}</span>
          </span>
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>
        </div>
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
        <nav className={styles.panelNav} aria-label={ui.menuLabel}>
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
            {site.city}, {values.countries[site.country] || site.country}
          </span>
          <Lang className={styles.panelLang} path={publicPath} />
        </div>
      </div>
    </header>
  );
}

// Sprachwahl: dieselbe Seite in der anderen Sprache (Filter in der Adresse bleiben erhalten).
// Bewusst ein normaler Link mit vollem Neuladen: Jede Sprache hat ihr eigenes Wurzel-Layout
// (<html lang>, <head>) – das soll der Server frisch liefern, nicht der Browser umbauen.
function Lang({ className, path }) {
  const { lang, ui } = useLang();
  return (
    <div className={className} role="group" aria-label={ui.language}>
      {locales.map((code) => (
        <a
          key={code}
          href={switchLocale(path, "", code)}
          hrefLang={code}
          lang={code}
          aria-label={langNames[code]}
          aria-current={code === lang ? "true" : undefined}
          onClick={(e) => {
            if (code === lang) return e.preventDefault();
            const search = window.location.search;
            if (search) e.currentTarget.href = switchLocale(path, search, code);
          }}
        >
          {code.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
