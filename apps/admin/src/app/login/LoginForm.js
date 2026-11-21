"use client";
import { useActionState, useState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  const [email, setEmail] = useState("");
  return (
    <form action={action}>
      {state?.error && <p className="msg err">{state.error}</p>}
      <div className="field">
        <label htmlFor="email">E-Mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="password">Passwort</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus={!!state?.error} />
      </div>
      <button className="btn" disabled={pending} style={{ width: "100%" }}>
        {pending ? "Anmelden …" : "Anmelden"}
      </button>
    </form>
  );
}
