/**
 * Section heading used by all shared sections: a small label, a large H2 and an optional lead or
 * action next to it. `numbered` is kept for compatibility (labels are no longer numbered).
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  dark = false,
  action,
  id,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  dark?: boolean;
  action?: React.ReactNode;
  numbered?: boolean;
  /** id on the H2, for aria-labelledby or anchors. */
  id?: string;
}) {
  return (
    <div className="mb-12 md:mb-14">
      <p className={`${dark ? "kicker-light" : "kicker"} mb-5`}>{eyebrow}</p>
      <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-10">
        <h2 id={id} className={`h-section md:col-span-7 ${lead || action ? "" : "md:col-span-10"}`}>
          {title}
        </h2>
        {(lead || action) && (
          <div className="md:col-span-5 md:pb-1">
            {lead && <p className={dark ? "text-[16.5px] leading-relaxed text-white/75" : "text-[16.5px] leading-relaxed text-ink-soft"}>{lead}</p>}
            {action && <div className={lead ? "mt-5" : ""}>{action}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/** Plain section label for sections that build their own heading layout. */
export function Kicker({ children, dark = false, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return <p className={`${dark ? "kicker-light" : "kicker"} ${className}`}>{children}</p>;
}
