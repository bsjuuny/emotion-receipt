import { EmotionReceipt } from "../types/receipt";
import { formatCurrency } from "./formatCurrency";

interface ShareResult {
  shared: boolean;
  copied: boolean;
}

export async function shareReceipt(receipt: EmotionReceipt): Promise<ShareResult> {
  const formattedAmount = formatCurrency(receipt.totalAmount);
  const shareTitle = `감정영수증 - ${receipt.finalMessage}`;
  const shareText = `[감정영수증 - 오늘의 감정 정산]\n\n최종 결제: ${receipt.finalMessage}\n총합계 금액: ${formattedAmount}\n메모: ${receipt.memo}\n\n오늘 나의 감정영수증을 정산해보세요!`;
  
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  // 1. Try Web Share API if supported
  if (typeof navigator !== "undefined" && navigator.share && navigator.canShare) {
    try {
      const shareData = {
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      };
      
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return { shared: true, copied: false };
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Web Share failed:", error);
      }
    }
  }

  // 2. Fallback to clipboard copy
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      const copyText = `${shareText}\n${shareUrl}`;
      await navigator.clipboard.writeText(copyText);
      return { shared: false, copied: true };
    } catch (error) {
      console.error("Clipboard copy failed:", error);
    }
  }

  return { shared: false, copied: false };
}
