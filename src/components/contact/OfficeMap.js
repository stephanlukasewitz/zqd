"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import "leaflet/dist/leaflet.css";
import styles from "./OfficeMap.module.css";

const KEY = "zqd:map-consent";

// Dunkle OpenStreetMap-Karte. Lädt erst nach Zustimmung – vorher geht keine
// Anfrage an Dritte raus. Leaflet wird erst dann nachgeladen.
export default function OfficeMap({ lat, lng, label }) {
  const el = useRef(null);
  const stored = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return localStorage.getItem(KEY) === "1";
      } catch {
        return false;
      }
    },
    () => false,
  );
  const [accepted, setAccepted] = useState(false);
  const consent = stored || accepted;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!consent) return;
    let map;
    let cancelled = false;
    import("leaflet").then(({ default: L }) => {
      if (cancelled || !el.current) return;
      map = L.map(el.current, {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: true,
      });
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const icon = L.divIcon({
        className: styles.pin,
        html: `<span></span><em>${label}</em>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker([lat, lng], { icon, keyboard: false }).addTo(map);
      setReady(true);
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [consent, lat, lng, label]);

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setAccepted(true);
  };

  return (
    <div className={styles.map} data-ready={ready || undefined}>
      <div ref={el} className={styles.canvas} />
      {!consent && (
        <div className={styles.gate}>
          <p>
            Beim Laden der Karte wird eine Verbindung zu OpenStreetMap hergestellt und
            Ihre IP-Adresse übertragen.
          </p>
          <button type="button" className="tlink" onClick={accept}>
            Karte laden <span className="arrow" aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
