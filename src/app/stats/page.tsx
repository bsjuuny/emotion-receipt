"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmotionReceipt } from "../../types/receipt";
import { getReceipts, deleteReceipt, getMonthlyStats, MonthlyStatsData, getAvailableMonths } from "../../lib/storage";
import MonthlyStats from "../../components/MonthlyStats";
import SavedReceiptList from "../../components/SavedReceiptList";

export default function StatsPage() {
  const [receipts, setReceipts] = useState<EmotionReceipt[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [stats, setStats] = useState<MonthlyStatsData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadData = () => {
    const all = getReceipts();
    setReceipts(all);

    const months = getAvailableMonths();
    setAvailableMonths(months);

    // Default to the first available month (usually the latest)
    let currentMonth = selectedMonth;
    if (!currentMonth && months.length > 0) {
      currentMonth = months[0];
      setSelectedMonth(currentMonth);
    } else if (!currentMonth) {
      // Fallback to today's month
      currentMonth = new Date().toISOString().substring(0, 7);
      setSelectedMonth(currentMonth);
    }

    const calculatedStats = getMonthlyStats(currentMonth);
    setStats(calculatedStats);
    setIsLoaded(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Recalculate stats when selectedMonth changes
  useEffect(() => {
    if (selectedMonth) {
      setStats(getMonthlyStats(selectedMonth));
    }
  }, [selectedMonth, receipts]);

  const handleDelete = (id: string) => {
    deleteReceipt(id);
    // Reload state from storage
    loadData();
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  // Filter receipts for the selected month list view
  const filteredReceipts = receipts.filter(r => r.createdAt.startsWith(selectedMonth));

  return (
    <main className="min-h-screen bg-[#faf9f5] text-slate-800 flex flex-col items-center justify-between pb-10">
      
      {/* Header */}
      <header className="w-full max-w-md mx-auto px-4 py-4 flex justify-between items-center bg-white/60 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/40">
        <Link href="/" className="flex items-center gap-1.5 cursor-pointer select-none">
          <span className="text-xl">🧾</span>
          <span className="font-extrabold text-slate-900 tracking-tight text-base font-mono">감정영수증</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-extrabold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center gap-1 cursor-pointer"
        >
          🏠 홈으로
        </Link>
      </header>

      <div className="w-full flex-grow flex flex-col justify-start py-6 px-4">
        
        {/* Title and Month Selector */}
        <div className="w-full max-w-md mx-auto flex justify-between items-center mb-6 px-2">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              기분 정산 보관함
            </h1>
            <p className="text-xs text-slate-400 font-semibold">
              지나온 하루들의 영수증과 결제 통계입니다.
            </p>
          </div>

          {/* Month Selector dropdown */}
          {availableMonths.length > 1 && (
            <select
              value={selectedMonth}
              onChange={e => handleMonthChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 transition-colors"
            >
              {availableMonths.map(m => {
                const [y, mm] = m.split("-");
                return (
                  <option key={m} value={m}>
                    {y}년 {parseInt(mm, 10)}월
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {isLoaded && stats ? (
          <div className="w-full space-y-6 animate-fadeIn">
            {/* 1. Monthly Statistics Dashboard */}
            <MonthlyStats stats={stats} selectedMonth={selectedMonth} />

            {/* 2. Receipts List */}
            <SavedReceiptList receipts={filteredReceipts} onDelete={handleDelete} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            <p className="text-slate-400 text-xs mt-3 font-semibold">정산 데이터 집계 중...</p>
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
