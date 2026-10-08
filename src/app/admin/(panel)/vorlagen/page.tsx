import { asc } from "drizzle-orm";
import Link from "next/link";
import { Card, Empty, LinkButton, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";

export const metadata = { title: "Projektvorlagen" };

export default async function TemplatesPage() {
  const [rows, products] = await Promise.all([
    db().select().from(schema.projectTemplates).orderBy(asc(schema.projectTemplates.name)),
    db().select({ id: schema.products.id, name: schema.products.name }).from(schema.products),
  ]);
  const pname = new Map(products.map((p) => [p.id, p.name]));
  return (
    <>
      <PageHeader
        title="Projektvorlagen"
        sub="Vorlagen legen beim Projektstart Aufgaben mit Fälligkeiten an und füllen die Offerte mit Leistungen."
        actions={
          <LinkButton href="/admin/vorlagen/neu" icon="plus">
            Neue Vorlage
          </LinkButton>
        }
      />
      {rows.length === 0 ? (
        <Empty>Noch keine Vorlagen.</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((t) => (
            <Link key={t.id} href={`/admin/vorlagen/${t.id}`} className="block">
              <Card title={t.name} className="h-full transition-colors hover:border-accent/40">
                {t.description && <p className="mb-3 text-[13px] text-muted">{t.description}</p>}
                <p className="text-[13px]">
                  <span className="font-medium">{t.tasks.length}</span> Aufgaben, davon {t.tasks.filter((x) => x.milestone).length} Meilensteine · Dauer ca. {Math.max(0, ...t.tasks.map((x) => x.offsetDays))} Tage
                </p>
                {t.productIds.length > 0 && <p className="mt-2 text-[12.5px] text-muted">Offerte: {t.productIds.map((id) => pname.get(id)).filter(Boolean).join(", ")}</p>}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
