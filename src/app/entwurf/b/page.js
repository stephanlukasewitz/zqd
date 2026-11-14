import TLink from "@/components/transition/TLink";
import Reveal from "@/components/fx/Reveal";
import Split from "@/components/entwurf/Split";
import { claim, competence, featured, general, heroImages, phases, philosophy, pic, scales, service } from "@/content/home";
import { projects } from "@/content/projects";
import styles from "./page.module.css";

export const metadata = { title: "Entwurf B – Geteilt" };

export default function EntwurfB() {
  const hero = heroImages()[0];
  const sc = scales();
  const ph = phases();
  const gen = pic("haus-der-giganten-verona");
  const proj = heroImages()[1];

  const sections = [
    {
      image: hero.image,
      alt: hero.alt,
      caption: hero.title,
      content: (
        <div className={styles.hero}>
          <p className={styles.small}>{service}</p>
          <h1 className={styles.claim}>
            <Reveal>{claim[0]}</Reveal>
            <Reveal className={styles.soft} delay={120}>
              {claim[1]}
            </Reveal>
          </h1>
        </div>
      ),
    },
    {
      image: pic("polarium-rostock").image,
      alt: "",
      caption: "Polarium, Zoologischer Garten Rostock",
      content: (
        <div>
          <h2 className={styles.small}>{philosophy.title}</h2>
          <p className={styles.lead}>{philosophy.text}</p>
          <p className={styles.words}>{philosophy.words.join(" · ")}</p>
        </div>
      ),
    },
    ...sc.map((s, i) => ({
      kind: "short",
      image: s.image,
      alt: s.alt,
      caption: `${s.scale} · ${s.title}${s.zoo ? ", " + s.zoo : ""}`,
      content: (
        <div>
          {i === 0 && <h2 className={styles.h2}>{competence.title}</h2>}
          <p className={styles.scale}>{s.scale}</p>
          <p className={styles.word}>{s.word}</p>
          {i === 0 && <p className={styles.text}>{competence.text}</p>}
          <TLink href={`/projekte/${s.slug}`} className="tlink">
            {s.title} <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </div>
      ),
    })),
    ...ph.map((p, i) => ({
      kind: "short",
      image: p.image,
      alt: p.alt,
      caption: `${p.title}, ${p.zoo}`,
      content: (
        <div>
          {i === 0 && <h2 className={styles.h2}>Von der Idee bis zur Realisierung.</h2>}
          <p className={styles.scale}>{String(i + 1).padStart(2, "0")}</p>
          <p className={styles.word}>{p.label}</p>
          <p className={styles.text}>{p.text}</p>
          <ul className={styles.list}>
            {p.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      ),
    })),
    {
      image: gen.image,
      alt: gen.alt,
      caption: `${gen.title}, ${gen.zoo}`,
      content: (
        <div>
          <h2 className={styles.h2}>{general.title}</h2>
          <dl className={styles.disc}>
            {general.disciplines.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.text}>{general.text}</p>
          <TLink href="/team" className="tlink">
            Das Team hinter unserer Planung <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </div>
      ),
    },
    {
      image: proj.image,
      alt: proj.alt,
      caption: proj.title,
      content: (
        <div>
          <h2 className={styles.h2}>Projekte</h2>
          <ol className={styles.index}>
            {featured().map((p, i) => (
              <li key={p.slug}>
                <TLink href={`/projekte/${p.slug}`}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{p.title}</span>
                  <span>{p.city}</span>
                </TLink>
              </li>
            ))}
          </ol>
          <TLink href="/projekte" className="tlink">
            Alle {projects.length} Projekte <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </div>
      ),
    },
  ];

  return <Split sections={sections} />;
}
