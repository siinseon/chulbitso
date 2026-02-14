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
      className="rounded-2xl p-5 sm:p-7 mb-5 text-white shadow-asset-card font-serif"
      style={{
        background: "linear-gradient(160deg, var(--point-color) 0%, #5a7350 60%, #4a5e42 100%)",
        boxShadow: "0 4px 20px rgba(58,49,40,0.12)",
      }}
    >
      <h2 className="text-[14px] sm:text-[15px] opacity-95 mb-2 tracking-tight">누적 투자 금액 (정가 합계)</h2>
      <div className="text-[26px] sm:text-3xl font-extrabold mb-1.5">
        ₩{totalValue.toLocaleString()}
      </div>
      <div className="text-[15px] sm:text-[16px] font-bold opacity-85">
        총 {totalCount}권{giftCount > 0 ? ` (선물 ${giftCount}권 포함)` : ""}
      </div>
    </div>
  );
}
