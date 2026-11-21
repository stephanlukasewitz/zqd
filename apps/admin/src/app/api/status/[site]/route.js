import { getSite } from "@/lib/sites";
import { getRepo } from "@/lib/repo";
import { getSession } from "@/lib/session";

export async function GET(_, { params }) {
  if (!(await getSession())) return Response.json({ error: "Nicht angemeldet." }, { status: 401 });
  const site = getSite((await params).site);
  if (!site) return Response.json({ error: "Unbekannt" }, { status: 404 });
  try {
    return Response.json(await getRepo().status(site), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
