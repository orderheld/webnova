import { HeroCtas } from "@/components/blocks";
import { ContactList, PortraitCard } from "@/components/editorial";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { Kicker } from "./head";

/** The contact person: Ferhat Demir's portrait with direct lines and office hours. Real facts only. */
export function ContactSection({ locale }: { locale: Locale }) {
  const s = structure[locale];
  return (
    <section className="container-x section-y">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <PortraitCard locale={locale} className="mx-auto max-w-[380px] lg:mx-0" />
        </div>
        <div className="lg:col-span-7">
          <Kicker className="mb-5">{s.contactEyebrow}</Kicker>
          <h2 className="h-section">{s.contactTitle}</h2>
          <p className="lead mt-6 max-w-xl">{s.contactText}</p>
          <HeroCtas locale={locale} dark={false} className="mt-8" />
          <ContactList locale={locale} hours className="mt-10" />
        </div>
      </div>
    </section>
  );
}
