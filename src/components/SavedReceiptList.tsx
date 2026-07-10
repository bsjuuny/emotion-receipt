"use client";

import { useState } from "react";
import { EmotionReceipt } from "../types/receipt";
import ReceiptCard from "./ReceiptCard";
import { formatCurrency } from "../lib/formatCurrency";

interface SavedReceiptListProps {
  receipts: EmotionReceipt[];
  onDelete: (id: string) => void;
}

export default function SavedReceiptList({
  receipts,
  onDelete,
}: SavedReceiptListProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<EmotionReceipt | null>(null);

  return (
    <div className="w-full max-w-md mx-auto space-y-4 px-2 pb-10">
      <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase pl-1 select-none">
        📂 저장된 영수증 내역 ({receipts.length}건)
      </h3>

      {receipts.length === 0 ? (
        <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
          <span className="text-4xl block mb-3.5 select-none">🧾</span>
          <p className="text-slate-400 text-sm font-medium">아직 발행된 영수증이 없습니다.</p>
          <p className="text-slate-400 text-xs mt-1">오늘의 감정을 결제하고 첫 영수증을 모아보세요!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {receipts.map(receipt => {
            const formattedDate = new Date(receipt.createdAt).toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const isSurplus = receipt.totalAmount <= 0;

            return (
              <div
                key={receipt.id}
                onClick={() => setSelectedReceipt(receipt)}
                className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      {formattedDate}
                    </span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isSurplus ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {isSurplus ? "마음흑자" : "지출발생"}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm truncate mt-1">
                    {receipt.finalMessage}
                  </h4>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-black text-sm tabular-nums ${isSurplus ? "text-emerald-600" : "text-slate-800"}`}>
                    {formatCurrency(receipt.totalAmount)}
                  </span>
                  
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("정말 이 감정영수증을 삭제하시겠습니까?\n삭제된 영수증은 통계에 포함되지 않습니다.")) {
                        onDelete(receipt.id);
                      }
                    }}
                    className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors duration-200 cursor-pointer"
                    aria-label="삭제"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail Overlay */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-md my-8 transition-all animate-fadeIn">
            {/* Modal close button */}
            <div className="absolute top-2.5 right-4 z-50">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-md transition-colors duration-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-slate-100 rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto p-2.5 scrollbar-none">
              <ReceiptCard
                receipt={selectedReceipt}
                onReset={() => setSelectedReceipt(null)}
                isSavedMode={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
