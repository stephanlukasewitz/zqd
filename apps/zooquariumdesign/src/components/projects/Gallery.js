"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import TLink from "../transition/TLink";
import IndexList from "./IndexList";
import { fmt } from "@/i18n/config";
import { useHref, useLang } from "@/i18n/LangProvider";
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
function fromSearch(search = "") {
  const sp = new URLSearchParams(search);
  return {
    query: sp.get("q") || "",
    type: sp.get("art") || "",
    service: sp.get("leistung") || "",
    country: sp.get("standort") || "",
    limit: Math.max(PAGE, Number(sp.get("n")) || PAGE),
    view: sp.get("ansicht") === "index" ? "list" : "grid",
  };
}

function toSearch({ query, type, service, country, view, limit }) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (type) params.set("art", type);
  if (service) params.set("leistung", service);
  if (country) params.set("standort", country);
  if (view === "list") params.set("ansicht", "index");
  if (limit > PAGE) params.set("n", String(limit));
  return params.toString();
}

export default function Gallery({ items, options, search }) {
  const { ui } = useLang();
  const t = ui.gallery;
  const href = useHref();
  const [init] = useState(() => fromSearch(search));
  const [query, setQuery] = useState(init.query);
  const [type, setType] = useState(init.type);
  const [service, setService] = useState(init.service);
  const [country, setCountry] = useState(init.country);
  const [limit, setLimit] = useState(init.limit);
  const [view, setView] = useState(init.view);
  const current = toSearch({ query, type, service, country, view, limit });

  // Next.js hält die Seite beim Wegnavigieren im Hintergrund samt Zustand bereit.
  // Wird sie wieder angezeigt, gilt die Adresse: über „Projekte“ im Menü kommt man
  // ohne Filter zurück (zurückgesetzt), über Zurück/„Alle Projekte“ mit Filtern.
  useEffect(() => {
    const next = fromSearch(window.location.search);
    if (toSearch(next) === toSearch(fromSearch(`?${current}`))) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Abgleich mit der Adresse beim erneuten Anzeigen
    setQuery(next.query);
    setType(next.type);
    setService(next.service);
    setCountry(next.country);
    setLimit(next.limit);
    setView(next.view);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nur beim (erneuten) Anzeigen
  }, []);

  useEffect(() => {
    const url = href(current ? `/projekte?${current}` : "/projekte");
    if (url !== window.location.pathname + window.location.search) {
      window.history.replaceState(window.history.state, "", url);
    }
    try {
      sessionStorage.setItem("zqd:projekte", url);
    } catch {}
  }, [current, href]);
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
          [p.title, p.zoo, p.city, p.country, p.countryLabel, p.type, p.typeLabel].filter(Boolean).join(" "),
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
    <section className={styles.section} aria-label={t.label}>
      <div className={`${styles.controls} wrap`}>
        <label className={styles.search}>
          <span className="sr-only">{t.search}</span>
          <svg viewBox="0 0 20 20" aria-hidden="true" className={styles.searchIcon}>
            <circle cx="8.5" cy="8.5" r="6" />
            <line x1="13" y1="13" x2="18" y2="18" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => resetLimit(setQuery)(e.target.value)}
            placeholder={t.placeholder}
            autoComplete="off"
            enterKeyHint="search"
          />
        </label>

        <div className={styles.filters}>
          <div className={styles.types} role="group" aria-label={t.typeGroup}>
            <button
              type="button"
              aria-pressed={!type}
              onClick={() => resetLimit(setType)("")}
            >
              {t.all}
            </button>
            {options.types.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={type === value}
                onClick={() => resetLimit(setType)(type === value ? "" : value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.selects}>
            <Select
              label={t.service}
              all={t.all}
              value={service}
              onChange={resetLimit(setService)}
              options={options.services}
            />
            <Select
              label={t.location}
              all={t.all}
              value={country}
              onChange={resetLimit(setCountry)}
              options={options.countries}
            />
          </div>
        </div>

        <div className={styles.status}>
          <p aria-live="polite">
            {filtered.length === 1 ? t.one : fmt(t.many, { n: filtered.length })}
          </p>
          {active && (
            <button type="button" className={styles.reset} onClick={reset}>
              {t.reset}
            </button>
          )}
          <div className={styles.view} role="group" aria-label={t.view}>
            <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")}>
              {t.grid}
            </button>
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>
              {t.list}
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
          <p>{t.empty}</p>
          <button type="button" className="tlink" onClick={reset}>
            {t.emptyReset}
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
            {t.more}
            <span>{fmt(t.moreOf, { a: Math.min(PAGE, filtered.length - limit), b: filtered.length - limit })}</span>
          </button>
        </div>
      )}
    </section>
  );
}

// Auswahlfeld, das genau so breit ist wie der gewählte Wert (unsichtbarer
// Platzhalter in derselben Rasterzelle), damit der Pfeil direkt dahinter sitzt.
function Select({ label, all, value, onChange, options }) {
  const shown = options.find(([v]) => v === value)?.[1];
  const byPointer = useRef(false);
  return (
    <label className={styles.select} data-set={value ? "" : undefined}>
      <span className={styles.selectLabel}>{label}</span>
      <span className={styles.field}>
        <span className={styles.sizer} aria-hidden="true">
          {shown || all}
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
          <option value="">{all}</option>
          {options.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
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
        <p className={styles.cardType}>{p.typeLabel || p.type}</p>
      </div>
    </TLink>
  );
}

function rememberScroll() {
  try {
    sessionStorage.setItem("zqd:projekte-y", String(window.scrollY));
  } catch {}
}
