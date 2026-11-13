import Link from "next/link";
import Logo from "./Logo";
import { legalNav, nav, site } from "@/content/site";
import Year from "./Year";
import styles from "./Footer.module.css";

// Bottom Bar (F00–F04): der Endzustand der oberen Navigationsleiste.
export default function Footer() {
  return (
    <footer id="site-footer" className={`${styles.footer} on-dark`}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="ZQD – zur Startseite"
          transitionTypes={["page"]}
        >
          <Logo />
        </Link>

        <div className={styles.contact}>
          <a className={styles.mail} href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <p className={styles.place}>
            {site.city}, {site.country}
          </p>
          <Link href="/kontakt#anfahrt" className="tlink" transitionTypes={["page"]}>
            Kontakt &amp; Anfahrt <span className="arrow">→</span>
          </Link>
        </div>

        <nav className={styles.menu} aria-label="Footer-Navigation">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href} style={{ "--i": i }}>
                <Link href={item.href} transitionTypes={["page"]}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.legal}>
        <p>
          © <Year /> {site.legalName}
        </p>
        <ul>
          {legalNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} transitionTypes={["page"]}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
