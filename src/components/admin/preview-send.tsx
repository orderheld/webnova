"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { sendPreviewAction } from "@/lib/admin/preview-actions";
import { Spinner } from "./feedback";
import { Icon } from "./icons";
import { Field, btn } from "./ui";

/** E-mail with the preview link (and the PDF) to the client; sent only with «Jetzt senden». */
export function PreviewSendDialog({
  id,
  draft,
  sentAt,
  pdfName,
}: {
  id: number;
  draft: { to: string; subject: string; text: string };
  sentAt: string | null;
  pdfName: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  function submit(fd: FormData) {
    setError(null);
    start(async () => {
      const res = await sendPreviewAction(id, fd);
      if (res.error) return setError(res.error);
      setDone(true);
      router.refresh();
      setTimeout(() => setOpen(false), 1200);
    });
  }

  return (
    <>
      <button type="button" onClick={() => (setOpen(true), setDone(false))} className={btn.accent}>
        <Icon name="send" className="h-4 w-4" /> {sentAt ? "Erneut per E-Mail senden" : "Per E-Mail senden"}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <form
            action={submit}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-2xl bg-surface p-5 shadow-lift"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold tracking-tight">Vorschau senden</h2>
              <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-bg" aria-label="Schliessen">
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="An">
                <input name="to" type="email" required defaultValue={draft.to} className="input" />
              </Field>
              <Field label="Kopie an (optional)">
                <input name="cc" type="email" className="input" />
              </Field>
            </div>
            <Field label="Betreff">
              <input name="subject" required defaultValue={draft.subject} className="input" />
            </Field>
            <Field label="Nachricht">
              <textarea name="text" rows={12} required defaultValue={draft.text} className="input [font-feature-settings:'calt'_0]" />
            </Field>
            {pdfName ? (
              <label className="flex items-center gap-3 text-[14px]">
                <input type="checkbox" name="pdf" defaultChecked className="h-[18px] w-[18px]" /> PDF anhängen: {pdfName}
              </label>
            ) : (
              <p className="text-[13px] text-muted">Kein PDF hinterlegt, die E-Mail geht nur mit dem Link.</p>
            )}
            <p className="text-[13px] text-muted">Unter dem Absatz mit dem Link steht in der E-Mail ein Knopf «Vorschau öffnen».</p>
            {error && <p className="text-[13px] text-danger">{error}</p>}
            {done && <p className="text-[13px] text-success">Gesendet.</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className={btn.ghost}>
                Abbrechen
              </button>
              <button disabled={pending} aria-busy={pending || undefined} className={btn.accent}>
                {pending && <Spinner className="h-3.5 w-3.5" />}
                {pending ? "Wird gesendet …" : "Jetzt senden"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
