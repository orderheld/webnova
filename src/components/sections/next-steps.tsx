import { ButtonLink } from "@/components/button";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";

/** "Ihre nächsten Schritte": Erstgespräch, Offerte, Umsetzung, on the dark surface. */
export function NextSteps({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const s = structure[locale];
  return (
    <section className="surface-night section-y text-white">
      <div className="container-x">
        <div className="reveal mb-14 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow-light mb-4">{s.stepsEyebrow}</p>
            <h2 className="h-section">{s.stepsTitle}</h2>
          </div>
          <p className="text-[17px] leading-relaxed text-white/75 md:col-span-5 md:text-[18px]">{s.stepsLead}</p>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {s.steps.map((st, n) => (
            <li key={st.title} className="reveal flex flex-col rounded-2xl border border-white/10 bg-night-2/70 p-7">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white font-display text-[15px] font-semibold text-accent">{n + 1}</span>
              <h3 className="mt-8 font-display text-[21px] font-semibold tracking-[-0.01em]">{st.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-white/70">{st.text}</p>
            </li>
          ))}
        </ol>
        <div className="reveal mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href={href(locale, "request")} variant="accent">
            {s.stepsCta}
          </ButtonLink>
          <ButtonLink href={site.phoneHref} variant="ghostLight" arrow={false} icon="phone">
            {site.phone}
          </ButtonLink>
          <ButtonLink href={site.whatsappHref} variant="ghostLight" arrow={false} icon="chat">
            {d.common.whatsapp}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
