"use client";

import { Layers } from "lucide-react";

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
<<<<<<< HEAD
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
=======
      className="rounded-2xl p-5 sm:p-7 shadow-asset-card border"
      style={{
        backgroundColor: "#C98C6E",
        borderColor: "rgba(139, 84, 54, 0.6)",
      }}
    >
      <h2 className="text-[14px] sm:text-[15px] font-bold font-serif mb-3" style={{ color: "#fffbf7" }}>
        차곡차곡 책 자산
      </h2>
      <div className="flex items-center gap-3 flex-wrap">
        <Layers size={32} className="flex-shrink-0" strokeWidth={2} style={{ color: "#fffbf7" }} />
        <div>
          <div className="text-[28px] sm:text-[32px] font-extrabold tracking-tight" style={{ color: "#fffbf7" }}>
            ₩{totalValue.toLocaleString()}
          </div>
          <div className="text-[14px] sm:text-[15px] font-medium mt-0.5" style={{ color: "rgba(255,251,247,0.85)" }}>
            총 {totalCount}권{giftCount > 0 ? ` (선물 ${giftCount}권 포함)` : ""}
          </div>
        </div>
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
      </div>
    </div>
  );
}
