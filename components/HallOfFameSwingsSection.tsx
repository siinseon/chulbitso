"use client";

import type { HallOfFameItem } from "@/lib/analysisStats";

const FRAME_DARK = "#3a3632";
const FRAME_RUST = "#5c5044";
const FRAME_LIGHT = "#6b5e52";
const FRAME_OUTLINE = "#2a2622";
const ROPE_RUST = "#6b5a4a";
const ROPE_DARK = "#4a4036";

const SEAT_COLORS = [
  "#C98C6E",
  "#6A8B9A",
  "#8C9E83",
] as const;

const SWING_ANIM = [
  "animate-swing-1",
  "animate-swing-2",
  "animate-swing-3",
] as const;

function SwingSetRow({
  items,
  title,
}: {
  items: HallOfFameItem[];
  title: string;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <p className="text-[11px] font-bold text-primary font-serif mb-4">{title}</p>
      {/* 그네대: 세로 기둥 2개 + 가로 봉 (이미지 비율), 그네 3개 */}
      <div className="relative w-full max-w-[280px] overflow-visible" style={{ height: 180 }}>
        {/* 가로 봉 (녹슨 금속 느낌) */}
        <div
          className="absolute left-0 right-0 rounded-sm"
          style={{
            top: 0,
            height: 16,
            background: `linear-gradient(180deg, ${FRAME_LIGHT} 0%, ${FRAME_RUST} 40%, ${FRAME_DARK} 100%)`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.2)",
            border: `2px solid ${FRAME_OUTLINE}`,
          }}
        />
        {/* 왼쪽 세로 기둥 (녹슨) */}
        <div
          className="absolute left-0 rounded-sm"
          style={{
            top: 16,
            width: 14,
            height: 114,
            background: `linear-gradient(90deg, ${FRAME_LIGHT} 0%, ${FRAME_RUST} 50%, ${FRAME_DARK} 100%)`,
            boxShadow: "inset 1px 0 0 rgba(255,255,255,0.06), inset -1px 0 0 rgba(0,0,0,0.15)",
            border: `2px solid ${FRAME_OUTLINE}`,
          }}
        />
        {/* 오른쪽 세로 기둥 (녹슨) */}
        <div
          className="absolute right-0 rounded-sm"
          style={{
            top: 16,
            width: 14,
            height: 114,
            background: `linear-gradient(90deg, ${FRAME_DARK} 0%, ${FRAME_RUST} 50%, ${FRAME_LIGHT} 100%)`,
            boxShadow: "inset 1px 0 0 rgba(0,0,0,0.15), inset -1px 0 0 rgba(255,255,255,0.06)",
            border: `2px solid ${FRAME_OUTLINE}`,
          }}
        />

        {/* 그네 3개: 가로 봉 아래, 세로 기둥과 폭(여백) 두고 매달림 */}
        <div
          className="absolute left-0 right-0 flex justify-around gap-2 px-8"
          style={{ top: 16 }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col items-stretch flex-1 min-w-0 max-w-[76px] w-[72px] ${SWING_ANIM[i]}`}
              style={{ transformOrigin: "top center" }}
            >
              {/* 가로 봉에 매달리는 고리 (녹슨) */}
              <div className="flex justify-between px-0 mb-0" style={{ height: 4 }}>
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: `linear-gradient(145deg, ${FRAME_RUST} 0%, ${FRAME_DARK} 100%)`,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3)",
                  }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: `linear-gradient(145deg, ${FRAME_RUST} 0%, ${FRAME_DARK} 100%)`,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
              {/* 줄 (녹슨 체인/로프 느낌) */}
              <div className="flex justify-between px-0 flex-shrink-0" style={{ height: 88, minHeight: 88 }}>
                <div
                  className="w-[2px] flex-shrink-0 self-start rounded-full"
                  style={{
                    height: 88,
                    minHeight: 88,
                    background: `repeating-linear-gradient(180deg, ${ROPE_RUST} 0px, ${ROPE_RUST} 3px, ${ROPE_DARK} 3px, ${ROPE_DARK} 6px)`,
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                  }}
                />
                <div
                  className="w-[2px] flex-shrink-0 self-start rounded-full"
                  style={{
                    height: 88,
                    minHeight: 88,
                    background: `repeating-linear-gradient(180deg, ${ROPE_RUST} 0px, ${ROPE_RUST} 3px, ${ROPE_DARK} 3px, ${ROPE_DARK} 6px)`,
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
              {/* 의자 (살짝 두께감 + 테두리) */}
              <div
                className="w-full min-h-[24px] -mt-px px-1.5 py-1 text-center flex flex-col justify-center rounded-none"
                style={{
                  background: SEAT_COLORS[i],
                  border: `2px solid ${FRAME_OUTLINE}`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.12)",
                }}
              >
                <p className="text-[9px] font-bold text-[#1a1a1a] font-serif truncate w-full leading-tight">
                  {item.value}
                </p>
                <p className="text-[8px] text-[#1a1a1a]/80 font-sans leading-tight">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface HallOfFameSwingsSectionProps {
  hallOfFame: HallOfFameItem[];
}

export default function HallOfFameSwingsSection({ hallOfFame }: HallOfFameSwingsSectionProps) {
  const items: HallOfFameItem[] = [...hallOfFame].slice(0, 9);
  while (items.length < 9) {
    items.push({ label: "-", value: "—" });
  }

  return (
    <section
      className="rounded-2xl p-5 border border-secondary overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-6 flex items-center gap-2">
        🎠 명예의 전당 그네
      </h3>
      <div className="space-y-10">
        <SwingSetRow
          items={items.slice(0, 3)}
          title="가장 많이 읽은 시리즈 1·2·3등"
        />
        <SwingSetRow
          items={items.slice(3, 6)}
          title="가장 많이 읽은 작가 1·2·3등"
        />
        <SwingSetRow
          items={items.slice(6, 9)}
          title="가장 많이 읽은 장르 1·2·3등"
        />
      </div>
    </section>
  );
}
