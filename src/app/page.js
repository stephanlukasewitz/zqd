import Image from "next/image";
import Hero from "@/components/home/Hero";
import Fields from "@/components/home/Fields";
import Selected from "@/components/home/Selected";
import PhaseCards from "@/components/home/PhaseCards";
import TLink from "@/components/transition/TLink";
import Reveal from "@/components/fx/Reveal";
import { withDot } from "@/components/fx/Dot";
import {
  claim,
  competence,
  general,
  heroImages,
  phases,
  phasesIntro,
  philosophy,
  pic,
  principles,
} from "@/content/home";
import { projects } from "@/content/projects";
import styles from "./page.module.css";

const count = (type) => projects.filter((p) => p.type === type).length;

// Die drei Aufgabenfelder – jeweils mit echter Projektzahl und Filterlink.
const fields = [
  {
    type: "Masterplanung",
    word: "Masterplanung",
    line: "Ganze Zoos weiterentwickeln – Schritt für Schritt und im laufenden Betrieb.",
    image: pic("masterplan-erweiterung-sued-schoenbrunn", 2).image,
  },
  {
    type: "Tieranlage",
    word: "Tieranlagen",
    line: "Häuser und Gehege, die Tieren Raum geben und Besuchern Nähe.",
    image: pic("orang-utan-dome-hagenbeck").image,
  },
  {
    type: "Aquarium",
    word: "Aquarien",
    line: "Unterwasserwelten mit Einblicken, die Mensch und Tier zusammenbringen.",
    image: pic("tropen-aquarium-hagenbeck").image,
  },
].map((f) => ({ ...f, count: count(f.type) }));

// Abschnittskopf: Titel links, ergänzender Text rechts unten – überall gleich.
function Head({ id, title, children }) {
  return (
    <div className={styles.head}>
      <h2 id={id} className={styles.h2}>
        <Reveal>{withDot(title)}</Reveal>
      </h2>
      {children && <div className={styles.aside}>{children}</div>}
    </div>
  );
}

function Caption({ shot, link = true }) {
  return (
    <figcaption className={styles.caption}>
      <span>
        {shot.title}, {shot.zoo}
      </span>
      {link && (
        <TLink href={`/projekte/${shot.slug}`} className={styles.capLink}>
          Projekt ansehen <span aria-hidden="true">→</span>
        </TLink>
      )}
    </figcaption>
  );
}

export default function HomePage() {
  const robbe = pic("eismeer-hagenbeck", 1);
  const elefant = pic("elefanten-badeteich-hagenbeck", 1);
  const band = pic("elefantenwelt-wilhelma", 1);

  const cards = phases().map((p) => ({
    label: p.label,
    note: p.text,
    details: p.details,
    image: p.image,
    alt: p.alt,
    credit: `${p.title}, ${p.zoo}`,
  }));

  return (
    <>
      <Hero slide={heroImages()[1]} claim={claim} />

      {/* Haltung */}
      <section className={`${styles.section} ${styles.intro}`} aria-labelledby="haltung">
        <h2 id="haltung" className="sr-only">
          {philosophy.title}
        </h2>
        <p className={styles.statement}>
          <Reveal>{withDot(philosophy.lead)}</Reveal>
        </p>
        <div className={styles.introBody}>
          <p className={styles.copy}>{philosophy.body}</p>
          <ul className={styles.values}>
            {philosophy.words.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bildpaar */}
      <section className={styles.pair} aria-label="Einblicke">
        <figure className={styles.pairLarge}>
          <div className={`${styles.media} img-reveal`} style={{ aspectRatio: "3 / 2" }}>
            <Image src={robbe.image} alt={robbe.alt} fill sizes="(max-width: 760px) 100vw, 64vw" className={styles.img} />
          </div>
          <Caption shot={robbe} />
        </figure>
        <figure className={styles.pairSmall}>
          <div className={`${styles.media} img-reveal`} style={{ aspectRatio: "4 / 5" }}>
            <Image src={elefant.image} alt={elefant.alt} fill sizes="(max-width: 760px) 60vw, 24vw" className={styles.img} />
          </div>
          <Caption shot={elefant} />
        </figure>
      </section>

      {/* Aufgabenfelder */}
      <section className={styles.section} aria-labelledby="felder">
        <Head id="felder" title={competence.title}>
          <p>{competence.text}</p>
        </Head>
        <Fields fields={fields} />
      </section>

      {/* Grundsätze */}
      <section className={`${styles.section} ${styles.principles}`} aria-labelledby="grundsaetze">
        <div className={styles.stick}>
          <h2 id="grundsaetze" className={styles.h2}>
            <Reveal>{withDot(principles.title)}</Reveal>
          </h2>
        </div>
        <ol className={styles.pList}>
          {principles.items.map(([head, text], i) => (
            <li key={head}>
              <span className={styles.pNum}>{String(i + 1).padStart(2, "0")}</span>
              <p className={styles.pHead}>{head}</p>
              <p className={styles.pText}>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Bildband */}
      <figure className={styles.band}>
        <div className={`${styles.bandMedia} img-reveal`}>
          <Image src={band.image} alt={band.alt} fill sizes="100vw" className={styles.img} />
        </div>
        <Caption shot={band} />
      </figure>

      {/* Planungsweg */}
      <section className={styles.section} aria-labelledby="planungsweg">
        <Head id="planungsweg" title="Von der Idee bis zur Realisierung.">
          <p>{phasesIntro}</p>
        </Head>
        <PhaseCards phases={cards} />
      </section>

      {/* Generalplanung */}
      <section className={styles.section} aria-labelledby="generalplanung">
        <Head id="generalplanung" title={general.title}>
          <p>{general.text}</p>
          <TLink href="/team" className="tlink">
            Das Team kennenlernen <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </Head>
        <ol className={styles.disciplines}>
          {general.disciplines.map(([k, v], i) => (
            <li key={k}>
              <span className={styles.dNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.dName}>{k}</span>
              <span className={styles.dText}>{v}</span>
            </li>
          ))}
        </ol>
      </section>

      <Selected />
    </>
  );
}
