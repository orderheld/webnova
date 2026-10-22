"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/types";
import { chf, secondLanguagePagePrice } from "@/content/pricing";
import { saveProposalAction } from "@/lib/admin/preview-actions";
import {
  captionMax,
  fitCaption,
  isLanguageRow,
  isPackageRow,
  languageRow,
  packagePages,
  packageRow,
  planFor,
  type Proposal,
  proposalDate,
  proposalTotals,
} from "@/lib/admin/proposal";
import { Spinner, toast } from "./feedback";
import { Icon } from "./icons";
import { Card, Field, btn, btnSm } from "./ui";

/*
 * Form of the PDF proposal of a client preview: the client's own texts, the screenshots and pictures, the price.
 * Everything starts filled in (standard texts, package prices, screenshots); «PDF erstellen» saves and prints it,
 * and the PDF then goes with the e-mail to the client.
 */

type Shot = { id: number; kind: "desktop" | "mobile"; n: number; caption: string };
type Picture = { id: number; path: string; size: number };
type PackageId = Proposal["price"]["packageId"];

const packages: [PackageId, string][] = [
  ["starter", "Starter"],
  ["kmu", "KMU"],
  ["professional", "Professional"],
  ["individuell", "Individuell"],
];

const limits = { desktop: 6, mobile: 5, gallery: 5 };

/** Lists are edited line by line; empty lines and entries left empty are dropped when saving. */
function clean(p: Proposal): Proposal {
  const lines = (xs: string[]) => xs.map((x) => x.trim()).filter(Boolean);
  const some = (...xs: string[]) => xs.some((x) => x.trim());
  return {
    ...p,
    situation: { ...p.situation, boxes: p.situation.boxes.map((b) => ({ ...b, items: lines(b.items) })) },
    concept: { ...p.concept, steps: p.concept.steps.filter((x) => some(x.title, x.text)) },
    structure: {
      ...p.structure,
      groups: p.structure.groups.map((g) => ({ ...g, pages: lines(g.pages) })).filter((g) => some(g.title, ...g.pages)),
      features: lines(p.structure.features),
    },
    plan: { ...p.plan, steps: p.plan.steps.filter((x) => some(x.when, x.title, x.text)) },
    after: { ...p.after, cards: p.after.cards.filter((x) => some(x.title, x.text)) },
    price: {
      ...p.price,
      rows: p.price.rows.filter((r) => some(r.label) || r.amount > 0),
      optional: p.price.optional.filter((r) => some(r.label, r.value)),
    },
    next: { ...p.next, steps: lines(p.next.steps) },
  };
}

/**
 * Pictures that are no longer in the preview (a new version with other file names) and deleted screenshots are
 * dropped, so they neither block the picker nor go missing from the PDF unnoticed.
 */
function withoutStale(p: Proposal, shots: Shot[], pictures: Picture[]): Proposal {
  const shotIds = new Set(shots.map((s) => s.id));
  const paths = new Set(pictures.map((x) => x.path));
  const exists = (ref: string) => (ref.startsWith("shot:") ? shotIds.has(Number(ref.slice(5))) : ref.startsWith("site:") ? paths.has(ref.slice(5)) : true);
  return {
    ...p,
    cover: { ...p.cover, image: exists(p.cover.image) ? p.cover.image : "" },
    gallery: { ...p.gallery, images: p.gallery.images.filter(exists) },
    desktop: p.desktop.filter((s) => shotIds.has(s.fileId)),
    mobile: p.mobile.filter((s) => shotIds.has(s.fileId)),
  };
}

async function post<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "POST" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as { error?: string }).error ?? `Fehler ${res.status}`);
  return json as T;
}

export function ProposalForm({
  id,
  locale,
  initial,
  saved,
  shots: initialShots,
  pictures,
  pdfName,
}: {
  id: number;
  locale: Locale;
  initial: Proposal;
  saved: boolean;
  shots: Shot[];
  pictures: Picture[];
  pdfName: string | null;
}) {
  const router = useRouter();
  const [p, setP] = useState(() => withoutStale(initial, initialShots, pictures));
  const [shots, setShots] = useState(initialShots);
  const [dirty, setDirty] = useState(false);
  const [stored, setStored] = useState(saved);
  const [busy, setBusy] = useState<null | "save" | "shots" | "pdf">(null);
  // languages of the saved price rows: the row of the further languages costs pages × CHF 140 per language
  const [languages, setLanguages] = useState(() => {
    const extra = initial.price.rows.find((r) => isLanguageRow(r.label));
    return extra ? Math.min(3, 1 + Math.round(extra.amount / (packagePages[initial.price.packageId] * secondLanguagePagePrice))) : 1;
  });
  const de = locale === "de";

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (next: (prev: Proposal) => Proposal) => {
    setP(next);
    setDirty(true);
  };
  const patch = <K extends keyof Proposal>(key: K, value: Partial<Proposal[K]>) =>
    update((prev) => ({ ...prev, [key]: { ...(prev[key] as object), ...value } }) as Proposal);

  async function save(quiet = false) {
    const res = await saveProposalAction(id, clean(p));
    if (res.error) {
      toast(res.error, "error");
      return false;
    }
    setDirty(false);
    setStored(true);
    if (!quiet) toast("Gespeichert");
    return true;
  }

  async function run(kind: "save" | "shots" | "pdf") {
    setBusy(kind);
    try {
      if (!(await save(kind !== "save"))) return;
      if (kind === "shots") {
        const res = await post<{ shots: Shot[]; desktop: Proposal["desktop"]; mobile: Proposal["mobile"]; cover: string }>(
          `/api/admin/vorschauen/${id}/vorschlag/screenshots`,
        );
        setShots(res.shots);
        setP((prev) => ({ ...prev, desktop: res.desktop, mobile: res.mobile, cover: { ...prev.cover, image: res.cover } }));
        toast(`${res.shots.length} Screenshots aufgenommen`);
      }
      if (kind === "pdf") {
        await post(`/api/admin/vorschauen/${id}/vorschlag/pdf`);
        router.push(`/admin/vorschauen/${id}`);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Fehler", "error");
    } finally {
      setBusy(null);
    }
  }

  // A new package replaces its row, the language row and the timeline; rows Ferhat added stay.
  const setPackage = (packageId: PackageId) =>
    update((prev) => {
      const pages = packagePages[packageId];
      const own = prev.price.rows.filter((r) => !isPackageRow(r.label) && !isLanguageRow(r.label));
      const lang = languageRow(locale, pages, languages);
      return {
        ...prev,
        price: { ...prev.price, packageId, rows: [packageRow(locale, packageId, pages), ...(lang ? [lang] : []), ...own] },
        plan: { ...planFor(locale, packageId), title: prev.plan.title, need: prev.plan.need },
      };
    });

  // More languages change only the language row.
  const setLanguageCount = (n: number) => {
    setLanguages(n);
    update((prev) => {
      const lang = languageRow(locale, packagePages[prev.price.packageId], n);
      const rows = prev.price.rows.filter((r) => !isLanguageRow(r.label));
      const at = Math.max(0, prev.price.rows.findIndex((r) => isPackageRow(r.label)) + 1);
      return { ...prev, price: { ...prev.price, rows: lang ? [...rows.slice(0, at), lang, ...rows.slice(at)] : rows } };
    });
  };

  const { total, pay } = proposalTotals(p.price);
  const desktopShots = shots.filter((s) => s.kind === "desktop");
  const mobileShots = shots.filter((s) => s.kind === "mobile");
  const img = (fileId: number) => `/api/admin/vorschauen/${id}/bild/${fileId}`;
  const pictureByPath = new Map(pictures.map((x) => [x.path, x]));
  const refImage = (ref: string) => {
    if (ref.startsWith("shot:")) return img(Number(ref.slice(5)));
    const pic = pictureByPath.get(ref.slice(5));
    return pic ? img(pic.id) : null;
  };

  return (
    <div className="space-y-6">
      <p className="rounded-xl bg-bright-soft px-4 py-3 text-[13.5px] leading-relaxed text-ink-soft">
        Alles ist schon ausgefüllt: Standardtexte, Preise aus deinen Paketen und Screenshots der Vorschau. Ergänze die Texte zum Kunden (Ausgangslage,
        Konzept, Seiten) auf {de ? "Deutsch" : "Französisch"}, der Sprache der Vorschau. *Wörter zwischen Sternen* erscheinen im PDF in der Akzentfarbe.
        Leere Abschnitte lässt das PDF weg.
      </p>

      <Card title="Allgemein">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Für" hint="z.B. Herrn Muster oder die Firma">
            <input className="input" maxLength={120} value={p.recipient} onChange={(e) => update((x) => ({ ...x, recipient: e.target.value }))} />
          </Field>
          <Field label="Datum">
            <input type="date" className="input" value={p.date} onChange={(e) => e.target.value && update((x) => ({ ...x, date: e.target.value }))} />
          </Field>
          <Field label="Gültig (Tage)" hint={`bis ${proposalDate(locale, p.date, p.validDays)}`}>
            <input
              type="number"
              min={1}
              max={365}
              className="input"
              value={p.validDays}
              onChange={(e) => update((x) => ({ ...x, validDays: Math.max(1, Math.min(365, Number(e.target.value) || 30)) }))}
            />
          </Field>
          <Field label="Akzentfarbe" hint="am besten die Farbe der Vorschau">
            <span className="flex items-center gap-2">
              <input type="color" className="h-10 w-14 cursor-pointer rounded-lg border border-line bg-surface p-1" value={p.accent} onChange={(e) => update((x) => ({ ...x, accent: e.target.value }))} />
              <code className="text-[13px] text-muted">{p.accent}</code>
            </span>
          </Field>
        </div>
      </Card>

      <Card title="Titelseite">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Field label="Titel" hint="kurz, z.B. «Zeit in *Farbe.*»">
              <input className="input" maxLength={120} value={p.cover.title} onChange={(e) => patch("cover", { title: e.target.value })} />
            </Field>
            <Field label="Text">
              <textarea className="input" rows={3} maxLength={400} value={p.cover.text} onChange={(e) => patch("cover", { text: e.target.value })} />
            </Field>
            <Field label="Hinweis unten rechts">
              <input className="input" maxLength={160} value={p.cover.note} onChange={(e) => patch("cover", { note: e.target.value })} />
            </Field>
          </div>
          <div>
            <span className="mb-1.5 block text-[12.5px] font-medium text-ink-soft">Hintergrundbild</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => patch("cover", { image: "none" })}
                className={`grid aspect-[16/10] place-items-center rounded-lg border bg-night text-[12px] text-white/80 ${p.cover.image === "" || p.cover.image === "none" ? "ring-2 ring-bright ring-offset-2" : "border-line"}`}
              >
                Ohne Bild
              </button>
              {[...pictures.map((x) => `site:${x.path}`), ...desktopShots.map((s) => `shot:${s.id}`)].map((ref) => (
                <button
                  key={ref}
                  type="button"
                  title={ref.slice(5)}
                  onClick={() => patch("cover", { image: ref })}
                  className={`overflow-hidden rounded-lg border border-line ${p.cover.image === ref ? "ring-2 ring-bright ring-offset-2" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={refImage(ref) ?? ""} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Ausgangslage" actions={<span className="text-[12.5px] text-muted">Was der Kunde will und braucht</span>}>
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <Field label="Titel">
              <input className="input" maxLength={160} value={p.situation.title} onChange={(e) => patch("situation", { title: e.target.value })} />
            </Field>
            <Field label="Text">
              <textarea className="input" rows={6} maxLength={1500} value={p.situation.text} onChange={(e) => patch("situation", { text: e.target.value })} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {p.situation.boxes.map((b, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-line p-3">
                <input
                  className="input"
                  maxLength={60}
                  value={b.title}
                  placeholder="Titel"
                  onChange={(e) => patch("situation", { boxes: p.situation.boxes.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })}
                />
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Ein Punkt pro Zeile"
                  value={b.items.join("\n")}
                  onChange={(e) => patch("situation", { boxes: p.situation.boxes.map((x, j) => (j === i ? { ...x, items: e.target.value.split("\n").slice(0, 6) } : x)) })}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Konzept" actions={<span className="text-[12.5px] text-muted">Der Aufbau der Startseite, Abschnitt für Abschnitt</span>}>
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Titel">
              <input className="input" maxLength={160} value={p.concept.title} onChange={(e) => patch("concept", { title: e.target.value })} />
            </Field>
            <Field label="Text">
              <textarea className="input" rows={2} maxLength={600} value={p.concept.text} onChange={(e) => patch("concept", { text: e.target.value })} />
            </Field>
          </div>
          <Repeater
            items={p.concept.steps}
            max={8}
            add={() => ({ title: "", text: "" })}
            onChange={(steps) => patch("concept", { steps })}
            addLabel="Abschnitt hinzufügen"
            render={(s, set, i) => (
              <div className="grid flex-1 gap-2 sm:grid-cols-[200px_1fr]">
                <input className="input" maxLength={60} placeholder={`${i + 1}. Titel`} value={s.title} onChange={(e) => set({ ...s, title: e.target.value })} />
                <input className="input" maxLength={300} placeholder="Was der Abschnitt zeigt" value={s.text} onChange={(e) => set({ ...s, text: e.target.value })} />
              </div>
            )}
          />
          {p.concept.steps.length === 0 && desktopShots.length > 0 && (
            <button
              type="button"
              className={btnSm.ghost}
              onClick={() => patch("concept", { steps: desktopShots.slice(0, 8).map((s) => ({ title: s.caption.slice(0, 60), text: "" })) })}
            >
              <Icon name="list" className="h-3.5 w-3.5" /> Abschnitte aus den Screenshots übernehmen
            </button>
          )}
        </div>
      </Card>

      <Card
        title="Screenshots"
        actions={
          <button type="button" className={btnSm.ghost} disabled={!!busy} onClick={() => run("shots")}>
            {busy === "shots" ? <Spinner className="h-3.5 w-3.5" /> : <Icon name="monitor" className="h-3.5 w-3.5" />}
            {shots.length ? "Neu aufnehmen" : "Screenshots aufnehmen"}
          </button>
        }
      >
        {busy === "shots" ? (
          <p className="flex items-center gap-2 text-[14px] text-ink-soft">
            <Spinner /> Die Vorschau wird am Computer und auf dem Handy fotografiert. Das dauert etwa eine Minute.
          </p>
        ) : shots.length === 0 ? (
          <p className="text-[14px] text-muted">Noch keine Screenshots. «Screenshots aufnehmen» fotografiert die Vorschau Abschnitt für Abschnitt.</p>
        ) : (
          <div className="space-y-6">
            <ShotPicker
              title={`Computer (${p.desktop.length} von max. ${limits.desktop})`}
              shots={desktopShots}
              selected={p.desktop}
              max={limits.desktop}
              img={img}
              wide
              onChange={(desktop) => update((x) => ({ ...x, desktop }))}
            />
            <ShotPicker
              title={`Handy (${p.mobile.length} von max. ${limits.mobile})`}
              shots={mobileShots}
              selected={p.mobile}
              max={limits.mobile}
              img={img}
              onChange={(mobile) => update((x) => ({ ...x, mobile }))}
            />
          </div>
        )}
      </Card>

      <Card title="Bildwelt" actions={<span className="text-[12.5px] text-muted">Bilder der Vorschau als Collage, ohne Bilder fällt die Seite weg</span>}>
        {pictures.length === 0 ? (
          <p className="text-[14px] text-muted">Die Vorschau hat keine Fotos (Bilder ab 40 KB).</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
              {pictures.map((x) => {
                const ref = `site:${x.path}`;
                const at = p.gallery.images.indexOf(ref);
                const full = p.gallery.images.length >= limits.gallery;
                return (
                  <button
                    key={x.id}
                    type="button"
                    title={x.path}
                    disabled={at < 0 && full}
                    onClick={() =>
                      patch("gallery", { images: at >= 0 ? p.gallery.images.filter((r) => r !== ref) : [...p.gallery.images, ref] })
                    }
                    className={`relative overflow-hidden rounded-lg border border-line disabled:opacity-40 ${at >= 0 ? "ring-2 ring-bright ring-offset-2" : ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(x.id)} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                    {at >= 0 && <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-bright text-[11px] font-semibold text-white">{at + 1}</span>}
                  </button>
                );
              })}
            </div>
            <Field label="Text unter der Collage">
              <textarea className="input" rows={2} maxLength={600} value={p.gallery.text} onChange={(e) => patch("gallery", { text: e.target.value })} />
            </Field>
          </div>
        )}
      </Card>

      <Card title="Aufbau" actions={<span className="text-[12.5px] text-muted">Seiten der fertigen Website und Funktionen</span>}>
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <Field label="Titel">
              <input className="input" maxLength={160} value={p.structure.title} onChange={(e) => patch("structure", { title: e.target.value })} />
            </Field>
            <Field label="Text">
              <textarea className="input" rows={3} maxLength={600} value={p.structure.text} onChange={(e) => patch("structure", { text: e.target.value })} />
            </Field>
            <Field label="Funktionen" hint="eine pro Zeile, max. 8">
              <textarea
                className="input"
                rows={6}
                value={p.structure.features.join("\n")}
                onChange={(e) => patch("structure", { features: e.target.value.split("\n").slice(0, 8) })}
              />
            </Field>
          </div>
          <div className="space-y-2">
            <span className="block text-[12.5px] font-medium text-ink-soft">Seiten in Gruppen (eine Seite pro Zeile, werden durchnummeriert)</span>
            <Repeater
              items={p.structure.groups}
              max={4}
              add={() => ({ title: "", pages: [] })}
              onChange={(groups) => patch("structure", { groups })}
              addLabel="Gruppe hinzufügen"
              render={(g, set) => (
                <div className="grid flex-1 gap-2 sm:grid-cols-[180px_1fr]">
                  <input className="input" maxLength={60} placeholder="Gruppe" value={g.title} onChange={(e) => set({ ...g, title: e.target.value })} />
                  <textarea className="input" rows={3} value={g.pages.join("\n")} onChange={(e) => set({ ...g, pages: e.target.value.split("\n").slice(0, 8) })} />
                </div>
              )}
            />
          </div>
        </div>
      </Card>

      <Card title="Investition">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Paket" hint="setzt Paketzeile und Vorgehen neu">
              <select className="input" value={p.price.packageId} onChange={(e) => setPackage(e.target.value as PackageId)}>
                {packages.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sprachen" hint={`jede weitere: ${packagePages[p.price.packageId]} Seiten × ${chf(secondLanguagePagePrice)}`}>
              <select
                className="input"
                value={languages}
                onChange={(e) => setLanguageCount(Number(e.target.value))}
              >
                <option value={1}>1 Sprache</option>
                <option value={2}>2 Sprachen</option>
                <option value={3}>3 Sprachen</option>
              </select>
            </Field>
            <Field label="Bezeichnung des Preises">
              <input className="input" maxLength={60} value={p.price.fixLabel} onChange={(e) => patch("price", { fixLabel: e.target.value })} />
            </Field>
            <Field label="Fixpreis (leer = Total)" hint={
                p.price.fixPrice === null || p.price.fixPrice === total
                  ? undefined
                  : p.price.fixPrice < total
                    ? `${chf(total - p.price.fixPrice)} unter der Berechnung`
                    : `Achtung: ${chf(p.price.fixPrice - total)} über der Berechnung`
              }>
              <input
                type="number"
                min={0}
                step={10}
                className="input"
                value={p.price.fixPrice ?? ""}
                placeholder={String(total)}
                onChange={(e) => patch("price", { fixPrice: e.target.value === "" ? null : Math.max(0, Math.round(Number(e.target.value))) })}
              />
            </Field>
          </div>
          <div>
            <span className="mb-1.5 block text-[12.5px] font-medium text-ink-soft">Berechnung</span>
            <Repeater
              items={p.price.rows}
              max={8}
              add={() => ({ label: "", amount: 0 })}
              onChange={(rows) => patch("price", { rows })}
              addLabel="Zeile hinzufügen"
              render={(r, set) => (
                <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_130px]">
                  <input className="input" maxLength={200} placeholder="Leistung" value={r.label} onChange={(e) => set({ ...r, label: e.target.value })} />
                  <input
                    type="number"
                    min={0}
                    step={10}
                    className="input text-right tabular-nums"
                    value={r.amount}
                    onChange={(e) => set({ ...r, amount: Math.max(0, Math.round(Number(e.target.value) || 0)) })}
                  />
                </div>
              )}
            />
            <p className="mt-2 text-right text-[14px] tabular-nums text-ink">
              Total {chf(total)}
              {p.price.fixPrice !== null && <span className="font-semibold text-bright"> · Kunde zahlt {chf(pay)}</span>}
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Text zum Preis">
              <textarea className="input" rows={3} maxLength={400} value={p.price.text} onChange={(e) => patch("price", { text: e.target.value })} />
            </Field>
            <Field label="Zahlung">
              <textarea className="input" rows={3} maxLength={300} value={p.price.payment} onChange={(e) => patch("price", { payment: e.target.value })} />
            </Field>
          </div>
          <div>
            <span className="mb-1.5 block text-[12.5px] font-medium text-ink-soft">Optional (ohne Betrag im Total)</span>
            <Repeater
              items={p.price.optional}
              max={6}
              add={() => ({ label: "", value: "" })}
              onChange={(optional) => patch("price", { optional })}
              addLabel="Option hinzufügen"
              render={(r, set) => (
                <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_200px]">
                  <input className="input" maxLength={120} placeholder="Leistung" value={r.label} onChange={(e) => set({ ...r, label: e.target.value })} />
                  <input className="input" maxLength={40} placeholder="z.B. separate Offerte" value={r.value} onChange={(e) => set({ ...r, value: e.target.value })} />
                </div>
              )}
            />
          </div>
        </div>
      </Card>

      <Card title="Vorgehen" actions={<span className="text-[12.5px] text-muted">Kommt aus dem Paket, hier anpassbar</span>}>
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Titel">
              <input className="input" maxLength={160} value={p.plan.title} onChange={(e) => patch("plan", { title: e.target.value })} />
            </Field>
            <Field label="Dauer (oben rechts)">
              <input className="input" maxLength={80} value={p.plan.note} onChange={(e) => patch("plan", { note: e.target.value })} />
            </Field>
          </div>
          <Repeater
            items={p.plan.steps}
            max={4}
            add={() => ({ when: "", title: "", text: "" })}
            onChange={(steps) => patch("plan", { steps })}
            addLabel="Schritt hinzufügen"
            render={(s, set) => (
              <div className="grid flex-1 gap-2 sm:grid-cols-[120px_160px_1fr]">
                <input className="input" maxLength={30} placeholder="Woche 1" value={s.when} onChange={(e) => set({ ...s, when: e.target.value })} />
                <input className="input" maxLength={60} placeholder="Titel" value={s.title} onChange={(e) => set({ ...s, title: e.target.value })} />
                <input className="input" maxLength={300} placeholder="Was passiert" value={s.text} onChange={(e) => set({ ...s, text: e.target.value })} />
              </div>
            )}
          />
          <Field label="Was wir vom Kunden brauchen">
            <textarea className="input" rows={2} maxLength={400} value={p.plan.need} onChange={(e) => patch("plan", { need: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card title="Nach der Zusage" actions={<span className="text-[12.5px] text-muted">Was zur fertigen Website dazukommt</span>}>
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Titel">
              <input className="input" maxLength={160} value={p.after.title} onChange={(e) => patch("after", { title: e.target.value })} />
            </Field>
            <Field label="Text">
              <textarea className="input" rows={2} maxLength={600} value={p.after.text} onChange={(e) => patch("after", { text: e.target.value })} />
            </Field>
          </div>
          <Repeater
            items={p.after.cards}
            max={6}
            add={() => ({ title: "", text: "" })}
            onChange={(cards) => patch("after", { cards })}
            addLabel="Punkt hinzufügen"
            render={(c, set) => (
              <div className="grid flex-1 gap-2 sm:grid-cols-[200px_1fr]">
                <input className="input" maxLength={60} placeholder="Titel" value={c.title} onChange={(e) => set({ ...c, title: e.target.value })} />
                <textarea className="input" rows={2} maxLength={300} value={c.text} onChange={(e) => set({ ...c, text: e.target.value })} />
              </div>
            )}
          />
        </div>
      </Card>

      <Card title="Nächste Schritte">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Titel">
            <input className="input" maxLength={160} value={p.next.title} onChange={(e) => patch("next", { title: e.target.value })} />
          </Field>
          <Field label="Schritte" hint="einer pro Zeile, max. 3; darunter folgt dein Kontakt mit Foto">
            <textarea className="input" rows={4} value={p.next.steps.join("\n")} onChange={(e) => patch("next", { steps: e.target.value.split("\n").slice(0, 3) })} />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-3 z-20 rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="mr-auto text-[12.5px] text-muted">
            {busy === "pdf"
              ? "PDF wird erstellt …"
              : dirty
                ? "Nicht gespeicherte Änderungen"
                : !stored
                  ? "Vorschlag noch nicht gespeichert"
                  : pdfName
                    ? `Aktuelles PDF: ${pdfName}`
                    : "Gespeichert"}
          </span>
          <button type="button" className={btn.ghost} disabled={!!busy} onClick={() => run("save")}>
            {busy === "save" && <Spinner />} Speichern
          </button>
          <button type="button" className={btn.dark} disabled={!!busy} onClick={() => run("pdf")}>
            {busy === "pdf" ? <Spinner /> : <Icon name="file" className="h-4 w-4" />} PDF erstellen
          </button>
        </div>
      </div>
    </div>
  );
}

function Repeater<T>({
  items,
  max,
  add,
  onChange,
  render,
  addLabel,
}: {
  items: T[];
  max: number;
  add: () => T;
  onChange: (items: T[]) => void;
  render: (item: T, set: (item: T) => void, index: number) => React.ReactNode;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {render(item, (next) => onChange(items.map((x, j) => (j === i ? next : x))), i)}
          <div className="flex shrink-0 flex-col">
            <button
              type="button"
              aria-label="Nach oben"
              disabled={i === 0}
              className="grid h-5 w-8 place-items-center text-muted hover:text-ink disabled:opacity-30"
              onClick={() => onChange(items.map((x, j) => (j === i - 1 ? items[i] : j === i ? items[i - 1] : x)))}
            >
              <Icon name="up" className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Entfernen"
              className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              <Icon name="trash" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
      {items.length < max && (
        <button type="button" className={btnSm.ghost} onClick={() => onChange([...items, add()])}>
          <Icon name="plus" className="h-3.5 w-3.5" /> {addLabel}
        </button>
      )}
    </div>
  );
}

function ShotPicker({
  title,
  shots,
  selected,
  max,
  img,
  wide = false,
  onChange,
}: {
  title: string;
  shots: Shot[];
  selected: Proposal["desktop"];
  max: number;
  img: (id: number) => string;
  wide?: boolean;
  onChange: (selected: Proposal["desktop"]) => void;
}) {
  const maxCaption = wide ? captionMax.desktop : captionMax.mobile;
  const byId = new Map(selected.map((s) => [s.fileId, s]));
  // keeps the page order of the screenshots
  const toggle = (shot: Shot) =>
    onChange(
      byId.has(shot.id)
        ? selected.filter((s) => s.fileId !== shot.id)
        : shots.filter((s) => byId.has(s.id) || s.id === shot.id).map((s) => byId.get(s.id) ?? { fileId: s.id, caption: fitCaption(s.caption, maxCaption) }),
    );
  return (
    <div>
      <h3 className="mb-2 text-[13px] font-semibold text-ink">{title}</h3>
      <div className={`grid gap-3 ${wide ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-8"}`}>
        {shots.map((shot) => {
          const sel = byId.get(shot.id);
          return (
            <div key={shot.id} className="space-y-1.5">
              <button
                type="button"
                disabled={!sel && selected.length >= max}
                onClick={() => toggle(shot)}
                className={`relative block w-full overflow-hidden rounded-lg border border-line disabled:opacity-40 ${sel ? "ring-2 ring-bright ring-offset-2" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(shot.id)} alt="" loading="lazy" className={`w-full object-cover object-top ${wide ? "aspect-[16/10]" : "aspect-[390/844]"}`} />
                <span className={`absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-md border ${sel ? "border-bright bg-bright text-white" : "border-white/80 bg-black/20"}`}>
                  {sel && <Icon name="check" className="h-3.5 w-3.5" />}
                </span>
              </button>
              {sel && (
                <input
                  className="input py-1 text-[12.5px]"
                  maxLength={maxCaption}
                  value={sel.caption}
                  placeholder="Bildtext"
                  onChange={(e) => onChange(selected.map((s) => (s.fileId === shot.id ? { ...s, caption: e.target.value } : s)))}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
