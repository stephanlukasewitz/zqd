"use client";

import { useState } from "react";

export default function ShareButton({ title, path }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = new URL(path, window.location.origin).toString();
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} – ZQD`, url });
        return;
      } catch {
        // abgebrochen – auf Kopieren zurückfallen
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Link kopieren:", url);
    }
  };

  return (
    <button type="button" className="tlink" onClick={share}>
      {copied ? "Link kopiert" : "Projekt teilen"}
      <span className="arrow" aria-hidden="true">
        ↗
      </span>
    </button>
  );
}
