import type { LeadDetails } from "@/db/schema";
import { describeDetails } from "@/lib/leads/details";
import { Card, KeyValues } from "./ui";

/** Service-specific answers from the request form, grouped per service. */
export function LeadDetailsCard({ details }: { details: LeadDetails | null }) {
  const groups = describeDetails(details);
  if (!groups.length) return null;
  return (
    <Card title="Antworten zu den Leistungen">
      <div className="space-y-5">
        {groups.map((g) => (
          <section key={g.service}>
            <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">{g.title}</h3>
            <KeyValues rows={g.rows} />
          </section>
        ))}
      </div>
    </Card>
  );
}
