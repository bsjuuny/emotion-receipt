"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { EmotionReceipt } from "../types/receipt";
import { formatCurrency } from "../lib/formatCurrency";
import { saveReceipt } from "../lib/storage";
import { shareReceipt } from "../lib/share";

interface ReceiptCardProps {
  receipt: EmotionReceipt;
  onReset: () => void;
  isSavedMode?: boolean;
}

export default function ReceiptCard({
  receipt,
  onReset,
  isSavedMode = false,
}: ReceiptCardProps) {
  const [isSaved, setIsSaved] = useState(isSavedMode);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleSave = () => {
    if (isSaved) return;
    saveReceipt(receipt);
    setIsSaved(true);
    showToast("💾 감정영수증이 보관함에 안전하게 결제/저장되었습니다!");
  };

  const handleShare = async () => {
    const result = await shareReceipt(receipt);
    if (result.copied) {
      showToast("📋 클립보드에 결과가 복사되었습니다!");
    } else if (result.shared) {
      showToast("📤 공유 성공!");
    } else {
      showToast("❌ 공유를 지원하지 않거나 실패했습니다.");
    }
  };

  const downloadReceiptImage = async () => {
    if (!receiptRef.current) return;
    try {
      showToast("📸 영수증 이미지 생성 중...");
      
      // Delay slightly for render stability and grab clean screenshot
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        backgroundColor: "#faf9f5",
        style: {
          transform: "scale(1)",
        },
      });

      const link = document.createElement("a");
      link.download = `emotion-receipt-${receipt.id.split("_")[2] || "today"}.png`;
      link.href = dataUrl;
      link.click();
      showToast("📥 영수증 이미지가 성공적으로 저장되었습니다!");
    } catch (err) {
      console.error("Failed to download image:", err);
      showToast("❌ 이미지 다운로드에 실패했습니다.");
    }
  };

  const formattedDate = new Date(receipt.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const getIntensityLabel = (intensity: string) => {
    switch (intensity) {
      case "low": return "약함";
      case "medium": return "보통";
      case "high": return "강함";
      case "dominant": return "지배";
      default: return "";
    }
  };

  const isNetSurplus = receipt.totalAmount <= 0;

  return (
    <div className="w-full max-w-md mx-auto space-y-6 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-slate-900/95 text-white px-5 py-3 rounded-full text-xs font-semibold shadow-xl border border-slate-800 backdrop-blur-sm z-50 transition-all duration-300 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Wrapping capture target */}
      <div ref={receiptRef} className="p-2 bg-[#faf9f5] rounded-xl">
        {/* Thermal Receipt Body */}
        <div className="relative bg-[#fcfbf7] border-2 border-slate-300 rounded-lg shadow-2xl p-6 font-mono text-slate-800 overflow-hidden">
          
          {/* Receipt Top Jagged Jag / Serrated Edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-300 select-none flex overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-slate-50 rotate-45 transform origin-top-left -translate-y-[3.5px] border-b border-r border-slate-300/40"
              />
            ))}
          </div>

          {/* Receipt Header */}
          <div className="text-center pt-4 pb-3 space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
              EMOTION RECEIPT
            </h2>
            <p className="text-[10px] text-slate-500 font-bold tracking-wider">
              *** 감 정 영 수 증 ***
            </p>
          </div>

          {/* Store Info / Meta details */}
          <div className="text-[11px] text-slate-500 border-b border-dashed border-slate-300 pb-3 space-y-0.5">
            <div className="flex justify-between">
              <span>발급일시:</span>
              <span className="font-semibold text-slate-700">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>영수증ID:</span>
              <span className="font-semibold text-slate-700">{receipt.id.split("_")[2] || "0000"}</span>
            </div>
            <div className="flex justify-between">
              <span>결제수단:</span>
              <span className="font-semibold text-slate-700">마음 페이 (무서명)</span>
            </div>
          </div>

          {/* Receipt Items Headers */}
          <div className="text-xs font-bold text-slate-800 flex justify-between py-2 border-b border-dashed border-slate-300">
            <span>감정 항목 (강도)</span>
            <span>정산 금액</span>
          </div>

          {/* Items List */}
          <div className="py-2.5 space-y-2 border-b border-dashed border-slate-300 text-sm">
            {receipt.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">
                    {item.label}
                    <span className="text-[10px] text-slate-400 font-normal ml-1">
                      ({getIntensityLabel(item.intensity)})
                    </span>
                  </span>
                  {item.isDiscount && (
                    <span className="text-[9px] text-emerald-600 font-semibold tracking-tight">
                      * 긍정 감정 특별 할인 *
                    </span>
                  )}
                </div>
                <span className={`font-semibold ${item.isDiscount ? "text-emerald-600" : "text-slate-900"}`}>
                  {item.isDiscount ? "할인 " : ""}
                  {formatCurrency(item.amount, item.isDiscount)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Section */}
          <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5">
            
            {/* Sub summaries */}
            <div className="flex justify-between text-xs text-slate-500">
              <span>총 지출 감정 금액</span>
              <span>
                {formatCurrency(
                  receipt.items.filter(i => !i.isDiscount).reduce((acc, c) => acc + c.amount, 0)
                )}
              </span>
            </div>
            <div className="flex justify-between text-xs text-emerald-600">
              <span>총 할인 감정 금액</span>
              <span>
                -{formatCurrency(
                  receipt.items.filter(i => i.isDiscount).reduce((acc, c) => acc + c.amount, 0)
                ).replace("-", "")}
              </span>
            </div>

            {/* Net amount */}
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-sm font-extrabold text-slate-950">합 계 금 액</span>
              <span className={`text-lg font-black ${isNetSurplus ? "text-emerald-600" : "text-rose-600"}`}>
                {isNetSurplus ? "마음 흑자 " : ""}
                {formatCurrency(receipt.totalAmount)}
              </span>
            </div>
          </div>

          {/* Final Payment Decision (최종 결제 문장) */}
          <div className="py-4 border-b border-dashed border-slate-300 text-center space-y-1 bg-slate-50/50 rounded-xl my-2 border border-slate-200/50">
            <span className="text-[9px] font-bold text-slate-400 tracking-widest block uppercase">
              [ 최종 결제 판정 ]
            </span>
            <p className="text-base font-black text-slate-900 px-3 py-1">
              {receipt.finalMessage}
            </p>
          </div>

          {/* User Memo */}
          <div className="py-3.5 space-y-1">
            <span className="text-[9px] font-bold text-slate-400 tracking-widest block uppercase">
              [ 감정 정산 메모 ]
            </span>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed whitespace-pre-line bg-amber-50/30 p-2.5 rounded-lg border border-amber-100/50">
              {receipt.memo}
            </p>
          </div>

          {/* Barcode Mock Rendering */}
          <div className="pt-4 pb-2 flex flex-col items-center space-y-1">
            <div className="flex items-center h-10 w-4/5 overflow-hidden select-none" aria-hidden="true">
              {/* Custom pure-CSS barcode simulation */}
              {[1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 1, 3].map((width, idx) => (
                <div
                  key={idx}
                  className={`h-full shrink-0 ${idx % 2 === 0 ? "bg-slate-950" : "bg-transparent"}`}
                  style={{ width: `${width * 2}px` }}
                />
              ))}
            </div>
            <span className="text-[9px] text-slate-400 font-mono tracking-[0.25em]">
              * {receipt.id.substring(8, 20).toUpperCase()} *
            </span>
          </div>

          {/* Medical Disclaimer Section */}
          <div className="pt-3 border-t border-slate-200 text-[9px] text-slate-400 text-center leading-tight font-sans">
            <p className="font-semibold text-slate-500 mb-0.5">※ 감정영수증 유의사항</p>
            <p>본 영수증은 심리학적/의학적 진단 서비스가 아닙니다. 우울, 불안 등 정신건강 문제에 관하여 의학적 판단이나 치료 권고를 대체할 수 없으며, 하루의 기분을 재미있게 회고하기 위한 용도로만 이용해 주세요.</p>
          </div>

          {/* Bottom Jagged Cutline */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-300 select-none flex overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-slate-50 rotate-45 transform origin-bottom-left translate-y-[3.5px] border-t border-l border-slate-300/40"
              />
            ))}
          </div>

        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-3 px-2">
        <button
          type="button"
          onClick={downloadReceiptImage}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-slate-900/5"
        >
          🖼️ 영수증 이미지 저장
        </button>

        <div className="grid grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className={`
              w-full py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm
              ${
                isSaved
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }
            `}
          >
            {isSaved ? "Saved ✓" : "💾 저장하기"}
          </button>
          
          <button
            type="button"
            onClick={handleShare}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-slate-900/10"
          >
            📤 공유하기
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="w-full bg-transparent hover:bg-slate-100 border border-slate-200 hover:border-slate-300 py-3.5 px-4 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-600 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          🔄 다시 정산하기
        </button>
      </div>
      
    </div>
  );
}
