import Image from "next/image";
import PageTransition from "@/components/PageTransition";
import FloorPlan from "@/components/team/FloorPlan";
import { partners, team } from "@/content/team";
import styles from "./page.module.css";

export const metadata = {
  title: "Team",
  description: "Das Team hinter ZQD – Menschen, Expertise und Partnernetzwerk.",
};

export default function TeamPage() {
  return (
    <PageTransition>
      {/* T01 */}
      <section className={`${styles.intro} wrap`}>
        <FloorPlan className={styles.plan} />
        <div className={styles.introText}>
          <h1 className={styles.title}>
            Erfahrung verbindet. <span>Neue Perspektiven bewegen.</span>
          </h1>
          <p className={styles.sub}>Das Team hinter ZQD.</p>
        </div>
      </section>

      {/* T02 */}
      <section className={`${styles.culture} wrap`}>
        <div className="grid">
          <h2 className={`${styles.h2} reveal`}>Zusammenarbeit im Büro</h2>
          <p className={`${styles.lead} reveal`}>
            Bei ZQD arbeiten unterschiedliche fachliche Perspektiven eng
            zusammen. Klare Abstimmung, fachlicher Austausch und gemeinsame
            Verantwortung prägen unsere tägliche Planung.
          </p>
        </div>
      </section>

      {/* T03 */}
      <section className={`${styles.people} wrap`} aria-labelledby="mitarbeitende">
        <h2 id="mitarbeitende" className="sr-only">
          Mitarbeitende
        </h2>
        <ul className={styles.peopleGrid}>
          {team.map((m, i) => (
            <li key={m.name} className="reveal">
              <details className={styles.person}>
                <summary>
                  <div className={styles.portrait}>
                    <Image
                      src={m.image}
                      alt={`Porträt ${m.name}`}
                      fill
                      sizes="(max-width: 560px) 50vw, (max-width: 1000px) 33vw, 25vw"
                      className={styles.portraitImg}
                      style={{ objectPosition: i === 0 ? "62% 40%" : "50% 30%" }}
                    />
                  </div>
                  <span className={styles.name}>{m.name}</span>
                  <span className={styles.role}>{m.role}</span>
                  <span className={styles.toggle} aria-hidden="true" />
                </summary>
                <dl className={styles.info}>
                  <div>
                    <dt>Qualifikation</dt>
                    <dd>{m.degree}</dd>
                  </div>
                  <div>
                    <dt>Aufgaben</dt>
                    <dd>{m.focus}</dd>
                  </div>
                  <div>
                    <dt>Erfahrung</dt>
                    <dd>{m.experience}</dd>
                  </div>
                  {m.email && (
                    <div>
                      <dt>E-Mail</dt>
                      <dd>
                        <a href={`mailto:${m.email}`}>{m.email}</a>
                      </dd>
                    </div>
                  )}
                </dl>
              </details>
            </li>
          ))}
        </ul>
      </section>

      {/* T04 */}
      <section className={`${styles.partners} wrap`} aria-labelledby="netzwerk">
        <div className="grid">
          <h2 id="netzwerk" className={`${styles.h2} reveal`}>
            Kompetenz im Netzwerk
          </h2>
          <p className={`${styles.lead} reveal`}>
            Für komplexe Aufgaben arbeiten wir mit spezialisierten Partnern
            zusammen.
          </p>
        </div>
        <ul className={styles.logoGrid}>
          {partners.map((p) => {
            const inner = (
              <>
                <span className={styles.logoBox}>
                  <Image
                    src={p.image}
                    alt={`Logo ${p.name}`}
                    sizes="240px"
                    className={styles.logo}
                  />
                </span>
                <span className={styles.pName}>
                  {p.name}
                  {p.url && <span aria-hidden="true"> ↗</span>}
                </span>
                {p.field && <span className={styles.pField}>{p.field}</span>}
              </>
            );
            return (
              <li key={p.name}>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.partner}
                    aria-label={`${p.name} (öffnet externe Website)`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={styles.partner}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </PageTransition>
  );
}
