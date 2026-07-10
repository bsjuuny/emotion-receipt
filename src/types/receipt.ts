export type EmotionType =
  | "fatigue"
  | "pride"
  | "unfairness"
  | "joy"
  | "anxiety"
  | "irritation"
  | "calm"
  | "sadness"
  | "gratitude"
  | "childSmile"
  | "goodMeal"
  | "smallWin";

export type EmotionIntensity = "low" | "medium" | "high" | "dominant";

export interface EmotionItem {
  type: EmotionType;
  label: string;
  intensity: EmotionIntensity;
  amount: number;
  isDiscount: boolean;
}

export interface EmotionReceipt {
  id: string;
  date: string;
  items: EmotionItem[];
  totalAmount: number;
  finalMessage: string;
  memo: string;
  createdAt: string;
}
