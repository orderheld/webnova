"use client";

import { unzipSync } from "fflate";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Preview } from "@/db/schema";
import { createPreviewAction, savePreviewAction } from "@/lib/admin/preview-actions";
import { mb, PREVIEW_CHUNK, PREVIEW_MAX_PDF, previewFilesFromZip, type PreviewUploadFile } from "@/lib/admin/preview-files";
import type { Option } from "@/lib/admin/queries";
import { ActionForm, Submit } from "./action-form";
import { Spinner, toast } from "./feedback";
import { Icon } from "./icons";
import { Field, btn, btnSm } from "./ui";

/*
 * Upload of a client preview: the browser unpacks the ZIP, checks it and sends every file in 1 MB parts to
 * /api/admin/vorschauen/<id>/dateien; /fertig then switches the link to the new files. Nothing goes live half done.
 */

type Progress = { done: number; total: number; label: string } | null;

async function api<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const json = res.status === 204 ? {} : await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as { error?: string }).error ?? `Fehler ${res.status}`);
  return json as T;
}

/**
 * Sends the files of one upload and finishes it. Four parts at a time, each tried up to three times; when one part
 * fails for good, the other workers stop too, so nothing keeps uploading behind the error message.
 */
async function uploadFiles(id: number, kind: "site" | "pdf", files: PreviewUploadFile[], onProgress: (done: number, total: number) => void) {
  const json = { "Content-Type": "application/json" };
  const started = await api<{ version: number; files: { id: number; path: string; chunks: number }[] }>(`/api/admin/vorschauen/${id}/dateien`, {
    method: "POST",
    headers: json,
    body: JSON.stringify({ kind, files: files.map((f) => ({ path: f.path, size: f.data.length })) }),
  });
  const byPath = new Map(files.map((f) => [f.path, f.data]));
  const parts = started.files.flatMap((f) => Array.from({ length: f.chunks }, (_, seq) => ({ fileId: f.id, seq, data: byPath.get(f.path)! })));
  const total = files.reduce((n, f) => n + f.data.length, 0);
  let done = 0;
  onProgress(0, total);
  let next = 0;
  const abort = new AbortController();
  const worker = async () => {
    while (next < parts.length && !abort.signal.aborted) {
      const part = parts[next++];
      const body = part.data.slice(part.seq * PREVIEW_CHUNK, (part.seq + 1) * PREVIEW_CHUNK);
      for (let attempt = 1; ; attempt++) {
        try {
          await api(`/api/admin/vorschauen/${id}/dateien/${part.fileId}/${part.seq}`, { method: "PUT", body, signal: abort.signal });
          break;
        } catch (err) {
          if (abort.signal.aborted) return;
          if (attempt >= 3) {
            abort.abort();
            throw err;
          }
          await new Promise((r) => setTimeout(r, attempt * 1500));
        }
      }
      done += body.length;
      if (!abort.signal.aborted) onProgress(done, total);
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, parts.length) }, worker));
  await api(`/api/admin/vorschauen/${id}/fertig`, {
    method: "POST",
    headers: json,
    body: JSON.stringify(kind === "site" ? { kind, version: started.version } : { kind, fileId: started.files[0].id }),
  });
}

/** Unpacks and checks the ZIP in the browser. */
async function readZip(file: File) {
  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
  } catch {
    throw new Error("Die Datei ist kein gültiges ZIP.");
  }
  const r = previewFilesFromZip(entries);
  if ("error" in r) throw new Error(r.error);
  return r.files;
}

async function readPdf(file: File): Promise<PreviewUploadFile[]> {
  if (!/\.pdf$/i.test(file.name)) throw new Error("Bitte ein PDF wählen.");
  if (file.size > PREVIEW_MAX_PDF) throw new Error(`Das PDF ist ${mb(file.size)} gross, erlaubt sind ${mb(PREVIEW_MAX_PDF)}.`);
  const name = file.name.replace(/[\\/]/g, "_").replace(/^\.+/, "") || "Vorschlag.pdf";
  return [{ path: name, data: new Uint8Array(await file.arrayBuffer()) }];
}

function ProgressBar({ p }: { p: Progress }) {
  if (!p) return null;
  const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex justify-between text-[12.5px] text-muted">
        <span>{p.label}</span>
        <span className="tabular-nums">
          {mb(p.done)} von {mb(p.total)} · {pct} %
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg">
        <div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Name, client and contact of a preview; shared by the new-preview form and «Bearbeiten». */
export function PreviewFields({ p, customers }: { p?: Preview; customers: Option[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Name (intern)" hint="Erscheint nie im Link, z.B. die Marke des Entwurfs" className="sm:col-span-2">
        <input name="title" required maxLength={120} defaultValue={p?.title} placeholder="z.B. Muster Uhren" className="input" />
      </Field>
      <Field label="Kunde (optional)">
        <select name="customerId" defaultValue={p?.customerId ?? ""} className="input">
          <option value="">Noch kein Kunde</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Sprache der Texte an den Kunden">
        <select name="language" defaultValue={p?.language ?? "de"} className="input">
          <option value="de">Deutsch</option>
          <option value="fr">Französisch</option>
        </select>
      </Field>
      <Field label="Anrede" hint="Für E-Mail und WhatsApp, z.B. «Herr Muster»">
        <input name="contactName" maxLength={120} defaultValue={p?.contactName} className="input" />
      </Field>
      <Field label="E-Mail des Kunden">
        <input name="contactEmail" type="email" maxLength={200} defaultValue={p?.contactEmail} className="input" />
      </Field>
      <Field label="Handy (für WhatsApp)">
        <input name="contactPhone" type="tel" maxLength={60} defaultValue={p?.contactPhone} className="input" />
      </Field>
      <Field label="Notiz (intern)" className="sm:col-span-2">
        <textarea name="note" rows={2} maxLength={2000} defaultValue={p?.note} className="input" />
      </Field>
    </div>
  );
}

export function PreviewEditForm({ p, customers }: { p: Preview; customers: Option[] }) {
  return (
    <ActionForm action={savePreviewAction.bind(null, p.id)} className="space-y-5">
      <PreviewFields p={p} customers={customers} />
      <div className="flex justify-end">
        <Submit>Speichern</Submit>
      </div>
    </ActionForm>
  );
}

/** Admin > Vorschauen > Neu: details, ZIP and optional PDF; opens the preview page with the link once online. */
export function PreviewNewForm({ customers }: { customers: Option[] }) {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // After a failed upload the next try continues with the same preview instead of creating a second one.
  const created = useRef<{ id: number; siteDone: boolean } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const zip = fd.get("zip");
    const pdf = fd.get("pdf");
    fd.delete("zip");
    fd.delete("pdf");
    if (!(zip instanceof File) || zip.size === 0) return setError("Bitte das ZIP der Vorschau wählen.");
    setError(null);
    setBusy(true);
    try {
      setProgress({ done: 0, total: zip.size, label: "ZIP wird geprüft …" });
      const files = await readZip(zip);
      const pdfFiles = pdf instanceof File && pdf.size > 0 ? await readPdf(pdf) : null;
      if (!created.current) {
        const res = await createPreviewAction(fd);
        if (!res.id) throw new Error(res.error ?? "Vorschau konnte nicht angelegt werden.");
        created.current = { id: res.id, siteDone: false };
      }
      const { id } = created.current;
      if (!created.current.siteDone) {
        await uploadFiles(id, "site", files, (done, total) => setProgress({ done, total, label: "Vorschau wird hochgeladen …" }));
        created.current.siteDone = true;
      }
      if (pdfFiles) await uploadFiles(id, "pdf", pdfFiles, (done, total) => setProgress({ done, total, label: "PDF wird hochgeladen …" }));
      router.push(`/admin/vorschauen/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <PreviewFields customers={customers} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vorschau als ZIP" hint="Ordner mit index.html, Bildern, Schriften, Videos; bis 80 MB entpackt">
          <input name="zip" type="file" accept=".zip,application/zip" required className="input py-2" />
        </Field>
        <Field label="PDF-Vorschlag (optional)" hint="Wird mit der E-Mail mitgeschickt; später austauschbar">
          <input name="pdf" type="file" accept=".pdf,application/pdf" className="input py-2" />
        </Field>
      </div>
      <ProgressBar p={progress} />
      {error && <p className="text-[13.5px] text-danger">{error}</p>}
      <div className="flex justify-end">
        <button disabled={busy} aria-busy={busy || undefined} className={btn.dark}>
          {busy ? <Spinner className="h-3.5 w-3.5" /> : <Icon name="upload" className="h-4 w-4" />}
          {busy ? "Wird hochgeladen …" : "Hochladen und Link erstellen"}
        </button>
      </div>
    </form>
  );
}

/** «Neue Version» (ZIP, same link) or «PDF hochladen» on the preview page. */
export function PreviewFileButton({ id, kind, label }: { id: number; kind: "site" | "pdf"; label: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<Progress>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    try {
      setProgress({ done: 0, total: file.size, label: "Wird geprüft …" });
      const files = kind === "site" ? await readZip(file) : await readPdf(file);
      await uploadFiles(id, kind, files, (done, total) => setProgress({ done, total, label: "Wird hochgeladen …" }));
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : String(err), "error");
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={input}
        type="file"
        accept={kind === "site" ? ".zip,application/zip" : ".pdf,application/pdf"}
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      <button type="button" disabled={!!progress} onClick={() => input.current?.click()} className={btnSm.ghost}>
        {progress ? <Spinner className="h-3.5 w-3.5" /> : <Icon name="upload" className="h-3.5 w-3.5" />} {label}
      </button>
      <ProgressBar p={progress} />
    </div>
  );
}
