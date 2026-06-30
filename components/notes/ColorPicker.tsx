"use client";

import { Check } from "lucide-react";
import { clsx } from "clsx";
import { NOTE_COLORS } from "@/lib/colors";

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {NOTE_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          title={color.name}
          aria-label={color.name}
          className={clsx(
            "grid h-8 w-8 place-items-center rounded-full border transition hover:scale-105",
            value === color.value ? "border-[#202124]" : "border-[#dadce0]"
          )}
          style={{ backgroundColor: color.value }}
          onClick={() => onChange(color.value)}
        >
          {value === color.value ? <Check size={16} /> : null}
        </button>
      ))}
    </div>
  );
}
