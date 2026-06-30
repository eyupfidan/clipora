import { NotesBoard } from "@/components/notes/NotesBoard";
import { getLabels, getNotes } from "@/lib/notes";
import type { NotesViewMode } from "@/types/note";

type ArchivePageProps = {
  searchParams?: Promise<{
    q?: string;
    view?: string;
  }>;
};

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const params = await searchParams;
  const view: NotesViewMode = params?.view === "list" ? "list" : "grid";
  const [notes, labels] = await Promise.all([
    getNotes({ mode: "archive", query: params?.q }),
    getLabels()
  ]);

  return (
    <NotesBoard
      notes={notes}
      labels={labels}
      view={view}
      page="archive"
      headingKey="archive"
      emptyTextKey={params?.q ? "emptyArchiveSearch" : "emptyArchive"}
    />
  );
}
