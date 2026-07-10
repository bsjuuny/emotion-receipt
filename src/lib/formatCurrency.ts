export function formatCurrency(amount: number, isDiscount: boolean = false): string {
  const absVal = Math.abs(amount);
  const formatted = absVal.toLocaleString("ko-KR") + "원";
  if (isDiscount || amount < 0) {
    return `-${formatted}`;
  }
  return formatted;
}
