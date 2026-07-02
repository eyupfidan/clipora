"use client";

import { GripVertical, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { ChecklistItem } from "@/lib/note-content";

type ChecklistEditorProps = {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
};

export function ChecklistEditor({ items, onChange }: ChecklistEditorProps) {
  const { t } = useLanguage();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function updateItem(index: number, nextItem: ChecklistItem) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? nextItem : item)));
  }

  function addItem(index = items.length - 1) {
    const nextItems = [...items];
    nextItems.splice(index + 1, 0, { checked: false, text: "" });
    onChange(nextItems);
    window.requestAnimationFrame(() => {
      inputRefs.current[index + 1]?.focus();
    });
  }

  function removeItem(index: number) {
    const nextItems = items.filter((_, itemIndex) => itemIndex !== index);
    onChange(nextItems.length > 0 ? nextItems : [{ checked: false, text: "" }]);
  }

  function moveItem(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;

    const nextItems = [...items];
    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);
    onChange(nextItems);
  }

  return (
    <div className="-mx-5 mt-3 border-y border-black/10">
      {items.map((item, index) => (
        <div
          key={index}
          className={[
            "group flex min-h-12 items-center gap-2 border-b border-black/10 px-5 transition-all duration-150 animate-page-in last:border-b-0",
            draggedIndex === index ? "scale-[0.99] opacity-50" : "scale-100 opacity-100",
            dragOverIndex === index && draggedIndex !== index ? "bg-black/5" : ""
          ].join(" ")}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOverIndex(index);
          }}
          onDrop={(event) => {
            event.preventDefault();
            if (draggedIndex !== null) moveItem(draggedIndex, index);
            setDraggedIndex(null);
            setDragOverIndex(null);
          }}
        >
          <span
            className="shrink-0 cursor-grab text-[#5f6368] opacity-70 active:cursor-grabbing"
            draggable
            onDragStart={(event) => {
              setDraggedIndex(index);
              event.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
          >
            <GripVertical size={18} aria-hidden />
          </span>
          <input
            type="checkbox"
            aria-label={t("toggleListItem")}
            checked={item.checked}
            className="h-4 w-4 shrink-0 accent-[#5f6368]"
            onChange={(event) => updateItem(index, { ...item, checked: event.target.checked })}
          />
          <input
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            value={item.text}
            onChange={(event) => updateItem(index, { ...item, text: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addItem(index);
              }
            }}
            placeholder={t("listItem")}
            className={[
              "min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#5f6368]",
              item.checked ? "text-[#5f6368] line-through" : ""
            ].join(" ")}
          />
          <button
            type="button"
            aria-label={t("removeListItem")}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#5f6368] opacity-100 hover:bg-black/10 md:opacity-0 md:group-hover:opacity-100"
            onClick={() => removeItem(index)}
          >
            <X size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="flex min-h-12 w-full items-center gap-5 px-8 text-left text-sm text-[#5f6368] hover:bg-black/5"
        onClick={() => addItem()}
      >
        <Plus size={18} />
        <span>{t("listItem")}</span>
      </button>
    </div>
  );
}
