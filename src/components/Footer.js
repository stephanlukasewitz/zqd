import Logo from "./Logo";
import TLink from "./transition/TLink";
import { legalNav, nav, site } from "@/content/site";
import Year from "./Year";
import styles from "./Footer.module.css";

// Bottom Bar: großer Abschluss mit Kontakt-Einladung, kompakter Navigation und
// dem vollständigen ZQD-Logo im großen Maßstab.
export default function Footer() {
  return (
    <footer id="site-footer" className={`${styles.footer} on-dark`}>
      <TLink href="/kontakt" className={styles.cta}>
        <span className={styles.ctaText}>
          Sprechen wir über <span>Ihr Projekt.</span>
        </span>
        <span className={styles.ctaArrow} aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <path d="M8 50 H88 M56 18 L88 50 L56 82" />
          </svg>
        </span>
      </TLink>

      <div className={styles.cols}>
        <div className={styles.col}>
          <p className={styles.key}>Kontakt</p>
          <a href={`mailto:${site.email}`} className={styles.link}>
            {site.email}
          </a>
          <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className={styles.link}>
            {site.phone}
          </a>
        </div>
        <div className={styles.col}>
          <p className={styles.key}>Standort</p>
          <p>
            {site.city}, {site.country}
          </p>
          <TLink href="/kontakt#anfahrt" className={styles.link}>
            Anfahrt
          </TLink>
        </div>
        <nav className={styles.col} aria-label="Footer-Navigation">
          <p className={styles.key}>Index</p>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <TLink href={item.href} className={styles.link}>
                  {item.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.col}>
          <p className={styles.key}>Rechtliches</p>
          <ul>
            {legalNav.map((item) => (
              <li key={item.href}>
                <TLink href={item.href} className={styles.link}>
                  {item.label}
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.base}>
        <TLink href="/" className={styles.brand} aria-label="ZQD – zur Startseite">
          <Logo />
        </TLink>
        <p className={styles.copy}>
          © <Year /> {site.legalName}
        </p>
      </div>
    </footer>
  );
}
