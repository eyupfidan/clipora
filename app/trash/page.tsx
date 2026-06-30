import { NotesBoard } from "@/components/NotesBoard";
import { getLabels, getNotes } from "@/lib/notes";
import type { NotesViewMode } from "@/types/note";

type TrashPageProps = {
  searchParams?: Promise<{
    q?: string;
    view?: string;
  }>;
};

export default async function TrashPage({ searchParams }: TrashPageProps) {
  const params = await searchParams;
  const view: NotesViewMode = params?.view === "list" ? "list" : "grid";
  const [notes, labels] = await Promise.all([
    getNotes({ mode: "trash", query: params?.q }),
    getLabels()
  ]);

  return (
    <NotesBoard
      notes={notes}
      labels={labels}
      view={view}
      page="trash"
      headingKey="trash"
      emptyTextKey={params?.q ? "emptyTrashSearch" : "emptyTrash"}
    />
  );
}
