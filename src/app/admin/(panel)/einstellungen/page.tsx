import { SettingsForm } from "@/components/admin/settings-form";
import { PageHeader } from "@/components/admin/ui";
import { getSettings } from "@/lib/admin/settings";

export const metadata = { title: "Einstellungen" };

export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Einstellungen" sub="Firmendaten, Zahlungsangaben und Textvorlagen für Offerten und Rechnungen" />
      <SettingsForm s={s} />
    </>
  );
}
