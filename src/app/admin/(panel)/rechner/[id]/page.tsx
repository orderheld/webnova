import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Calculator } from "@/components/admin/calculator";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { LinkButton, PageHeader, btn } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { normalizeCalc } from "@/lib/admin/calculator";
import { deleteEstimateAction } from "@/lib/admin/calculator-actions";
import { fmtDateTime } from "@/lib/admin/money";
import { customerOptions, routeId } from "@/lib/admin/queries";
import { getCalculatorConfig } from "@/lib/admin/settings";

export default async function EstimateDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  if (!id) notFound();
  const [[e], customers, cfg] = await Promise.all([db().select().from(schema.estimates).where(eq(schema.estimates.id, id)), customerOptions(), getCalculatorConfig()]);
  if (!e) notFound();
  return (
    <>
      <PageHeader
        back={{ href: "/admin/rechner", label: "Rechner" }}
        title={e.name}
        sub={`Kalkulation · zuletzt gespeichert ${fmtDateTime(e.updatedAt)}`}
        actions={
          <LinkButton href="/admin/rechner/preise" variant="ghost" icon="settings">
            Preise bearbeiten
          </LinkButton>
        }
      />
      <Calculator
        id={e.id}
        config={cfg}
        customers={customers}
        initial={{ name: e.name, customerId: e.customerId, leadId: e.leadId, calc: normalizeCalc(e.data, cfg, { total: e.total, hours: e.totalHours }) }}
      />
      <form action={deleteEstimateAction.bind(null, e.id)} className="mt-8">
        <ConfirmButton message={`Kalkulation «${e.name}» löschen?`} className={btn.danger}>
          Kalkulation löschen
        </ConfirmButton>
      </form>
    </>
  );
}
