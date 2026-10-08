"use client";

import { useId, useState } from "react";
import type { Locale } from "@/content/types";
import { Icon } from "./icons";

/** Legal forms with their German and French names. */
const forms = [
  ["einzel", "Einzelunternehmen", "Entreprise individuelle"],
  ["gmbh", "GmbH", "Sàrl"],
  ["ag", "AG", "SA"],
  ["kollektiv", "Kollektivgesellschaft", "Société en nom collectif"],
  ["kommandit", "Kommanditgesellschaft", "Société en commandite"],
  ["genossenschaft", "Genossenschaft", "Société coopérative"],
  ["verein", "Verein", "Association"],
  ["stiftung", "Stiftung", "Fondation"],
] as const;

type FormKey = (typeof forms)[number][0];

interface Data {
  company: string;
  form: FormKey;
  street: string;
  zipCity: string;
  country: string;
  email: string;
  phone: string;
  web: string;
  persons: string;
  uid: string;
  vat: boolean;
  register: string;
  host: string;
}

const ui = {
  de: {
    company: "Firmenname",
    companyHint: "Wie im Handelsregister eingetragen",
    form: "Rechtsform",
    street: "Strasse und Nr.",
    zipCity: "PLZ und Ort",
    country: "Land",
    email: "E-Mail",
    phone: "Telefon (empfohlen)",
    web: "Website (optional)",
    persons: "Vertretungsberechtigte Person(en)",
    personsHint: "z. B. Anna Muster, Geschäftsführerin",
    uid: "UID (optional)",
    vat: "Mehrwertsteuerpflichtig (MWST-Nummer anzeigen)",
    register: "Handelsregister (optional)",
    registerHint: "z. B. Handelsregister des Kantons Bern",
    host: "Hosting-Anbieter (optional)",
    output: "Text in",
    preview: "Ihr Impressum",
    copy: "Text kopieren",
    copied: "Kopiert",
    empty: "Füllen Sie die Felder links aus. Der Text erscheint hier.",
    uidInvalid: "Format: CHE-123.456.789",
    note: "Dieser Generator erstellt einen Entwurf nach bestem Wissen und ersetzt keine Rechtsberatung. Prüfen Sie die Angaben vor der Veröffentlichung. Ihre Eingaben bleiben in Ihrem Browser.",
    legend: "Ihre Angaben",
  },
  fr: {
    company: "Raison sociale",
    companyHint: "Telle qu'inscrite au registre du commerce",
    form: "Forme juridique",
    street: "Rue et n°",
    zipCity: "NPA et localité",
    country: "Pays",
    email: "E-mail",
    phone: "Téléphone (recommandé)",
    web: "Site internet (facultatif)",
    persons: "Personne(s) habilitée(s) à représenter",
    personsHint: "p. ex. Anne Exemple, gérante",
    uid: "IDE (facultatif)",
    vat: "Assujetti à la TVA (afficher le numéro de TVA)",
    register: "Registre du commerce (facultatif)",
    registerHint: "p. ex. Registre du commerce du canton de Vaud",
    host: "Hébergeur (facultatif)",
    output: "Texte en",
    preview: "Vos mentions légales",
    copy: "Copier le texte",
    copied: "Copié",
    empty: "Remplissez les champs. Le texte apparaît ici.",
    uidInvalid: "Format : CHE-123.456.789",
    note: "Ce générateur crée un projet de texte au mieux de nos connaissances et ne remplace pas un conseil juridique. Vérifiez les indications avant de les publier. Vos saisies restent dans votre navigateur.",
    legend: "Vos données",
  },
};

/** Labels inside the generated text, per output language. */
const out = {
  de: {
    title: "Impressum",
    contact: "Kontaktadresse",
    phone: "Telefon",
    email: "E-Mail",
    web: "Website",
    persons: "Vertretungsberechtigte Person(en)",
    ids: "Unternehmensidentifikation",
    uid: "UID",
    vat: "MWST-Nummer",
    vatSuffix: "MWST",
    register: "Handelsregistereintrag",
    host: "Hosting",
    country: "Schweiz",
  },
  fr: {
    title: "Mentions légales",
    contact: "Adresse de contact",
    phone: "Téléphone",
    email: "E-mail",
    web: "Site internet",
    persons: "Personne(s) habilitée(s) à représenter",
    ids: "Identification de l'entreprise",
    uid: "IDE",
    vat: "Numéro de TVA",
    vatSuffix: "TVA",
    register: "Inscription au registre du commerce",
    host: "Hébergement",
    country: "Suisse",
  },
};

const uidRe = /^CHE-?\d{3}\.?\d{3}\.?\d{3}$/i;

/** "che123456789" -> "CHE-123.456.789" */
function formatUid(v: string) {
  const digits = v.replace(/\D/g, "");
  return digits.length === 9 ? `CHE-${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}` : v.trim();
}

/** Builds the Impressum text, block by block, leaving out everything that is empty. */
export function buildImpressum(d: Data, lang: Locale): string {
  const t = out[lang];
  const form = forms.find((f) => f[0] === d.form);
  const formName = form?.[lang === "de" ? 1 : 2] ?? "";
  const sep = lang === "de" ? ": " : " : ";
  const country = d.country.trim() || t.country;
  const blocks: string[][] = [];
  const name = d.company.trim();
  // The legal form is shown separately only when the company name does not already contain it.
  const hasWord = (w: string) => new RegExp(`(^|[\\s,(])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[\\s,).])`, "i").test(name);
  const showForm = !!form && formName !== "" && !hasWord(form[1]) && !hasWord(form[2]);
  blocks.push(
    [
      t.contact,
      name + (showForm ? ` (${formName})` : ""),
      d.street.trim(),
      d.zipCity.trim(),
      country,
      d.phone.trim() && `${t.phone}${sep}${d.phone.trim()}`,
      d.email.trim() && `${t.email}${sep}${d.email.trim()}`,
      d.web.trim() && `${t.web}${sep}${d.web.trim()}`,
    ].filter(Boolean),
  );
  if (d.persons.trim()) blocks.push([t.persons, ...d.persons.split(/\n|;/).map((p) => p.trim()).filter(Boolean)]);
  const uid = d.uid.trim() ? formatUid(d.uid) : "";
  const ids = [
    uid && `${t.uid}${sep}${uid}`,
    uid && d.vat && `${t.vat}${sep}${uid} ${t.vatSuffix}`,
    d.register.trim() && `${t.register}${sep}${d.register.trim()}`,
  ].filter(Boolean) as string[];
  if (ids.length) blocks.push([t.ids, ...ids]);
  if (d.host.trim()) blocks.push([t.host, d.host.trim()]);
  return [t.title, ...blocks.map((b) => b.join("\n"))].join("\n\n");
}

export function ImpressumGenerator({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const id = useId();
  const [lang, setLang] = useState<Locale>(locale);
  const [copied, setCopied] = useState(false);
  const [d, setD] = useState<Data>({
    company: "",
    form: "gmbh",
    street: "",
    zipCity: "",
    country: "",
    email: "",
    phone: "",
    web: "",
    persons: "",
    uid: "",
    vat: false,
    register: "",
    host: "",
  });
  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setCopied(false);
    setD((p) => ({ ...p, [k]: v }));
  };
  const ready = d.company.trim() && d.street.trim() && d.zipCity.trim() && d.email.trim();
  const text = ready ? buildImpressum(d, lang) : "";
  const uidBad = d.uid.trim() !== "" && !uidRe.test(d.uid.replace(/\s/g, ""));

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const field = (k: "company" | "street" | "zipCity" | "country" | "email" | "phone" | "web" | "uid" | "register" | "host", label: string, opts: { hint?: string; type?: string; auto?: string; required?: boolean; placeholder?: string } = {}) => (
    <div>
      <label htmlFor={`${id}-${k}`} className="mb-1.5 block text-[14px] font-medium text-ink">
        {label}
        {opts.required && <span className="text-bright"> *</span>}
      </label>
      <input
        id={`${id}-${k}`}
        className="input"
        type={opts.type ?? "text"}
        autoComplete={opts.auto ?? "off"}
        value={d[k]}
        placeholder={opts.placeholder}
        required={opts.required}
        aria-describedby={opts.hint ? `${id}-${k}-hint` : undefined}
        onChange={(e) => set(k, e.target.value)}
      />
      {opts.hint && (
        <span id={`${id}-${k}-hint`} className="mt-1 block text-[13px] text-muted">
          {opts.hint}
        </span>
      )}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <form className="card p-6 sm:p-8 lg:col-span-7" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-5 font-display text-[20px] font-semibold tracking-[-0.01em]">{t.legend}</legend>
          <div className="sm:col-span-2">{field("company", t.company, { hint: t.companyHint, auto: "organization", required: true })}</div>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[14px] font-medium text-ink">{t.form}</span>
            <select className="input" value={d.form} onChange={(e) => set("form", e.target.value as FormKey)}>
              {forms.map((f) => (
                <option key={f[0]} value={f[0]}>
                  {locale === "de" ? f[1] : f[2]}
                </option>
              ))}
            </select>
          </label>
          {field("street", t.street, { auto: "street-address", required: true })}
          {field("zipCity", t.zipCity, { required: true })}
          {field("email", t.email, { type: "email", auto: "email", required: true })}
          {field("phone", t.phone, { type: "tel", auto: "tel" })}
          {field("web", t.web, { placeholder: locale === "de" ? "www.beispiel.ch" : "www.exemple.ch" })}
          {field("country", t.country, { placeholder: out[locale].country })}
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[14px] font-medium text-ink">{t.persons}</span>
            <textarea className="input min-h-[84px] resize-y" value={d.persons} onChange={(e) => set("persons", e.target.value)} placeholder={t.personsHint} />
          </label>
          <div>
            {field("uid", t.uid, { placeholder: "CHE-123.456.789" })}
            {uidBad && <span className="mt-1 block text-[13px] text-danger">{t.uidInvalid}</span>}
          </div>
          {field("register", t.register, { placeholder: t.registerHint })}
          <label className="flex items-start gap-3 text-[15px] text-ink-soft sm:col-span-2">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--color-accent)]" checked={d.vat} onChange={(e) => set("vat", e.target.checked)} />
            {t.vat}
          </label>
          <div className="sm:col-span-2">{field("host", t.host)}</div>
        </fieldset>
      </form>

      <div className="lg:col-span-5">
        <div className="surface-night sticky top-28 rounded-2xl p-6 text-white shadow-lift sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[20px] font-semibold tracking-[-0.01em]">{t.preview}</h2>
            <div role="group" aria-label={t.output} className="flex rounded-full border border-white/20 p-0.5 text-[13px]">
              {(["de", "fr"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => {
                    setLang(l);
                    setCopied(false);
                  }}
                  className={`rounded-full px-3 py-1 font-medium transition-colors ${lang === l ? "bg-white text-accent" : "text-white/75 hover:text-white"}`}
                >
                  {l === "de" ? "Deutsch" : "Français"}
                </button>
              ))}
            </div>
          </div>
          <pre
            aria-live="polite"
            className="mt-5 min-h-[260px] whitespace-pre-wrap break-words rounded-xl bg-white/[0.06] p-5 font-sans text-[14.5px] leading-relaxed text-white/90"
          >
            {text || <span className="text-white/55">{t.empty}</span>}
          </pre>
          <button
            type="button"
            onClick={copy}
            disabled={!text}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-accent transition-colors hover:bg-bright-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name={copied ? "check" : "file"} className="h-4 w-4" />
            {copied ? t.copied : t.copy}
          </button>
          <p className="mt-5 text-[13px] leading-relaxed text-white/65">{t.note}</p>
        </div>
      </div>
    </div>
  );
}
