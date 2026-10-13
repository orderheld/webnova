"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Locale } from "@/content/types";
import { submitWebsiteCheck } from "@/lib/leads/website-check";
import { Icon } from "./icons";

const t = {
  de: {
    url: "Ihre Website",
    next: "Website prüfen lassen",
    step2: "Wohin dürfen wir die Einschätzung senden?",
    urlPh: "ihre-firma.ch",
    name: "Vor- und Nachname",
    company: "Firma (optional)",
    email: "E-Mail",
    phone: "Telefon (optional)",
    note: "Worauf sollen wir besonders achten? (optional)",
    notePh: "z. B. zu wenig Anfragen, Google, Handy",
    send: "Website-Check anfragen",
    sending: "Wird gesendet …",
    privacy: "Mit dem Absenden akzeptieren Sie die",
    privacyLink: "Datenschutzerklärung",
    error: "Das hat nicht geklappt. Bitte prüfen Sie Ihre Angaben oder rufen Sie uns an.",
    errUrl: "Bitte geben Sie die Adresse Ihrer Website an.",
  },
  fr: {
    url: "Votre site",
    next: "Analyser mon site",
    step2: "Où pouvons-nous vous envoyer notre avis ?",
    urlPh: "votre-entreprise.ch",
    name: "Prénom et nom",
    company: "Entreprise (facultatif)",
    email: "E-mail",
    phone: "Téléphone (facultatif)",
    note: "Un point à regarder en particulier ? (facultatif)",
    notePh: "p. ex. peu de demandes, Google, mobile",
    send: "Demander l'analyse",
    sending: "Envoi en cours …",
    privacy: "En envoyant ce formulaire, vous acceptez la",
    privacyLink: "déclaration de protection des données",
    error: "L'envoi n'a pas fonctionné. Vérifiez vos données ou appelez-nous.",
    errUrl: "Veuillez indiquer l'adresse de votre site.",
  },
};

const field =
  "w-full rounded-xl border border-line bg-bg-2/60 px-4 py-3 text-[16px] text-ink outline-none transition-[border-color,background-color,box-shadow] placeholder:text-muted/80 focus:border-bright focus:bg-white focus:ring-4 focus:ring-bright-soft";
const lab = "mb-1.5 block text-[13.5px] font-medium text-ink-soft";

/**
 * Website check in two steps (nordpixel look): a white bar with the website address and a dark button,
 * then the contact fields open below it in the same card. Sent as a lead (source "website-check");
 * Ferhat looks at the site personally, there is no automatic analysis.
 */
export function WebsiteCheckForm({ locale, thanksHref, privacyHref }: { locale: Locale; thanksHref: string; privacyHref: string }) {
  const c = t[locale];
  const router = useRouter();
  const startedAt = useRef(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!open) {
      // Step 1 only asks for the address; the browser has already checked that it is filled in.
      setOpen(true);
      requestAnimationFrame(() => nameRef.current?.focus());
      return;
    }
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const res = await submitWebsiteCheck({
      locale,
      websiteUrl: String(f.get("url") ?? ""),
      name: String(f.get("name") ?? ""),
      email: String(f.get("email") ?? ""),
      company: String(f.get("company") ?? ""),
      phone: String(f.get("phone") ?? ""),
      note: String(f.get("note") ?? ""),
      pageUrl: window.location.pathname,
      website2: String(f.get("website2") ?? ""),
      startedAt: startedAt.current || Date.now(),
    }).catch(() => ({ ok: false, field: "" }));
    if (res.ok) {
      router.push(`${thanksHref}?check=1`);
      return;
    }
    setBusy(false);
    setError(res.field === "websiteUrl" ? c.errUrl : c.error);
  }

  return (
    <form
      onSubmit={onSubmit}
      onFocus={() => {
        if (!startedAt.current) startedAt.current = Date.now();
      }}
      className="relative rounded-[1.25rem] bg-white p-2 text-left text-ink shadow-[0_40px_80px_-30px_rgb(5_12_20/0.7)] ring-1 ring-black/5"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="wc-url" className="flex min-h-14 flex-1 items-center gap-3 rounded-xl px-4 focus-within:bg-bg-2/70">
          <Icon name="globe" className="h-5 w-5 shrink-0 text-muted" />
          <span className="sr-only">{c.url}</span>
          <input
            id="wc-url"
            name="url"
            required
            inputMode="url"
            autoComplete="url"
            placeholder={c.urlPh}
            className="h-14 w-full min-w-0 bg-transparent text-[17px] text-ink outline-none placeholder:text-muted/80"
          />
        </label>
        {!open && (
          <button
            type="submit"
            className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-[16px] font-semibold text-white transition-colors hover:bg-night"
          >
            {c.next}
            <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

      {open && (
        <div className="dialog-in border-t border-line px-3 pb-3 pt-5 sm:px-4">
          <p aria-live="polite" className="font-display text-[18px] font-semibold leading-snug">
            {c.step2}
          </p>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="wc-name" className={lab}>
                  {c.name}
                </label>
                <input ref={nameRef} id="wc-name" name="name" required minLength={2} autoComplete="name" className={field} />
              </div>
              <div>
                <label htmlFor="wc-email" className={lab}>
                  {c.email}
                </label>
                {/* pattern: the browser alone accepts "name@domain", the server does not; same rule as the lead form. */}
                <input id="wc-email" name="email" type="email" required pattern="[^\s@]+@[^\s@]+\.[^\s@]{2,}" autoComplete="email" className={field} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="wc-company" className={lab}>
                  {c.company}
                </label>
                <input id="wc-company" name="company" maxLength={160} autoComplete="organization" className={field} />
              </div>
              <div>
                <label htmlFor="wc-phone" className={lab}>
                  {c.phone}
                </label>
                <input id="wc-phone" name="phone" type="tel" autoComplete="tel" className={field} />
              </div>
            </div>
            <div>
              <label htmlFor="wc-note" className={lab}>
                {c.note}
              </label>
              <input id="wc-note" name="note" maxLength={300} placeholder={c.notePh} className={field} />
            </div>
          </div>
          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-[14px] text-danger">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="group mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-night disabled:opacity-60"
          >
            {busy ? c.sending : c.send}
            {!busy && <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </button>
          <p className="mt-3 text-center text-[12.5px] text-muted">
            {c.privacy}{" "}
            <a href={privacyHref} className="underline underline-offset-2 hover:text-accent">
              {c.privacyLink}
            </a>
            .
          </p>
        </div>
      )}
      {/* Honeypot: hidden from people, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="wc-website2">Website 2</label>
        <input id="wc-website2" name="website2" tabIndex={-1} autoComplete="off" />
      </div>
    </form>
  );
}
