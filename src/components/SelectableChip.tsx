"use client";

interface SelectableChipProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onClick: () => void;
}

export default function SelectableChip({
  label,
  emoji,
  selected,
  onClick,
}: SelectableChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-3 rounded-2xl border-2 text-sm font-bold transition-all duration-300 transform active:scale-95 text-center cursor-pointer min-h-[48px] flex items-center justify-center gap-1.5
        ${
          selected
            ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/20 scale-[1.02]"
            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        }
      `}
    >
      {emoji && <span className="text-base select-none">{emoji}</span>}
      <span>{label}</span>
    </button>
  );
}
