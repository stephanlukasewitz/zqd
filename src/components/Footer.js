import Logo from "./Logo";
import TLink from "./transition/TLink";
import ToTop from "./ToTop";
import Year from "./Year";
import { service } from "@/content/home";
import { legalNav, nav, site } from "@/content/site";
import styles from "./Footer.module.css";

// Bottom Bar: ruhiger Abschluss im selben Raster wie der Header.
export default function Footer() {
  return (
    <footer id="site-footer" className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandCol}>
          <TLink href="/" className={styles.brand} aria-label="Zooquariumdesign – zur Startseite">
            <Logo variant="wordmark" />
          </TLink>
          <p className={styles.service}>{service}</p>
        </div>

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
        <p>
          © <Year /> {site.legalName} · Architekturgarage
        </p>
        <ul>
          {legalNav.map((item) => (
            <li key={item.href}>
              <TLink href={item.href}>{item.label}</TLink>
            </li>
          ))}
          <li>
            <ToTop className={styles.top} />
          </li>
        </ul>
      </div>
    </footer>
  );
}
