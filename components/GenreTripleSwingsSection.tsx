"use client";

import { useState } from "react";
import type { GenreStat } from "@/lib/analysisStats";

const FRAME_DARK = "#3a3632";
const FRAME_RUST = "#5c5044";
const FRAME_LIGHT = "#6b5e52";
const FRAME_OUTLINE = "#2a2622";
const CHAIN_RUST = "#6b5a4a";
const CHAIN_DARK = "#4a4036";

/* 독서 습관 정글짐 색상만 사용 */
const SEAT_COLORS = ["#a89268", "#6a7a8a", "#9a6b58"] as const;

/* 배치: 좌=2위, 중앙=1위, 우=3위 */
const ORDER = [1, 0, 2] as const; // topGenres[index] → left, center, right

const SWING_ANIM = [
  "animate-swing-2", // 좌측: 2위
  "animate-swing-1", // 중앙: 1위
  "animate-swing-3", // 우측: 3위
] as const;

interface SwingProps {
  genre: GenreStat | null;
  animClass: string;
  seatColor: string;
  onPush: () => void;
  isPushing: boolean;
}

function SingleSwing({ genre, animClass, seatColor, onPush, isPushing }: SwingProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const displayName = genre?.name ?? "—";
  const count = genre?.count ?? 0;

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <div className="relative flex flex-col items-center">
      {/* 말풍선 툴팁 */}
      {showTooltip && genre && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-lg whitespace-nowrap"
          style={{
            background: "rgba(58, 49, 40, 0.92)",
            color: "#F2E6D0",
            fontSize: 11,
            fontFamily: "var(--font-serif-myeongjo)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {displayName} (총 {count}권)
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45"
            style={{ background: "rgba(58, 49, 40, 0.92)" }}
          />
        </div>
      )}

      <div
        className={`flex flex-col items-stretch flex-1 min-w-0 max-w-[80px] w-[76px] cursor-pointer select-none ${
          showTooltip || isPushing ? "" : animClass
        } ${isPushing ? "animate-swing-push" : ""}`}
        style={{ transformOrigin: "top center" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => genre && onPush()}
      >
        {/* 체인 연결 고리 */}
        <div className="flex justify-between px-0 mb-0" style={{ height: 4 }}>
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: `linear-gradient(145deg, ${FRAME_RUST} 0%, ${FRAME_DARK} 100%)`,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)",
            }}
          />
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: `linear-gradient(145deg, ${FRAME_RUST} 0%, ${FRAME_DARK} 100%)`,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)",
            }}
          />
        </div>
        {/* 녹슨 체인 */}
        <div className="flex justify-between px-0 flex-shrink-0 h-[130px] min-h-[130px]">
          <div
            className="w-[3px] flex-shrink-0 rounded-sm h-[130px] min-h-[130px]"
            style={{
              background: `repeating-linear-gradient(180deg, ${CHAIN_RUST} 0px, ${CHAIN_RUST} 4px, ${CHAIN_DARK} 4px, ${CHAIN_DARK} 8px)`,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          />
          <div
            className="w-[3px] flex-shrink-0 rounded-sm h-[130px] min-h-[130px]"
            style={{
              background: `repeating-linear-gradient(180deg, ${CHAIN_RUST} 0px, ${CHAIN_RUST} 4px, ${CHAIN_DARK} 4px, ${CHAIN_DARK} 8px)`,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          />
        </div>
        {/* 의자 (정글짐 색상: 골드 / 블루그레이 / 러스트) */}
        <div
          className="w-full min-h-[28px] -mt-px px-2 py-1.5 text-center flex flex-col justify-center rounded-sm"
          style={{
            background: `linear-gradient(180deg, ${seatColor} 0%, ${seatColor} 70%, rgba(0,0,0,0.12) 100%)`,
            border: `2px solid ${FRAME_OUTLINE}`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.12)",
          }}
        >
          <p
            className="text-[10px] text-[#2a2622] font-jua leading-tight truncate w-full"
            style={{ letterSpacing: "0.02em" }}
            title={displayName}
          >
            {displayName}
          </p>
        </div>
      </div>
    </div>
  );
}

interface GenreTripleSwingsSectionProps {
  topGenres: GenreStat[];
}

export default function GenreTripleSwingsSection({ topGenres }: GenreTripleSwingsSectionProps) {
  const [pushingIndex, setPushingIndex] = useState<number | null>(null);
  const list = topGenres ?? [];

  const items: (GenreStat | null)[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = ORDER[i];
    items.push(list[idx] ?? null);
  }

  const handlePush = (index: number) => {
    setPushingIndex(index);
    setTimeout(() => setPushingIndex(null), 900);
  };

  return (
    <section
      className="rounded-2xl p-5 border border-secondary overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
        장르 명예의 전당: 3인용 그네
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">가장 많이 읽은 장르 TOP 3</p>

      <div className="relative w-full max-w-[440px] mx-auto overflow-hidden" style={{ height: 260 }}>
        {/* 꼭대기 가로 봉 (녹슨 금속) */}
        <div
          className="absolute left-0 right-0 rounded-sm"
          style={{
            top: 20,
            width: "100%",
            height: 14,
            background: `linear-gradient(180deg, ${FRAME_LIGHT} 0%, ${FRAME_RUST} 40%, ${FRAME_DARK} 100%)`,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15)",
            border: `2px solid ${FRAME_OUTLINE}`,
          }}
        />

        {/* 왼쪽 세로 기둥 */}
        <div
          className="absolute rounded-sm"
          style={{
            left: "2%",
            top: 34,
            width: 12,
            height: 195,
            background: `linear-gradient(90deg, ${FRAME_LIGHT} 0%, ${FRAME_RUST} 50%, ${FRAME_DARK} 100%)`,
            boxShadow: "inset 1px 0 0 rgba(255,255,255,0.06), inset -1px 0 0 rgba(0,0,0,0.2)",
            border: `2px solid ${FRAME_OUTLINE}`,
          }}
        />
        {/* 오른쪽 세로 기둥 */}
        <div
          className="absolute rounded-sm"
          style={{
            right: "2%",
            top: 34,
            width: 12,
            height: 195,
            background: `linear-gradient(90deg, ${FRAME_DARK} 0%, ${FRAME_RUST} 50%, ${FRAME_LIGHT} 100%)`,
            boxShadow: "inset -1px 0 0 rgba(0,0,0,0.2), inset 1px 0 0 rgba(255,255,255,0.06)",
            border: `2px solid ${FRAME_OUTLINE}`,
          }}
        />

        {/* 그네 3개: 좌(2위) | 중(1위) | 우(3위) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex justify-around gap-3 px-6"
          style={{ top: 34 }}
        >
          {items.map((genre, i) => (
            <SingleSwing
              key={i}
              genre={genre}
              animClass={SWING_ANIM[i]}
              seatColor={SEAT_COLORS[i % 3]}
              onPush={() => handlePush(i)}
              isPushing={pushingIndex === i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
