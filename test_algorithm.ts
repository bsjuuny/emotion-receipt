import { generateReceipt } from "./src/lib/generateReceipt";
import { EmotionType, EmotionIntensity } from "./src/types/receipt";

interface RawInput {
  type: EmotionType;
  intensity: EmotionIntensity;
}

function runTestCase(caseName: string, inputs: RawInput[], userMemo: string = "") {
  console.log(`=== [${caseName}] ===`);
  console.log("Inputs:", inputs.map(i => `${i.type} (${i.intensity})`).join(", "));
  console.log("User Memo:", userMemo || "(None)");
  
  const receipt = generateReceipt(inputs, userMemo);
  
  console.log("-----------------------------------------");
  console.log("Receipt ID:", receipt.id);
  console.log("Items:");
  receipt.items.forEach(item => {
    console.log(`  - ${item.label}: ${item.isDiscount ? "할인 -" : ""}${item.amount.toLocaleString()}원`);
  });
  console.log("Total Amount (Net):", receipt.totalAmount.toLocaleString() + "원");
  console.log("Final Message:", receipt.finalMessage);
  console.log("System/Combined Memo:", receipt.memo);
  console.log("=========================================\n");
  
  return receipt;
}

console.log("Starting Emotion Receipt Algorithm Tests...\n");

// Scenario 1: Mixed emotions (fatigue dominant + childSmile high + pride medium + irritation low)
const input1: RawInput[] = [
  { type: "fatigue", intensity: "dominant" }, // 42,000 (Expense)
  { type: "childSmile", intensity: "high" },   // -25,000 (Discount)
  { type: "pride", intensity: "medium" },     // -12,000 (Discount)
  { type: "irritation", intensity: "low" },   // 5,000 (Expense)
];
// Expected total = 42,000 - 25,000 - 12,000 + 5,000 = 10,000원
const res1 = runTestCase("SCENARIO 1: MIXED EMOTIONS", input1);

// Scenario 2: Pure positive (calm high + gratitude medium)
const input2: RawInput[] = [
  { type: "calm", intensity: "high" },        // -25,000 (Discount)
  { type: "gratitude", intensity: "medium" }, // -12,000 (Discount)
];
// Expected total = -37,000원 (Surplus)
const res2 = runTestCase("SCENARIO 2: PURE POSITIVE (SURPLUS)", input2);

// Assertions
const case1Passed = res1.totalAmount === 10000;
const case2Passed = res2.totalAmount === -37000;
const case1MemoPassed = res1.memo.includes("피로 누적이 과다합니다") || res1.memo.includes("아이의 맑은 미소");
const case2MessagePassed = res2.finalMessage.includes("흑자") || res2.finalMessage.includes("환불");

console.log(`Case 1 Amount Verification: ${case1Passed ? "PASS ✅" : "FAIL ❌"}`);
console.log(`Case 2 Amount Verification: ${case2Passed ? "PASS ✅" : "FAIL ❌"}`);
console.log(`Case 1 System Memo Rule: ${case1MemoPassed ? "PASS ✅" : "FAIL ❌"}`);
console.log(`Case 2 Final Message Rule: ${case2MessagePassed ? "PASS ✅" : "FAIL ❌"}`);

if (case1Passed && case2Passed && case1MemoPassed && case2MessagePassed) {
  console.log("\n🎉 ALL EMOTION RECEIPT ALGORITHM TESTS COMPLETED SUCCESSFULLY! 🎉");
} else {
  process.exit(1);
}
