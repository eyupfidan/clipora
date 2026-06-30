"use client";

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { useLanguage } from "@/components/LanguageProvider";
import { MasonryGrid } from "@/components/MasonryGrid";
import { NoteCard } from "@/components/NoteCard";
import { NoteEditor } from "@/components/NoteEditor";
import { NoteModal } from "@/components/NoteModal";
import type { TranslationKey } from "@/lib/i18n";
import type { LabelSummary, NotesViewMode, NoteWithLabels } from "@/types/note";

type NotesBoardProps = {
  notes: NoteWithLabels[];
  labels: LabelSummary[];
  view: NotesViewMode;
  page: "active" | "archive" | "trash" | "label";
  heading?: string;
  headingKey?: TranslationKey;
  emptyTextKey: TranslationKey;
};

export function NotesBoard({
  notes,
  labels,
  view,
  page,
  heading,
  headingKey,
  emptyTextKey
}: NotesBoardProps) {
  const [selectedNote, setSelectedNote] = useState<NoteWithLabels | null>(null);
  const { t } = useLanguage();
  const pinnedNotes = notes.filter((note) => note.isPinned && page === "active");
  const otherNotes = page === "active" ? notes.filter((note) => !note.isPinned) : notes;

  return (
    <div>
      {page === "active" ? <NoteEditor labels={labels} /> : null}
      {heading || headingKey ? (
        <h1 className="mb-6 text-xl font-medium text-[#3c4043]">
          {headingKey ? t(headingKey) : heading}
        </h1>
      ) : null}
      {notes.length === 0 ? (
        <EmptyState title={t(emptyTextKey)} />
      ) : (
        <div className="space-y-10">
          {pinnedNotes.length > 0 ? (
            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#5f6368]">
                {t("pinned")}
              </h2>
              <MasonryGrid view={view}>
                {pinnedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onOpen={setSelectedNote} />
                ))}
              </MasonryGrid>
            </section>
          ) : null}
          {otherNotes.length > 0 ? (
            <section>
              {pinnedNotes.length > 0 ? (
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#5f6368]">
                  {t("others")}
                </h2>
              ) : null}
              <MasonryGrid view={view}>
                {otherNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onOpen={setSelectedNote} />
                ))}
              </MasonryGrid>
            </section>
          ) : null}
        </div>
      )}
      {selectedNote ? (
        <NoteModal note={selectedNote} labels={labels} onClose={() => setSelectedNote(null)} />
      ) : null}
    </div>
  );
}
