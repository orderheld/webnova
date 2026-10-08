import { ButtonLink } from "@/components/button";
import { ContactList, PhotoSlot } from "@/components/editorial";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { photo } from "@/lib/photos";
import { Kicker } from "./head";

/** The contact person: Ferhat Demir with direct lines and office hours. Real facts only. */
export function ContactSection({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const s = structure[locale];
  return (
    <section className="container-x section-y">
      <Kicker className="mb-8">{s.contactEyebrow}</Kicker>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="h-section">{s.contactTitle}</h2>
          <p className="lead mt-6 max-w-xl">{s.contactText}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={href(locale, "request")}>{d.hero.primary}</ButtonLink>
            <ButtonLink href={href(locale, "contact")} variant="ghost" arrow={false}>
              {d.nav.contact}
            </ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="mb-8 grid grid-cols-[120px_1fr] items-end gap-6">
            <PhotoSlot photo={photo("founder", locale)} ratio="aspect-[4/5]" fallback="monogram" sizes="120px" />
            <p className="pb-1 leading-tight">
              <span className="block font-display text-[22px] font-semibold tracking-[-0.015em] text-ink">Ferhat Demir</span>
              <span className="meta mt-1 block">{s.contactRole}</span>
            </p>
          </div>
          <ContactList locale={locale} hours />
        </div>
      </div>
    </section>
  );
}
