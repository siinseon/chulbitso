"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SeriesStat } from "@/lib/analysisStats";

const FRAME_DARK = "#3a3632";
const FRAME_RUST = "#5c5044";
const FRAME_LIGHT = "#6b5e52";
const FRAME_OUTLINE = "#2a2622";
/* 철봉 금속감: 위쪽 하이라이트, 아래 그림자 */
const BAR_HIGHLIGHT = "#4d4842";
const BAR_SHADOW = "#2a2622";

const SEAT_COLORS = ["#a89268", "#6a7a8a", "#9a6b58"] as const;

/* 배치: 왼쪽(가장 높은 철봉)=1위, 가운데=2위, 오른쪽=3위 */
const ORDER = [0, 1, 2] as const;

/* 열별 기본 세로 위치(px): 각 철봉 가운데에 시리즈 글씨 배치 */
const DEFAULT_Y = [-28, 18, 66] as const;
/* 호버 시 봉 위로 올라가는 y(px) */
const HOVER_Y = [-103, -64, -64] as const;

/* SVG viewBox "0 0 512 512" — 기둥 x: 39.286, 190.446, 320.581, 371.871, 501.801 */
const VIEWBOX_W = 512;
/* 1위=첫번째·두번째 기둥 사이, 2위=두번째·세번째 사이, 3위=네번째·다섯번째 사이 */
const PILLAR1 = 39.286;
const PILLAR2 = 190.446;
const PILLAR3 = 320.581;
const PILLAR4 = 371.871;
const PILLAR5 = 501.801;
const BAR1_CENTER = (PILLAR1 + PILLAR2) / 2;
const BAR2_CENTER = (PILLAR2 + PILLAR3) / 2;
const BAR3_CENTER = (PILLAR4 + PILLAR5) / 2;
/* 시리즈 글씨: viewBox x를 %로 (라벨 컨테이너와 SVG 너비가 같아서 정확히 기둥 사이에 맞음) */
const LABEL_CENTER_X_PCT = [
  (BAR1_CENTER / VIEWBOX_W) * 100,
  (BAR2_CENTER / VIEWBOX_W) * 100,
  (BAR3_CENTER / VIEWBOX_W) * 100,
] as [number, number, number];

interface SeriesTripleSwingsSectionProps {
  topSeries: SeriesStat[];
}

export default function SeriesTripleSwingsSection({ topSeries }: SeriesTripleSwingsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items: (SeriesStat | null)[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = ORDER[i];
    items.push(topSeries[idx] ?? null);
  }

  return (
    <section
      className="rounded-2xl p-5 border border-secondary overflow-x-hidden overflow-y-visible"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2 flex-wrap break-words">
        시리즈 명예의 전당: 3인용 철봉
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">가장 많이 읽은 시리즈 TOP 3</p>

      <div
        className="relative w-full max-w-[760px] mx-auto cursor-pointer select-none overflow-hidden overflow-y-visible"
        style={{ height: 330 }}
      >
        {/* 철봉 + 라벨: 스크롤 없이 컨테이너 안에 맞춤 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-full h-full"
          style={{
            height: 300,
            width: "100%",
            maxWidth: 720,
          }}
        >
          <svg
            viewBox="0 0 512 512"
            className="w-full h-full"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="barMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={BAR_HIGHLIGHT} />
                <stop offset="35%" stopColor={FRAME_DARK} />
                <stop offset="65%" stopColor={FRAME_DARK} />
                <stop offset="100%" stopColor={BAR_SHADOW} />
              </linearGradient>
              <filter id="barShadow" x="-20%" y="-10%" width="140%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#1a1614" floodOpacity="0.5" />
              </filter>
            </defs>
            <g filter="url(#barShadow)" fill="url(#barMetal)">
              <path d="M481.107,398.651c-5.632,0-10.199,4.566-10.199,10.199v3.099c0,5.633,4.567,10.199,10.199,10.199s10.199-4.566,10.199-10.199v-3.099C491.306,403.217,486.739,398.651,481.107,398.651z" />
              <path d="M492.487,434.601h-22.76c-5.632,0-10.199,4.566-10.199,10.199c0,5.633,4.567,10.199,10.199,10.199h22.76c5.632,0,10.199-4.566,10.199-10.199C502.686,439.167,498.12,434.601,492.487,434.601z" />
              <path d="M501.801,228.243h-10.495v-11.52c0-5.633-4.567-10.199-10.199-10.199s-10.199,4.566-10.199,10.199v11.52h-129.93v-54.994h11.07c5.632,0,10.199-4.566,10.199-10.199c0-5.633-4.567-10.199-10.199-10.199h-11.07v-10.488c0-5.633-4.567-10.199-10.199-10.199c-5.632,0-10.199,4.566-10.199,10.199v10.488H190.446V96.824h10.817c5.632,0,10.199-4.566,10.199-10.199c0-5.633-4.567-10.199-10.199-10.199h-10.817V67.2c0-5.633-4.567-10.199-10.199-10.199c-5.632,0-10.199,4.566-10.199,10.199v9.225H39.286V67.2c0-5.633-4.567-10.199-10.199-10.199c-5.632,0-10.199,4.566-10.199,10.199v9.225h-8.689C4.567,76.425,0,80.991,0,86.624c0,5.633,4.567,10.199,10.199,10.199h8.689v337.777h-1.439c-5.632,0-10.199,4.566-10.199,10.199c0,5.633,4.567,10.199,10.199,10.199h22.758c5.632,0,10.199-4.566,10.199-10.199c0-5.633-4.567-10.199-10.199-10.199h-0.921V96.824h130.761v337.777h-2.066c-5.632,0-10.199,4.566-10.199,10.199c0,5.633,4.567,10.199,10.199,10.199h22.76c5.632,0,10.199-4.566,10.199-10.199c0-5.633-4.567-10.199-10.199-10.199h-0.296V173.249h130.135v261.352h-1.18c-5.632,0-10.199,4.566-10.199,10.199c0,5.633,4.567,10.199,10.199,10.199h22.76c5.632,0,10.199-4.566,10.199-10.199c0-5.633-4.567-10.199-10.199-10.199h-1.181V248.642h129.93v128.193c0,5.633,4.567,10.199,10.199,10.199s10.199-4.566,10.199-10.199V248.642h10.495c5.632,0,10.199-4.566,10.199-10.199C512,232.81,507.433,228.243,501.801,228.243z" />
            </g>
          </svg>
          {/* 시리즈 이름: 휠과 동일한 너비 영역 안에서 % 위치 사용 */}
          <div
            className="absolute left-0 right-0 w-full overflow-visible pointer-events-none"
            style={{ top: "39%", height: "36%", minWidth: 0 }}
          >
            {items.map((series, i) => (
              <motion.div
                key={i}
                className="absolute flex flex-col items-center justify-center text-center pointer-events-auto"
                style={{
                  left: `${LABEL_CENTER_X_PCT[i]}%`,
                  top: 0,
                  x: "-50%",
                  width: "max-content",
                  maxWidth: "28%",
                }}
                initial={false}
                animate={{
                  y: hoveredIndex === i ? HOVER_Y[i] : DEFAULT_Y[i],
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 28,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <p
                  className="text-[10px] font-bold text-[#2a2622] leading-tight truncate text-center w-full"
                  style={{ fontFamily: "var(--font-serif-myeongjo), serif" }}
                  title={series?.name ?? ""}
                >
                  {series?.name ?? "—"}
                </p>
                {series && (
                  <p className="text-[8px] text-[#2a2622]/80 mt-0.5 text-center whitespace-nowrap">
                    {series.count}권
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
