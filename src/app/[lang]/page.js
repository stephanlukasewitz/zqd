import Image from "next/image";
import Hero from "@/components/home/Hero";
import Fields from "@/components/home/Fields";
import Selected from "@/components/home/Selected";
import PhaseCards from "@/components/home/PhaseCards";
import TLink from "@/components/transition/TLink";
import Reveal from "@/components/fx/Reveal";
import { withDot } from "@/components/fx/Dot";
import { heroImage, phaseImages, pic } from "@/content/home";
import { getProjects } from "@/content/projects";
import { fmt } from "@/i18n/config";
import { getDict, getLang } from "@/i18n/server";
import styles from "./page.module.css";

// Bilder der drei Aufgabenfelder (Texte im Wörterbuch)
const FIELD_IMAGES = [
  ["Masterplanung", "masterplan-erweiterung-sued-schoenbrunn", 2],
  ["Tieranlage", "orang-utan-dome-hagenbeck", 0],
  ["Aquarium", "tropen-aquarium-hagenbeck", 0],
];

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

function Caption({ shot, view, link = true }) {
  return (
    <figcaption className={styles.caption}>
      <span>
        {shot.title}, {shot.zoo}
      </span>
      {link && (
        <TLink href={`/projekte/${shot.slug}`} className={styles.capLink}>
          {view} <span aria-hidden="true">→</span>
        </TLink>
      )}
    </figcaption>
  );
}

export default async function HomePage() {
  const lang = await getLang();
  const d = await getDict();
  const h = d.home;
  const { philosophy, principles, competence, general } = h;
  const projects = getProjects(lang);
  const count = (type) => projects.filter((p) => p.type === type).length;

  const robbe = pic("eismeer-hagenbeck", 1, lang);
  const elefant = pic("elefanten-badeteich-hagenbeck", 1, lang);
  const band = pic("elefantenwelt-wilhelma", 1, lang);

  const fields = FIELD_IMAGES.map(([type, slug, i]) => ({
    type,
    word: h.fields[type][0],
    line: h.fields[type][1],
    image: pic(slug, i, lang).image,
    count: fmt(h.count, { n: count(type) }),
  }));

  const cards = phaseImages(lang).map((img, i) => ({
    label: h.phases[i].label,
    note: h.phases[i].text,
    details: h.phases[i].details,
    image: img.image,
    alt: img.alt,
    credit: `${img.title}, ${img.zoo}`,
  }));

  return (
    <>
      <Hero slide={heroImage(lang)} claim={h.claim} />

      {/* Warum */}
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

      {/* Grundsätze */}
      <section className={`${styles.section} ${styles.tight} ${styles.principles}`} aria-labelledby="grundsaetze">
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

      {/* Was */}
      {/* Bildpaar */}
      <section className={`${styles.pair} ${styles.chapter}`} aria-label={h.insights}>
        <figure className={styles.pairLarge}>
          <div className={`${styles.media} img-reveal`} style={{ aspectRatio: "3 / 2" }}>
            <Image src={robbe.image} alt={robbe.alt} fill sizes="(max-width: 760px) 100vw, 64vw" className={styles.img} />
          </div>
          <Caption shot={robbe} view={h.viewProject} />
        </figure>
        <figure className={styles.pairSmall}>
          <div className={`${styles.media} img-reveal`} style={{ aspectRatio: "4 / 5" }}>
            <Image src={elefant.image} alt={elefant.alt} fill sizes="(max-width: 760px) 60vw, 24vw" className={styles.img} />
          </div>
          <Caption shot={elefant} view={h.viewProject} />
        </figure>
      </section>

      {/* Aufgabenfelder */}
      <section className={`${styles.section} ${styles.tight}`} aria-labelledby="felder">
        <Head id="felder" title={competence.title}>
          <p>{competence.text}</p>
        </Head>
        <Fields fields={fields} />
      </section>

      {/* Wie */}
      {/* Planungsweg */}
      <section className={`${styles.section} ${styles.chapter}`} aria-labelledby="planungsweg">
        <Head id="planungsweg" title={h.phasesTitle}>
          <p>{h.phasesIntro}</p>
        </Head>
        <PhaseCards phases={cards} />
      </section>

      {/* Bildband */}
      <figure className={styles.band}>
        <div className={`${styles.bandMedia} img-reveal`}>
          <Image src={band.image} alt={band.alt} fill sizes="100vw" className={styles.img} />
        </div>
        <Caption shot={band} view={h.viewProject} />
      </figure>

      {/* Generalplanung */}
      <section className={`${styles.section} ${styles.tight}`} aria-labelledby="generalplanung">
        <Head id="generalplanung" title={general.title}>
          <p>{general.text}</p>
          <TLink href="/team" className="tlink">
            {general.teamLink} <span className="arrow" aria-hidden="true">→</span>
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

      {/* Beweis */}
      <Selected space="var(--space-chapter)" />
    </>
  );
}
