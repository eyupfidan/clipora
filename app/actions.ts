"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { DEFAULT_NOTE_COLOR } from "@/lib/colors";
import { prisma } from "@/lib/prisma";
import type { NoteMutationInput } from "@/types/note";

function normalizeText(value?: string) {
  return value?.trim() ?? "";
}

function normalizeLabels(labelNames?: string[]) {
  const seen = new Set<string>();
  return (labelNames ?? [])
    .map((name) => name.trim())
    .filter(Boolean)
    .filter((name) => {
      const key = name.toLocaleLowerCase("tr-TR");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

async function ensureLabels(labelNames?: string[]) {
  const names = normalizeLabels(labelNames);
  const labels = [];

  for (const name of names) {
    const label = await prisma.label.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    labels.push(label);
  }

  return labels;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/trash");
  revalidatePath("/labels/[label]", "page");
}

export async function createNote(input: NoteMutationInput) {
  const title = normalizeText(input.title);
  const content = normalizeText(input.content);

  if (!title && !content) {
    return { ok: false, error: "Title or content is required." };
  }

  const labels = await ensureLabels(input.labelNames);

  const note = await prisma.note.create({
    data: {
      title,
      content,
      color: input.color || DEFAULT_NOTE_COLOR,
      isPinned: Boolean(input.isPinned),
      isArchived: Boolean(input.isArchived),
      labels: {
        create: labels.map((label) => ({
          label: {
            connect: { id: label.id }
          }
        }))
      }
    }
  });

  revalidateAll();
  return { ok: true, noteId: note.id };
}

export async function updateNote(id: string, input: NoteMutationInput) {
  const title = normalizeText(input.title);
  const content = normalizeText(input.content);

  if (!title && !content) {
    return { ok: false, error: "Empty notes cannot be saved." };
  }

  const labels = await ensureLabels(input.labelNames);
  const data: Prisma.NoteUpdateInput = {
    title,
    content,
    color: input.color || DEFAULT_NOTE_COLOR,
    isPinned: input.isPinned,
    isArchived: input.isArchived,
    isDeleted: input.isDeleted,
    labels: {
      deleteMany: {},
      create: labels.map((label) => ({
        label: {
          connect: { id: label.id }
        }
      }))
    }
  };

  await prisma.note.update({
    where: { id },
    data
  });

  revalidateAll();
  return { ok: true };
}

export async function createLabel(name: string) {
  const normalizedName = normalizeText(name);

  if (!normalizedName) {
    return { ok: false, error: "Label name cannot be empty." };
  }

  try {
    await prisma.label.create({
      data: { name: normalizedName }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "This label already exists." };
    }
    throw error;
  }

  revalidateAll();
  return { ok: true };
}

export async function setNoteDeleted(id: string, isDeleted: boolean) {
  await prisma.note.update({
    where: { id },
    data: {
      isDeleted,
      isArchived: isDeleted ? false : undefined
    }
  });

  revalidateAll();
  return { ok: true };
}

export async function hardDeleteNote(id: string) {
  await prisma.note.delete({
    where: { id }
  });

  revalidateAll();
  return { ok: true };
}

export async function setNoteArchived(id: string, isArchived: boolean) {
  await prisma.note.update({
    where: { id },
    data: {
      isArchived,
      isPinned: isArchived ? false : undefined
    }
  });

  revalidateAll();
  return { ok: true };
}

export async function setNotePinned(id: string, isPinned: boolean) {
  await prisma.note.update({
    where: { id },
    data: {
      isPinned,
      isArchived: isPinned ? false : undefined
    }
  });

  revalidateAll();
  return { ok: true };
}
