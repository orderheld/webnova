import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { TemplateEditor } from "@/components/admin/template-editor";
import { PageHeader, btn } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { deleteTemplateAction } from "@/lib/admin/project-actions";
import { routeId } from "@/lib/admin/queries";

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const raw = (await params).id;
  const isNew = raw === "neu";
  const id = isNew ? null : routeId(raw);
  if (!isNew && !id) notFound();
  const [tpl] = id ? await db().select().from(schema.projectTemplates).where(eq(schema.projectTemplates.id, id)) : [];
  if (id && !tpl) notFound();
  const products = await db()
    .select({ id: schema.products.id, name: schema.products.name, price: schema.products.price, interval: schema.products.interval })
    .from(schema.products)
    .orderBy(asc(schema.products.sortOrder));
  return (
    <>
      <PageHeader back={{ href: "/admin/vorlagen", label: "Projektvorlagen" }} title={tpl ? tpl.name : "Neue Vorlage"} />
      <TemplateEditor
        id={id}
        products={products}
        initial={tpl ? { name: tpl.name, description: tpl.description ?? "", tasks: tpl.tasks, productIds: tpl.productIds } : { name: "", description: "", tasks: [{ title: "Kick-off", offsetDays: 0 }], productIds: [] }}
      />
      {tpl && (
        <form action={deleteTemplateAction.bind(null, tpl.id)} className="mt-8">
          <ConfirmButton message="Vorlage löschen? Bestehende Projekte bleiben unverändert." className={btn.danger}>
            Vorlage löschen
          </ConfirmButton>
        </form>
      )}
    </>
  );
}
