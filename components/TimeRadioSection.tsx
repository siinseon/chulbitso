"use client";

import { useState, useEffect } from "react";

interface TimeRadioSectionProps {
  avgPubYear: number | null;
}

const YEAR_MIN = 1950;
const YEAR_MAX = 2025;
const LCD_GREEN = "#39ff14";

export default function TimeRadioSection({ avgPubYear }: TimeRadioSectionProps) {
  const [displayYear, setDisplayYear] = useState<number | null>(null);

  useEffect(() => {
    if (avgPubYear == null) {
      setDisplayYear(null);
      return;
    }
    const target = Math.max(YEAR_MIN, Math.min(YEAR_MAX, Math.round(avgPubYear)));
    let elapsed = 0;
    const tuneMs = 100;
    const tuneDuration = 900;
    const interval = setInterval(() => {
      elapsed += tuneMs;
      if (elapsed >= tuneDuration) {
        setDisplayYear(target);
        clearInterval(interval);
        return;
      }
      const jitter = Math.round((Math.random() - 0.5) * 20);
      setDisplayYear(Math.max(YEAR_MIN, Math.min(YEAR_MAX, target + jitter)));
    }, tuneMs);
    return () => clearInterval(interval);
  }, [avgPubYear]);

  const year = displayYear ?? (typeof avgPubYear === "number" ? Math.round(avgPubYear) : null);
  const indicatorPct = year != null ? ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100 : 50;
  const tickCount = 60;

  return (
    <section
      className="rounded-2xl p-5 border border-secondary overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
        시대 주파수 튜너
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">
        읽은 책들의 평균 출간연도를 주파수처럼 맞춰봤어요
      </p>

      {/* 라디오 몸체: 왼쪽 스피커 그릴 + 오른쪽 은색 패널(LCD 창 + 노브) */}
      <div
        className="mx-auto max-w-[320px] rounded-xl overflow-hidden flex"
        style={{
          background: "linear-gradient(180deg, #2a2826 0%, #1c1b1a 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
          border: "1px solid #3a3836",
        }}
      >
        {/* 왼쪽: 스피커 그릴 */}
        <div
          className="flex-shrink-0 flex flex-col justify-center gap-0.5 py-4 pl-3 pr-2"
          style={{ width: "72px" }}
        >
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full flex-shrink-0"
              style={{
                background: "linear-gradient(90deg, #8a8886 0%, #9e9c9a 50%, #8a8886 100%)",
                boxShadow: "0 0 1px rgba(0,0,0,0.2)",
              }}
            />
          ))}
        </div>

        {/* 오른쪽: 은색 전면 패널 + LCD 창 + 노브 */}
        <div
          className="flex-1 min-w-0 pt-3 pr-3 pb-3 pl-2"
          style={{
            background: "linear-gradient(165deg, #b5b3b0 0%, #9a9896 40%, #8a8886 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)",
            borderLeft: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {/* LCD 디스플레이: 검정 + 네온 그린 눈금(조금 더 길게) + 숫자 */}
          <div
            className="rounded-lg overflow-hidden mb-3 p-1"
            style={{
              background: "linear-gradient(180deg, #b0b0b0 0%, #9a9896 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 1px rgba(0,0,0,0.1)",
              border: "1px solid #8a8886",
            }}
          >
            <div
              className="rounded overflow-hidden"
              style={{
                background: "#0a0a0a",
                minHeight: 76,
              }}
            >
              {/* 상단: 가로 눈금 더 길게 (세로선 높이 확대) */}
              <div className="relative px-2 pt-2 pb-1" style={{ height: 28 }}>
                <div className="relative flex justify-between items-flex-end" style={{ height: 16 }}>
                  {[...Array(tickCount)].map((_, i) => {
                    const pct = (i / (tickCount - 1)) * 100;
                    const isMajor = i % 5 === 0;
                    const isIndicator = Math.abs(pct - indicatorPct) < 2;
                    const h = isIndicator ? 16 : isMajor ? 9 : 5;
                    return (
                      <div
                        key={i}
                        className="flex-shrink-0 rounded-sm"
                        style={{
                          width: 1,
                          height: h,
                          background: LCD_GREEN,
                          boxShadow: `0 0 4px ${LCD_GREEN}`,
                          opacity: isIndicator ? 1 : 0.85,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 하단: 연도 숫자만 */}
              <div className="flex items-center justify-center py-2.5 px-2">
                <span
                  className="font-pixel text-[26px] sm:text-[28px] tabular-nums select-none"
                  style={{
                    color: LCD_GREEN,
                    textShadow: `0 0 8px ${LCD_GREEN}, 0 0 16px rgba(57,255,20,0.5)`,
                    letterSpacing: "0.1em",
                  }}
                >
                  {year != null ? year : "----"}
                </span>
              </div>
            </div>
          </div>

          {/* 노브: TUNING, VOLUME, FM AM, POWER */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex-shrink-0"
                style={{
                  background: "linear-gradient(145deg, #a2a09e 0%, #7a7876 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2)",
                  border: "1px solid #8a8886",
                }}
              />
              <span className="text-[7px] font-mono text-black/60 mt-0.5">TUNING</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{
                  background: "linear-gradient(145deg, #a2a09e 0%, #7a7876 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2)",
                  border: "1px solid #8a8886",
                }}
              />
              <span className="text-[7px] font-mono text-black/60 mt-0.5">VOLUME</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{
                  background: "linear-gradient(145deg, #a2a09e 0%, #7a7876 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2)",
                  border: "1px solid #8a8886",
                }}
              />
              <span className="text-[7px] font-mono text-black/60 mt-0.5">FM AM</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-5 h-2.5 rounded-sm flex-shrink-0"
                style={{
                  background: "linear-gradient(180deg, #6a6866 0%, #5a5856 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  border: "1px solid #4a4846",
                }}
              />
              <span className="text-[7px] font-mono text-black/60 mt-0.5">POWER</span>
            </div>
          </div>

          <p className="text-center text-[10px] font-mono text-black/50 tracking-widest">출빛소</p>
        </div>
      </div>
    </section>
  );
}
