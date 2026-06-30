"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { hardDeleteNote, setNoteArchived, setNoteDeleted, setNotePinned } from "@/app/actions";
import { NoteToolbar } from "@/components/notes/NoteToolbar";
import type { NoteWithLabels } from "@/types/note";

type NoteCardProps = {
  note: NoteWithLabels;
  onOpen: (note: NoteWithLabels) => void;
};

export function NoteCard({ note, onOpen }: NoteCardProps) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [isPending, startTransition] = useTransition();

  function runAction(action: () => Promise<unknown>, hide = true) {
    if (hide) setHidden(true);
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  if (hidden) return null;

  return (
    <article
      role="button"
      tabIndex={0}
      className="group w-full cursor-pointer rounded-lg border border-[#e0e0e0] p-4 transition duration-150 animate-page-in hover:-translate-y-0.5 hover:shadow-keep focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
      style={{ backgroundColor: note.color }}
      onClick={() => onOpen(note)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen(note);
      }}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {note.title ? <h3 className="whitespace-pre-wrap break-words font-medium">{note.title}</h3> : null}
          {note.content ? (
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">{note.content}</p>
          ) : null}
        </div>
      </div>
      {note.labels.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.labels.map((label) => (
            <span key={label.id} className="max-w-full truncate rounded-full bg-black/10 px-3 py-1 text-xs">
              {label.name}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-3 flex min-h-9 items-center justify-end opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
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
