import { requireSession } from "@/lib/session";
import { Feedback } from "@/components/ui";

export default async function AppLayout({ children }) {
  await requireSession();
  return (
    <>
      {children}
      <Feedback />
    </>
  );
}
