import { EmotionIntensity } from "../types/receipt";

export function calculateEmotionAmount(intensity: EmotionIntensity): number {
  switch (intensity) {
    case "low":
      return 5000;
    case "medium":
      return 12000;
    case "high":
      return 25000;
    case "dominant":
      return 42000;
    default:
      return 0;
  }
}
