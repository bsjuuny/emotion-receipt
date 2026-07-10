"use client";

import { EmotionType, EmotionIntensity } from "../types/receipt";
import { EMOTIONS } from "../data/emotions";

interface IntensityValue {
  type: EmotionType;
  intensity: EmotionIntensity;
}

interface EmotionIntensityPickerProps {
  selectedTypes: EmotionType[];
  intensities: IntensityValue[];
  onChange: (intensities: IntensityValue[]) => void;
  memo: string;
  onMemoChange: (memo: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

interface IntensityOption {
  value: EmotionIntensity;
  label: string;
  costLabel: string;
}

const INTENSITY_OPTIONS: IntensityOption[] = [
  { value: "low", label: "약함", costLabel: "5천원" },
  { value: "medium", label: "보통", costLabel: "1.2만원" },
  { value: "high", label: "강함", costLabel: "2.5만원" },
  { value: "dominant", label: "지배함", costLabel: "4.2만원" },
];

export default function EmotionIntensityPicker({
  selectedTypes,
  intensities,
  onChange,
  memo,
  onMemoChange,
  onSubmit,
  onBack,
}: EmotionIntensityPickerProps) {
  
  const getIntensityForType = (type: EmotionType): EmotionIntensity => {
    const found = intensities.find(i => i.type === type);
    return found ? found.intensity : "medium";
  };

  const handleIntensityChange = (type: EmotionType, intensity: EmotionIntensity) => {
    const exists = intensities.some(i => i.type === type);
    if (exists) {
      onChange(
        intensities.map(i => (i.type === type ? { ...i, intensity } : i))
      );
    } else {
      onChange([...intensities, { type, intensity }]);
    }
  };

  const getEmotionLabelAndEmoji = (type: EmotionType) => {
    const def = EMOTIONS.find(e => e.type === type);
    return def ? `${def.emoji} ${def.label}` : type;
  };

  const isPositive = (type: EmotionType) => {
    const def = EMOTIONS.find(e => e.type === type);
    return def ? def.isDiscount : false;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-2">
      
      {/* Intensity Selector Card */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            STEP 02
          </span>
          <h2 className="text-xl font-extrabold text-slate-800 leading-snug">
            감정의 크기를 조절해주세요
          </h2>
          <p className="text-xs font-medium text-slate-400">
            각 감정이 오늘 나에게 미친 영향력을 선택합니다.
          </p>
        </div>

        {/* Emotion items loop */}
        <div className="divide-y divide-slate-100">
          {selectedTypes.map(type => {
            const currentIntensity = getIntensityForType(type);
            const positive = isPositive(type);

            return (
              <div key={type} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                    {getEmotionLabelAndEmoji(type)}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  }`}>
                    {positive ? "할인 요소" : "지출 요소"}
                  </span>
                </div>

                {/* 4-scale buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  {INTENSITY_OPTIONS.map(opt => {
                    const active = currentIntensity === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleIntensityChange(type, opt.value)}
                        className={`
                          py-2 rounded-xl text-center flex flex-col items-center justify-center transition-all duration-200 transform active:scale-95 cursor-pointer
                          ${
                            active
                              ? "bg-slate-900 text-white font-bold scale-[1.02] shadow-sm"
                              : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 font-medium"
                          }
                        `}
                      >
                        <span className="text-[11px]">{opt.label}</span>
                        <span className={`text-[8px] mt-0.5 tracking-tight opacity-75 ${
                          active ? "text-slate-200" : "text-slate-400"
                        }`}>
                          {positive ? "-" : ""}{opt.costLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Memo Card */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3.5">
        <label htmlFor="memo-textarea" className="block space-y-1">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block">
            STEP 03
          </span>
          <span className="text-base font-extrabold text-slate-800 block">
            오늘을 기록하는 한 줄 메모 <span className="text-slate-400 text-xs font-normal">(선택)</span>
          </span>
        </label>
        <div>
          <textarea
            id="memo-textarea"
            rows={2}
            value={memo}
            onChange={e => onMemoChange(e.target.value)}
            placeholder="예: 퇴근길에 맛있는 밥을 먹어서 사르르 녹음"
            className="w-full rounded-xl border border-slate-200 p-3.5 text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:outline-none bg-white transition-colors duration-200 resize-none min-h-[72px]"
          />
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="space-y-3.5">
        <button
          type="button"
          onClick={onSubmit}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 py-4 px-6 rounded-2xl text-base font-extrabold transition-all duration-300 transform active:scale-98 shadow-md shadow-slate-900/10 cursor-pointer flex items-center justify-center min-h-[52px]"
        >
          🧾 영수증 발급하기
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full bg-transparent hover:bg-slate-100 border border-slate-200 py-3.5 px-6 rounded-2xl text-sm font-bold text-slate-500 transition-all duration-300 transform active:scale-98 cursor-pointer flex items-center justify-center"
        >
          ⬅️ 이전 단계로
        </button>
      </div>

    </div>
  );
}
