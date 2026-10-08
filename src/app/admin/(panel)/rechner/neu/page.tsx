import { eq } from "drizzle-orm";
import { Calculator } from "@/components/admin/calculator";
import { LinkButton, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { newCalculation } from "@/lib/admin/calculator";
import { customerOptions, routeId } from "@/lib/admin/queries";
import { getCalculatorConfig } from "@/lib/admin/settings";
import { label } from "@/lib/leads/options";

export const metadata = { title: "Neue Kalkulation" };

/** Package suggestion from the lead's services and budget. */
function suggestPackage(lead?: { services: string[]; budget: string | null }) {
  if (!lead) return undefined;
  if (lead.services.includes("shop")) return "shop";
  if (lead.budget === "b1") return "starter";
  if (lead.budget === "b3" || lead.budget === "b4") return "professional";
  return "kmu";
}

export default async function NewEstimate({ searchParams }: { searchParams: Promise<{ kunde?: string; anfrage?: string }> }) {
  const { kunde, anfrage } = await searchParams;
  const leadId = anfrage ? routeId(anfrage) : null;
  const [cfg, customers, lead] = await Promise.all([
    getCalculatorConfig(),
    customerOptions(),
    leadId ? db().select().from(schema.leads).where(eq(schema.leads.id, leadId)).then((r) => r[0]) : Promise.resolve(undefined),
  ]);
  const hint = lead
    ? `Anfrage: ${lead.company || lead.name} · ${lead.services.map((x) => label("services", x)).join(", ") || "keine Leistungen angegeben"} · Budget ${label("budget", lead.budget)} · Webseite vorhanden: ${lead.hasWebsite ? "ja" : "nein"}`
    : undefined;
  return (
    <>
      <PageHeader
        back={{ href: "/admin/rechner", label: "Rechner" }}
        title="Neue Kalkulation"
        sub="Paket wählen, Zusatzleistungen ergänzen, Offerte erstellen"
        actions={
          <LinkButton href="/admin/rechner/preise" variant="ghost" icon="settings">
            Preise bearbeiten
          </LinkButton>
        }
      />
      <Calculator
        id={null}
        config={cfg}
        customers={customers}
        leadHint={hint}
        initial={{
          name: lead ? `Webseite ${lead.company || lead.name}` : "",
          customerId: kunde ? routeId(kunde) : (lead?.customerId ?? null),
          leadId: lead?.id ?? null,
          calc: newCalculation(cfg, suggestPackage(lead)),
        }}
      />
    </>
  );
}
