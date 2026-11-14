"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import TLink from "../transition/TLink";
import IndexList from "./IndexList";
import styles from "./Gallery.module.css";

const PAGE = 8;

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss");
}

// Filter liegen in der URL (?q=…&art=…&leistung=…&standort=…&ansicht=index),
// damit sie teilbar sind und beim Zurückkehren erhalten bleiben.
export default function Gallery({ items, options, initial = {} }) {
  const [query, setQuery] = useState(initial.q || "");
  const [type, setType] = useState(initial.art || "");
  const [service, setService] = useState(initial.leistung || "");
  const [country, setCountry] = useState(initial.standort || "");
  const [limit, setLimit] = useState(Math.max(PAGE, Number(initial.n) || PAGE));
  const [view, setView] = useState(initial.ansicht === "index" ? "list" : "grid");

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type) params.set("art", type);
    if (service) params.set("leistung", service);
    if (country) params.set("standort", country);
    if (view === "list") params.set("ansicht", "index");
    if (limit > PAGE) params.set("n", String(limit));
    const qs = params.toString();
    const url = qs ? `/projekte?${qs}` : "/projekte";
    if (url !== window.location.pathname + window.location.search) {
      window.history.replaceState(window.history.state, "", url);
    }
    try {
      sessionStorage.setItem("zqd:projekte", url);
    } catch {}
  }, [query, type, service, country, view, limit]);
  const numbers = useMemo(
    () => Object.fromEntries(items.map((p, i) => [p.slug, String(i + 1).padStart(2, "0")])),
    [items],
  );
  const q = useDeferredValue(query);
  const grid = useRef(null);
  const firstNew = useRef(-1);

  // Nach „Weitere Projekte“: Liegt das erste neue Projekt unterhalb des Bildschirms
  // (z. B. wenn man ganz unten geklickt hat), sanft dorthin scrollen.
  useEffect(() => {
    const i = firstNew.current;
    if (i < 0) return;
    firstNew.current = -1;
    const el = grid.current?.children[i];
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top >= 0 && top < window.innerHeight * 0.75) return;
    const offset = -Math.round(window.innerHeight * 0.15);
    if (window.__lenis) window.__lenis.scrollTo(el, { offset, duration: 1.2 });
    else window.scrollTo({ top: window.scrollY + top + offset, behavior: "smooth" });
  }, [limit]);

  const filtered = useMemo(() => {
    const nq = normalize(q.trim());
    return items.filter((p) => {
      if (type && p.type !== type) return false;
      if (service && !p.services.includes(service)) return false;
      if (country && p.country !== country) return false;
      if (nq) {
        const hay = normalize(
          [p.title, p.zoo, p.city, p.country, p.type].filter(Boolean).join(" "),
        );
        if (!nq.split(/\s+/).every((t) => hay.includes(t))) return false;
      }
      return true;
    });
  }, [items, q, type, service, country]);

  const active = Boolean(query || type || service || country);
  const visible = filtered.slice(0, limit);
  const reset = () => {
    setQuery("");
    setType("");
    setService("");
    setCountry("");
    setLimit(PAGE);
  };
  const resetLimit = (fn) => (v) => {
    fn(v);
    setLimit(PAGE);
  };

  return (
    <section className={styles.section} aria-label="Projektgalerie">
      <div className={`${styles.controls} wrap`}>
        <label className={styles.search}>
          <span className="sr-only">Projekte durchsuchen</span>
          <svg viewBox="0 0 20 20" aria-hidden="true" className={styles.searchIcon}>
            <circle cx="8.5" cy="8.5" r="6" />
            <line x1="13" y1="13" x2="18" y2="18" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => resetLimit(setQuery)(e.target.value)}
            placeholder="Projekt, Zoo oder Ort suchen …"
            autoComplete="off"
            enterKeyHint="search"
          />
        </label>

        <div className={styles.filters}>
          <div className={styles.types} role="group" aria-label="Projektart">
            <button
              type="button"
              aria-pressed={!type}
              onClick={() => resetLimit(setType)("")}
            >
              Alle
            </button>
            {options.types.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => resetLimit(setType)(type === t ? "" : t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className={styles.selects}>
            <Select
              label="Leistung"
              value={service}
              onChange={resetLimit(setService)}
              options={options.services}
            />
            <Select
              label="Standort"
              value={country}
              onChange={resetLimit(setCountry)}
              options={options.countries}
            />
          </div>
        </div>

        <div className={styles.status}>
          <p aria-live="polite">
            {filtered.length === 1 ? "1 Projekt" : `${filtered.length} Projekte`}
          </p>
          {active && (
            <button type="button" className={styles.reset} onClick={reset}>
              Zurücksetzen
            </button>
          )}
          <div className={styles.view} role="group" aria-label="Ansicht">
            <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")}>
              Raster
            </button>
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>
              Index
            </button>
          </div>
        </div>
      </div>

      {filtered.length && view === "list" ? (
        <div className="wrap">
          <IndexList items={filtered} numbers={numbers} />
        </div>
      ) : filtered.length ? (
        <ul ref={grid} className={`${styles.grid} wrap`}>
          {visible.map((p, i) => (
            <li key={p.slug} className={styles.item} style={{ "--d": `${(i % PAGE) * 40}ms` }}>
              <Card project={p} eager={i < 2} num={numbers[p.slug]} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={`${styles.empty} wrap`}>
          <p>Keine Projekte für diese Auswahl.</p>
          <button type="button" className="tlink" onClick={reset}>
            Filter zurücksetzen
          </button>
        </div>
      )}

      {view === "grid" && filtered.length > limit && (
        <div className={`${styles.more} wrap`}>
          <button
            type="button"
            onClick={() => {
              firstNew.current = limit;
              setLimit(limit + PAGE);
            }}
          >
            Weitere Projekte anzeigen
            <span>
              {Math.min(PAGE, filtered.length - limit)} von {filtered.length - limit}
            </span>
          </button>
        </div>
      )}
    </section>
  );
}

// Auswahlfeld, das genau so breit ist wie der gewählte Wert (unsichtbarer
// Platzhalter in derselben Rasterzelle), damit der Pfeil direkt dahinter sitzt.
function Select({ label, value, onChange, options }) {
  const byPointer = useRef(false);
  return (
    <label className={styles.select} data-set={value ? "" : undefined}>
      <span className={styles.selectLabel}>{label}</span>
      <span className={styles.field}>
        <span className={styles.sizer} aria-hidden="true">
          {value || "Alle"}
        </span>
        <select
          value={value}
          onPointerDown={() => (byPointer.current = true)}
          onKeyDown={() => (byPointer.current = false)}
          onChange={(e) => {
            onChange(e.target.value);
            // Mit der Maus gewählt: Fokus lösen, damit kein Rahmen stehen bleibt.
            if (byPointer.current) e.target.blur();
          }}
        >
          <option value="">Alle</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </span>
    </label>
  );
}

function Card({ project: p, eager, num }) {
  return (
    <TLink href={`/projekte/${p.slug}`} className={styles.card} data-slug={p.slug} onClick={rememberScroll}>
        <div className={styles.media}>
          <Image
            src={p.cover.image}
            alt={p.cover.alt}
            fill
            sizes="(max-width: 760px) 100vw, 48vw"
            loading={eager ? "eager" : "lazy"}
            className={styles.img}
          />
        </div>
      <div className={styles.meta}>
        <h2 className={styles.cardTitle}>
          <span className={styles.cardNum}>{num}</span>
          {p.title}
        </h2>
        <p className={styles.cardPlace}>
          {[p.zoo, p.city].filter((x, i, a) => x && a.indexOf(x) === i).join(", ")}
        </p>
        <p className={styles.cardType}>{p.type}</p>
      </div>
    </TLink>
  );
}

function rememberScroll() {
  try {
    sessionStorage.setItem("zqd:projekte-y", String(window.scrollY));
  } catch {}
}
