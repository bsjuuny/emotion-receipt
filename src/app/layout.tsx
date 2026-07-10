import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "감정영수증 | 하루 감정 가방 정산기",
  description: "오늘 하루 어떤 기분이었나요? 복잡한 나의 하루 감정을 긍정 할인과 부정 지출로 계산하여 한 장의 영수증으로 정산해드립니다.",
};

export default function RootLayout({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-[#faf9f5] text-slate-800">
        {children}
      </body>
    </html>
  );
}
