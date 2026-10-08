"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { Locale } from "@/content/types";
import type { Dict } from "@/i18n/dict";
import { submitLead } from "@/lib/leads/actions";
import { serviceOptions } from "@/lib/leads/options";
import { Icon } from "./icons";

type Service = (typeof serviceOptions)[number];

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

const STEPS = 2;

/**
 * Short project request: step 1 picks the service with one tap, step 2 asks for
 * name, optional company, e-mail (required), optional phone and message.
 * Industry pages pass a preset service and start directly on step 2.
 */
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
  /** Sent along with the lead, e.g. on industry pages. */
  presetIndustry?: string;
  dark?: boolean;
}) {
  const router = useRouter();
  const uid = useId();
  const startedAt = useRef(0);
  const topRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [services, setServices] = useState<Service[]>(preset);
  const [step, setStep] = useState(preset.length > 0 ? 1 : 0);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website2, setWebsite2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [pending, startTransition] = useTransition();

  const selected = serviceOptions.filter((o) => services.includes(o));
  const nameOk = name.trim().length >= 2;
  const emailFilled = email.trim() !== "";
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const emailError = emailFilled ? t.invalidEmail : t.required;

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

  function pick(o: Service) {
    setServices([o]);
    go(1);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 0) {
      if (selected.length) go(1);
      return;
    }
    setTouched(true);
    if (!nameOk || !emailOk) {
      // Take the visitor to the first field that needs attention (it may sit above the fold on phones),
      // centred so the sticky header cannot cover it.
      const field = (nameOk ? emailRef : nameRef).current;
      field?.focus({ preventScroll: true });
      field?.scrollIntoView({ block: "center" });
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const res = await submitLead({
          locale,
          source,
          services: selected.length ? selected : ["other"],
          hasWebsite: null,
          companySize: null,
          industry: presetIndustry,
          budget: null,
          timeline: null,
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          preferredContact: null,
          message,
          website2,
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
  const progress = Math.round(((step + 1) / STEPS) * 100);

  const notes = (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[13px] leading-snug text-muted sm:justify-start">
      {t.note.map((n) => (
        <li key={n} className="flex items-center gap-1.5 whitespace-nowrap">
          <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-bright" strokeWidth={2.4} />
          {n}
        </li>
      ))}
    </ul>
  );

  return (
    <form onSubmit={submit} className={`relative rounded-2xl border border-line p-5 shadow-lift sm:p-9 ${card}`} noValidate>
      <div className="mb-6 sm:mb-7">
        <div className="flex items-center justify-between gap-3 text-[13px]">
          <p ref={topRef} tabIndex={-1} aria-live="polite" className="scroll-mt-28 whitespace-nowrap font-semibold uppercase tracking-[0.1em] text-bright outline-none">
            {t.step} {step + 1} {t.of} {STEPS}
          </p>
          <p className="flex items-center gap-1.5 whitespace-nowrap text-muted">
            <Icon name="bolt" className="h-3.5 w-3.5 text-bright" />
            {t.quick}
          </p>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-bright-soft"
          role="progressbar"
          aria-label={`${t.step} ${step + 1} ${t.of} ${STEPS}`}
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
          <input tabIndex={-1} autoComplete="off" value={website2} onChange={(e) => setWebsite2(e.target.value)} />
        </label>
      </div>

      {step === 0 && (
        <>
          <Fieldset legend={t.q.services} hint={t.q.servicesHint}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {serviceOptions.map((o) => {
                const on = services.includes(o);
                return (
                  <button
                    type="button"
                    key={o}
                    aria-pressed={on}
                    onClick={() => pick(o)}
                    className={`group flex min-h-[52px] items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left text-[14px] leading-tight transition-colors last:col-span-2 sm:gap-2.5 sm:px-3.5 sm:text-[15px] sm:last:col-span-1 ${
                      on ? "border-bright bg-bright-soft font-medium text-accent" : "border-line bg-white hover:border-bright/50 hover:bg-bg-2"
                    }`}
                  >
                    <Icon name={serviceIcons[o]} className={`h-[18px] w-[18px] shrink-0 max-[389px]:hidden ${on ? "text-bright" : "text-muted group-hover:text-bright"}`} />
                    <span className="min-w-0 flex-1 hyphens-auto">{t.options.services[o]}</span>
                  </button>
                );
              })}
            </div>
          </Fieldset>
          <div className="mt-6 border-t border-line pt-5">{notes}</div>
        </>
      )}

      {step === 1 && (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {selected.map((o) => (
              <span key={o} className="inline-flex items-center gap-1.5 rounded-full bg-bright-soft px-3 py-1.5 text-[13px] font-medium text-accent">
                <Icon name={serviceIcons[o]} className="h-3.5 w-3.5 text-bright" />
                {t.options.services[o]}
              </span>
            ))}
            <button
              type="button"
              onClick={() => go(0)}
              className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-[13px] text-muted underline decoration-ink/20 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
            >
              {t.change}
            </button>
          </div>

          <Fieldset legend={t.q.contact}>
            <div className="space-y-3">
              <Field id={`${uid}-name`} label={t.q.name} required error={touched && !nameOk ? t.required : undefined}>
                <input
                  ref={nameRef}
                  id={`${uid}-name`}
                  className="input"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-required="true"
                  aria-invalid={touched && !nameOk}
                  aria-describedby={touched && !nameOk ? `${uid}-name-error` : undefined}
                />
              </Field>
              <Field id={`${uid}-company`} label={t.q.company} optional={t.q.optional}>
                <input id={`${uid}-company`} className="input" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id={`${uid}-email`} label={t.q.email} required error={touched && !emailOk ? emailError : undefined}>
                  <input
                    ref={emailRef}
                    id={`${uid}-email`}
                    className="input"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                    aria-invalid={touched && !emailOk}
                    aria-describedby={touched && !emailOk ? `${uid}-email-error` : undefined}
                  />
                </Field>
                <Field id={`${uid}-phone`} label={t.q.phone} optional={t.q.optional}>
                  <input
                    id={`${uid}-phone`}
                    className="input"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field>
              </div>
              <Field id={`${uid}-message`} label={t.q.message} optional={t.q.optional}>
                <textarea
                  id={`${uid}-message`}
                  className="input min-h-[88px] resize-y"
                  rows={3}
                  placeholder={t.q.messagePlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Field>
            </div>
          </Fieldset>

          {error && (
            <p role="alert" className="mt-5 rounded-2xl bg-danger/10 px-4 py-3 text-[14px] text-danger">
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row-reverse sm:items-center sm:justify-between sm:gap-6">
            <button
              type="submit"
              disabled={pending}
              className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-medium text-white shadow-xs transition-colors hover:bg-night disabled:opacity-60 sm:w-auto"
            >
              {pending ? t.sending : t.submit}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            {notes}
          </div>
          <p className="mt-4 text-center text-[12.5px] leading-snug text-muted sm:text-left">
            <a href={privacyHref} className="underline decoration-ink/20 underline-offset-2 hover:text-accent hover:decoration-accent">
              {t.privacy}
            </a>
          </p>
        </>
      )}
    </form>
  );
}

function Fieldset({ legend, hint, children }: { legend: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-1 font-display text-[21px] font-semibold leading-tight tracking-[-0.02em] sm:text-[24px]">{legend}</legend>
      {hint ? <p className="mb-5 text-[14px] text-muted">{hint}</p> : <div className="mb-5" />}
      {children}
    </fieldset>
  );
}

function Field({
  id,
  label,
  error,
  required = false,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium text-ink-soft">
        {label}
        {required && <span className="text-bright"> *</span>}
        {optional && <span className="font-normal text-muted"> ({optional})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
