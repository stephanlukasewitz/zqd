"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useTransitionNav } from "./TransitionProvider";
import { useHref } from "@/i18n/LangProvider";

// Link mit Seitenübergang. Neue Tabs, Modifier-Klicks und Anker bleiben unverändert.
// Interne (deutsche) Pfade werden automatisch in die aktuelle Sprache übersetzt.
//
// Vorladen: nicht schon, wenn der Link sichtbar wird (das löste beim Scrollen über
// die Startseite Hunderte Anfragen pro Sekunde aus und bremste langsame Geräte),
// sondern erst bei Absicht – Maus darüber, Fokus oder Antippen. Beim Klick lädt
// zusätzlich die Seitenüberblendung vor.
export default function TLink({ href: raw, onClick, onPointerEnter, onFocus, onTouchStart, prefetch = false, ...props }) {
  const { navigate } = useTransitionNav();
  const router = useRouter();
  const href = useHref()(raw);
  const done = useRef(false);

  const warm = () => {
    if (done.current || typeof href !== "string" || !href.startsWith("/")) return;
    done.current = true;
    router.prefetch(href);
  };

  return (
    <Link
      href={href}
      prefetch={prefetch}
      {...props}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        warm();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        warm();
      }}
      onTouchStart={(e) => {
        onTouchStart?.(e);
        warm();
      }}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          props.target === "_blank" ||
          String(href).startsWith("#")
        )
          return;
        const url = new URL(href, window.location.href);
        if (url.pathname === window.location.pathname) {
          if (url.hash) return;
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        e.preventDefault();
        navigate(href);
      }}
    />
  );
}
