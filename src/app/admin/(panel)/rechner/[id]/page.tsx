import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Calculator } from "@/components/admin/calculator";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader, btn } from "@/components/admin/ui";
import { Icon } from "@/components/admin/icons";
import { db, schema } from "@/db";
import { deleteEstimateAction, estimateToQuoteAction } from "@/lib/admin/actions";
import { customerOptions } from "@/lib/admin/queries";

export default async function EstimateDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ fehler?: string }> }) {
  const id = Number((await params).id);
  const { fehler } = await searchParams;
  if (!Number.isInteger(id)) notFound();
  const [e] = await db().select().from(schema.estimates).where(eq(schema.estimates.id, id));
  if (!e) notFound();
  const customers = await customerOptions();
  return (
    <>
      <PageHeader
        back={{ href: "/admin/rechner", label: "Rechner" }}
        title={e.name}
        sub="Kostenschätzung"
        actions={
          <form action={estimateToQuoteAction.bind(null, e.id)}>
            <button className={btn.dark}>
              <Icon name="file" className="h-4 w-4" /> Offerte daraus erstellen
            </button>
          </form>
        }
      />
      {fehler === "kunde" && (
        <p className="mb-5 rounded-2xl bg-danger/10 px-4 py-3 text-[14px] text-danger">Bitte zuerst einen Kunden wählen und speichern.</p>
      )}
      <Calculator
        id={e.id}
        customers={customers}
        initial={{
          name: e.name,
          customerId: e.customerId,
          leadId: e.leadId,
          hourlyRate: e.data.hourlyRate,
          riskPercent: e.data.riskPercent,
          items: e.data.items,
          custom: e.data.custom,
          marginNote: e.data.marginNote ?? "",
        }}
      />
      <form action={deleteEstimateAction.bind(null, e.id)} className="mt-8">
        <ConfirmButton message="Schätzung löschen?" className={btn.danger}>
          Schätzung löschen
        </ConfirmButton>
      </form>
    </>
  );
}
