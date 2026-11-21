"use client";

import { useSyncExternalStore } from "react";
import TLink from "../transition/TLink";
import { parsePath } from "@/i18n/config";

// Gespeicherte Übersicht (ggf. in anderer Sprache) → interner Pfad samt Filtern;
// TLink übersetzt ihn in die aktuelle Sprache.
const read = () => {
  try {
    const url = sessionStorage.getItem("zqd:projekte") || "/projekte";
    const [path, search = ""] = url.split("?");
    return parsePath(path).path + (search ? `?${search}` : "");
  } catch {
    return "/projekte";
  }
};

// Zurück zur Übersicht – mit den zuletzt gesetzten Filtern und der Scrollposition.
export default function BackLink({ className, children }) {
  const href = useSyncExternalStore(
    () => () => {},
    read,
    () => "/projekte",
  );
  return (
    <TLink
      href={href}
      className={className}
      onClick={() => {
        try {
          window.__restoreScroll = Number(sessionStorage.getItem("zqd:projekte-y")) || 0;
        } catch {}
      }}
    >
      {children}
    </TLink>
  );
}
