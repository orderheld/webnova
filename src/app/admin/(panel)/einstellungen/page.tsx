import { ResetData } from "@/components/admin/reset-data";
import { SettingsForm } from "@/components/admin/settings-form";
import { Card, KeyValues, PageHeader } from "@/components/admin/ui";
import { infraRegions } from "@/lib/admin/infra";
import { getSettings } from "@/lib/admin/settings";

export const metadata = { title: "Einstellungen" };

export default async function SettingsPage() {
  const [s, infra] = await Promise.all([getSettings(), infraRegions()]);
  return (
    <>
      <PageHeader
        eyebrow="Einstellungen" title="Einstellungen" sub="Firmendaten, Zahlungsangaben und Textvorlagen für Offerten und Rechnungen" />
      <SettingsForm s={s} />
      <Card title="Server-Standorte" className="mt-6">
        <KeyValues
          rows={infra.map((r) => [
            r.service,
            <span key={r.service}>
              {r.region}
              {r.europe !== null && (
                <span className={`ml-2 text-[12.5px] font-medium ${r.europe ? "text-success" : "text-warn"}`}>
                  {r.europe ? "Europa" : "ausserhalb Europas"}
                </span>
              )}
            </span>,
          ])}
        />
      </Card>
      <ResetData />
    </>
  );
}
