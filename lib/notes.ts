import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { LabelSummary, NoteWithLabels } from "@/types/note";

const noteInclude = {
  labels: {
    include: {
      label: true
    },
    orderBy: {
      label: {
        name: "asc"
      }
    }
  }
} satisfies Prisma.NoteInclude;

function mapNote(note: Prisma.NoteGetPayload<{ include: typeof noteInclude }>): NoteWithLabels {
  return {
    ...note,
    labels: note.labels.map((entry) => entry.label)
  };
}

export async function getLabels(): Promise<LabelSummary[]> {
  return prisma.label.findMany({
    orderBy: { name: "asc" }
  });
}

type GetNotesOptions = {
  mode: "active" | "archive" | "trash" | "label";
  query?: string;
  label?: string;
};

export async function getNotes({ mode, query, label }: GetNotesOptions): Promise<NoteWithLabels[]> {
  const trimmedQuery = query?.trim();
  const where: Prisma.NoteWhereInput = {};

  if (mode === "active") {
    where.isDeleted = false;
    where.isArchived = false;
  }

  if (mode === "archive") {
    where.isDeleted = false;
    where.isArchived = true;
  }

  if (mode === "trash") {
    where.isDeleted = true;
  }

  if (mode === "label") {
    where.isDeleted = false;
    where.labels = {
      some: {
        label: {
          name: label
        }
      }
    };
  }

  if (trimmedQuery) {
    where.OR = [
      { title: { contains: trimmedQuery } },
      { content: { contains: trimmedQuery } }
    ];
  }

  const notes = await prisma.note.findMany({
    where,
    include: noteInclude,
    orderBy: [
      { isPinned: "desc" },
      { updatedAt: "desc" }
    ]
  });

  return notes.map(mapNote);
}
