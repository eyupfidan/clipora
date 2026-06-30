import { NotesBoard } from "@/components/NotesBoard";
import { getLabels, getNotes } from "@/lib/notes";
import type { NotesViewMode } from "@/types/note";

type LabelPageProps = {
  params: Promise<{
    label: string;
  }>;
  searchParams?: Promise<{
    q?: string;
    view?: string;
  }>;
};

export default async function LabelPage({ params, searchParams }: LabelPageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const label = decodeURIComponent(routeParams.label);
  const view: NotesViewMode = queryParams?.view === "list" ? "list" : "grid";
  const [notes, labels] = await Promise.all([
    getNotes({ mode: "label", label, query: queryParams?.q }),
    getLabels()
  ]);

  return (
    <NotesBoard
      notes={notes}
      labels={labels}
      view={view}
      page="label"
      heading={label}
      emptyTextKey={queryParams?.q ? "emptyLabelSearch" : "emptyLabel"}
    />
  );
}
