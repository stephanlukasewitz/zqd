import Image from "next/image";
import { withDot } from "@/components/fx/Dot";
import { partners, team } from "@/content/team";
import Reveal from "@/components/fx/Reveal";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/server";
import styles from "./page.module.css";

export async function generateMetadata() {
  const d = await getDict();
  return { title: d.meta.team.title, description: d.meta.team.description };
}

export default async function TeamPage() {
  const d = await getDict();
  const t = d.team;
  return (
    <>
      {/* T01 */}
      <section className={`${styles.intro} wrap`}>
        <div className={styles.introText}>
          <h1 className={styles.title}>
            <Reveal>
              {t.title[0]} <span className={styles.hl}>{withDot(t.title[1])}</span>
            </Reveal>
          </h1>
          <p className={styles.sub}>{t.sub}</p>
        </div>
      </section>

      {/* T02 */}
      <section className={`${styles.culture} wrap`}>
        <div className="grid">
          <h2 className={`${styles.h2} reveal`}>{t.cultureTitle}</h2>
          <p className={`${styles.lead} reveal`}>{t.culture}</p>
        </div>
      </section>

      {/* T03 */}
      <section className={`${styles.people} wrap`} aria-labelledby="mitarbeitende">
        <h2 id="mitarbeitende" className="sr-only">
          {t.people}
        </h2>
        <ul className={styles.peopleGrid}>
          {team.map((m, i) => (
            <li key={m.name} className="reveal">
              <details className={styles.person}>
                <summary>
                  <div className={styles.portrait}>
                    <Image
                      src={m.image}
                      alt={fmt(t.portrait, { name: m.name })}
                      fill
                      sizes="(max-width: 560px) 50vw, (max-width: 1000px) 33vw, 25vw"
                      className={styles.portraitImg}
                      style={{ objectPosition: i === 0 ? "62% 40%" : "50% 30%" }}
                    />
                  </div>
                  <span className={styles.name}>{m.name}</span>
                  <span className={styles.role}>{t.roles[m.role] || m.role}</span>
                  <span className={styles.toggle} aria-hidden="true" />
                </summary>
                <dl className={styles.info}>
                  <div>
                    <dt>{t.qualification}</dt>
                    <dd>{m.degree}</dd>
                  </div>
                  <div>
                    <dt>{t.focus}</dt>
                    <dd>{m.focus}</dd>
                  </div>
                  <div>
                    <dt>{t.experience}</dt>
                    <dd>{m.experience}</dd>
                  </div>
                  {m.email && (
                    <div>
                      <dt>{t.email}</dt>
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
            {t.partnersTitle}
          </h2>
          <p className={`${styles.lead} reveal`}>{t.partners}</p>
        </div>
        <ul className={styles.logoGrid}>
          {partners.map((p) => {
            const inner = (
              <>
                <span className={styles.logoBox}>
                  <Image
                    src={p.image}
                    alt={fmt(t.logo, { name: p.name })}
                    fill
                    sizes="200px"
                    className={styles.logo}
                  />
                </span>
                <span className={styles.pName}>
                  {p.name}
                  {p.url && <span aria-hidden="true"> ↗</span>}
                </span>
                {p.field && <span className={styles.pField}>{t.fields[p.field] || p.field}</span>}
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
                    aria-label={fmt(t.external, { name: p.name })}
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
    </>
  );
}
