import PageTransition from "@/components/PageTransition";
import { withDot } from "@/components/fx/Dot";
import ContactForm from "@/components/contact/ContactForm";
import OfficeMap from "@/components/contact/OfficeMap";
import { site } from "@/content/site";
import Reveal from "@/components/fx/Reveal";
import { pageMeta } from "@/i18n/meta";
import { getDict, getLang } from "@/i18n/server";
import styles from "./page.module.css";

export async function generateMetadata() {
  const d = await getDict();
  return pageMeta(await getLang(), "/kontakt", { title: d.meta.contact.title, description: d.meta.contact.description });
}

export default async function KontaktPage() {
  const lang = await getLang();
  const d = await getDict();
  const t = d.contact;
  const country = d.values.countries[site.country] || site.country;
  const address = [site.street, `${site.zip} ${site.city}`, country];
  const routeQuery = site.mapsQuery || address.join(", ");
  const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(routeQuery)}`;
  const tel = site.phone.replace(/[^\d+]/g, "");

  return (
    <PageTransition>
      {/* C01 */}
      <section className={`${styles.intro} wrap`}>
        <div className="grid">
          <h1 className={styles.title}>
            <Reveal>{withDot(t.title)}</Reveal>
          </h1>
          <p className={styles.sub}>{t.sub}</p>
        </div>
      </section>

      {/* C02 / C03 */}
      <section className={`${styles.contact} wrap`} aria-label={t.inquiry}>
        <div className="grid">
          <div className={styles.formCol}>
            <ContactForm email={site.email} lang={lang} />
          </div>
          <aside className={styles.direct} aria-label={t.direct}>
            <dl>
              <div>
                <dt>{t.email}</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="tlink">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{t.phone}</dt>
                <dd>
                  <a href={`tel:${tel}`} className="tlink">
                    {site.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* C04 */}
      <section id="anfahrt" className={`${styles.location} wrap`} aria-labelledby="standort">
        <div className="grid">
          <h2 id="standort" className={styles.key}>
            {t.officeTitle}
          </h2>
          <div className={styles.mapCol}>
            <OfficeMap lat={site.geo.lat} lng={site.geo.lng} label={site.legalName} />
          </div>
          <div className={styles.address}>
            <address>
              {site.legalName}
              <br />
              {address.map((l) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
            </address>
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.route}
            >
              {t.route} <span aria-hidden="true">↗</span>
              <span className="sr-only">{t.routeNote}</span>
            </a>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
