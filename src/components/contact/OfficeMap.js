"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import styles from "./OfficeMap.module.css";

// Dunkle OpenStreetMap-Karte. Kacheln kommen über den eigenen Proxy
// (/api/tiles), Besucher sprechen also nicht mit Dritten. Leaflet wird erst
// geladen, wenn die Karte in die Nähe des sichtbaren Bereichs kommt.
export default function OfficeMap({ lat, lng, label }) {
  const el = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let map;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        import("leaflet").then(({ default: L }) => {
          if (cancelled || !el.current) return;
          map = L.map(el.current, {
            center: [lat, lng],
            zoom: 15,
            minZoom: 12,
            maxZoom: 18,
            scrollWheelZoom: false,
            zoomControl: false,
          });
          L.control.zoom({ position: "bottomright" }).addTo(map);
          L.tileLayer("/api/tiles/{z}/{x}/{y}", {
            minZoom: 12,
            maxZoom: 18,
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
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el.current);
    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, [lat, lng, label]);

  return (
    <div className={styles.map} data-ready={ready || undefined}>
      <div ref={el} className={styles.canvas} />
    </div>
  );
}
