"use client";

import { useEffect, useState } from "react";

// Live-Uhrzeit in Hamburg – ein ruhiges, lebendiges Detail.
export default function Clock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);
  const time = now
    ? now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" })
    : "--:--";
  return <span suppressHydrationWarning>Hamburg {time}</span>;
}
