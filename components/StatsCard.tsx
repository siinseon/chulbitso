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
      </div>
    </div>
  );
}
