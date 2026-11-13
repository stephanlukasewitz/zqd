"use client";

import Link from "next/link";
import { useActionState } from "react";
import { sendInquiry } from "@/app/kontakt/actions";
import styles from "./ContactForm.module.css";

const TYPES = ["Masterplanung", "Tieranlage", "Aquarium", "Sonstiges"];

export default function ContactForm({ email }) {
  const [state, action, pending] = useActionState(sendInquiry, null);
  const v = state?.values || {};
  const e = state?.errors || {};

  if (state?.ok) {
    return (
      <div className={styles.success} role="status" tabIndex={-1}>
        <span className={styles.mark} aria-hidden="true">
          <span>Z</span>
          <span>Q</span>
          <span>D</span>
        </span>
        <p className={styles.successTitle}>Vielen Dank.</p>
        <p>Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns bei Ihnen.</p>
      </div>
    );
  }

  return (
    <form action={action} className={styles.form} noValidate>
      {state?.error && (
        <p className={styles.formError} role="alert">
          {state.error}{" "}
          {email && (
            <a href={`mailto:${email}`} className={styles.inlineLink}>
              {email}
            </a>
          )}
        </p>
      )}

      <Field label="Name" name="name" required error={e.name} defaultValue={v.name} autoComplete="name" />
      <Field
        label="Einrichtung / Unternehmen"
        name="org"
        required
        error={e.org}
        defaultValue={v.org}
        autoComplete="organization"
      />
      <Field
        label="E-Mail"
        name="email"
        type="email"
        required
        error={e.email}
        defaultValue={v.email}
        autoComplete="email"
        inputMode="email"
      />
      <Field label="Telefon" name="phone" type="tel" defaultValue={v.phone} autoComplete="tel" half />
      <Field label="Land" name="country" defaultValue={v.country} autoComplete="country-name" half />

      <fieldset className={styles.types}>
        <legend>Projektart</legend>
        <div>
          {TYPES.map((t) => (
            <label key={t} className={styles.chip}>
              <input type="radio" name="type" value={t} defaultChecked={v.type === t} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        label="Nachricht"
        name="message"
        required
        error={e.message}
        defaultValue={v.message}
        textarea
      />

      {/* Honeypot – für Menschen unsichtbar */}
      <div className={styles.hp} aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className={styles.consent} data-error={e.consent ? "" : undefined}>
        <input type="checkbox" name="consent" aria-describedby={e.consent ? "err-consent" : undefined} />
        <span className={styles.box} aria-hidden="true" />
        <span>
          Ich habe die{" "}
          <Link href="/datenschutz" className={styles.inlineLink}>
            Datenschutzhinweise
          </Link>{" "}
          gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung der
          Anfrage einverstanden. *
        </span>
      </label>
      {e.consent && (
        <p id="err-consent" className={styles.error}>
          {e.consent}
        </p>
      )}

      <div className={styles.submitRow}>
        <p className={styles.req}>* Pflichtfeld</p>
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Wird gesendet …" : "Anfrage senden"}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, required, error, textarea, half, ...rest }) {
  const id = `f-${name}`;
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className={`${styles.field} ${half ? styles.half : ""}`} data-error={error ? "" : undefined}>
      <Tag
        id={id}
        name={name}
        placeholder=" "
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `err-${name}` : undefined}
        rows={textarea ? 5 : undefined}
        {...(textarea ? {} : { type: rest.type || "text" })}
        {...rest}
      />
      <label htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      {error && (
        <p id={`err-${name}`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
