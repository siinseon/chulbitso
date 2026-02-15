"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY_PREFIX = "chulbitso-junglegym-";

/* 정글짐 피라미드: 낡고 바랜 톤 (노랑·파랑·빨강·초록 흐리게) */
const PYRAMID_COLORS = ["#a89268", "#6a7a8a", "#9a6b58", "#6a7c5a"];
const PYRAMID_ROW_COUNTS = [1, 2, 3, 4, 5, 6, 7];
const GYM_SQUARE_SIZE = 28;
const GYM_GAP = 4;

function getStorageKey(year: number, month: number): string {
  return `${STORAGE_KEY_PREFIX}${year}-${String(month).padStart(2, "0")}`;
}

function loadFilledCells(year: number, month: number): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(getStorageKey(year, month));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveFilledCells(year: number, month: number, cells: Set<number>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(year, month), JSON.stringify(Array.from(cells)));
  } catch {}
}

/** (rowIndex, cellIndex) → 칸 번호 0~27 */
function cellKey(rowIndex: number, cellIndex: number): number {
  const before = (rowIndex * (rowIndex + 1)) / 2;
  return before + cellIndex;
}

export default function ReadingJungleGym() {
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth() + 1);
  const [filled, setFilled] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setFilled(loadFilledCells(year, month));
  }, [year, month, mounted]);

  const [flagBounceKey, setFlagBounceKey] = useState(0);

  const toggleCell = useCallback(
    (key: number) => {
      setFilled((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else {
          next.add(key);
          setFlagBounceKey((k) => k + 1);
        }
        saveFilledCells(year, month, next);
        return next;
      });
    },
    [year, month]
  );

  if (!mounted) {
    return (
      <div
        className="rounded-2xl p-5 border animate-pulse relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #e8ddc8 0%, #ddd4bc 100%)",
          borderColor: "rgba(100, 95, 85, 0.35)",
          boxShadow: "0 4px 20px rgba(58, 49, 40, 0.18), inset 0 0 60px rgba(180, 165, 140, 0.08)",
        }}
      >
        <div className="h-6 w-32 rounded mb-4 opacity-40 bg-primary/20" />
        <div className="flex flex-col items-center gap-1">
          {[1, 2, 3].map((r) => (
            <div key={r} className="flex gap-1">
              {Array.from({ length: r }).map((_, i) => (
                <div key={i} className="w-7 h-7 rounded opacity-20 bg-primary/10" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 border overflow-visible relative"
      style={{
        background: "linear-gradient(180deg, #e8ddc8 0%, #ddd4bc 100%)",
        borderColor: "rgba(100, 95, 85, 0.35)",
        boxShadow: "0 4px 20px rgba(58, 49, 40, 0.18), inset 0 0 60px rgba(180, 165, 140, 0.08)",
      }}
    >
      {/* 바랜 먼지감 오버레이 */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200, 188, 168, 0.12) 0%, transparent 70%)",
        }}
      />
      <h3 className="text-[15px] sm:text-[16px] font-bold text-primary font-serif mb-1 flex items-center gap-2 relative z-10">
        🧗 독서 습관 정글짐
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4 relative z-10">
        읽은 날 클릭해서 칸을 채워요
      </p>

      <div className="relative flex flex-col items-center gap-[4px] relative z-10" style={{ gap: GYM_GAP }}>
        {/* 꼭대기 깃발 - 칸 채울 때마다 점프 */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full"
          style={{ marginTop: -GYM_GAP }}
        >
          <div key={flagBounceKey} className="animate-flag-bounce">
            <div
              className="relative flex items-end justify-center"
              style={{ width: GYM_SQUARE_SIZE, height: GYM_SQUARE_SIZE + 24 }}
            >
            {/* 깃대 */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-sm"
              style={{
                width: 3,
                height: 24,
                background: "linear-gradient(90deg, #5a4a3a 0%, #6b5a4a 50%, #5a4a3a 100%)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            />
            {/* 깃발 삼각형 - 막대기 왼쪽 끝에 맞춤 (막대 3px, 중심 기준 -1.5px) */}
            <div
              className="absolute"
              style={{
                left: "50%",
                bottom: 18,
                marginLeft: -1.5,
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "14px solid #c94a4a",
                filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.25))",
              }}
            />
            </div>
          </div>
        </div>
        {PYRAMID_ROW_COUNTS.map((count, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center justify-center"
            style={{ gap: GYM_GAP }}
          >
            {Array.from({ length: count }).map((_, cellIndex) => {
              const key = cellKey(rowIndex, cellIndex);
              const isFilled = filled.has(key);
              const color = PYRAMID_COLORS[rowIndex % PYRAMID_COLORS.length];

              return (
                <button
                  key={cellIndex}
                  type="button"
                  onClick={() => toggleCell(key)}
                  className="flex-shrink-0 transition-transform duration-200 rounded-[3px] border-2 focus:outline-none focus:ring-2 focus:ring-primary/30 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    width: GYM_SQUARE_SIZE,
                    height: GYM_SQUARE_SIZE,
                    borderColor: color,
                    backgroundColor: isFilled ? color : "transparent",
                    boxShadow: isFilled
                      ? "0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)"
                      : "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                  aria-label={isFilled ? "채움 (클릭 시 해제)" : "비움 (클릭 시 채우기)"}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-[12px] text-text-muted font-serif mt-3 text-center relative z-10">
        이번 달 <span className="font-bold text-primary">{filled.size}</span>칸 채웠어요
      </p>
    </div>
  );
}
