"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { Locale } from "@/content/types";
import type { Dict } from "@/i18n/dict";
import { submitLead } from "@/lib/leads/actions";
import { type Question, type ServiceKey, generalQuestions, serviceQuestions } from "@/lib/leads/details";
import {
  budgetOptions,
  companySizeOptions,
  contactOptions,
  serviceOptions,
  timelineOptions,
} from "@/lib/leads/options";
import { Icon } from "./icons";

type Service = (typeof serviceOptions)[number];
type Answer = string | string[];

interface State {
  services: Service[];
  details: Partial<Record<Service, Record<string, Answer>>>;
  hasWebsite: boolean | null;
  websiteUrl: string;
  companySize: (typeof companySizeOptions)[number] | null;
  industry: string;
  budget: (typeof budgetOptions)[number] | null;
  timeline: (typeof timelineOptions)[number] | null;
  deadline: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  preferredContact: (typeof contactOptions)[number] | null;
  message: string;
  website2: string;
}

type Step = { kind: "services" } | { kind: "service"; service: Service } | { kind: "company" } | { kind: "budget" } | { kind: "contact" };

const serviceIcons: Record<Service, string> = {
  webdesign: "layout",
  redesign: "refresh",
  shop: "cart",
  seo: "search",
  ads: "megaphone",
  branding: "pen",
  pos: "terminal",
  maintenance: "shield",
  other: "chat",
};

const reassure = {
  de: { time: "ca. 2 Minuten", note: "Kostenlos & unverbindlich · Antwort innert 1 Arbeitstag", secure: "Wir verwenden Ihre Angaben nur, um Ihre Anfrage zu beantworten." },
  fr: { time: "env. 2 minutes", note: "Gratuit et sans engagement · Réponse en 1 jour ouvrable", secure: "Nous utilisons vos informations uniquement pour répondre à votre demande." },
};

/** Services where a website already exists by definition. */
const impliesWebsite: Service[] = ["redesign", "maintenance"];

const industrySuggestions = {
  de: ["Gastronomie", "Catering", "Coiffeur / Beauty", "Handwerk", "Bau / Immobilien", "Gesundheit / Praxis", "Treuhand / Beratung", "Detailhandel", "Fitness / Sport", "Verein"],
  fr: ["Restauration", "Traiteur", "Coiffure / beauté", "Artisanat", "Construction / immobilier", "Santé / cabinet", "Fiduciaire / conseil", "Commerce de détail", "Fitness / sport", "Association"],
} as const;

export function LeadForm({
  locale,
  t,
  thanksHref,
  privacyHref,
  source = "anfrage",
  preset = [],
  presetIndustry = "",
  dark = false,
}: {
  locale: Locale;
  t: Dict["form"];
  thanksHref: string;
  privacyHref: string;
  source?: string;
  preset?: Service[];
  /** Prefills the industry field, e.g. on industry pages. */
  presetIndustry?: string;
  dark?: boolean;
}) {
  const router = useRouter();
  const uid = useId();
  const startedAt = useRef(0);
  const topRef = useRef<HTMLParagraphElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [pending, startTransition] = useTransition();
  const [s, setS] = useState<State>({
    services: preset,
    details: {},
    hasWebsite: null,
    websiteUrl: "",
    companySize: null,
    industry: presetIndustry,
    budget: null,
    timeline: null,
    deadline: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    preferredContact: null,
    message: "",
    website2: "",
  });
  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));

  // Selected services in catalogue order, each with its own short question step.
  const selected = serviceOptions.filter((o) => s.services.includes(o));
  const steps: Step[] = [
    { kind: "services" },
    ...selected.map((service): Step => ({ kind: "service", service })),
    { kind: "company" },
    { kind: "budget" },
    { kind: "contact" },
  ];
  const current = steps[Math.min(step, steps.length - 1)];
  const isLast = step >= steps.length - 1;

  const websiteImplied = selected.some((x) => impliesWebsite.includes(x)) || s.websiteUrl.trim() !== "";
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.email);
  const validStep = (st: Step) => {
    switch (st.kind) {
      case "services":
        return s.services.length > 0;
      case "service":
        return true;
      case "company":
        return s.companySize !== null && (websiteImplied || s.hasWebsite !== null);
      case "budget":
        return s.budget !== null && s.timeline !== null;
      case "contact":
        return s.name.trim().length >= 2 && emailOk;
    }
  };
  const valid = validStep(current);

  // Move focus to the step header after navigating, so keyboard and screen reader users land on the new step.
  useEffect(() => {
    if (!moved.current) return;
    const el = topRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const top = el.getBoundingClientRect().top;
    // keep the header clear of the sticky site navigation (scroll-mt on the element)
    if (top < 96 || top > window.innerHeight * 0.6) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function go(to: number) {
    moved.current = true;
    setTouched(false);
    setStep(to);
  }

  function next() {
    setTouched(true);
    if (!valid) return;
    go(Math.min(step + 1, steps.length - 1));
  }

  const resolveDefault = (q: Question): Answer | undefined =>
    "default" in q && q.default ? q.default.map((v) => (v === "$locale" ? locale : v)) : undefined;
  const answer = (service: Service, q: Question): Answer | undefined => s.details[service]?.[q.key] ?? resolveDefault(q);
  const setAnswer = (service: Service, key: string, v: Answer) =>
    setS((p) => ({ ...p, details: { ...p.details, [service]: { ...p.details[service], [key]: v } } }));

  function payloadDetails() {
    const out: Record<string, Record<string, Answer>> = {};
    for (const service of selected) {
      const answers: Record<string, Answer> = {};
      for (const q of serviceQuestions[service].questions) {
        if ("url" in q && q.url) continue;
        const a = answer(service, q);
        if (a !== undefined && a !== "" && !(Array.isArray(a) && a.length === 0)) answers[q.key] = a;
      }
      if (Object.keys(answers).length) out[service] = answers;
    }
    if (s.deadline.trim()) out.general = { deadline: s.deadline.trim() };
    return out;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLast) return next();
    setTouched(true);
    if (!valid) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await submitLead({
          locale,
          source,
          services: s.services,
          details: payloadDetails(),
          hasWebsite: websiteImplied ? true : s.hasWebsite,
          websiteUrl: s.websiteUrl,
          companySize: s.companySize,
          industry: s.industry,
          budget: s.budget,
          timeline: s.timeline,
          name: s.name,
          company: s.company,
          email: s.email,
          phone: s.phone,
          preferredContact: s.preferredContact,
          message: s.message,
          website2: s.website2,
          pageUrl: window.location.pathname,
          startedAt: startedAt.current,
        });
        if (res.ok) router.push(thanksHref);
        else setError(t.error);
      } catch {
        setError(t.error);
      }
    });
  }

  const card = dark ? "bg-white text-ink" : "bg-surface";
  const progress = Math.round(((step + 1) / steps.length) * 100);
  const lang = locale === "fr" ? "fr" : "de";
  const r = reassure[lang];

  return (
    <form onSubmit={submit} className={`relative rounded-2xl border border-line p-5 shadow-lift sm:p-10 ${card}`} noValidate>
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 text-[13px]">
          <p ref={topRef} tabIndex={-1} aria-live="polite" className="scroll-mt-28 font-semibold uppercase tracking-[0.1em] text-bright outline-none">
            {t.step} {step + 1} {t.of} {steps.length}
          </p>
          {current.kind === "service" ? (
            <p className="flex items-center gap-1.5 font-medium text-accent">
              <Icon name={serviceIcons[current.service]} className="h-4 w-4" />
              {t.options.services[current.service]}
            </p>
          ) : (
            <p className="text-muted">{r.time}</p>
          )}
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-bright-soft"
          role="progressbar"
          aria-label={`${t.step} ${step + 1} ${t.of} ${steps.length}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="h-full rounded-full bg-bright transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={s.website2} onChange={(e) => set("website2", e.target.value)} />
        </label>
      </div>

      {current.kind === "services" && (
        <Fieldset legend={t.q.services} hint={t.q.servicesHint} error={touched && !valid ? t.required : undefined}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
            {serviceOptions.map((o) => {
              const on = s.services.includes(o);
              return (
                <button
                  type="button"
                  key={o}
                  aria-pressed={on}
                  onClick={() => set("services", on ? s.services.filter((x) => x !== o) : [...s.services, o])}
                  className={`flex min-h-[64px] items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] leading-snug transition-colors ${
                    on ? "border-bright bg-bright-soft font-medium text-accent" : "border-line bg-white hover:border-bright/50 hover:bg-bg-2"
                  }`}
                >
                  <Icon name={serviceIcons[o]} className={`hidden h-5 w-5 shrink-0 sm:block ${on ? "text-bright" : "text-muted"}`} />
                  <span className="flex-1">{t.options.services[o]}</span>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${on ? "border-bright bg-bright text-white" : "border-ink/20"}`}>
                    {on && <Icon name="check" className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
        </Fieldset>
      )}

      {current.kind === "service" && (
        <div>
          <h3 className="font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] sm:text-[26px]">{serviceQuestions[current.service].title[lang]}</h3>
          <p className="mb-7 mt-1 text-[14px] text-muted">{serviceQuestions[current.service].lead[lang]}</p>
          <div className="space-y-7">
            {serviceQuestions[current.service].questions.map((q) => {
              const service = current.service;
              const id = `${uid}-${service}-${q.key}`;
              if (q.type === "text" || q.type === "textarea") {
                const value = q.url ? s.websiteUrl : ((answer(service, q) as string | undefined) ?? "");
                const onChange = (v: string) => (q.url ? set("websiteUrl", v) : setAnswer(service, q.key, v));
                return (
                  <div key={q.key}>
                    <label htmlFor={id} className="mb-2 block text-[16px] font-medium text-ink">
                      {q.label[lang]}
                    </label>
                    {q.type === "textarea" ? (
                      <textarea id={id} className="input min-h-[120px] resize-y" placeholder={q.placeholder?.[lang]} value={value} onChange={(e) => onChange(e.target.value)} />
                    ) : (
                      <input
                        id={id}
                        className="input"
                        type={q.url ? "url" : "text"}
                        inputMode={q.url ? "url" : undefined}
                        autoComplete={q.url ? "url" : "off"}
                        placeholder={q.placeholder?.[lang]}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                      />
                    )}
                  </div>
                );
              }
              const a = answer(service, q);
              return (
                <fieldset key={q.key}>
                  <legend className="mb-1 text-[16px] font-medium text-ink">{q.label[lang]}</legend>
                  {q.hint ? <p className="mb-3 text-[13px] text-muted">{q.hint[lang]}</p> : <div className="mb-3" />}
                  {q.type === "single" ? (
                    <Choice
                      small
                      options={q.options.map((o) => ({ v: o.v, l: o[lang] }))}
                      value={typeof a === "string" ? a : null}
                      onChange={(v) => setAnswer(service, q.key, a === v ? "" : v)}
                    />
                  ) : (
                    <MultiChoice
                      options={q.options.map((o) => ({ v: o.v, l: o[lang] }))}
                      value={Array.isArray(a) ? a : []}
                      onChange={(v) => setAnswer(service, q.key, v)}
                    />
                  )}
                </fieldset>
              );
            })}
          </div>
        </div>
      )}

      {current.kind === "company" && (
        <div className="space-y-8">
          <Fieldset legend={t.q.companySize} error={touched && s.companySize === null ? t.required : undefined}>
            <Choice
              options={companySizeOptions.map((o) => ({ v: o, l: t.options.companySize[o] }))}
              value={s.companySize}
              onChange={(v) => set("companySize", v)}
            />
          </Fieldset>
          <div>
            <label htmlFor={`${uid}-industry`} className="mb-3 block font-display text-[19px] font-semibold leading-tight tracking-[-0.02em] sm:text-[21px]">
              {t.q.industry} <span className="text-[14px] font-normal tracking-normal text-muted">({t.q.optional})</span>
            </label>
            <input
              id={`${uid}-industry`}
              className="input"
              list={`${uid}-industries`}
              placeholder={t.q.industryPlaceholder}
              value={s.industry}
              onChange={(e) => set("industry", e.target.value)}
            />
            <datalist id={`${uid}-industries`}>
              {industrySuggestions[lang].map((x) => (
                <option key={x} value={x} />
              ))}
            </datalist>
          </div>
          {!websiteImplied && (
            <Fieldset small legend={t.q.hasWebsite} error={touched && s.hasWebsite === null ? t.required : undefined}>
              <Choice
                options={[
                  { v: true, l: t.options.yesNo.yes },
                  { v: false, l: t.options.yesNo.no },
                ]}
                value={s.hasWebsite}
                onChange={(v) => set("hasWebsite", v)}
              />
              {s.hasWebsite && (
                <input
                  className="input mt-3"
                  type="url"
                  inputMode="url"
                  placeholder="www.ihre-firma.ch"
                  aria-label={t.q.websiteUrl}
                  value={s.websiteUrl}
                  onChange={(e) => set("websiteUrl", e.target.value)}
                />
              )}
            </Fieldset>
          )}
        </div>
      )}

      {current.kind === "budget" && (
        <div className="space-y-8">
          <Fieldset legend={t.q.budget} hint={t.q.budgetHint} error={touched && s.budget === null ? t.required : undefined}>
            <Choice options={budgetOptions.map((o) => ({ v: o, l: t.options.budget[o] }))} value={s.budget} onChange={(v) => set("budget", v)} />
          </Fieldset>
          <Fieldset small legend={t.q.timeline} error={touched && s.timeline === null ? t.required : undefined}>
            <Choice options={timelineOptions.map((o) => ({ v: o, l: t.options.timeline[o] }))} value={s.timeline} onChange={(v) => set("timeline", v)} />
          </Fieldset>
          <div>
            <label htmlFor={`${uid}-deadline`} className="mb-2 block text-[16px] font-medium text-ink">
              {generalQuestions.deadline.label[lang]}
            </label>
            <input
              id={`${uid}-deadline`}
              className="input"
              placeholder={generalQuestions.deadline.placeholder[lang]}
              value={s.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </div>
        </div>
      )}

      {current.kind === "contact" && (
        <Fieldset legend={t.q.contact}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t.q.name} required error={touched && s.name.trim().length < 2 ? t.required : undefined}>
              <input className="input" autoComplete="name" value={s.name} onChange={(e) => set("name", e.target.value)} required aria-required="true" />
            </Field>
            <Field label={t.q.company}>
              <input className="input" autoComplete="organization" value={s.company} onChange={(e) => set("company", e.target.value)} />
            </Field>
            <Field label={t.q.email} required error={touched && !emailOk ? t.invalidEmail : undefined}>
              <input className="input" type="email" autoComplete="email" value={s.email} onChange={(e) => set("email", e.target.value)} required aria-required="true" />
            </Field>
            <Field label={t.q.phone}>
              <input className="input" type="tel" autoComplete="tel" value={s.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
          </div>
          <fieldset className="mt-6">
            <legend className="mb-3 text-[14px] font-medium text-ink-soft">{t.q.preferredContact}</legend>
            <Choice
              small
              options={contactOptions.map((o) => ({ v: o, l: t.options.preferredContact[o] }))}
              value={s.preferredContact}
              onChange={(v) => set("preferredContact", v)}
            />
          </fieldset>
          <Field label={t.q.message} className="mt-6">
            <textarea className="input min-h-[110px] resize-y" value={s.message} onChange={(e) => set("message", e.target.value)} />
          </Field>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-ink-soft">
            {t.reassure.map((r) => (
              <li key={r} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-bright-soft text-bright">
                  <Icon name="check" className="h-3 w-3" strokeWidth={2.6} />
                </span>
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-muted">
            <a href={privacyHref} className="underline decoration-ink/20 underline-offset-2 hover:text-accent hover:decoration-accent">
              {t.privacy}
            </a>
          </p>
        </Fieldset>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-danger/10 px-4 py-3 text-[14px] text-danger">
          {error}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => go(step - 1)}
            className="inline-flex min-h-12 items-center gap-1.5 rounded-full px-3 text-[15px] text-muted transition-colors hover:text-accent"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            {t.back}
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-medium text-white shadow-xs transition-colors hover:bg-night disabled:opacity-60"
        >
          {!isLast ? t.next : pending ? t.sending : t.submit}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      <p className="mt-4 flex items-start justify-end gap-2 text-right text-[13px] leading-snug text-muted">
        <Icon name={isLast ? "lock" : "check"} className="mt-px h-3.5 w-3.5 shrink-0 text-bright" strokeWidth={2.2} />
        {isLast ? r.secure : r.note}
      </p>
    </form>
  );
}

function Fieldset({ legend, hint, error, small, children }: { legend: string; hint?: string; error?: string; small?: boolean; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend
        className={`mb-1 font-display font-semibold leading-tight ${small ? "text-[19px] tracking-[-0.02em] sm:text-[21px]" : "text-[22px] tracking-[-0.02em] sm:text-[26px]"}`}
      >
        {legend}
      </legend>
      {hint ? <p className="mb-5 text-[14px] text-muted">{hint}</p> : <div className={small ? "mb-3" : "mb-5"} />}
      {children}
      {error && (
        <p role="alert" className="mt-3 text-[13px] text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Field({
  label,
  error,
  required = false,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[14px] font-medium text-ink-soft">
        {label}
        {required && <span className="text-bright"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[13px] text-danger">{error}</span>}
    </label>
  );
}

const chip = (on: boolean, small?: boolean) =>
  `min-h-12 rounded-full border text-[15px] transition-colors ${small ? "px-4 py-2" : "px-5 py-2.5"} ${
    on ? "border-bright bg-bright-soft font-medium text-accent" : "border-line bg-white hover:border-bright/50 hover:bg-bg-2"
  }`;

function Choice<T extends string | boolean>({
  options,
  value,
  onChange,
  small,
}: {
  options: { v: T; l: string }[];
  value: T | null;
  onChange: (v: T) => void;
  small?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const on = value === o.v;
        return (
          <button key={String(o.v)} type="button" aria-pressed={on} onClick={() => onChange(o.v)} className={chip(on, small)}>
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

function MultiChoice({ options, value, onChange }: { options: { v: string; l: string }[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const on = value.includes(o.v);
        return (
          <button
            key={o.v}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((x) => x !== o.v) : [...value, o.v])}
            className={`inline-flex items-center gap-2 ${chip(on, true)}`}
          >
            <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border transition-colors ${on ? "border-bright bg-bright text-white" : "border-ink/20"}`} aria-hidden="true">
              {on && <Icon name="check" className="h-2.5 w-2.5" strokeWidth={3} />}
            </span>
            {o.l}
          </button>
        );
      })}
    </div>
  );
}
