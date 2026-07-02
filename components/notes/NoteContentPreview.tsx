"use client";

import { LinkedText } from "@/components/notes/LinkedText";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { hasChecklistContent, parseChecklistItems } from "@/lib/note-content";

const COMPACT_CHECKLIST_LIMIT = 10;

type NoteContentPreviewProps = {
  content: string;
  compact?: boolean;
  onChecklistToggle?: (index: number, checked: boolean) => void;
  disabled?: boolean;
};

export function NoteContentPreview({ content, compact, onChecklistToggle, disabled }: NoteContentPreviewProps) {
  const { t } = useLanguage();

  if (!content) return null;

  if (hasChecklistContent(content)) {
    const items = parseChecklistItems(content);
    const visibleItems = compact ? items.slice(0, COMPACT_CHECKLIST_LIMIT) : items;
    const hiddenItemCount = items.length - visibleItems.length;

    return (
      <ul className={compact ? "mt-4 space-y-2 text-sm leading-6" : "mt-2 space-y-1.5 text-sm leading-6"}>
        {visibleItems.map((item, index) => (
          <li key={`${item.text}-${index}`} className={compact ? "flex min-w-0 items-start gap-3" : "flex min-w-0 items-start gap-2"}>
            <input
              type="checkbox"
              aria-label={t("toggleListItem")}
              checked={item.checked}
              disabled={disabled}
              className={compact ? "mt-1 h-4 w-4 shrink-0 accent-[#5f6368]" : "mt-1 h-4 w-4 shrink-0 accent-[#5f6368]"}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              onChange={(event) => onChecklistToggle?.(index, event.target.checked)}
            />
            <LinkedText
              text={item.text}
              className={item.checked ? "min-w-0 break-words text-[#5f6368] line-through" : "min-w-0 break-words"}
            />
          </li>
        ))}
        {compact && hiddenItemCount > 0 ? (
          <li className="pl-7 text-xs text-[#5f6368]">
            {t("moreItems").replace("{count}", String(hiddenItemCount))}
          </li>
        ) : null}
      </ul>
    );
  }

  return (
    <p className={compact ? "mt-4 whitespace-pre-wrap break-words text-sm leading-6" : "mt-2 whitespace-pre-wrap break-words text-sm leading-6"}>
      <LinkedText text={content} />
    </p>
  );
}
