"use client";

interface DashboardProps {
  readCount?: number;
  totalCount?: number;
  remainingCount?: number;
}

export default function Dashboard({
  readCount = 2,
  totalCount = 4,
  remainingCount = 2,
}: DashboardProps) {
  return (
    <div
      className="rounded-2xl p-7 mb-5 text-white shadow-asset-card"
      style={{
        background: "linear-gradient(135deg, #4A5E42 0%, #6A8B9A 100%)",
      }}
    >
      <h2 className="text-[13px] opacity-90 mb-2">독서 현황</h2>
      <div className="text-3xl font-extrabold mb-1.5">
        읽은 책 {readCount}권 / 전체 {totalCount}권
      </div>
      <div className="text-[15px] font-bold opacity-85">
        남은 책 {remainingCount}권
      </div>
    </div>
  );
}
