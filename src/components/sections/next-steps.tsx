import { HeroCtas } from "@/components/blocks";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { SectionHead } from "./head";

/** "Ihre nächsten Schritte": Erstgespräch, Offerte, Umsetzung, as connected steps on the dark stage. */
export function NextSteps({ locale }: { locale: Locale }) {
  const s = structure[locale];
  return (
    <section className="stage-night section-y text-white">
      <div className="container-x">
        <SectionHead dark eyebrow={s.stepsEyebrow} title={s.stepsTitle} lead={s.stepsLead} />
        <ol className="relative grid gap-4 md:grid-cols-3">
          <span aria-hidden="true" className="absolute left-8 right-8 top-[2.6rem] hidden h-px bg-linear-to-r from-white/40 via-accent-light/40 to-white/10 md:block" />
          {s.steps.map((st, n) => (
            <li key={st.title} className="card-glass relative p-6">
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-white font-display text-[15px] font-semibold text-accent ring-8 ring-night">{n + 1}</span>
              <h3 className="mt-6 font-display text-[21px] font-semibold leading-[1.3]">{st.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-white/70">{st.text}</p>
            </li>
          ))}
        </ol>
        <HeroCtas locale={locale} note className="mt-10" />
      </div>
    </section>
  );
}
