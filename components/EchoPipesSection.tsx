"use client";

import { useState } from "react";
import type { TranslatorStat } from "@/lib/analysisStats";

const METAL_DARK = "#3A3128";
const METAL_RUST = "#4A5E42";
const METAL_LIGHT = "#5a6b50";

function PipeOpening({
  rank,
  translator,
  isHovered,
  onHover,
}: {
  rank: number;
  translator: TranslatorStat | null;
  isHovered: boolean;
  onHover: (v: boolean) => void;
}) {
  const sizes = [96, 72, 56];
  const size = sizes[rank] ?? 56;

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div
        className={`relative rounded-full flex items-center justify-center transition-transform duration-150 ${
          isHovered ? "animate-pipe-whisper" : ""
        }`}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 30%, ${METAL_LIGHT} 0%, ${METAL_RUST} 40%, ${METAL_DARK} 100%)`,
          boxShadow: `
            inset 0 2px 8px rgba(255,255,255,0.08),
            inset 0 -2px 6px rgba(0,0,0,0.3),
            0 4px 12px rgba(0,0,0,0.2)
          `,
          border: `2px solid ${METAL_DARK}`,
        }}
      >
        {/* 페인트 벗겨진 얼룩 */}
        <div
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle at 20% 80%, transparent 0%, ${METAL_DARK} 15%, transparent 25%),
                         radial-gradient(circle at 80% 20%, transparent 0%, ${METAL_DARK} 10%, transparent 20%)`,
          }}
        />
        {/* 내부 어두운 구멍 */}
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: size * 0.5,
            height: size * 0.5,
            background: `radial-gradient(circle at 30% 30%, #2a241e 0%, #1a1612 100%)`,
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          {!translator && (
            <span className="text-[18px] sm:text-[20px] font-serif text-[#8a7a6a]" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
              ?
            </span>
          )}
        </div>

        {isHovered && (
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-20 min-w-[120px] px-3 py-2 rounded-lg text-center"
            style={{
              background: "rgba(58, 49, 40, 0.95)",
              border: "1px solid #4A5E42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {translator ? (
              <>
                <p className="text-[12px] font-bold text-[#E8DCC8] font-serif">
                  {translator.name}
                </p>
                <p className="text-[10px] text-[#b8a898] font-serif mt-0.5">
                  총 {translator.count}권의 목소리
                </p>
              </>
            ) : (
              <p className="text-[11px] text-[#b8a898] font-serif">아직 기록이 없어요</p>
            )}
          </div>
        )}
      </div>
      {/* 파이프 기둥 (모래에서 솟아오름) */}
      <div
        className="flex-shrink-0"
        style={{
          width: size * 0.6,
          height: 12,
          background: `linear-gradient(180deg, ${METAL_RUST} 0%, ${METAL_DARK} 100%)`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 4px rgba(0,0,0,0.2)",
          border: `1px solid ${METAL_DARK}`,
          borderRadius: "0 0 4px 4px",
        }}
      />
    </div>
  );
}

export default function EchoPipesSection({
  topTranslators,
}: {
  topTranslators: TranslatorStat[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items: (TranslatorStat | null)[] = [];
  for (let i = 0; i < 3; i++) {
    items.push(topTranslators[i] ?? null);
  }

  return (
    <section
      className="rounded-2xl p-5 border border-secondary overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
        언어의 울림통
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">번역서 역자 TOP 3</p>

      {/* 모래 바닥 + 파이프 3개 */}
      <div
        className="relative rounded-xl overflow-visible flex items-end justify-center gap-6 sm:gap-8 py-6 px-4"
        style={{
          background: "linear-gradient(180deg, #e8d4b8 0%, #d4c4a8 50%, #c4b498 100%)",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid rgba(140, 158, 131, 0.4)",
          minHeight: 140,
        }}
      >
        {items.map((t, i) => (
          <PipeOpening
            key={i}
            rank={i}
            translator={t}
            isHovered={hoveredIndex === i}
            onHover={(v) => setHoveredIndex(v ? i : null)}
          />
        ))}
      </div>

      <p className="text-[11px] text-text-muted font-serif text-center mt-3 italic">
        바다 건너 이야기를 전해준 목소리들
      </p>
    </section>
  );
}
