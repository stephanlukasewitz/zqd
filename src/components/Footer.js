import Logo from "./Logo";
import TLink from "./transition/TLink";
import { legalNav, nav, site } from "@/content/site";
import Year from "./Year";
import styles from "./Footer.module.css";

// Bottom Bar: ruhiger Abschluss im selben Raster wie der Header.
export default function Footer() {
  return (
    <footer id="site-footer" className={styles.footer}>
      <div className={styles.grid}>
        <TLink href="/" className={styles.brand} aria-label="ZQD – zur Startseite">
          <Logo variant="wordmark" />
        </TLink>

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
      </div>

      <div className={styles.base}>
        <p className={styles.copy}>
          <Logo variant="mark" className={styles.mark} />
          <span>
            © <Year /> {site.legalName} · Zooquariumdesign · Architekturgarage
          </span>
        </p>
        <ul>
          {legalNav.map((item) => (
            <li key={item.href}>
              <TLink href={item.href}>{item.label}</TLink>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
