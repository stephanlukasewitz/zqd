"use server";
import { redirect } from "next/navigation";
import { checkCredentials, endSession, startSession } from "@/lib/session";

export async function login(_, formData) {
  const ok = checkCredentials(formData.get("email"), formData.get("password"));
  if (!ok) {
    // Bremse gegen Ausprobieren
    await new Promise((r) => setTimeout(r, 1200));
    return { error: "E-Mail oder Passwort stimmt nicht." };
  }
  await startSession();
  redirect("/");
}

export async function logout() {
  await endSession();
  redirect("/login");
}
