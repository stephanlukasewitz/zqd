import Image from "next/image";
import zoo from "@/assets/zooquariumdesign.jpg";
import { CONTACT, LINKS } from "./site";

export default function Home() {
  return (
    <div className="page">
      <header className="top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/zqd-logo.svg" alt="ZQD GmbH" width="176" height="34" />
      </header>
      <main>
        <section className="intro">
          <h1>
            Erfahrung als Fundament. Entwicklung als Anspruch<span className="dot">.</span>
          </h1>
          <p>Die ZQD GmbH vereint zwei Büros unter einem Dach – mit einem gemeinsamen Anspruch an gute Architektur.</p>
        </section>
        <section className="brands" aria-label="Unsere Büros">
          <a className="brand photo" href={LINKS.zooquariumdesign}>
            <Image className="bg" src={zoo} alt="" placeholder="blur" sizes="(max-width: 760px) 100vw, 50vw" priority />
            <span className="txt">
              <span>
                <h2>Zooquariumdesign</h2>
                <p>Architektur und Generalplanung für zoologische Einrichtungen – von der Masterplanung bis zur einzelnen Tieranlage.</p>
              </span>
              <span className="arrow" aria-hidden="true">↗</span>
            </span>
          </a>
          <a className="brand plain" href={LINKS.architekturgarage}>
            <span className="txt">
              <span>
                <h2>Architekturgarage</h2>
                <p>Architektur und Planung.</p>
              </span>
              <span className="arrow" aria-hidden="true">↗</span>
            </span>
          </a>
        </section>
      </main>
      <footer className="foot">
        <address>
          <span>{CONTACT.legal}</span>
          <span>
            {CONTACT.street}, {CONTACT.city}
          </span>
          <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </address>
        <nav>
          <a href={`${LINKS.zooquariumdesign}/impressum`}>Impressum</a>
          <a href={`${LINKS.zooquariumdesign}/datenschutz`}>Datenschutz</a>
        </nav>
      </footer>
    </div>
  );
}
