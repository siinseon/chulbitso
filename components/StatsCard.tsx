"use client";

interface StatsCardProps {
  totalValue: number;
  totalCount: number;
  giftCount?: number;
}

export default function StatsCard({
  totalValue,
  totalCount,
  giftCount = 0,
}: StatsCardProps) {
  return (
    <div
      className="rounded-2xl p-5 sm:p-7 mb-5 text-white shadow-asset-card"
      style={{
        background: "linear-gradient(135deg, #11593F 0%, #1a7a57 100%)",
      }}
    >
      <h2 className="text-[14px] sm:text-[15px] opacity-90 mb-2">누적 투자 금액 (정가 합계)</h2>
      <div className="text-[26px] sm:text-3xl font-extrabold mb-1.5">
        ₩{totalValue.toLocaleString()}
      </div>
      <div className="text-[15px] sm:text-[16px] font-bold opacity-85">
        총 {totalCount}권{giftCount > 0 ? ` (선물 ${giftCount}권 포함)` : ""}
      </div>
    </div>
  );
}
