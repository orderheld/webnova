import { ButtonLink } from "@/components/button";
import { Icon } from "@/components/icons";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hoursLines } from "@/lib/hours";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";

/** The contact person: Ferhat Demir with direct lines and office hours. Real facts only. */
export function ContactSection({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const s = structure[locale];
  const hours = hoursLines(locale);
  return (
    <section className="container-x section-y">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="reveal lg:col-span-6">
          <p className="eyebrow mb-4">{s.contactEyebrow}</p>
          <h2 className="h-section">{s.contactTitle}</h2>
          <p className="lead mt-6 max-w-xl">{s.contactText}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={href(locale, "request")}>{d.hero.primary}</ButtonLink>
            <ButtonLink href={href(locale, "contact")} variant="ghost" arrow={false}>
              {d.nav.contact}
            </ButtonLink>
          </div>
        </div>
        <div className="reveal lg:col-span-5 lg:col-start-8">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-5 border-b border-line bg-bg-2 p-7">
              <span aria-hidden="true" className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent font-display text-[22px] font-semibold text-white">
                FD
              </span>
              <span className="leading-tight">
                <span className="block font-display text-[21px] font-semibold tracking-[-0.01em] text-ink">Ferhat Demir</span>
                <span className="mt-1 block text-[14.5px] text-muted">{s.contactRole}</span>
              </span>
            </div>
            <ul className="space-y-3.5 p-7 text-[15.5px]">
              <li>
                <a href={site.phoneHref} className="flex items-center gap-3 font-medium text-ink transition-colors hover:text-accent">
                  <Icon name="phone" className="h-[18px] w-[18px] text-bright" /> {site.phone}
                </a>
              </li>
              <li>
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-medium text-ink transition-colors hover:text-accent">
                  <Icon name="chat" className="h-[18px] w-[18px] text-bright" /> {d.common.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 font-medium text-ink transition-colors hover:text-accent">
                  <Icon name="mail" className="h-[18px] w-[18px] text-bright" /> {site.email}
                </a>
              </li>
              {hours.length > 0 && (
                <li className="flex items-start gap-3 border-t border-line pt-4 text-ink-soft">
                  <Icon name="spark" className="mt-0.5 h-[18px] w-[18px] shrink-0 text-bright" />
                  <span>
                    <span className="block font-medium text-ink">{s.hoursLabel}</span>
                    {hours.map((h) => (
                      <span key={h} className="block">
                        {h}
                      </span>
                    ))}
                    <span className="block text-muted">{s.closedSunday}</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
