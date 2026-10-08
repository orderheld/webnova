import { Icon } from "@/components/icons";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";

/** True facts about Webnova as a quiet band under the hero. No numbers, ratings or awards. */
export function TrustFacts({ locale, className = "" }: { locale: Locale; className?: string }) {
  const s = structure[locale];
  return (
    <section aria-label={s.trustLabel} className={`border-b border-line bg-bg ${className}`}>
      <ul className="container-x grid gap-x-8 gap-y-6 py-10 sm:grid-cols-2 lg:grid-cols-5">
        {s.trust.map((f) => (
          <li key={f.title} className="flex gap-3.5">
            <span className="icon-tile h-10 w-10">
              <Icon name={f.icon} className="h-[18px] w-[18px]" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold leading-snug text-ink">{f.title}</span>
              <span className="mt-1 block text-[14px] leading-relaxed text-muted">{f.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
