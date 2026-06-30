import { NotesBoard } from "@/components/NotesBoard";
import { getLabels, getNotes } from "@/lib/notes";
import type { NotesViewMode } from "@/types/note";

type HomePageProps = {
  searchParams?: Promise<{
    q?: string;
    view?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const view: NotesViewMode = params?.view === "list" ? "list" : "grid";
  const [notes, labels] = await Promise.all([
    getNotes({ mode: "active", query: params?.q }),
    getLabels()
  ]);

  return (
    <NotesBoard
      notes={notes}
      labels={labels}
      view={view}
      page="active"
      emptyTextKey={params?.q ? "emptySearch" : "emptyNotes"}
    />
  );
}
