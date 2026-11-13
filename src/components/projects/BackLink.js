"use client";

import { useSyncExternalStore } from "react";
import TLink from "../transition/TLink";

const read = () => {
  try {
    return sessionStorage.getItem("zqd:projekte") || "/projekte";
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
