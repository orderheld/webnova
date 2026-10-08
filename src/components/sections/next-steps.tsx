import { ButtonLink } from "@/components/button";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { SectionHead } from "./head";

/** "Ihre nächsten Schritte": Erstgespräch, Offerte, Umsetzung, as the one Schieferblau band of a page. */
export function NextSteps({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const s = structure[locale];
  return (
    <section className="section-y bg-night text-white">
      <div className="container-x">
        <SectionHead dark eyebrow={s.stepsEyebrow} title={s.stepsTitle} lead={s.stepsLead} />
        <ol className="grid gap-x-8 md:grid-cols-3">
          {s.steps.map((st, n) => (
            <li key={st.title} className="border-t border-white/25 pb-8 pt-6">
              <span className="font-display text-[14px] font-semibold tabular-nums text-accent-light">{String(n + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 font-display text-[23px] font-semibold tracking-[-0.015em]">{st.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-white/70">{st.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-3">
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
