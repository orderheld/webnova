import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { CustomerForm } from "@/components/admin/customer-form";
import { Badge, Card, Empty, LinkButton, PageHeader, btn } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { deleteCustomerAction } from "@/lib/admin/actions";
import { chf, fmtDate } from "@/lib/admin/money";

export default async function CustomerDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ fehler?: string }> }) {
  const id = Number((await params).id);
  const { fehler } = await searchParams;
  if (!Number.isInteger(id)) notFound();
  const [c] = await db().select().from(schema.customers).where(eq(schema.customers.id, id));
  if (!c) notFound();
  const [quotes, invoices, estimates] = await Promise.all([
    db().select().from(schema.quotes).where(eq(schema.quotes.customerId, id)).orderBy(desc(schema.quotes.createdAt)),
    db().select().from(schema.invoices).where(eq(schema.invoices.customerId, id)).orderBy(desc(schema.invoices.createdAt)),
    db().select().from(schema.estimates).where(eq(schema.estimates.customerId, id)).orderBy(desc(schema.estimates.updatedAt)),
  ]);
  const name = c.company || [c.firstName, c.lastName].filter(Boolean).join(" ");
  return (
    <>
      <PageHeader
        title={name}
        sub={`Kunde seit ${fmtDate(c.createdAt)}`}
        actions={
          <>
            <LinkButton href={`/admin/rechner/neu?kunde=${c.id}`} variant="ghost" icon="calc">
              Kosten schätzen
            </LinkButton>
            <LinkButton href={`/admin/offerten/neu?kunde=${c.id}`} variant="ghost" icon="file">
              Offerte
            </LinkButton>
            <LinkButton href={`/admin/rechnungen/neu?kunde=${c.id}`} icon="receipt">
              Rechnung
            </LinkButton>
          </>
        }
      />
      {fehler === "dokumente" && (
        <p className="mb-5 rounded-2xl bg-danger/10 px-4 py-3 text-[14px] text-danger">
          Kunde kann nicht gelöscht werden, solange Offerten oder Rechnungen existieren.
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card title="Stammdaten" className="lg:col-span-3">
          <CustomerForm customer={c} />
          <form action={deleteCustomerAction.bind(null, c.id)} className="mt-6 border-t border-line pt-4">
            <ConfirmButton message="Kunde endgültig löschen?" className={btn.danger}>
              Kunde löschen
            </ConfirmButton>
          </form>
        </Card>
        <div className="space-y-6 lg:col-span-2">
          <DocList title="Offerten" items={quotes.map((q) => ({ href: `/admin/offerten/${q.id}`, number: q.number, title: q.title, total: q.total, status: q.status, date: q.issueDate }))} />
          <DocList title="Rechnungen" items={invoices.map((q) => ({ href: `/admin/rechnungen/${q.id}`, number: q.number, title: q.title, total: q.total, status: q.status, date: q.issueDate }))} />
          <Card title="Kostenschätzungen">
            {estimates.length === 0 ? (
              <p className="text-[14px] text-muted">Keine.</p>
            ) : (
              <ul className="-my-2 divide-y divide-line">
                {estimates.map((e) => (
                  <li key={e.id}>
                    <Link href={`/admin/rechner/${e.id}`} className="flex justify-between gap-3 py-2.5 text-[14px] hover:text-accent">
                      <span className="truncate">{e.name}</span>
                      <span className="tabular-nums text-muted">CHF {chf(e.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

function DocList({ title, items }: { title: string; items: { href: string; number: string; title: string; total: number; status: string; date: string }[] }) {
  return (
    <Card title={title}>
      {items.length === 0 ? (
        <Empty>Keine {title}.</Empty>
      ) : (
        <ul className="-my-2 divide-y divide-line">
          {items.map((i) => (
            <li key={i.href}>
              <Link href={i.href} className="flex items-center justify-between gap-3 py-2.5 hover:opacity-80">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium">{i.number}</p>
                  <p className="truncate text-[12px] text-muted">
                    {fmtDate(i.date)} · {i.title}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[13px] tabular-nums">{chf(i.total)}</span>
                  <Badge status={i.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
