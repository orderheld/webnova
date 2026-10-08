import { desc, eq } from "drizzle-orm";
import { ProjectForm } from "@/components/admin/forms";
import { Card, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { customerOptions, templateOptions } from "@/lib/admin/queries";
import { getSettings } from "@/lib/admin/settings";

export const metadata = { title: "Neues Projekt" };

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ kunde?: string; offerte?: string }> }) {
  const sp = await searchParams;
  const [customers, templates, s, quotes] = await Promise.all([
    customerOptions(),
    templateOptions(),
    getSettings(),
    db().select({ id: schema.quotes.id, number: schema.quotes.number, title: schema.quotes.title }).from(schema.quotes).orderBy(desc(schema.quotes.createdAt)).limit(200),
  ]);
  const quote = sp.offerte ? (await db().select().from(schema.quotes).where(eq(schema.quotes.id, Number(sp.offerte))))[0] : undefined;
  return (
    <>
      <PageHeader title="Neues Projekt" sub="Mit Vorlage werden die Aufgaben samt Fälligkeiten automatisch angelegt." back={{ href: "/admin/projekte", label: "Projekte" }} />
      <Card className="max-w-3xl">
        <ProjectForm
          customers={customers}
          templates={templates}
          quotes={quotes.map((q) => ({ id: q.id, name: `${q.number} · ${q.title}` }))}
          defaults={{ customerId: quote?.customerId ?? (sp.kunde ? Number(sp.kunde) : null), quoteId: quote?.id, name: quote?.title, hourlyRate: s.hourlyRate }}
        />
      </Card>
    </>
  );
}
