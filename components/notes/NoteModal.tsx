"use client";

import { useRouter } from "next/navigation";
import { ListChecks } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState, useTransition } from "react";
import {
  hardDeleteNote,
  setNoteArchived,
  setNoteDeleted,
  setNotePinned,
  updateNote
} from "@/app/actions/note-actions";
import { ChecklistEditor } from "@/components/notes/ChecklistEditor";
import { ColorPicker } from "@/components/notes/ColorPicker";
import { LinkPreviewList } from "@/components/notes/LinkPreviewList";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LabelPicker } from "@/components/notes/LabelPicker";
import { NoteToolbar } from "@/components/notes/NoteToolbar";
import {
  checklistItemsToText,
  hasChecklistContent,
  parseChecklistItems,
  serializeChecklistItems,
  textToChecklistItems
} from "@/lib/note-content";
import type { LabelSummary, NoteWithLabels } from "@/types/note";

type NoteModalProps = {
  note: NoteWithLabels;
  labels: LabelSummary[];
  onClose: () => void;
};

export function NoteModal({ note, labels, onClose }: NoteModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isChecklist, setIsChecklist] = useState(hasChecklistContent(note.content));
  const [checklistItems, setChecklistItems] = useState(() => {
    const parsedItems = parseChecklistItems(note.content);
    return parsedItems.length > 0 ? parsedItems : textToChecklistItems(note.content);
  });
  const [color, setColor] = useState(note.color);
  const [isPinned, setIsPinned] = useState(note.isPinned);
  const [isArchived, setIsArchived] = useState(note.isArchived);
  const [labelNames, setLabelNames] = useState(note.labels.map((label) => label.name));
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  function saveAndClose() {
    const nextContent = isChecklist ? serializeChecklistItems(checklistItems) : content;

    startTransition(async () => {
      const result = await updateNote(note.id, {
        title,
        content: nextContent,
        color,
        isPinned,
        isArchived,
        isDeleted: note.isDeleted,
        labelNames
      });

      if (!result.ok) {
        setError(result.error ?? t("updateError"));
        return;
      }

      router.refresh();
      onClose();
    });
  }

  function toggleChecklistMode() {
    if (isChecklist) {
      setContent(checklistItemsToText(checklistItems));
      setIsChecklist(false);
      return;
    }

    setChecklistItems(textToChecklistItems(content));
    setIsChecklist(true);
  }

  function runAction(action: () => Promise<unknown>, close = true) {
    startTransition(async () => {
      await action();
      router.refresh();
      if (close) onClose();
    });
  }

  if (typeof document === "undefined") return null;

  const editorContent = isChecklist ? serializeChecklistItems(checklistItems) : content;
  const hasContent = title.trim() || (isChecklist ? checklistItems.some((item) => item.text.trim()) : content.trim());

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center overflow-y-auto bg-black/55 p-4"
      onMouseDown={onClose}
    >
      <section
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl animate-modal-panel-in overflow-y-auto rounded-lg border border-[#dadce0] p-5 shadow-keep"
        style={{ backgroundColor: color }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("title")}
            className="min-w-0 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-[#5f6368]"
            autoFocus
          />
          <NoteToolbar
            compact
            isPinned={isPinned}
            onPin={() => {
              setIsPinned((value) => !value);
              if (isArchived) setIsArchived(false);
            }}
          />
        </div>
        {isChecklist ? (
          <ChecklistEditor items={checklistItems} onChange={setChecklistItems} />
        ) : (
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={t("takeNote")}
            rows={8}
            className="mt-3 w-full resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-[#5f6368]"
          />
        )}
        <LinkPreviewList content={editorContent} />
        <div className="mt-4 space-y-4">
          <LabelPicker availableLabels={labels} selectedNames={labelNames} onChange={setLabelNames} />
          <ColorPicker value={color} onChange={setColor} />
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <NoteToolbar
              isPinned={isPinned}
              isArchived={isArchived}
              isDeleted={note.isDeleted}
              disabled={isPending}
              onPin={() => runAction(() => setNotePinned(note.id, !note.isPinned), false)}
              onArchive={() => runAction(() => setNoteArchived(note.id, !note.isArchived))}
              onDelete={() => runAction(() => setNoteDeleted(note.id, true))}
              onRestore={() => runAction(() => setNoteDeleted(note.id, false))}
              onHardDelete={() => runAction(() => hardDeleteNote(note.id))}
            />
            <button
              type="button"
              aria-label={t("checklist")}
              title={t("checklist")}
              className={[
                "grid h-9 w-9 place-items-center rounded-full text-[#5f6368] transition hover:bg-black/10 hover:text-[#202124]",
                isChecklist ? "bg-black/10 text-[#202124]" : ""
              ].join(" ")}
              onClick={toggleChecklistMode}
              disabled={isPending}
            >
              <ListChecks size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#5f6368]">{isPending ? t("saving") : ""}</span>
            <button
              type="button"
              className="rounded px-5 py-2 text-sm font-medium hover:bg-black/10"
              onClick={onClose}
              disabled={isPending}
            >
              {t("close")}
            </button>
            <button
              type="button"
              className="rounded bg-[#fbbc04] px-5 py-2 text-sm font-medium text-[#202124] hover:bg-[#f9ab00] disabled:opacity-60"
              onClick={saveAndClose}
              disabled={isPending || !hasContent}
            >
              {t("save")}
            </button>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}
