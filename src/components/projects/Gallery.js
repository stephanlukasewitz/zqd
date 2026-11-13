"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import styles from "./Gallery.module.css";

const PAGE = 8;

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss");
}

export default function Gallery({ items, options }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [service, setService] = useState("");
  const [country, setCountry] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const q = useDeferredValue(query);

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
        </div>
      </div>

      {filtered.length ? (
        <ul className={`${styles.grid} wrap`}>
          {visible.map((p, i) => (
            <li key={p.slug} className={styles.item} style={{ "--d": `${(i % PAGE) * 40}ms` }}>
              <Card project={p} eager={i < 2} />
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

      {filtered.length > limit && (
        <div className={`${styles.more} wrap`}>
          <button type="button" onClick={() => setLimit((l) => l + PAGE)}>
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

function Select({ label, value, onChange, options }) {
  return (
    <label className={styles.select} data-set={value ? "" : undefined}>
      <span className={styles.selectLabel}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
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
    </label>
  );
}

function Card({ project: p, eager }) {
  return (
    <Link
      href={`/projekte/${p.slug}`}
      className={styles.card}
      data-slug={p.slug}
      scroll={false}
    >
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
        <h2 className={styles.cardTitle}>{p.title}</h2>
        <p className={styles.cardPlace}>
          {[p.zoo, p.city].filter((x, i, a) => x && a.indexOf(x) === i).join(", ")}
        </p>
        <p className={styles.cardType}>{p.type}</p>
      </div>
    </Link>
  );
}
