import { ButtonLink } from "@/components/button";
import { CtaBand, PageHero, Prose } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { ReferenceCard } from "@/components/reference-card";
import { references } from "@/content/references";
import { legal } from "@/content/legal";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";

export function AboutPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <>
      <PageHero
        eyebrow={d.pages.aboutEyebrow}
        title={d.pages.aboutH1}
        lead={d.pages.aboutLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.about }]}
      />
      <section className="container-x grid gap-12 pb-20 pt-14 md:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose sections={d.pages.aboutSections} />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-28 rounded-[28px] border border-line bg-surface p-8">
            <ul className="space-y-5 text-[16px]">
              {d.home.why.map((w) => (
                <li key={w.title} className="flex gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-night">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{w.title}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href={href(locale, "contact")} variant="dark" className="mt-8 w-full">
              {d.nav.contact}
            </ButtonLink>
          </div>
        </aside>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

export function ReferencesPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <>
      <PageHero
        eyebrow={d.nav.references}
        title={d.pages.referencesH1}
        lead={d.pages.referencesLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.references }]}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={href(locale, "request")}>{d.hero.primary}</ButtonLink>
        </div>
      </PageHero>
      <section className="container-x relative z-10 -mt-10 grid gap-5 pb-24 md:grid-cols-2">
        {references.map((r) => (
          <ReferenceCard key={r.key} r={r} locale={locale} large />
        ))}
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const channels = [
    { icon: "phone", label: d.common.callUs, value: site.phone, href: site.phoneHref },
    { icon: "mail", label: d.common.writeUs, value: site.email, href: `mailto:${site.email}` },
    { icon: "chat", label: d.common.whatsapp, value: site.phone, href: site.whatsappHref },
  ];
  return (
    <>
      <PageHero
        eyebrow={d.pages.contactEyebrow}
        title={d.pages.contactH1}
        lead={d.pages.contactLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.contact }]}
      />
      <section className="container-x relative z-10 -mt-10 grid gap-10 pb-24 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="group flex items-center gap-5 rounded-[24px] border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-night"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-night text-accent transition-colors group-hover:bg-accent group-hover:text-night">
                <Icon name={c.icon} />
              </span>
              <span>
                <span className="block text-[13px] text-muted">{c.label}</span>
                <span className="block font-display text-[19px] font-bold tracking-tight">{c.value}</span>
              </span>
            </a>
          ))}
          <div className="rounded-[24px] bg-night p-6 text-white shadow-[inset_0_0_0_1px_rgba(210,255,40,0.15)]">
            <p className="text-[13px] uppercase tracking-[0.12em] text-white/50">{d.pages.office}</p>
            <p className="mt-3 text-[18px] leading-snug">
              Webnova
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {locale === "fr" ? "Granges (SO)" : `${site.address.city} SO`}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Webnova ${site.address.street} ${site.address.zip} ${site.address.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[14px] text-accent hover:text-white"
            >
              Google Maps <Icon name="arrowUpRight" className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="lg:col-span-7">
          <LeadForm
            locale={locale}
            t={d.form}
            thanksHref={href(locale, "thanks")}
            privacyHref={href(locale, "legal:datenschutz")}
            source="kontakt"
          />
        </div>
      </section>
    </>
  );
}

export function RequestPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -left-32 top-20 -z-10 h-[460px] w-[460px] animate-drift rounded-full bg-accent/20 blur-[130px]" />
      <div className="container-x grid gap-12 pb-24 pt-10 md:pt-16 lg:grid-cols-12">
        <div className="animate-rise lg:col-span-4">
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[13px] text-white/75">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {d.common.free}
          </p>
          <h1 className="display text-[clamp(2.4rem,5vw,4rem)]">{d.form.title}</h1>
          <p className="mt-6 text-[18px] leading-relaxed text-white/70">{d.form.lead}</p>
          <ul className="mt-10 space-y-4 text-[15px] text-white/85">
            {d.lp.trust.map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-night">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 border-t border-white/10 pt-8 text-[15px] text-white/70">
            <a href={site.phoneHref} className="flex items-center gap-3 hover:text-accent">
              <Icon name="phone" className="h-4 w-4 text-accent" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="mt-3 flex items-center gap-3 hover:text-accent">
              <Icon name="mail" className="h-4 w-4 text-accent" /> {site.email}
            </a>
          </div>
        </div>
        <div className="animate-rise [animation-delay:150ms] lg:col-span-8">
          <LeadForm locale={locale} t={d.form} thanksHref={href(locale, "thanks")} privacyHref={href(locale, "legal:datenschutz")} dark />
        </div>
      </div>
    </section>
  );
}

export function ThanksPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute left-1/3 top-1/4 -z-10 h-[460px] w-[460px] animate-drift rounded-full bg-accent/25 blur-[130px]" />
      <div className="container-x flex min-h-[70vh] flex-col items-start justify-center py-24">
        <span className="relative mb-8 grid h-20 w-20 animate-pop place-items-center rounded-full bg-accent text-night">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-40" />
          <Icon name="check" className="relative h-9 w-9" strokeWidth={2.6} />
        </span>
        <h1 className="display max-w-3xl animate-rise text-[clamp(2.4rem,6vw,4.8rem)]">{d.thanks.title}</h1>
        <p className="mt-6 max-w-xl animate-rise text-[19px] leading-relaxed text-white/70 [animation-delay:120ms]">{d.thanks.text}</p>
        <ButtonLink href={href(locale, "home")} className="mt-10">
          {d.thanks.back}
        </ButtonLink>
      </div>
    </section>
  );
}

export function LegalPage({ locale, legalKey }: { locale: Locale; legalKey: keyof typeof legal }) {
  const d = getDict(locale);
  const l = legal[legalKey][locale];
  return (
    <>
      <PageHero title={l.title} crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: l.title }]} />
      <section className="container-x pb-24 pt-10 md:pt-14">
        <div className="max-w-3xl">
          <Prose sections={l.sections} />
        </div>
      </section>
    </>
  );
}
