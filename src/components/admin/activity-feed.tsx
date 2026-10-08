import Link from "next/link";
import type { Activity } from "@/db/schema";
import { activityTypes } from "@/db/schema";
import { addActivityAction, deleteActivityAction } from "@/lib/admin/crm-actions";
import { activityTypeLabels } from "@/lib/admin/labels";
import { fmtDateTime } from "@/lib/admin/money";
import { ActionForm, Submit } from "./action-form";
import { ConfirmButton } from "./confirm-button";
import { Icon } from "./icons";
import { Card, iconBtn } from "./ui";

const typeIcon: Record<string, string> = { anruf: "phone", email: "mail", meeting: "users", notiz: "note", system: "flag" };

export function ActivityFeed({
  activities,
  target,
  followUp = false,
  title = "Aktivitäten",
  links,
}: {
  activities: Activity[];
  target: { leadId?: number; customerId?: number; projectId?: number };
  followUp?: boolean;
  title?: string;
  /** optional link labels for activities that belong to other records */
  links?: { projects?: Map<number, string>; leads?: Map<number, string> };
}) {
  return (
    <Card title={title}>
      <ActionForm action={addActivityAction.bind(null, target)} reset className="mb-5 space-y-2">
        <div className="flex flex-wrap gap-2">
          <select name="type" defaultValue="anruf" className="input w-auto" aria-label="Art">
            {activityTypes
              .filter((t) => t !== "system")
              .map((t) => (
                <option key={t} value={t}>
                  {activityTypeLabels[t]}
                </option>
              ))}
          </select>
          <input type="datetime-local" name="occurredAt" className="input w-auto flex-1" aria-label="Zeitpunkt (leer = jetzt)" />
        </div>
        <textarea name="body" rows={2} required placeholder="Was wurde besprochen? Nächste Schritte …" className="input" />
        <div className="flex flex-wrap items-center gap-2">
          {followUp && (
            <label className="flex items-center gap-2 text-[13px] text-muted">
              Nächster Follow-up
              <input type="date" name="followUpAt" className="input w-auto py-1.5" />
            </label>
          )}
          <span className="flex-1" />
          <Submit size="sm">Eintragen</Submit>
        </div>
      </ActionForm>
      {activities.length === 0 ? (
        <p className="text-[14px] text-muted">Noch keine Aktivitäten.</p>
      ) : (
        <ol className="relative space-y-4 border-l border-line pl-5">
          {activities.map((a) => (
            <li key={a.id} className="group relative">
              <span className={`absolute -left-[31px] top-0 grid h-[22px] w-[22px] place-items-center rounded-full border border-line ${a.type === "system" ? "bg-bg text-muted" : "bg-accent-soft text-accent"}`}>
                <Icon name={typeIcon[a.type] ?? "note"} className="h-3 w-3" />
              </span>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12px] text-muted">
                    {activityTypeLabels[a.type]} · {fmtDateTime(a.occurredAt)}
                    {a.projectId && links?.projects?.get(a.projectId) && (
                      <>
                        {" · "}
                        <Link href={`/admin/projekte/${a.projectId}`} className="hover:text-accent">
                          {links.projects.get(a.projectId)}
                        </Link>
                      </>
                    )}
                    {a.leadId && links?.leads?.get(a.leadId) && (
                      <>
                        {" · "}
                        <Link href={`/admin/anfragen/${a.leadId}`} className="hover:text-accent">
                          {links.leads.get(a.leadId)}
                        </Link>
                      </>
                    )}
                  </p>
                  <p className={`mt-0.5 whitespace-pre-line text-[14px] ${a.type === "system" ? "text-ink-soft" : ""}`}>{a.body}</p>
                </div>
                <form action={deleteActivityAction.bind(null, a.id)} className="transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                  <ConfirmButton message="Aktivität löschen?" className={iconBtn}>
                    <Icon name="trash" className="h-3.5 w-3.5" />
                    <span className="sr-only">Löschen</span>
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
