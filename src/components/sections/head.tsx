/** Section heading used by all shared sections: eyebrow, H2 and an optional lead next to it. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  dark = false,
  action,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  dark?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="reveal mb-12 grid gap-6 md:mb-14 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <p className={`${dark ? "eyebrow-light" : "eyebrow"} mb-4`}>{eyebrow}</p>
        <h2 className="h-section">{title}</h2>
      </div>
      {(lead || action) && (
        <div className="md:col-span-5">
          {lead && <p className={dark ? "text-[17px] leading-relaxed text-white/75 md:text-[18px]" : "lead"}>{lead}</p>}
          {action && <div className={lead ? "mt-5" : ""}>{action}</div>}
        </div>
      )}
    </div>
  );
}
