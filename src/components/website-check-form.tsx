"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Locale } from "@/content/types";
import { submitWebsiteCheck } from "@/lib/leads/website-check";
import { Icon } from "./icons";

const t = {
  de: {
    title: "Website-Check in 30 Sekunden anfragen",
    promise: "Sie erhalten eine persönliche Einschätzung von Ferhat Demir: was gut ist, was Anfragen kostet und was sich zuerst lohnt. Kostenlos und unverbindlich.",
    url: "Ihre Website",
    urlPh: "ihre-firma.ch",
    name: "Vor- und Nachname",
    company: "Firma (optional)",
    email: "E-Mail",
    phone: "Telefon (optional)",
    note: "Worauf sollen wir besonders achten? (optional)",
    notePh: "z. B. zu wenig Anfragen, Google, Handy",
    send: "Website prüfen lassen",
    sending: "Wird gesendet …",
    privacy: "Mit dem Absenden akzeptieren Sie die",
    privacyLink: "Datenschutzerklärung",
    error: "Das hat nicht geklappt. Bitte prüfen Sie Ihre Angaben oder rufen Sie uns an.",
    errUrl: "Bitte geben Sie die Adresse Ihrer Website an.",
    points: ["Antwort innert 1 Arbeitstag", "Persönlich, kein Auto-Report"],
  },
  fr: {
    title: "Demander l'analyse en 30 secondes",
    promise: "Vous recevez l'avis personnel de Ferhat Demir : ce qui fonctionne, ce qui vous coûte des demandes et ce qui vaut la peine en premier. Gratuit et sans engagement.",
    url: "Votre site",
    urlPh: "votre-entreprise.ch",
    name: "Prénom et nom",
    company: "Entreprise (facultatif)",
    email: "E-mail",
    phone: "Téléphone (facultatif)",
    note: "Un point à regarder en particulier ? (facultatif)",
    notePh: "p. ex. peu de demandes, Google, mobile",
    send: "Faire analyser mon site",
    sending: "Envoi en cours …",
    privacy: "En envoyant ce formulaire, vous acceptez la",
    privacyLink: "déclaration de protection des données",
    error: "L'envoi n'a pas fonctionné. Vérifiez vos données ou appelez-nous.",
    errUrl: "Veuillez indiquer l'adresse de votre site.",
    points: ["Réponse sous 1 jour ouvrable", "Personnel, pas de rapport automatique"],
  },
};

const field =
  "w-full rounded-xl border border-line bg-bg-2/60 px-4 py-3 text-[16px] text-ink outline-none transition-[border-color,background-color,box-shadow] placeholder:text-muted/80 focus:border-bright focus:bg-white focus:ring-4 focus:ring-bright-soft";
const lab = "mb-1.5 block text-[13.5px] font-medium text-ink-soft";

/** One-step website check: URL, name, e-mail, optional company, phone and note. Sent as a lead (source "website-check"). */
export function WebsiteCheckForm({ locale, thanksHref, privacyHref }: { locale: Locale; thanksHref: string; privacyHref: string }) {
  const c = t[locale];
  const router = useRouter();
  const startedAt = useRef(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      className="relative rounded-3xl bg-white p-6 text-ink shadow-[0_40px_80px_-30px_rgb(10_22_34/0.6)] ring-1 ring-black/5 sm:p-8"
    >
      <h2 className="font-display text-[clamp(1.35rem,2.2vw,1.65rem)] font-semibold leading-[1.25]">{c.title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{c.promise}</p>
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="wc-url" className={lab}>
            {c.url}
          </label>
          <input id="wc-url" name="url" required inputMode="url" autoComplete="url" placeholder={c.urlPh} className={field} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="wc-name" className={lab}>
              {c.name}
            </label>
            <input id="wc-name" name="name" required minLength={2} autoComplete="name" className={field} />
          </div>
          <div>
            <label htmlFor="wc-email" className={lab}>
              {c.email}
            </label>
            <input id="wc-email" name="email" type="email" required autoComplete="email" className={field} />
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
        {/* Honeypot: hidden from people, bots fill it in. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="wc-website2">Website 2</label>
          <input id="wc-website2" name="website2" tabIndex={-1} autoComplete="off" />
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
        className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[15.5px] font-semibold text-white transition-colors hover:bg-night disabled:opacity-60"
      >
        {busy ? c.sending : c.send}
        {!busy && <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </button>
      <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px] text-muted">
        {c.points.map((p) => (
          <li key={p} className="flex items-center gap-1.5">
            <Icon name="check" className="h-3.5 w-3.5 text-bright" strokeWidth={3} />
            {p}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-[12.5px] text-muted">
        {c.privacy}{" "}
        <a href={privacyHref} className="underline underline-offset-2 hover:text-accent">
          {c.privacyLink}
        </a>
        .
      </p>
    </form>
  );
}
