import { desc } from "drizzle-orm";
import { PendingButton } from "@/components/admin/feedback";
import { Card, Empty, LinkButton, PageHeader, btnSm } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { fmtDateTime } from "@/lib/admin/money";
import { clearSpamAction, deleteSpamAction, restoreSpamAction } from "@/lib/admin/spam-actions";
import { SPAM_KEEP_DAYS } from "@/lib/leads/spam";

export const metadata = { title: "Spam-Filter" };


export default async function SpamPage() {
  const rows = await db().select().from(schema.leadSpam).orderBy(desc(schema.leadSpam.createdAt)).limit(300);

  return (
    <>
      <PageHeader
        eyebrow="Verkauf"
        title="Spam-Filter"
        sub={`Vom Filter abgefangene Formulare der Webseite. Ohne Push und ohne Mail, ${SPAM_KEEP_DAYS} Tage aufbewahrt. War etwas echt, mit «Keine Spam» als Anfrage übernehmen.`}
        actions={
          <>
            <LinkButton href="/admin/anfragen" variant="ghost" icon="list">
              Zu den Anfragen
            </LinkButton>
            {rows.length > 0 && (
              <form action={clearSpamAction}>
                <PendingButton confirm="Alle abgefangenen Einträge löschen?" className={btnSm.danger}>
                  Alle löschen
                </PendingButton>
              </form>
            )}
          </>
        }
      />
      {rows.length === 0 ? (
        <Empty icon="shield">Nichts abgefangen. Echte Anfragen landen wie immer unter Leads & Anfragen.</Empty>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {r.name}
                    {r.email && <span className="font-normal text-muted"> · {r.email}</span>}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-muted">
                    {fmtDateTime(r.createdAt)} · {r.form === "website-check" ? "Website-Check" : "Anfrageformular"} · Punkte {r.score}
                  </p>
                  {r.message && <p className="mt-2 line-clamp-4 whitespace-pre-line break-words text-[13.5px] text-ink-soft">{r.message}</p>}
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {r.reasons.map((why) => (
                      <li key={why} className="rounded-full bg-danger-soft px-2.5 py-0.5 text-[12px] text-danger">
                        {why}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form action={restoreSpamAction.bind(null, r.id)}>
                    <PendingButton className={btnSm.ghost}>Keine Spam</PendingButton>
                  </form>
                  <form action={deleteSpamAction.bind(null, r.id)}>
                    <PendingButton className={btnSm.danger}>Löschen</PendingButton>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
