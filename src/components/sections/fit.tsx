import { Icon } from "@/components/icons";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";

/** "Passen wir zusammen?": honest fit and no-fit lists, no prices. */
export function FitSection({ locale, fit, pos = false }: { locale: Locale; fit?: { yes: string[]; no: string[] }; pos?: boolean }) {
  const s = structure[locale];
  const f = fit ?? (pos ? s.posFit : s.fit);
  return (
    <section className="container-x section-y">
      <div className="reveal mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-4">{s.fitEyebrow}</p>
        <h2 className="h-section">{s.fitTitle}</h2>
        <p className="lead mt-6">{s.fitLead}</p>
      </div>
      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        <div className="card reveal p-7 md:p-9">
          <h3 className="font-display text-[20px] font-semibold tracking-[-0.01em]">{s.fitYesTitle}</h3>
          <ul className="mt-6 space-y-4">
            {f.yes.map((t) => (
              <li key={t} className="flex gap-3 text-[16px] leading-relaxed text-ink-soft">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                  <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.6} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal rounded-2xl border border-line bg-bg-2 p-7 md:p-9">
          <h3 className="font-display text-[20px] font-semibold tracking-[-0.01em]">{s.fitNoTitle}</h3>
          <ul className="mt-6 space-y-4">
            {f.no.map((t) => (
              <li key={t} className="flex gap-3 text-[16px] leading-relaxed text-ink-soft">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted">
                  <Icon name="close" className="h-3.5 w-3.5" strokeWidth={2.4} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
