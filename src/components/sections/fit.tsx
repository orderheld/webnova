import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { SectionHead } from "./head";

/** "Passen wir zusammen?": honest fit and no-fit lists side by side, no prices. */
export function FitSection({ locale, fit, pos = false }: { locale: Locale; fit?: { yes: string[]; no: string[] }; pos?: boolean }) {
  const s = structure[locale];
  const f = fit ?? (pos ? s.posFit : s.fit);
  const col = (title: string, items: string[], yes: boolean) => (
    <div>
      <h3 className="flex items-center gap-3 border-b border-ink pb-4 font-display text-[20px] font-semibold tracking-[-0.01em]">
        <span aria-hidden="true" className={`grid h-7 w-7 place-items-center rounded-full text-[15px] ${yes ? "bg-accent text-white" : "border border-line text-muted"}`}>
          {yes ? "+" : "−"}
        </span>
        {title}
      </h3>
      <ul>
        {items.map((t) => (
          <li key={t} className={`border-b border-line py-4 text-[16px] leading-relaxed ${yes ? "text-ink" : "text-ink-soft"}`}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <section className="container-x section-y">
      <SectionHead eyebrow={s.fitEyebrow} title={s.fitTitle} lead={s.fitLead} />
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {col(s.fitYesTitle, f.yes, true)}
        {col(s.fitNoTitle, f.no, false)}
      </div>
    </section>
  );
}
