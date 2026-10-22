import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { CopyButton } from "@/components/admin/copy-button";
import { Icon } from "@/components/admin/icons";
import { Badge, Empty, LinkButton, PageHeader, Stat, Table, iconBtn, td, trHover } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { fmtDate, fmtDateTime } from "@/lib/admin/money";
import { mb } from "@/lib/admin/preview-files";
import { previewUrl } from "@/lib/admin/previews";
import { customerName } from "@/lib/admin/queries";

export const metadata = { title: "Vorschauen" };

export default async function PreviewsPage() {
  const p = schema.previews;
  const c = schema.customers;
  const [rows, [sum]] = await Promise.all([
    db().select({ p, c }).from(p).leftJoin(c, eq(c.id, p.customerId)).orderBy(desc(p.createdAt)),
    db()
      .select({ bytes: sql<number>`coalesce(sum(${schema.previewFiles.size}), 0)::float8` })
      .from(schema.previewFiles),
  ]);
  const live = rows.filter((r) => r.p.active && r.p.version > 0);
  const opened = rows.filter((r) => r.p.views > 0).length;
  const sent = rows.filter((r) => r.p.sentAt).length;

  return (
    <>
      <PageHeader
        eyebrow="Verkauf"
        title="Vorschauen"
        sub="Entwürfe für Kunden als Link auf webnova.ch: ZIP hochladen, Link senden, sehen, wann der Kunde ihn öffnet"
        actions={
          <LinkButton href="/admin/vorschauen/neu" icon="upload">
            Neue Vorschau
          </LinkButton>
        }
      />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Online" value={String(live.length)} sub={`${rows.length} total`} icon="globe" />
        <Stat label="Gesendet" value={String(sent)} icon="send" />
        <Stat label="Vom Kunden geöffnet" value={String(opened)} sub={sent ? `von ${sent} gesendeten` : undefined} icon="eye" tone={opened ? "ok" : undefined} />
        <Stat label="Speicher" value={mb(sum?.bytes ?? 0)} sub="Alte Vorschauen löschen gibt Platz frei" icon="box" />
      </div>
      {rows.length === 0 ? (
        <Empty
          icon="monitor"
          action={
            <LinkButton href="/admin/vorschauen/neu" icon="upload">
              Erste Vorschau hochladen
            </LinkButton>
          }
        >
          Noch keine Vorschau. Lade den Entwurf als ZIP hoch, dann gibt es sofort einen Link wie webnova.ch/vorschau/k7m2x9p4qa/, ohne Kundennamen und
          nicht in Google.
        </Empty>
      ) : (
        <Table head={["Vorschau", "Link", "Gesendet", "Geöffnet", ""]} minWidth={860}>
          {rows.map(({ p: v, c: cust }) => {
            const url = previewUrl(v.token);
            const online = v.active && v.version > 0;
            return (
              <tr key={v.id} className={trHover}>
                <td className={td}>
                  <Link href={`/admin/vorschauen/${v.id}`} className="font-medium text-ink hover:text-accent">
                    {v.title}
                  </Link>
                  <p className="text-[12.5px] text-muted">
                    {cust ? customerName(cust) : v.contactName || "Ohne Kunde"} · {fmtDate(v.createdAt)}
                  </p>
                </td>
                <td className={td}>
                  {online ? (
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[12.5px] text-ink-soft">/vorschau/{v.token}/</span>
                      <CopyButton text={url} label="" done="Link kopiert" className={iconBtn} />
                    </span>
                  ) : (
                    <Badge status={v.version === 0 ? "entwurf" : "pausiert"} label={v.version === 0 ? "Upload unvollständig" : "Ausgeschaltet"} />
                  )}
                </td>
                <td className={td}>{v.sentAt ? <span className="text-[13.5px]">{fmtDate(v.sentAt)}</span> : <span className="text-muted">–</span>}</td>
                <td className={td}>
                  {v.views > 0 ? (
                    <span className="text-[13.5px]">
                      <span className="font-medium text-success">{v.views}×</span>
                      <span className="text-muted"> · zuletzt {fmtDateTime(v.lastViewedAt)}</span>
                    </span>
                  ) : (
                    <span className="text-muted">Noch nicht</span>
                  )}
                </td>
                <td className={`${td} text-right`}>
                  {online && (
                    <a href={url} target="_blank" rel="noopener" className={iconBtn} aria-label="Vorschau öffnen" title="Vorschau öffnen">
                      <Icon name="external" className="h-4 w-4" />
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </>
  );
}
