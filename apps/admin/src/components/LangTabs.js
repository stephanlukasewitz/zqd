"use client";
const NAMES = { de: "Deutsch", en: "Englisch", tr: "Türkisch" };

// Deutsch ist die Hauptsprache; Englisch/Türkisch zeigen fehlende Übersetzungen mit Punkt an
export default function LangTabs({ value, onChange, missing = {} }) {
  return (
    <div className="tabs" role="tablist">
      {Object.entries(NAMES).map(([l, n]) => (
        <button key={l} type="button" role="tab" aria-selected={value === l} onClick={() => onChange(l)}>
          {n}
          {missing[l] ? <span className="miss" title="Übersetzung unvollständig">•</span> : null}
        </button>
      ))}
    </div>
  );
}
