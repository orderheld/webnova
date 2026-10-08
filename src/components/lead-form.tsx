"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { Locale } from "@/content/types";
import type { Dict } from "@/i18n/dict";
import { submitLead } from "@/lib/leads/actions";
import {
  budgetOptions,
  companySizeOptions,
  contactOptions,
  serviceOptions,
  timelineOptions,
} from "@/lib/leads/options";
import { Icon } from "./icons";

type Service = (typeof serviceOptions)[number];

interface State {
  services: Service[];
  hasWebsite: boolean | null;
  websiteUrl: string;
  companySize: (typeof companySizeOptions)[number] | null;
  industry: string;
  budget: (typeof budgetOptions)[number] | null;
  timeline: (typeof timelineOptions)[number] | null;
  name: string;
  company: string;
  email: string;
  phone: string;
  preferredContact: (typeof contactOptions)[number] | null;
  message: string;
  website2: string;
}

export function LeadForm({
  locale,
  t,
  thanksHref,
  privacyHref,
  source = "anfrage",
  preset = [],
  dark = false,
}: {
  locale: Locale;
  t: Dict["form"];
  thanksHref: string;
  privacyHref: string;
  source?: string;
  preset?: Service[];
  dark?: boolean;
}) {
  const router = useRouter();
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [pending, startTransition] = useTransition();
  const [s, setS] = useState<State>({
    services: preset,
    hasWebsite: null,
    websiteUrl: "",
    companySize: null,
    industry: "",
    budget: null,
    timeline: null,
    name: "",
    company: "",
    email: "",
    phone: "",
    preferredContact: null,
    message: "",
    website2: "",
  });
  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));

  const steps = 4;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.email);
  const valid = [
    s.services.length > 0,
    s.hasWebsite !== null && s.companySize !== null,
    s.budget !== null && s.timeline !== null,
    s.name.trim().length >= 2 && emailOk,
  ];

  function next() {
    setTouched(true);
    if (!valid[step]) return;
    setTouched(false);
    setStep((x) => Math.min(x + 1, steps - 1));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < steps - 1) return next();
    setTouched(true);
    if (!valid[step]) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await submitLead({
          ...s,
          locale,
          source,
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

  return (
    <form onSubmit={submit} className={`rounded-lg border border-line p-6 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.35)] sm:p-10 ${card}`} noValidate>
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-muted">
          {t.step} {step + 1} {t.of} {steps}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: steps }).map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? "w-10 bg-accent" : "w-6 bg-line"}`} />
          ))}
        </div>
      </div>

      {/* honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={s.website2} onChange={(e) => set("website2", e.target.value)} />
        </label>
      </div>

      {step === 0 && (
        <Fieldset legend={t.q.services} hint={t.q.servicesHint} error={touched && !valid[0] ? t.required : undefined}>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {serviceOptions.map((o) => {
              const on = s.services.includes(o);
              return (
                <button
                  type="button"
                  key={o}
                  aria-pressed={on}
                  onClick={() => set("services", on ? s.services.filter((x) => x !== o) : [...s.services, o])}
                  className={`flex min-h-[64px] items-center justify-between gap-2 rounded-md border px-4 py-3 text-left text-[15px] transition-all ${
                    on ? "border-accent bg-accent-soft font-medium text-ink" : "border-line hover:border-accent/40"
                  }`}
                >
                  {t.options.services[o]}
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${on ? "border-accent bg-accent text-white" : "border-line"}`}>
                    {on && <Icon name="check" className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
        </Fieldset>
      )}

      {step === 1 && (
        <div className="space-y-8">
          <Fieldset legend={t.q.hasWebsite} error={touched && s.hasWebsite === null ? t.required : undefined}>
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
                placeholder="www.ihre-firma.ch"
                aria-label={t.q.websiteUrl}
                value={s.websiteUrl}
                onChange={(e) => set("websiteUrl", e.target.value)}
              />
            )}
          </Fieldset>
          <Fieldset legend={t.q.companySize} error={touched && s.companySize === null ? t.required : undefined}>
            <Choice
              options={companySizeOptions.map((o) => ({ v: o, l: t.options.companySize[o] }))}
              value={s.companySize}
              onChange={(v) => set("companySize", v)}
            />
          </Fieldset>
          <Fieldset legend={t.q.industry}>
            <input className="input" value={s.industry} onChange={(e) => set("industry", e.target.value)} aria-label={t.q.industry} />
          </Fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <Fieldset legend={t.q.budget} hint={t.q.budgetHint} error={touched && s.budget === null ? t.required : undefined}>
            <Choice options={budgetOptions.map((o) => ({ v: o, l: t.options.budget[o] }))} value={s.budget} onChange={(v) => set("budget", v)} />
          </Fieldset>
          <Fieldset legend={t.q.timeline} error={touched && s.timeline === null ? t.required : undefined}>
            <Choice options={timelineOptions.map((o) => ({ v: o, l: t.options.timeline[o] }))} value={s.timeline} onChange={(v) => set("timeline", v)} />
          </Fieldset>
        </div>
      )}

      {step === 3 && (
        <Fieldset legend={t.q.contact}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t.q.name} error={touched && s.name.trim().length < 2 ? t.required : undefined}>
              <input className="input" autoComplete="name" value={s.name} onChange={(e) => set("name", e.target.value)} required />
            </Field>
            <Field label={t.q.company}>
              <input className="input" autoComplete="organization" value={s.company} onChange={(e) => set("company", e.target.value)} />
            </Field>
            <Field label={t.q.email} error={touched && !emailOk ? t.invalidEmail : undefined}>
              <input className="input" type="email" autoComplete="email" value={s.email} onChange={(e) => set("email", e.target.value)} required />
            </Field>
            <Field label={t.q.phone}>
              <input className="input" type="tel" autoComplete="tel" value={s.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
          </div>
          <div className="mt-6">
            <p className="mb-3 text-[14px] text-muted">{t.q.preferredContact}</p>
            <Choice
              options={contactOptions.map((o) => ({ v: o, l: t.options.preferredContact[o] }))}
              value={s.preferredContact}
              onChange={(v) => set("preferredContact", v)}
            />
          </div>
          <Field label={t.q.message} className="mt-6">
            <textarea className="input min-h-[110px] resize-y" value={s.message} onChange={(e) => set("message", e.target.value)} />
          </Field>
          <p className="mt-4 text-[13px] text-muted">
            <a href={privacyHref} className="underline underline-offset-2 hover:text-ink">
              {t.privacy}
            </a>
          </p>
        </Fieldset>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-md bg-danger/10 px-4 py-3 text-[14px] text-danger">
          {error}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="rounded-[4px] px-4 py-3 text-[15px] text-muted hover:text-ink">
            ← {t.back}
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-2 rounded-[4px] bg-accent px-7 py-4 text-[15px] font-medium text-white transition-all hover:bg-night disabled:opacity-60"
        >
          {step < steps - 1 ? t.next : pending ? t.sending : t.submit}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}

function Fieldset({ legend, hint, error, children }: { legend: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-1 font-display text-[22px] font-semibold leading-tight tracking-[-0.03em] sm:text-[27px]">{legend}</legend>
      {hint ? <p className="mb-5 text-[14px] text-muted">{hint}</p> : <div className="mb-5" />}
      {children}
      {error && <p className="mt-3 text-[13px] text-danger">{error}</p>}
    </fieldset>
  );
}

function Field({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[14px] text-muted">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-[13px] text-danger">{error}</span>}
    </label>
  );
}

function Choice<T extends string | boolean>({
  options,
  value,
  onChange,
}: {
  options: { v: T; l: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const on = value === o.v;
        return (
          <button
            key={String(o.v)}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.v)}
            className={`rounded-[4px] border px-5 py-3 text-[15px] transition-all ${
              on ? "border-accent bg-accent-soft font-medium text-ink" : "border-line hover:border-accent/40"
            }`}
          >
            {o.l}
          </button>
        );
      })}
    </div>
  );
}
