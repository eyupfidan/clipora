import { Lightbulb } from "lucide-react";

type EmptyStateProps = {
  title: string;
};

export function EmptyState({ title }: EmptyStateProps) {
  return (
    <div className="grid min-h-[360px] place-items-center text-center text-[#5f6368]">
      <div>
        <Lightbulb className="mx-auto mb-5 text-[#e0e0e0]" size={96} strokeWidth={1.2} />
        <p className="text-xl">{title}</p>
      </div>
    </div>
  );
}
