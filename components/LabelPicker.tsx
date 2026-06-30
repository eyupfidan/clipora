"use client";

import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { LabelSummary } from "@/types/note";

type LabelPickerProps = {
  availableLabels: LabelSummary[];
  selectedNames: string[];
  onChange: (labels: string[]) => void;
};

export function LabelPicker({ availableLabels, selectedNames, onChange }: LabelPickerProps) {
  const [draft, setDraft] = useState("");
  const { t } = useLanguage();
  const selectedSet = useMemo(
    () => new Set(selectedNames.map((name) => name.toLocaleLowerCase("tr-TR"))),
    [selectedNames]
  );

  function toggleLabel(name: string) {
    const key = name.toLocaleLowerCase("tr-TR");
    if (selectedSet.has(key)) {
      onChange(selectedNames.filter((label) => label.toLocaleLowerCase("tr-TR") !== key));
      return;
    }
    onChange([...selectedNames, name]);
  }

  function addDraft() {
    const name = draft.trim();
    if (!name || selectedSet.has(name.toLocaleLowerCase("tr-TR"))) return;
    onChange([...selectedNames, name]);
    setDraft("");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedNames.map((name) => (
          <span
            key={name}
            className="inline-flex max-w-full items-center gap-1 rounded-full bg-black/10 px-3 py-1 text-xs"
          >
            <span className="truncate">{name}</span>
            <button type="button" aria-label={`${t("removeLabel")}: ${name}`} onClick={() => toggleLabel(name)}>
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addDraft();
            }
          }}
          placeholder={t("addLabel")}
          className="h-9 min-w-0 flex-1 rounded border border-[#dadce0] bg-white/70 px-3 text-sm outline-none focus:border-[#1a73e8]"
        />
        <button
          type="button"
          aria-label={t("addLabel")}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/10"
          onClick={addDraft}
        >
          <Plus size={18} />
        </button>
      </div>
      {availableLabels.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {availableLabels.map((label) => (
            <button
              key={label.id}
              type="button"
              className="rounded-full border border-[#dadce0] px-3 py-1 text-xs hover:bg-black/5"
              onClick={() => toggleLabel(label.name)}
            >
              {label.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
