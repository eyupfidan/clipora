export type LabelSummary = {
  id: string;
  name: string;
  createdAt: Date;
};

export type NoteWithLabels = {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  labels: LabelSummary[];
};

export type NoteMutationInput = {
  title?: string;
  content?: string;
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  labelNames?: string[];
};

export type NotesViewMode = "grid" | "list";
