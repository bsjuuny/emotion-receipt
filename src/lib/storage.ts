import { EmotionReceipt, EmotionType } from "../types/receipt";

const STORAGE_KEY = "emotion_receipts_v1";

export function getReceipts(): EmotionReceipt[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse receipts from localStorage:", error);
    return [];
  }
}

export function saveReceipt(receipt: EmotionReceipt): void {
  if (typeof window === "undefined") return;
  try {
    const current = getReceipts();
    const updated = [receipt, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save receipt to localStorage:", error);
  }
}

export function deleteReceipt(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getReceipts();
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to delete receipt from localStorage:", error);
  }
}

export interface MonthlyStatsData {
  totalExpenditure: number; // 부정 감정 금액 합
  totalDiscount: number; // 긍정 감정 금액 합 (양수값)
  netAmount: number; // totalExpenditure - totalDiscount
  mostFrequentEmotion: { label: string; count: number } | null;
  mostExpensiveEmotion: { label: string; amount: number } | null;
  biggestDiscountEmotion: { label: string; amount: number } | null;
}

export function getMonthlyStats(yearMonth: string): MonthlyStatsData {
  // yearMonth format: "YYYY-MM" (e.g., "2026-06")
  const allReceipts = getReceipts();
  
  // Filter by yearMonth
  const monthlyReceipts = allReceipts.filter(r => {
    return r.createdAt.startsWith(yearMonth);
  });

  let totalExpenditure = 0;
  let totalDiscount = 0;

  const emotionCounts: Record<string, { label: string; count: number }> = {};
  
  let maxExpense = -1;
  let maxExpenseLabel = "";
  
  let maxDiscount = -1;
  let maxDiscountLabel = "";

  monthlyReceipts.forEach(receipt => {
    receipt.items.forEach(item => {
      // 1. Accumulate total amounts
      if (item.isDiscount) {
        totalDiscount += item.amount;
      } else {
        totalExpenditure += item.amount;
      }

      // 2. Count frequency
      if (!emotionCounts[item.type]) {
        emotionCounts[item.type] = { label: item.label, count: 0 };
      }
      emotionCounts[item.type].count++;

      // 3. Find most expensive negative emotion
      if (!item.isDiscount && item.amount > maxExpense) {
        maxExpense = item.amount;
        maxExpenseLabel = item.label;
      }

      // 4. Find biggest discount positive emotion
      if (item.isDiscount && item.amount > maxDiscount) {
        maxDiscount = item.amount;
        maxDiscountLabel = item.label;
      }
    });
  });

  // Calculate most frequent
  let mostFrequent: { label: string; count: number } | null = null;
  let maxCount = -1;
  Object.keys(emotionCounts).forEach(type => {
    const data = emotionCounts[type];
    if (data.count > maxCount) {
      maxCount = data.count;
      mostFrequent = { label: data.label, count: data.count };
    }
  });

  return {
    totalExpenditure,
    totalDiscount,
    netAmount: totalExpenditure - totalDiscount,
    mostFrequentEmotion: mostFrequent,
    mostExpensiveEmotion: maxExpense !== -1 ? { label: maxExpenseLabel, amount: maxExpense } : null,
    biggestDiscountEmotion: maxDiscount !== -1 ? { label: maxDiscountLabel, amount: maxDiscount } : null,
  };
}

export function getAvailableMonths(): string[] {
  const allReceipts = getReceipts();
  const monthsSet = new Set<string>();
  
  allReceipts.forEach(r => {
    if (r.createdAt && r.createdAt.length >= 7) {
      monthsSet.add(r.createdAt.substring(0, 7)); // "YYYY-MM"
    }
  });

  // If empty, return current month as default option
  if (monthsSet.size === 0) {
    const now = new Date().toISOString().substring(0, 7);
    return [now];
  }

  return Array.from(monthsSet).sort().reverse();
}
