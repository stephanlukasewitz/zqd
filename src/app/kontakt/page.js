import PageTransition from "@/components/PageTransition";
import ContactForm from "@/components/contact/ContactForm";
import SitePlan from "@/components/contact/SitePlan";
import { site } from "@/content/site";
import styles from "./page.module.css";

export const metadata = {
  title: "Kontakt",
  description: "Sprechen wir über Ihr Projekt – Anfrage, Kontaktdaten und Anfahrt.",
};

export default function KontaktPage() {
  const address = [site.street, `${site.zip} ${site.city}`, site.country];
  const routeQuery = site.mapsQuery || address.join(", ");
  const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(routeQuery)}`;
  const tel = site.phone.replace(/[^\d+]/g, "");

  return (
    <PageTransition>
      {/* C01 */}
      <section className={`${styles.intro} wrap`}>
        <div className="grid">
          <h1 className={styles.title}>Sprechen wir über Ihr Projekt.</h1>
          <p className={styles.sub}>
            Ob Masterplanung, neue Tieranlage oder Modernisierung – wir freuen
            uns auf Ihre Anfrage.
          </p>
        </div>
      </section>

      {/* C02 / C03 */}
      <section className={`${styles.contact} wrap`} aria-label="Anfrage">
        <div className="grid">
          <div className={styles.formCol}>
            <ContactForm email={site.email} />
          </div>
          <aside className={styles.direct} aria-label="Direkter Kontakt">
            <dl>
              <div>
                <dt>E-Mail</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="tlink">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Telefon</dt>
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
          <div className={styles.map}>
            <SitePlan />
          </div>
          <div className={styles.address}>
            <h2 id="standort" className={styles.h2}>
              Büro &amp; Anfahrt
            </h2>
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
              Route planen <span aria-hidden="true">↗</span>
              <span className="sr-only">(öffnet Google Maps)</span>
            </a>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
