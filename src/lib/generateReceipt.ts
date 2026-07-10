import { EmotionIntensity, EmotionItem, EmotionReceipt, EmotionType } from "../types/receipt";
import { EMOTIONS } from "../data/emotions";
import { calculateEmotionAmount } from "./calculateEmotionAmount";

interface RawEmotionInput {
  type: EmotionType;
  intensity: EmotionIntensity;
}

// Map of final messages based on totalAmount
const FINAL_MESSAGES_LE_0 = [
  "오늘은 마음이 흑자입니다. 😊",
  "웃음으로 대부분 환불된 하루입니다. 🌸",
  "마음의 금고가 든든하게 채워진 날. ✨",
];

const FINAL_MESSAGES_LE_20000 = [
  "그래도 괜찮은 하루 ☕",
  "약간 비쌌지만 감당 가능한 하루입니다. 👍",
  "적당히 균형을 이룬 보통의 날. ⚖️",
];

const FINAL_MESSAGES_LE_60000 = [
  "오늘은 마음이 조금 과소비했습니다. 🛒",
  "피곤했지만 망한 날은 아닙니다. 🔋",
  "조금 무거웠지만 교훈이 남은 하루. 📝",
];

const FINAL_MESSAGES_GT_60000 = [
  "감정 할부 3개월 필요 💳",
  "내일의 나에게 일부 청구 예정입니다. 🚨",
  "정신적 전액 파산 위기, 긴급 휴식 요망! 🛑",
];

function getRandomItem<T>(arr: T[]): T {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

export function generateReceipt(inputs: RawEmotionInput[], userMemo: string = ""): EmotionReceipt {
  // Map raw inputs to EmotionItem with details
  const items: EmotionItem[] = inputs.map(input => {
    const def = EMOTIONS.find(e => e.type === input.type);
    const label = def ? def.label : input.type;
    const isDiscount = def ? def.isDiscount : false;
    const amount = calculateEmotionAmount(input.intensity);

    return {
      type: input.type,
      label,
      intensity: input.intensity,
      amount,
      isDiscount,
    };
  });

  // Calculate total amount
  let totalAmount = 0;
  items.forEach(item => {
    if (item.isDiscount) {
      totalAmount -= item.amount;
    } else {
      totalAmount += item.amount;
    }
  });

  // 1. Resolve final message
  let finalMessage = "";
  if (totalAmount <= 0) {
    finalMessage = getRandomItem(FINAL_MESSAGES_LE_0);
  } else if (totalAmount <= 20000) {
    finalMessage = getRandomItem(FINAL_MESSAGES_LE_20000);
  } else if (totalAmount <= 60000) {
    finalMessage = getRandomItem(FINAL_MESSAGES_LE_60000);
  } else {
    finalMessage = getRandomItem(FINAL_MESSAGES_GT_60000);
  }

  // 2. Resolve smart system memo
  let systemMemo = "";

  // Check dominant emotions
  const hasChildSmile = items.some(i => i.type === "childSmile");
  const hasFatigue = items.find(i => i.type === "fatigue");
  const hasPride = items.some(i => i.type === "pride");
  const hasSmallWin = items.some(i => i.type === "smallWin");

  const positiveItems = items.filter(i => i.isDiscount);
  const negativeItems = items.filter(i => !i.isDiscount);

  // Core rule checks
  if (hasFatigue && (hasFatigue.intensity === "high" || hasFatigue.intensity === "dominant")) {
    systemMemo = "🔋 피로 누적이 과다합니다. 오늘은 추가 정산 없이 무조건 꿀잠 자는 것을 전액 권장합니다.";
  } else if (hasChildSmile) {
    systemMemo = "👶 아이의 맑은 미소 한 방에 오늘의 찌푸림이 전부 할인 환불처리 되었습니다.";
  } else if (hasPride || hasSmallWin) {
    systemMemo = "🏆 무형의 자산인 뿌듯함과 작은 성취를 매수하셨으니 매우 가치 있는 소비였습니다.";
  } else if (positiveItems.length === 0 && negativeItems.length > 0) {
    systemMemo = "🩹 마음에 적자 폭이 컸던 하루였지만, 단단한 방어력을 샀다고 생각해요. 내일은 대폭 할인이 올 거예요.";
  } else if (positiveItems.length > negativeItems.length) {
    systemMemo = "☀️ 마음 가득 긍정 혜택을 챙기신 지혜로운 하루였네요. 이 기운으로 내일도 파이팅입니다!";
  } else {
    systemMemo = "📝 감정 장부에 소소한 흔적을 남긴 날. 비록 지출도 있었지만 배움 가득한 하루였습니다.";
  }

  // Combine user memo with system memo if user memo exists
  const finalMemo = userMemo ? `${userMemo} (${systemMemo})` : systemMemo;

  const uniqueId = `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    id: uniqueId,
    date: new Date().toISOString(),
    items,
    totalAmount,
    finalMessage,
    memo: finalMemo,
    createdAt: new Date().toISOString(),
  };
}
