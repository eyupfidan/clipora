"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { createNote } from "@/app/actions";
import { ColorPicker } from "@/components/ColorPicker";
import { useLanguage } from "@/components/LanguageProvider";
import { LabelPicker } from "@/components/LabelPicker";
import { NoteToolbar } from "@/components/NoteToolbar";
import { DEFAULT_NOTE_COLOR } from "@/lib/colors";
import type { LabelSummary } from "@/types/note";

type NoteEditorProps = {
  labels: LabelSummary[];
};

export function NoteEditor({ labels }: NoteEditorProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<string>(DEFAULT_NOTE_COLOR);
  const [isPinned, setIsPinned] = useState(false);
  const [labelNames, setLabelNames] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  function reset() {
    setTitle("");
    setContent("");
    setColor(DEFAULT_NOTE_COLOR);
    setIsPinned(false);
    setLabelNames([]);
    setError("");
  }

  function saveAndCollapse() {
    const hasContent = title.trim() || content.trim();
    if (!hasContent) {
      setError("");
      return;
    }

    startTransition(async () => {
      const result = await createNote({ title, content, color, isPinned, labelNames });
      if (!result.ok) {
        setError(result.error ?? t("saveError"));
        return;
      }
      reset();
      setExpanded(false);
      router.refresh();
    });
  }

  return (
    <div
      ref={wrapperRef}
      className="mx-auto mb-8 max-w-2xl rounded-lg border border-[#e0e0e0] bg-white shadow-keep"
      style={{ backgroundColor: color }}
    >
      {!expanded ? (
        <button
          type="button"
          className="block w-full px-4 py-3 text-left text-[#5f6368]"
          onClick={() => setExpanded(true)}
        >
          {t("takeNote")}
        </button>
      ) : (
        <div className="space-y-2 p-4">
          <div className="flex items-start gap-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("title")}
              className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[#5f6368]"
              autoFocus
            />
            <NoteToolbar isPinned={isPinned} onPin={() => setIsPinned((value) => !value)} compact />
          </div>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={t("takeNote")}
            rows={4}
            className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-[#5f6368]"
          />
          <LabelPicker availableLabels={labels} selectedNames={labelNames} onChange={setLabelNames} />
          <ColorPicker value={color} onChange={setColor} />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#5f6368]">{isPending ? t("saving") : ""}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded px-5 py-2 text-sm font-medium hover:bg-black/10"
                onClick={() => {
                  reset();
                  setExpanded(false);
                }}
                disabled={isPending}
              >
                {t("close")}
              </button>
              <button
                type="button"
                className="rounded bg-[#fbbc04] px-5 py-2 text-sm font-medium text-[#202124] hover:bg-[#f9ab00] disabled:opacity-60"
                onClick={saveAndCollapse}
                disabled={isPending || (!title.trim() && !content.trim())}
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
