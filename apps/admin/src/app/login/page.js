import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LoginForm from "./LoginForm";

export const metadata = { title: "Anmelden" };

export default async function LoginPage() {
  if (await getSession()) redirect("/");
  return (
    <main className="login">
      <div style={{ width: "100%", maxWidth: 360 }}>
        <h1>
          ZQD Verwaltung<span className="dot">.</span>
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
