import { EmotionType } from "../types/receipt";

export interface EmotionDefinition {
  type: EmotionType;
  label: string;
  isDiscount: boolean; // true = 긍정(할인), false = 부정(지출)
  emoji: string;
}

export const EMOTIONS: EmotionDefinition[] = [
  { type: "fatigue", label: "피로", isDiscount: false, emoji: "😫" },
  { type: "pride", label: "뿌듯함", isDiscount: true, emoji: "😎" },
  { type: "unfairness", label: "억울함", isDiscount: false, emoji: "🥺" },
  { type: "joy", label: "기쁨", isDiscount: true, emoji: "🥰" },
  { type: "anxiety", label: "불안", isDiscount: false, emoji: "😰" },
  { type: "irritation", label: "짜증", isDiscount: false, emoji: "⚡" },
  { type: "calm", label: "평온", isDiscount: true, emoji: "🧘" },
  { type: "sadness", label: "서운함", isDiscount: false, emoji: "😢" },
  { type: "gratitude", label: "고마움", isDiscount: true, emoji: "🙏" },
  { type: "childSmile", label: "아이 웃음", isDiscount: true, emoji: "👶" },
  { type: "goodMeal", label: "맛있는 밥", isDiscount: true, emoji: "🍖" },
  { type: "smallWin", label: "작은 성취", isDiscount: true, emoji: "🏆" },
];
