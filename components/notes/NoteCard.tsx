"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { hardDeleteNote, setNoteArchived, setNoteContent, setNoteDeleted, setNotePinned } from "@/app/actions";
import { LinkPreviewList } from "@/components/notes/LinkPreviewList";
import { NoteContentPreview } from "@/components/notes/NoteContentPreview";
import { NoteToolbar } from "@/components/notes/NoteToolbar";
import { parseChecklistItems, serializeChecklistItems } from "@/lib/note-content";
import type { NoteWithLabels } from "@/types/note";

type NoteCardProps = {
  note: NoteWithLabels;
  onOpen: (note: NoteWithLabels) => void;
};

export function NoteCard({ note, onOpen }: NoteCardProps) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [content, setContent] = useState(note.content);
  const [isPending, startTransition] = useTransition();

  function runAction(action: () => Promise<unknown>, hide = true) {
    if (hide) setIsRemoving(true);
    startTransition(async () => {
      await action();
      router.refresh();
      if (hide) {
        window.setTimeout(() => setHidden(true), 160);
      }
    });
  }

  function toggleChecklistItem(index: number, checked: boolean) {
    const items = parseChecklistItems(content);
    const nextItems = items.map((item, itemIndex) => (itemIndex === index ? { ...item, checked } : item));
    const nextContent = serializeChecklistItems(nextItems);
    setContent(nextContent);

    startTransition(async () => {
      await setNoteContent(note.id, nextContent);
      router.refresh();
    });
  }

  if (hidden) return null;

  return (
    <article
      role="button"
      tabIndex={0}
      className={[
        "group relative w-full cursor-pointer overflow-hidden rounded-lg border border-[#dadce0] transition duration-150 animate-page-in hover:-translate-y-0.5 hover:shadow-keep focus:outline-none focus:ring-2 focus:ring-[#1a73e8]",
        isRemoving ? "scale-95 opacity-0" : "scale-100 opacity-100"
      ].join(" ")}
      style={{ backgroundColor: note.color }}
      onClick={() => onOpen(note)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen(note);
      }}
    >
      <div className="flex items-start gap-3 px-5 pb-4 pt-5">
        <div className="min-w-0 flex-1">
          {note.title ? (
            <h3 className="whitespace-pre-wrap break-words text-xl font-normal leading-6 text-[#202124]">
              {note.title}
            </h3>
          ) : null}
          <NoteContentPreview
            content={content}
            compact
            disabled={isPending}
            onChecklistToggle={toggleChecklistItem}
          />
        </div>
      </div>
      <LinkPreviewList content={content} compact />
      {note.labels.length > 0 ? (
        <div className="flex flex-wrap gap-2 px-5 pb-4 pt-3">
          {note.labels.map((label) => (
            <span key={label.id} className="max-w-full truncate rounded-full bg-black/10 px-3 py-1 text-xs">
              {label.name}
            </span>
          ))}
        </div>
      ) : null}
      <div className="absolute right-2 top-2 z-10 rounded-full bg-white/90 opacity-100 shadow-sm transition md:opacity-0 md:group-hover:opacity-100">
        <NoteToolbar
          compact
          isPinned={note.isPinned}
          isArchived={note.isArchived}
          isDeleted={note.isDeleted}
          disabled={isPending}
          onPin={() => runAction(() => setNotePinned(note.id, !note.isPinned), false)}
          onArchive={() => runAction(() => setNoteArchived(note.id, !note.isArchived))}
          onDelete={() => runAction(() => setNoteDeleted(note.id, true))}
          onRestore={() => runAction(() => setNoteDeleted(note.id, false))}
          onHardDelete={() => runAction(() => hardDeleteNote(note.id))}
        />
      </div>
    </article>
  );
}
