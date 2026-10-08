import { eq } from "drizzle-orm";
import { Calculator } from "@/components/admin/calculator";
import { PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { customerOptions } from "@/lib/admin/queries";
import { getSettings } from "@/lib/admin/settings";
import { label } from "@/lib/leads/options";

export const metadata = { title: "Neue Schätzung" };

export default async function NewEstimate({ searchParams }: { searchParams: Promise<{ kunde?: string; anfrage?: string }> }) {
  const { kunde, anfrage } = await searchParams;
  const [s, customers] = await Promise.all([getSettings(), customerOptions()]);
  const lead = anfrage ? (await db().select().from(schema.leads).where(eq(schema.leads.id, Number(anfrage))))[0] : undefined;
  const hint = lead
    ? `Anfrage: ${lead.company || lead.name} · ${lead.services.map((x) => label("services", x)).join(", ")} · Budget ${label("budget", lead.budget)} · Webseite vorhanden: ${lead.hasWebsite ? "ja" : "nein"}`
    : undefined;
  return (
    <>
      <PageHeader back={{ href: "/admin/rechner", label: "Rechner" }} title="Neue Kostenschätzung" />
      <Calculator
        id={null}
        customers={customers}
        leadHint={hint}
        initial={{
          name: lead ? `${lead.company || lead.name}: ${lead.services.map((x) => label("services", x)).join(", ")}` : "",
          customerId: kunde ? Number(kunde) : (lead?.customerId ?? null),
          leadId: lead?.id ?? null,
          hourlyRate: s.hourlyRate,
          riskPercent: 10,
          items: ["kickoff", "sitemap", "styleguide", "home-design", "setup", "home-dev", "form", "onpage", "testing", "golive", "pm"].map((id) => ({ id, qty: 1 })),
          custom: [],
          marginNote: "",
        }}
      />
    </>
  );
}
