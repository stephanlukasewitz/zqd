import Image from "next/image";
import TLink from "@/components/transition/TLink";
import Reveal from "@/components/fx/Reveal";
import Clock from "@/components/entwurf/Clock";
import Reel from "@/components/entwurf/Reel";
import { claim, competence, featured, general, heroImages, phases, philosophy, scales, service } from "@/content/home";
import { projects } from "@/content/projects";
import styles from "./page.module.css";

export const metadata = { title: "Entwurf A – Schriftzug" };

export default function EntwurfA() {
  const hero = heroImages()[0];
  return (
    <>
      {/* Erster Bildschirm: nur der Schriftzug */}
      <section className={styles.hero} data-brand-zone aria-label="Einstieg">
        <div className={styles.meta}>
          <span>{service}</span>
          <Clock />
        </div>
        <h1 className={styles.wordmark}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/zqd-wordmark.svg" alt="Zooquariumdesign" />
        </h1>
      </section>

      <figure className={styles.full}>
        <div className={styles.fullMedia}>
          <Image src={hero.image} alt={hero.alt} fill sizes="100vw" preload className={styles.img} />
        </div>
        <figcaption className={styles.caption}>
          <span>{hero.title}</span>
          <TLink href={`/projekte/${hero.slug}`} className="tlink">
            Projekt ansehen <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </figcaption>
      </figure>

      {/* Haltung */}
      <section className={styles.statement}>
        <p className={styles.claim}>
          <Reveal>{claim[0]}</Reveal>
          <Reveal className={styles.soft} delay={120}>
            {claim[1]}
          </Reveal>
        </p>
        <div className={styles.side}>
          <p>{philosophy.text}</p>
          <p className={styles.words}>{philosophy.words.join(" · ")}</p>
        </div>
      </section>

      <Reel items={featured()} total={projects.length} />

      {/* Maßstäbe */}
      <section className={styles.scales}>
        <h2 className={styles.h2}>
          <Reveal>{competence.title}</Reveal>
        </h2>
        <p className={styles.text}>{competence.text}</p>
        <ol className={styles.scaleRow}>
          {scales().map((s) => (
            <li key={s.scale}>
              <TLink href={`/projekte/${s.slug}`}>
                <div className={styles.scaleMedia}>
                  <Image src={s.image} alt={s.alt} fill sizes="(max-width: 760px) 50vw, 24vw" className={styles.img} />
                </div>
                <span className={styles.scaleNum}>{s.scale}</span>
                <span className={styles.scaleWord}>{s.word}</span>
              </TLink>
            </li>
          ))}
        </ol>
      </section>

      {/* Planungsweg */}
      <section className={styles.phases}>
        <h2 className={styles.h2}>
          <Reveal>Von der Idee bis zur Realisierung.</Reveal>
        </h2>
        <ol className={styles.phaseList}>
          {phases().map((p, i) => (
            <li key={p.label}>
              <span className={styles.big}>{i + 1}</span>
              <div>
                <h3>{p.label}</h3>
                <p>{p.text}</p>
              </div>
              <div className={styles.phaseMedia}>
                <Image src={p.image} alt={p.alt} fill sizes="(max-width: 760px) 100vw, 30vw" className={styles.img} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Generalplanung */}
      <section className={styles.general}>
        <h2 className={styles.h2}>
          <Reveal>{general.title}</Reveal>
        </h2>
        <div className={styles.cols}>
          {general.disciplines.map(([k, v]) => (
            <div key={k}>
              <h3>{k}</h3>
              <p>{v}</p>
            </div>
          ))}
        </div>
        <p className={styles.text}>{general.text}</p>
        <TLink href="/team" className="tlink">
          Das Team hinter unserer Planung <span className="arrow" aria-hidden="true">→</span>
        </TLink>
      </section>
    </>
  );
}
