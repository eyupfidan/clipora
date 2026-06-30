"use client";

import { clsx } from "clsx";
import type { NotesViewMode } from "@/types/note";

type MasonryGridProps = {
  view: NotesViewMode;
  children: React.ReactNode;
};

export function MasonryGrid({ view, children }: MasonryGridProps) {
  if (view === "list") {
    return <div className="mx-auto grid max-w-2xl gap-4">{children}</div>;
  }

  return (
    <div
      className={clsx(
        "masonry-grid mx-auto max-w-7xl",
        "columns-1 sm:columns-2 lg:columns-3 2xl:columns-4"
      )}
    >
      {children}
    </div>
  );
}
