import Image from "next/image";
import { placeOf, projects } from "@/content/projects";
import Reveal from "../fx/Reveal";
import TLink from "../transition/TLink";
import { LightboxProvider, Zoom } from "./Lightbox";
import styles from "./ProjectDetail.module.css";

// Wiederkehrende Komposition für die Bildstrecke – wie ein gelayoutetes Magazin.
const LAYOUT = ["full", "left", "right", "offset", "wide-left"];

export default function ProjectDetail({ project: p }) {
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const num = String(idx + 1).padStart(2, "0");
  const total = String(projects.length).padStart(2, "0");

  const facts = [
    p.zoo && ["Auftraggeber", p.zoo],
    ["Standort", placeOf(p)],
    ["Aufgabe", p.type],
    p.year && ["Jahr", p.year],
    p.scope && ["Leistungen", p.scope],
  ].filter(Boolean);

  const [lead, ...rest] = p.text?.length ? p.text : ["Projektbeschreibung folgt."];

  const shots = [p.cover, ...(p.gallery || [])].map((g) => ({ image: g.image, alt: g.alt }));

  return (
    <LightboxProvider images={shots} title={p.title}>
    <article className={styles.detail}>
      <header className={styles.intro}>
        <p className={styles.meta}>
          <span className={styles.num}>
            {num}
            <i>/</i>
            {total}
          </span>
          <span>{p.type}</span>
          <span>{placeOf(p)}</span>
        </p>
        <h1 id={`title-${p.slug}`} className={styles.title}>
          <Reveal>{p.title}</Reveal>
        </h1>
      </header>

      <figure className={`${styles.hero} img-reveal`}>
        <Zoom index={0} label={p.cover.alt}>
          <Image
            src={p.cover.image}
            alt={p.cover.alt}
            fill
            sizes="100vw"
            preload
            quality={85}
            className={styles.heroImg}
          />
        </Zoom>
      </figure>

      <div className={styles.body}>
        <aside className={styles.facts} aria-label="Projektdaten">
          <dl>
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {p.facts?.length > 0 && (
            <ul className={styles.figures}>
              {p.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
        </aside>

        <div className={styles.text}>
          <p className={styles.lead}>{lead}</p>
          {rest.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {p.gallery?.length > 0 && (
        <div className={styles.sequence}>
          {p.gallery.map((g, i) => {
            const kind = LAYOUT[i % LAYOUT.length];
            return (
              <figure key={i} className={`${styles.shot} img-reveal`} data-kind={kind}>
                <div
                  className={styles.shotMedia}
                  style={{
                    aspectRatio:
                      kind === "full" ? "16 / 9" : `${g.image.width} / ${g.image.height}`,
                  }}
                >
                  <Zoom index={i + 1} label={g.alt}>
                    <Image
                      src={g.image}
                      alt={g.alt}
                      fill
                      sizes={kind === "full" ? "100vw" : "(max-width: 760px) 100vw, 60vw"}
                      className={styles.shotImg}
                    />
                  </Zoom>
                </div>
              </figure>
            );
          })}
        </div>
      )}

      <nav className={styles.next} aria-label="Nächstes Projekt">
        <TLink href={`/projekte/${next.slug}`} className={styles.nextLink}>
          <span className={styles.nextLabel}>Nächstes Projekt</span>
          <span className={styles.nextTitle}>{next.title}</span>
          <span className={styles.nextPlace}>{placeOf(next)}</span>
          <span className={styles.nextMedia}>
            <Image src={next.cover.image} alt="" fill sizes="30vw" className={styles.shotImg} />
          </span>
        </TLink>
      </nav>
    </article>
    </LightboxProvider>
  );
}
