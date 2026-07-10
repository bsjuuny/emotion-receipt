"use client";

import { MonthlyStatsData } from "../lib/storage";
import { formatCurrency } from "../lib/formatCurrency";

interface MonthlyStatsProps {
  stats: MonthlyStatsData;
  selectedMonth: string;
}

export default function MonthlyStats({ stats, selectedMonth }: MonthlyStatsProps) {
  const [year, month] = selectedMonth.split("-");
  const isNetSurplus = stats.netAmount <= 0;

  return (
    <div className="w-full max-w-md mx-auto space-y-4 px-2">
      
      {/* Overview Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden">
        
        {/* Decorative corner accent */}
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none ${
          isNetSurplus ? "bg-emerald-400" : "bg-rose-400"
        }`} />

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider block">
            {year}년 {parseInt(month, 10)}월 기분 리포트
          </span>
          <h3 className="text-lg font-extrabold text-slate-800">
            기분 가계부 정산 현황
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-rose-50/50 border border-rose-100/50 rounded-2xl p-3.5 space-y-1 text-center">
            <span className="text-[10px] font-bold text-rose-500 uppercase block">총 감정 지출</span>
            <span className="text-base font-black text-rose-700 block">
              {formatCurrency(stats.totalExpenditure)}
            </span>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-3.5 space-y-1 text-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase block">총 감정 할인</span>
            <span className="text-base font-black text-emerald-700 block">
              -{formatCurrency(stats.totalDiscount).replace("-", "")}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500">순수 마음 손익</span>
          <span className={`text-base font-black ${isNetSurplus ? "text-emerald-600" : "text-rose-600"}`}>
            {isNetSurplus ? "마음 흑자 " : ""}
            {formatCurrency(stats.netAmount)}
          </span>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 gap-3">
        
        {/* Most Frequent Emotion */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">
              가장 많이 발생한 감정
            </span>
            <span className="text-sm font-extrabold text-slate-800 block">
              {stats.mostFrequentEmotion ? stats.mostFrequentEmotion.label : "기록 없음"}
            </span>
          </div>
          <div className="shrink-0 bg-slate-50 text-slate-800 font-black text-xs px-3 py-1.5 rounded-full border border-slate-200">
            {stats.mostFrequentEmotion ? `${stats.mostFrequentEmotion.count}회 감지` : "-"}
          </div>
        </div>

        {/* Most Expensive (Expenditure) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-rose-500 tracking-wider uppercase block">
              가장 큰 감정 지출 (부정)
            </span>
            <span className="text-sm font-extrabold text-slate-800 block">
              {stats.mostExpensiveEmotion ? stats.mostExpensiveEmotion.label : "기록 없음"}
            </span>
          </div>
          <div className="shrink-0 bg-rose-50 text-rose-700 font-extrabold text-xs px-3 py-1.5 rounded-full border border-rose-100">
            {stats.mostExpensiveEmotion ? formatCurrency(stats.mostExpensiveEmotion.amount) : "-"}
          </div>
        </div>

        {/* Biggest Discount (Positive) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-emerald-600 tracking-wider uppercase block">
              가장 큰 감정 할인 (긍정)
            </span>
            <span className="text-sm font-extrabold text-slate-800 block">
              {stats.biggestDiscountEmotion ? stats.biggestDiscountEmotion.label : "기록 없음"}
            </span>
          </div>
          <div className="shrink-0 bg-emerald-50 text-emerald-700 font-extrabold text-xs px-3 py-1.5 rounded-full border border-emerald-100">
            {stats.biggestDiscountEmotion ? `-${formatCurrency(stats.biggestDiscountEmotion.amount).replace("-", "")}` : "-"}
          </div>
        </div>

      </div>

    </div>
  );
}
