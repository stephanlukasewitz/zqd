import Link from "next/link";
import { notFound } from "next/navigation";
import { getSite } from "@/lib/sites";
import { logout } from "../../actions";
import Nav from "@/components/Nav";
import DraftBar from "@/components/DraftBar";

export default async function SiteLayout({ children, params }) {
  const { site: id } = await params;
  const site = getSite(id);
  if (!site) notFound();
  return (
    <div className="shell">
      <aside className="side">
        <Link href="/" className="brand">
          {site.name}
          <span className="dot">.</span>
        </Link>
        <Nav site={site.id} />
        <div className="foot">
          <a href={site.liveUrl} target="_blank" rel="noreferrer" className="muted" style={{ textDecoration: "none" }}>
            Live-Seite ↗
          </a>
          <form action={logout}>
            <button>Abmelden</button>
          </form>
        </div>
      </aside>
      <div className="main">
        <DraftBar site={site.id} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
