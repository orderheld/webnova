import { Icon } from "@/components/icons";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";

/** True facts about Webnova as a row of small icon cards under the hero. No numbers, ratings or awards. */
export function TrustFacts({ locale, className = "" }: { locale: Locale; className?: string }) {
  const s = structure[locale];
  return (
    <section aria-label={s.trustLabel} className={`bg-bg-2 ${className}`}>
      <dl className="container-x grid gap-3 py-8 sm:grid-cols-2 md:py-10 lg:grid-cols-5">
        {s.trust.map((f) => (
          <div key={f.title} className="card-soft flex gap-3.5 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bright-soft text-accent">
              <Icon name={f.icon} className="h-5 w-5" />
            </span>
            <div>
              <dt className="text-[14.5px] font-semibold leading-snug text-ink">{f.title}</dt>
              <dd className="mt-1 text-[13px] leading-relaxed text-muted">{f.text}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
