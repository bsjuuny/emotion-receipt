"use client";

import { useState } from "react";
import Link from "next/link";
import { EmotionType, EmotionIntensity, EmotionReceipt } from "../types/receipt";
import { generateReceipt } from "../lib/generateReceipt";
import EmotionSelector from "../components/EmotionSelector";
import EmotionIntensityPicker from "../components/EmotionIntensityPicker";
import ReceiptCard from "../components/ReceiptCard";

type AppStep = "home" | "selector" | "picker" | "result";

interface IntensityValue {
  type: EmotionType;
  intensity: EmotionIntensity;
}

export default function Home() {
  const [step, setStep] = useState<AppStep>("home");
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionType[]>([]);
  const [intensities, setIntensities] = useState<IntensityValue[]>([]);
  const [memo, setMemo] = useState("");
  const [receipt, setReceipt] = useState<EmotionReceipt | null>(null);

  const handleNextToPicker = () => {
    // Initialize default intensities for newly selected emotions if not exists
    const updatedIntensities = [...intensities];
    selectedEmotions.forEach(type => {
      const exists = updatedIntensities.some(i => i.type === type);
      if (!exists) {
        updatedIntensities.push({ type, intensity: "medium" });
      }
    });
    // Remove unused intensities
    const filteredIntensities = updatedIntensities.filter(i => selectedEmotions.includes(i.type));

    setIntensities(filteredIntensities);
    setStep("picker");
  };

  const handleGenerateReceipt = () => {
    // Map selected emotions with their actual selected intensities
    const inputs = selectedEmotions.map(type => {
      const match = intensities.find(i => i.type === type);
      return {
        type,
        intensity: match ? match.intensity : ("medium" as EmotionIntensity),
      };
    });

    const generated = generateReceipt(inputs, memo);
    setReceipt(generated);
    setStep("result");
  };

  const handleReset = () => {
    setSelectedEmotions([]);
    setIntensities([]);
    setMemo("");
    setReceipt(null);
    setStep("home");
  };

  return (
    <main className="min-h-screen bg-[#faf9f5] text-slate-800 flex flex-col items-center justify-between pb-10">
      
      {/* Header */}
      <header className="w-full max-w-md mx-auto px-4 py-4 flex justify-between items-center bg-white/60 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/40">
        <Link href="/" onClick={handleReset} className="flex items-center gap-1.5 cursor-pointer select-none">
          <span className="text-xl">🧾</span>
          <span className="font-extrabold text-slate-900 tracking-tight text-base font-mono">감정영수증</span>
        </Link>
        <Link
          href="/stats"
          className="text-xs font-extrabold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center gap-1 cursor-pointer"
        >
          📊 기분 통계
        </Link>
      </header>

      <div className="w-full flex-grow flex flex-col justify-center py-6 px-4">
        {step === "home" && (
          <div className="w-full max-w-md mx-auto text-center space-y-8 py-10 animate-fadeIn">
            {/* Logo Badge */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900 shadow-xl shadow-slate-900/10 animate-pulse relative select-none">
              <span className="text-5xl">🧾</span>
            </div>

            {/* Core copy */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug whitespace-pre-line tracking-tight px-4">
                오늘의 기분,{"\n"}
                영수증으로 정산해드립니다.
              </h1>
              <p className="text-sm font-semibold text-slate-400 leading-relaxed px-6">
                장소 지도 말고, 하루 동안 쌓인 마음의 지출을{"\n"}
                한 장의 영수증으로 가볍게 털어내 보세요.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3.5 pt-6 px-4">
              <button
                type="button"
                onClick={() => setStep("selector")}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 py-4 px-6 rounded-2xl text-base font-extrabold transition-all duration-300 transform active:scale-98 shadow-lg shadow-slate-950/15 cursor-pointer"
              >
                🛒 오늘 감정 결제하기
              </button>
              
              <Link
                href="/stats"
                className="block w-full bg-white hover:bg-slate-50 border-2 border-slate-200 py-3.5 px-6 rounded-2xl text-sm font-bold text-slate-600 transition-all duration-300 transform active:scale-98 shadow-sm text-center cursor-pointer"
              >
                📊 월별 감정 지출 보기
              </Link>
            </div>
          </div>
        )}

        {step === "selector" && (
          <div className="w-full animate-fadeIn">
            <EmotionSelector
              selected={selectedEmotions}
              onChange={setSelectedEmotions}
              onNext={handleNextToPicker}
            />
          </div>
        )}

        {step === "picker" && (
          <div className="w-full animate-fadeIn">
            <EmotionIntensityPicker
              selectedTypes={selectedEmotions}
              intensities={intensities}
              onChange={setIntensities}
              memo={memo}
              onMemoChange={setMemo}
              onSubmit={handleGenerateReceipt}
              onBack={() => setStep("selector")}
            />
          </div>
        )}

        {step === "result" && receipt && (
          <div className="w-full animate-fadeIn">
            <div className="text-center mb-6 space-y-1">
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                CALCULATION FINISHED
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                오늘의 감정영수증 발급 완료 🎉
              </h1>
            </div>
            <ReceiptCard receipt={receipt} onReset={handleReset} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center py-4 border-t border-slate-200/50">
        <p className="text-[9px] text-slate-400 font-bold font-mono">
          &copy; {new Date().getFullYear()} 감정영수증. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
