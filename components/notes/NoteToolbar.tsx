"use client";

import { Archive, ArchiveRestore, Pin, PinOff, RotateCcw, Trash2, X } from "lucide-react";
import { clsx } from "clsx";
import { useLanguage } from "@/components/providers/LanguageProvider";

type NoteToolbarProps = {
  isPinned?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  onPin?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onHardDelete?: () => void;
  onClose?: () => void;
  compact?: boolean;
  disabled?: boolean;
};

export function NoteToolbar({
  isPinned,
  isArchived,
  isDeleted,
  onPin,
  onArchive,
  onDelete,
  onRestore,
  onHardDelete,
  onClose,
  compact,
  disabled
}: NoteToolbarProps) {
  const { t } = useLanguage();
  const buttonClass = clsx(
    "grid place-items-center rounded-full text-[#5f6368] transition hover:bg-black/10 hover:text-[#202124]",
    compact ? "h-8 w-8" : "h-9 w-9"
  );

  return (
    <div className="flex items-center gap-1">
      {!isDeleted && onPin ? (
        <button
          type="button"
          aria-label={isPinned ? t("unpin") : t("pin")}
          className={buttonClass}
          onClick={(event) => {
            event.stopPropagation();
            onPin();
          }}
          disabled={disabled}
        >
          {isPinned ? <PinOff size={18} /> : <Pin size={18} />}
        </button>
      ) : null}
      {!isDeleted && onArchive ? (
        <button
          type="button"
          aria-label={isArchived ? t("unarchiveNote") : t("archiveNote")}
          className={buttonClass}
          onClick={(event) => {
            event.stopPropagation();
            onArchive();
          }}
          disabled={disabled}
        >
          {isArchived ? <ArchiveRestore size={18} /> : <Archive size={18} />}
        </button>
      ) : null}
      {!isDeleted && onDelete ? (
        <button
          type="button"
          aria-label={t("deleteNote")}
          className={buttonClass}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          disabled={disabled}
        >
          <Trash2 size={18} />
        </button>
      ) : null}
      {isDeleted && onRestore ? (
        <button
          type="button"
          aria-label={t("restoreNote")}
          className={buttonClass}
          onClick={(event) => {
            event.stopPropagation();
            onRestore();
          }}
          disabled={disabled}
        >
          <RotateCcw size={18} />
        </button>
      ) : null}
      {isDeleted && onHardDelete ? (
        <button
          type="button"
          aria-label={t("hardDeleteNote")}
          className={buttonClass}
          onClick={(event) => {
            event.stopPropagation();
            onHardDelete();
          }}
          disabled={disabled}
        >
          <Trash2 size={18} />
        </button>
      ) : null}
      {onClose ? (
        <button
          type="button"
          aria-label={t("close")}
          className={buttonClass}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          disabled={disabled}
        >
          <X size={18} />
        </button>
      ) : null}
    </div>
  );
}
