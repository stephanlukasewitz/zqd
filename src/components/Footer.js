import Logo from "./Logo";
import TLink from "./transition/TLink";
import { site } from "@/content/site";
import { getDict } from "@/i18n/server";
import Year from "./Year";
import styles from "./Footer.module.css";

// Bottom Bar: ruhiger Abschluss im selben Raster wie der Header.
export default async function Footer() {
  const d = await getDict();
  const t = d.ui.footer;
  const nav = Object.entries(d.nav);
  const legalNav = Object.entries(d.legalNav);
  return (
    <footer id="site-footer" className={styles.footer}>
      <div className={styles.grid}>
        <TLink href="/" className={styles.brand} aria-label={d.ui.home}>
          <Logo variant="wordmark" />
        </TLink>

        <div className={styles.col}>
          <p className={styles.key}>{t.contact}</p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone}</a>
        </div>

        <div className={styles.col}>
          <p className={styles.key}>{t.office}</p>
          <p>{site.street}</p>
          <p>
            {site.zip} {site.city}
          </p>
          <TLink href="/kontakt#anfahrt" className={styles.more}>
            {t.route}
          </TLink>
        </div>

        <nav className={styles.col} aria-label={t.nav}>
          <p className={styles.key}>{t.index}</p>
          {nav.map(([href, label]) => (
            <TLink key={href} href={href}>
              {label}
            </TLink>
          ))}
        </nav>
      </div>

      <div className={styles.base}>
        <p className={styles.copy}>
          <Logo variant="mark" className={styles.mark} />
          <span>
            © <Year /> {site.legalName} · Zooquariumdesign ·{" "}
            <a href="https://www.architekturgarage.com/" target="_blank" rel="noopener">
              Architekturgarage
            </a>
          </span>
        </p>
        <ul>
          {legalNav.map(([href, label]) => (
            <li key={href}>
              <TLink href={href}>{label}</TLink>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
