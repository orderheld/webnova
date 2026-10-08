import { eq } from "drizzle-orm";
import { Calculator } from "@/components/admin/calculator";
import { LinkButton, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import type { LeadDetails } from "@/db/schema";
import { type CalcLine, type CalculatorConfig, addonLine, newCalculation } from "@/lib/admin/calculator";
import { customerOptions, routeId } from "@/lib/admin/queries";
import { getCalculatorConfig } from "@/lib/admin/settings";
import { label } from "@/lib/leads/options";

export const metadata = { title: "Neue Kalkulation" };

type LeadForCalc = { services: string[]; budget: string | null; details: LeadDetails | null };

/** Package suggestion from the lead's services, page count and budget. */
function suggestPackage(lead?: LeadForCalc) {
  if (!lead) return undefined;
  if (lead.services.includes("shop")) return "shop";
  const pages = lead.details?.webdesign?.pages ?? lead.details?.redesign?.pages;
  if (pages === "10+" || pages === "5-10") return "professional";
  if (pages === "1") return "starter";
  if (lead.budget === "b1") return "starter";
  if (lead.budget === "b3" || lead.budget === "b4") return "professional";
  return "kmu";
}

/** Add-ons that follow directly from the answers in the request form. */
function suggestAddons(cfg: CalculatorConfig, lead?: LeadForCalc): CalcLine[] {
  if (!lead) return [];
  const d = lead.details ?? {};
  const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);
  const features = list(d.webdesign?.features);
  const wanted: [string, number][] = [];
  const languages = list(d.webdesign?.languages).length;
  if (languages > 1) wanted.push(["language", languages - 1]);
  if (features.includes("booking") || features.includes("reservation")) wanted.push(["booking", 1]);
  if (features.includes("blog")) wanted.push(["blog", 1]);
  if (features.includes("shop") && !lead.services.includes("shop")) wanted.push(["shopModule", 1]);
  if (lead.services.includes("seo")) wanted.push(["seo", 1]);
  if (lead.services.includes("branding") && d.branding?.logo !== "keep") wanted.push(["logo", 1]);
  if (lead.services.includes("pos") || list(d.shop?.extras).includes("pos")) wanted.push(["pos", 1]);
  if (lead.services.includes("redesign") && d.redesign?.keepContent !== "new") wanted.push(["relaunch", 1]);
  return wanted.flatMap(([id, qty]) => {
    const a = cfg.addons.find((x) => x.id === id);
    return a ? [addonLine(a, qty)] : [];
  });
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
          calc: { ...newCalculation(cfg, suggestPackage(lead)), addons: suggestAddons(cfg, lead) },
        }}
      />
    </>
  );
}
