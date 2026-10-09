import { PushSettings } from "@/components/admin/push";
import { ResetData } from "@/components/admin/reset-data";
import { SettingsForm } from "@/components/admin/settings-form";
import { Card, KeyValues, PageHeader } from "@/components/admin/ui";
import { infraRegions } from "@/lib/admin/infra";
import { pushDevices, pushPublicKey } from "@/lib/admin/push";
import { getSettings } from "@/lib/admin/settings";

export const metadata = { title: "Einstellungen" };

export default async function SettingsPage() {
  const [s, infra, devices, pushKey] = await Promise.all([getSettings(), infraRegions(), pushDevices(), pushPublicKey()]);
  return (
    <>
      <PageHeader
        eyebrow="Einstellungen" title="Einstellungen" sub="Firmendaten, Zahlungsangaben, Textvorlagen für Offerten und Rechnungen sowie Mitteilungen" />
      <SettingsForm s={s} />
      <PushSettings
        publicKey={pushKey}
        devices={devices.map((d) => ({ ...d, createdAt: d.createdAt.toISOString(), lastSentAt: d.lastSentAt?.toISOString() ?? null }))}
      />
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
