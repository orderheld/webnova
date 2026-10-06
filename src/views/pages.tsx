import { ButtonLink } from "@/components/button";
import { CtaBand, PageHero, Prose } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
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
      <section className="container-x grid gap-12 pb-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose sections={d.pages.aboutSections} />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-28 rounded-[28px] border border-line bg-surface p-8">
            <ul className="space-y-5 text-[16px]">
              {d.home.why.map((w) => (
                <li key={w.title} className="flex gap-3">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent" />
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
      <section className="container-x grid gap-10 pb-24 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="group flex items-center gap-5 rounded-[24px] border border-line bg-surface p-6 transition-colors hover:border-ink"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <Icon name={c.icon} />
              </span>
              <span>
                <span className="block text-[13px] text-muted">{c.label}</span>
                <span className="block text-[19px] font-medium tracking-tight">{c.value}</span>
              </span>
            </a>
          ))}
          <div className="rounded-[24px] bg-night p-6 text-white">
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
              className="mt-5 inline-flex items-center gap-2 text-[14px] text-white/70 hover:text-white"
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
    <section className="container-x grid gap-12 pb-24 pt-10 md:pt-16 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className="eyebrow mb-6">{d.common.free}</p>
        <h1 className="display text-[clamp(2.4rem,5vw,4rem)]">{d.form.title}</h1>
        <p className="mt-6 text-[18px] leading-relaxed text-ink-soft">{d.form.lead}</p>
        <ul className="mt-10 space-y-4 text-[15px]">
          {d.lp.trust.map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon name="check" className="h-4 w-4" />
              </span>
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-10 border-t border-line pt-8 text-[15px] text-ink-soft">
          <a href={site.phoneHref} className="flex items-center gap-3 hover:text-ink">
            <Icon name="phone" className="h-4 w-4" /> {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="mt-3 flex items-center gap-3 hover:text-ink">
            <Icon name="mail" className="h-4 w-4" /> {site.email}
          </a>
        </div>
      </div>
      <div className="lg:col-span-8">
        <LeadForm locale={locale} t={d.form} thanksHref={href(locale, "thanks")} privacyHref={href(locale, "legal:datenschutz")} />
      </div>
    </section>
  );
}

export function ThanksPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
      <span className="mb-8 grid h-16 w-16 animate-pop place-items-center rounded-full bg-success text-white">
        <Icon name="check" className="h-8 w-8" />
      </span>
      <h1 className="display max-w-3xl text-[clamp(2.4rem,6vw,4.8rem)]">{d.thanks.title}</h1>
      <p className="mt-6 max-w-xl text-[19px] leading-relaxed text-ink-soft">{d.thanks.text}</p>
      <ButtonLink href={href(locale, "home")} variant="dark" className="mt-10">
        {d.thanks.back}
      </ButtonLink>
    </section>
  );
}

export function LegalPage({ locale, legalKey }: { locale: Locale; legalKey: keyof typeof legal }) {
  const d = getDict(locale);
  const l = legal[legalKey][locale];
  return (
    <>
      <PageHero title={l.title} crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: l.title }]} />
      <section className="container-x pb-24">
        <div className="max-w-3xl">
          <Prose sections={l.sections} />
        </div>
      </section>
    </>
  );
}
