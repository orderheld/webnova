import { asc } from "drizzle-orm";
import { Modal } from "@/components/admin/action-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ProductForm } from "@/components/admin/forms";
import { Icon } from "@/components/admin/icons";
import { Empty, PageHeader, Table, iconBtn, td, tdNum } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { deleteProductAction, duplicateProductAction } from "@/lib/admin/finance-actions";
import { intervalLabels } from "@/lib/admin/labels";
import { chf } from "@/lib/admin/money";

export const metadata = { title: "Leistungen" };

export default async function ProductsPage() {
  const rows = await db().select().from(schema.products).orderBy(asc(schema.products.sortOrder), asc(schema.products.name));
  return (
    <>
      <PageHeader
        eyebrow="Einstellungen"
        title="Leistungen"
        sub="Katalog mit Standardpreisen. Wird in Offerten, Rechnungen, Abos und Projektvorlagen verwendet."
        actions={
          <Modal label="Neue Leistung" title="Neue Leistung" icon="plus" variant="dark" wide>
            <ProductForm />
          </Modal>
        }
      />
      {rows.length === 0 ? (
        <Empty icon="tag">Noch keine Leistungen erfasst.</Empty>
      ) : (
        <Table minWidth={760} head={["Leistung", "Kategorie", "Einheit", { label: "Preis CHF", align: "right" }, "Wiederkehrend", "Status", ""]}>
          {rows.map((p) => (
            <tr key={p.id} className={`hover:bg-bg/60 ${p.active ? "" : "opacity-55"}`}>
              <td className={td}>
                <p className="font-medium">{p.name}</p>
                {p.description && <p className="max-w-[380px] truncate text-[12px] text-muted">{p.description}</p>}
              </td>
              <td className={`${td} text-ink-soft`}>{p.category || "–"}</td>
              <td className={`${td} text-ink-soft`}>{p.unit}</td>
              <td className={tdNum}>{chf(p.price)}</td>
              <td className={td}>{p.interval ? <span className="inline-flex items-center gap-1 text-accent"><Icon name="repeat" className="h-3.5 w-3.5" />{intervalLabels[p.interval]}</span> : <span className="text-muted">einmalig</span>}</td>
              <td className={`${td} text-[13px]`}>{p.active ? "aktiv" : "inaktiv"}</td>
              <td className="whitespace-nowrap pr-3 text-right">
                <span className="inline-flex">
                  <Modal label={<Icon name="edit" className="h-3.5 w-3.5" />} title="Leistung bearbeiten" triggerClassName={iconBtn} wide>
                    <ProductForm product={p} />
                  </Modal>
                  <form action={duplicateProductAction.bind(null, p.id)}>
                    <button className={iconBtn} aria-label="Duplizieren">
                      <Icon name="copy" className="h-3.5 w-3.5" />
                    </button>
                  </form>
                  <form action={deleteProductAction.bind(null, p.id)}>
                    <ConfirmButton message={`«${p.name}» löschen? Bestehende Dokumente bleiben unverändert.`} className={iconBtn}>
                      <Icon name="trash" className="h-3.5 w-3.5" />
                      <span className="sr-only">Löschen</span>
                    </ConfirmButton>
                  </form>
                </span>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
