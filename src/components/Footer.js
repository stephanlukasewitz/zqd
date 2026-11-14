import TLink from "./transition/TLink";
import ToTop from "./ToTop";
import Year from "./Year";
import { withDot } from "./fx/Dot";
import { subclaim } from "@/content/home";
import { legalNav, nav, site } from "@/content/site";
import styles from "./Footer.module.css";

// Bottom Bar: schwarzer Abschluss als Gegenstück zum dunklen Einstieg –
// Leitbotschaft, Kontakt und Index, darunter der Schriftzug über die volle Breite.
export default function Footer() {
  return (
    <footer id="site-footer" className={styles.footer} data-dark-zone>
      <p className={styles.statement}>{withDot(subclaim)}</p>

      <div className={styles.grid}>
        <div className={styles.col}>
          <p className={styles.key}>Kontakt</p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone}</a>
        </div>

        <div className={styles.col}>
          <p className={styles.key}>Büro</p>
          <p>{site.street}</p>
          <p>
            {site.zip} {site.city}
          </p>
          <TLink href="/kontakt#anfahrt" className={styles.more}>
            Anfahrt
          </TLink>
        </div>

        <nav className={styles.col} aria-label="Footer-Navigation">
          <p className={styles.key}>Index</p>
          {nav.map((item) => (
            <TLink key={item.href} href={item.href}>
              {item.label}
            </TLink>
          ))}
        </nav>

        <div className={styles.col}>
          <p className={styles.key}>Rechtliches</p>
          {legalNav.map((item) => (
            <TLink key={item.href} href={item.href}>
              {item.label}
            </TLink>
          ))}
        </div>
      </div>

      <TLink href="/" className={styles.brand} aria-label="Zooquariumdesign – zur Startseite" data-brand-zone>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/zqd-wordmark-footer.svg" alt="" width="1408" height="114" decoding="async" />
      </TLink>

      <div className={styles.base}>
        <p>
          © <Year /> {site.legalName} · Architekturgarage
        </p>
        <ToTop className={styles.top} />
      </div>
    </footer>
  );
}
