"use client";

import Link from "next/link";
import { useTransitionNav } from "./TransitionProvider";

// Link mit Seitenübergang. Neue Tabs, Modifier-Klicks und Anker bleiben unverändert.
export default function TLink({ href, onClick, ...props }) {
  const { navigate } = useTransitionNav();
  return (
    <Link
      href={href}
      {...props}
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
