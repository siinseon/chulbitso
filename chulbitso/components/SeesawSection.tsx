"use client";

import { useMemo } from "react";
import type { Book } from "@/lib/useBooks";

const LITERATURE_CATEGORIES = ["시집", "소설", "에세이"];

interface SeesawSectionProps {
  books: Book[];
}

function countLiterature(books: Book[]) {
  let literature = 0;
  let nonLiterature = 0;
  books.forEach((b) => {
    const cat = (b.category || "").trim() || "기타";
    if (LITERATURE_CATEGORIES.includes(cat)) {
      literature += 1;
    } else {
      nonLiterature += 1;
    }
  });
  return { literature, nonLiterature };
}

const MAX_TILT_DEG = 14;

export default function SeesawSection({ books }: SeesawSectionProps) {
  const { literature, nonLiterature } = useMemo(
    () => countLiterature(books),
    [books]
  );
  const total = literature + nonLiterature;

  // 시소 기울기: 문학이 많으면 문학 쪽(-)으로, 비문학이 많으면 비문학 쪽(+)으로
  const tiltDeg =
    total === 0
      ? 0
      : ((nonLiterature - literature) / total) * MAX_TILT_DEG;

  return (
    <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
      <h3 className="text-[15px] font-bold text-primary mb-1 flex items-center gap-2 font-serif">
        🎢 문학 vs 비문학 시소
      </h3>
      <p className="text-[12px] text-muted mb-4">
        문학(시·소설·에세이)이 많으면 문학 쪽으로, 비문학이 많으면 비문학 쪽으로 기울어져요.
      </p>

      {total === 0 ? (
        <p className="text-[13px] text-muted py-8 text-center">
          분야가 있는 도서가 없어요.
        </p>
      ) : (
        <div className="flex flex-col items-center">
          {/* 시소 받침대 */}
          <div
            className="relative w-full max-w-[380px] h-[110px] overflow-visible"
            style={{ perspective: "200px" }}
          >
            {/* 받침대 기둥 — 위가 피벗/판과 맞닿도록 높이 확보 */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-14 rounded-b-md z-0"
              style={{
                background: "linear-gradient(90deg, #4A3520 0%, #5C4033 30%, #6B5344 50%, #5C4033 70%, #4A3520 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 6px rgba(58,49,40,0.3)",
                border: "1px solid #3A2820",
              }}
            />

            {/* 기둥 위 피벗 — 기둥 맨 위에 붙여서 판이 올라가게 */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-6 h-2 rounded-sm z-[5]"
              style={{
                bottom: "54px",
                background: "linear-gradient(180deg, #4A3520 0%, #3A2820 100%)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
              }}
            />

            {/* 시소 판: 막대가 피벗 위에 올라가 기울어짐 (가로로 더 길게) */}
            <div
              className="absolute left-1/2 z-10 w-[98%] max-w-[340px] transition-transform duration-700 ease-out"
              style={{
                top: "56px",
                transform: `translate(-50%, -50%) rotate(${tiltDeg}deg)`,
                transformOrigin: "center center",
              }}
            >
              {/* 판 위쪽면 — 양 끝만 살짝 진하게(앉는 자리 느낌), 나무결 */}
              <div
                className="w-full h-5 rounded-sm relative overflow-hidden"
                style={{
                  background: "linear-gradient(90deg, #6B5344 0%, #7B6344 14%, #9B8265 30%, #8B7355 70%, #7B6344 86%, #6B5344 100%)",
                  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1), 0 3px 10px rgba(58,49,40,0.2)",
                  border: "1px solid #4A3520",
                }}
              >
                <div className="absolute inset-0 opacity-25 pointer-events-none" style={{
                  backgroundImage: "repeating-linear-gradient(90deg, transparent 0 2px, rgba(58,49,40,0.2) 3px 4px)",
                }} />
                {/* 양 끝 손잡이: 판 위에 선만 (같은 레이어, 떠다니지 않음) */}
                <span className="absolute left-[10%] top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full bg-primary/50" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.15)" }} />
                <span className="absolute right-[10%] top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full bg-primary/50" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.15)" }} />
              </div>
              {/* 판 두께 (앞쪽 립) */}
              <div
                className="absolute left-0 right-0 top-full w-full h-1.5 -mt-px rounded-b-sm"
                style={{
                  background: "linear-gradient(180deg, #5C4033 0%, #4A3520 100%)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />

              {/* 문학 라벨 — 시소 왼쪽 끝 위, 판과 같은 각도(회전 div 안에 있음) */}
              <div className="absolute left-0 bottom-full pr-0 pb-1.5 text-right whitespace-nowrap">
                <span className="block text-[11px] font-mono text-muted">문학</span>
                <span className="block text-[14px] font-bold text-primary font-serif">{literature}권</span>
              </div>
              {/* 비문학 라벨 — 시소 오른쪽 끝 위, 판과 같은 각도 */}
              <div className="absolute right-0 bottom-full pl-0 pb-1.5 text-left whitespace-nowrap">
                <span className="block text-[11px] font-mono text-muted">비문학</span>
                <span className="block text-[14px] font-bold text-primary font-serif">{nonLiterature}권</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted mt-2 text-center">
            시·소설·에세이 = 문학 / 인문·기타 = 비문학
          </p>
        </div>
      )}
    </section>
  );
}
