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
      className="rounded-2xl p-7 mb-5 text-white shadow-asset-card"
      style={{
        background: "linear-gradient(135deg, #11593F 0%, #1a7a57 100%)",
      }}
    >
      <h2 className="text-[13px] opacity-90 mb-2">누적 투자 금액 (정가 합계)</h2>
      <div className="text-2xl md:text-3xl font-extrabold mb-1.5">
        ₩{totalValue.toLocaleString()}
      </div>
      <div className="text-[15px] font-bold opacity-85">
        총 {totalCount}권{giftCount > 0 ? ` (선물 ${giftCount}권 포함)` : ""}
      </div>
    </div>
  );
}
