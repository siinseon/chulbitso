"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BooksSnapshot } from "@/lib/analysisStats";

const WOOD_LIGHT = "#c4a574";
const WOOD_MID = "#a88b5c";
const WOOD_DARK = "#8a7349";
const WOOD_EDGE = "#7a6340";
const RUST_LIGHT = "#d4a078";
const RUST_MID = "#C98C6E";
const RUST_DARK = "#a86f52";
const OUTLINE = "#1a1a1a";

const LITERATURE_CATEGORIES = ["소설/시/희곡", "에세이", "만화", "시집", "소설"];

interface ReadingBalanceSeesawSectionProps {
  books: BooksSnapshot;
}

export default function ReadingBalanceSeesawSection({ books }: ReadingBalanceSeesawSectionProps) {
  const { literature, nonLiterature } = useMemo(() => {
    const all = [...books.my, ...books.read, ...books.ebook];
    let lit = 0;
    let non = 0;
    all.forEach((b) => {
      const cat = (b.category ?? "").trim() || "기타";
      if (LITERATURE_CATEGORIES.includes(cat)) lit += 1;
      else non += 1;
    });
    return { literature: lit, nonLiterature: non };
  }, [books]);

  const total = literature + nonLiterature;
  const targetTilt =
    total > 0
      ? Math.max(-28, Math.min(28, ((literature - nonLiterature) / total) * 28))
      : 0;

  const [tilt, setTilt] = useState(0);
  const [creaked, setCreaked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(w > 0 && w < 320 ? w / 320 : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setTilt(targetTilt), 100);
    return () => clearTimeout(t);
  }, [targetTilt]);

  useEffect(() => {
    if (Math.abs(tilt) > 1 && !creaked) {
      setCreaked(true);
    }
  }, [tilt, creaked]);

  return (
    <section
      className="rounded-2xl p-5 border border-secondary overflow-hidden relative"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2 relative z-10">
        독서 밸런스 시소
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">문학과 비문학, 독서 비율 알아보기</p>

      <div
        ref={containerRef}
        className="relative w-full max-w-[320px] mx-auto overflow-hidden min-w-0"
        style={{ height: 220 }}
      >
        {/* 시소를 컨테이너 너비에 맞춰 스케일 (모바일에서 넘침 방지) */}
        <div
          className="absolute left-1/2 top-0 h-full w-[320px]"
          style={{
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "center bottom",
          }}
        >
        {/* 모래/바닥 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 rounded-b-xl"
          style={{
            background: "linear-gradient(180deg, #e8d4b8 0%, #d4c4a8 100%)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
          }}
        />

        {/* 원통형 받침대 (시소 받침) */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 14,
            height: 70,
            background: `linear-gradient(90deg, ${RUST_DARK} 0%, ${RUST_MID} 50%, ${RUST_LIGHT} 100%)`,
            boxShadow: "inset 1px 0 0 rgba(255,255,255,0.1), inset -1px 0 0 rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.15)",
            border: `1px solid ${OUTLINE}`,
          }}
        />

        {/* 시소판: 가로 막대 + 양끝 의자 */}
        <div
          className={`absolute left-1/2 w-[320px] -translate-x-1/2 transition-transform duration-[1200ms] ease-out ${creaked ? "animate-seesaw-creak" : ""}`}
          style={{
            bottom: 78,
            transform: `translateX(-50%) rotate(${-tilt}deg)`,
            transformOrigin: "center bottom",
          }}
        >
          {/* 가로 막대 (나무 판자) - 막대 위에 의자·손잡이가 붙음 */}
          <div
            className="absolute left-0 right-0 bottom-0 rounded-sm"
            style={{
              height: 10,
              background: `linear-gradient(180deg, ${WOOD_LIGHT} 0%, ${WOOD_MID} 35%, ${WOOD_DARK} 70%, ${WOOD_EDGE} 100%)`,
              boxShadow: "inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1), 0 3px 8px rgba(0,0,0,0.15)",
              border: `1px solid ${OUTLINE}`,
            }}
          />

          {/* 왼쪽 의자 (막대 위에 붙음) */}
          <div
            className="absolute left-2 bottom-[10px] rounded-t-sm"
            style={{
              width: 56,
              height: 10,
              minHeight: 10,
              background: `linear-gradient(180deg, ${WOOD_MID} 0%, ${WOOD_DARK} 100%)`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.2)",
              border: `1px solid ${OUTLINE}`,
              borderBottom: "none",
            }}
          />
          {/* 왼쪽 라벨: 의자 바로 위, 2줄 (문학 / N권) */}
          <div
            className="absolute left-2 flex flex-col items-center justify-end text-center"
            style={{ width: 56, bottom: 20 }}
          >
            <span className="text-[10px] font-bold font-serif leading-tight block" style={{ color: "#1a1a1a", textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>문학</span>
            <span className="text-[10px] font-bold font-serif leading-tight block" style={{ color: "#1a1a1a", textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>{literature}권</span>
          </div>
          {/* 왼쪽 손잡이 (받침대 쪽으로 땡김) */}
          <div
            className="absolute left-[58px] bottom-[15px] w-1.5 h-6 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${RUST_DARK} 0%, ${RUST_MID} 100%)`,
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              border: `1px solid ${OUTLINE}`,
            }}
          />

          {/* 오른쪽 의자 */}
          <div
            className="absolute right-2 bottom-[10px] rounded-t-sm"
            style={{
              width: 56,
              height: 10,
              minHeight: 10,
              background: `linear-gradient(180deg, ${WOOD_MID} 0%, ${WOOD_DARK} 100%)`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.2)",
              border: `1px solid ${OUTLINE}`,
              borderBottom: "none",
            }}
          />
          {/* 오른쪽 라벨: 의자 바로 위, 2줄 (비문학 / N권) */}
          <div
            className="absolute right-2 flex flex-col items-center justify-end text-center"
            style={{ width: 56, bottom: 20 }}
          >
            <span className="text-[10px] font-bold font-serif leading-tight block" style={{ color: "#1a1a1a", textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>비문학</span>
            <span className="text-[10px] font-bold font-serif leading-tight block" style={{ color: "#1a1a1a", textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>{nonLiterature}권</span>
          </div>
          {/* 오른쪽 손잡이 (받침대 쪽으로 땡김) */}
          <div
            className="absolute right-[58px] bottom-[15px] w-1.5 h-6 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${RUST_MID} 0%, ${RUST_DARK} 100%)`,
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              border: `1px solid ${OUTLINE}`,
            }}
          />

        </div>
        </div>
      </div>
    </section>
  );
}
