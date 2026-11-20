"use client";

import { useEffect } from "react";

// Sparmodus: <html data-lite> – der Hero zeigt das Wasser als ruhiges Foto, die
// Bilderwolke verzichtet auf die Weichzeichner. Standard ist die volle Fassung;
// der Sparmodus lässt sich nur noch zum Testen mit ?lite in der Adresse einschalten.
// (Eine automatische Erkennung über die Bildrate hat auf normalen Geräten zu oft
// angeschlagen, z. B. während des Ladens oder bei Browsern mit 30-fps-Begrenzung.)

const KEY = "zqd:lite";

export default function PerfGuard() {
  useEffect(() => {
    try {
      sessionStorage.removeItem(KEY); // früher automatisch gesetzter Sparmodus
    } catch {}
    if (new URLSearchParams(window.location.search).has("lite")) {
      document.documentElement.setAttribute("data-lite", "");
      window.dispatchEvent(new Event("zqd:lite"));
    }
  }, []);
  return null;
}
