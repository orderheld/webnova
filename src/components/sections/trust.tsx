import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";

/** True facts about Webnova as a quiet fact line under the hero. No numbers, ratings or awards. */
export function TrustFacts({ locale, className = "" }: { locale: Locale; className?: string }) {
  const s = structure[locale];
  return (
    <section aria-label={s.trustLabel} className={`bg-bg ${className}`}>
      <dl className="container-x grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
        {s.trust.map((f, i) => (
          <div key={f.title} className="border-b border-line py-6 lg:border-b-0 lg:py-10">
            <dt className="flex items-baseline gap-3 text-[15px] font-semibold leading-snug text-ink">
              <span className="font-display text-[12.5px] tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
              {f.title}
            </dt>
            <dd className="mt-2 pl-[1.85rem] text-[14px] leading-relaxed text-muted">{f.text}</dd>
          </div>
        ))}
      </dl>
      <div className="container-x">
        <div className="border-b border-line" />
      </div>
    </section>
  );
}
