import { requireSession } from "@/lib/session";

export default async function AppLayout({ children }) {
  await requireSession();
  return children;
}
