import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ExpenseForm } from "@/components/admin/forms";
import { Icon } from "@/components/admin/icons";
import { Card, PageHeader, btn } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { deleteExpenseAction, duplicateExpenseAction } from "@/lib/admin/finance-actions";
import { chf, fmtDate } from "@/lib/admin/money";
import { allProjectOptions, customerOptions, routeId } from "@/lib/admin/queries";

export default async function ExpenseDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  if (!id) notFound();
  const [e] = await db().select().from(schema.expenses).where(eq(schema.expenses.id, id));
  if (!e) notFound();
  const [customers, projects] = await Promise.all([customerOptions(), allProjectOptions()]);
  return (
    <>
      <PageHeader
        back={{ href: "/admin/ausgaben", label: "Ausgaben" }}
        title={e.description}
        sub={`${fmtDate(e.date)} · CHF ${chf(e.amount)}`}
        actions={
          <>
            {e.receiptUrl && (
              <a href={e.receiptUrl} target="_blank" rel="noreferrer" className={btn.ghost}>
                <Icon name="external" className="h-4 w-4" /> Beleg
              </a>
            )}
            <form action={duplicateExpenseAction.bind(null, e.id)}>
              <button className={btn.ghost}>
                <Icon name="copy" className="h-4 w-4" /> Duplizieren
              </button>
            </form>
          </>
        }
      />
      <Card className="max-w-4xl">
        <ExpenseForm expense={e} customers={customers} projects={projects} />
        <form action={deleteExpenseAction.bind(null, e.id)} className="mt-6 border-t border-line pt-4">
          <ConfirmButton message="Ausgabe löschen?" className={btn.danger}>
            Ausgabe löschen
          </ConfirmButton>
        </form>
      </Card>
    </>
  );
}
