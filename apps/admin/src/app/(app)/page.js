import Link from "next/link";
import { SITES } from "@/lib/sites";
import { logout } from "../actions";

export default function Home() {
  return (
    <main className="content" style={{ margin: "0 auto" }}>
      <div className="head">
        <h1>
          Websites<span className="dot">.</span>
        </h1>
        <form action={logout}>
          <button className="btn ghost sm">Abmelden</button>
        </form>
      </div>
      <div className="row">
        {SITES.map((s) =>
          s.ready ? (
            <Link key={s.id} href={`/${s.id}`} className="card" style={{ textDecoration: "none" }}>
              <h2>{s.name}</h2>
              <p className="muted small" style={{ margin: "6px 0 0" }}>
                Projekte, Startseite, Team, Texte
              </p>
            </Link>
          ) : (
            <div key={s.id} className="card" style={{ opacity: 0.5 }}>
              <h2>{s.name}</h2>
              <p className="muted small" style={{ margin: "6px 0 0" }}>
                Folgt
              </p>
            </div>
          ),
        )}
      </div>
    </main>
  );
}
