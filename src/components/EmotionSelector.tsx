"use client";

import { EmotionType } from "../types/receipt";
import { EMOTIONS } from "../data/emotions";
import SelectableChip from "./SelectableChip";

interface EmotionSelectorProps {
  selected: EmotionType[];
  onChange: (selected: EmotionType[]) => void;
  onNext: () => void;
}

export default function EmotionSelector({
  selected,
  onChange,
  onNext,
}: EmotionSelectorProps) {
  const toggleSelect = (type: EmotionType) => {
    if (selected.includes(type)) {
      onChange(selected.filter(t => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-2">
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            STEP 01
          </span>
          <h2 className="text-xl font-extrabold text-slate-800 leading-snug">
            오늘 어떤 감정이 있었나요?
          </h2>
          <p className="text-xs font-medium text-slate-400">
            기억에 남는 감정들을 자유롭게 모두 선택해 주세요. (복수 선택 가능)
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
          {EMOTIONS.map(emotion => (
            <SelectableChip
              key={emotion.type}
              label={emotion.label}
              emoji={emotion.emoji}
              selected={selected.includes(emotion.type)}
              onClick={() => toggleSelect(emotion.type)}
            />
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          className={`
            w-full py-4 px-6 rounded-2xl text-base font-bold transition-all duration-300 transform active:scale-98 shadow-md flex items-center justify-center min-h-[52px] cursor-pointer
            ${
              selected.length > 0
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-950/10"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }
          `}
        >
          ➡️ 감정 강도 선택하기 ({selected.length}개 선택됨)
        </button>
      </div>
    </div>
  );
}
