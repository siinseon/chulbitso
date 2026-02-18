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

/* 배치: 좌=2위, 중앙=1위, 우=3위 */
const ORDER = [1, 0, 2] as const;

/* 열별 기본 세로 위치(px): 좌=문학동네 시인선(더 위), 중=문학과 지성(그대로), 우=창비시선(더 아래) */
const DEFAULT_Y = [-42, 12, 36] as const;
/* 호버 시 봉 위로 올라가는 y(px): 문학동네는 더 위로 올라가야 봉을 넘음 */
const HOVER_Y = [-103, -64, -64] as const;

/* 철봉 viewBox: 실제 막대/기둥이 그려지는 x 구간만 사용 (path 기준 왼쪽 39, 오른쪽 502 근처) */
const BAR_WIDTH = 720;
const VIEWBOX_LEFT = 39;
const VIEWBOX_RIGHT = 502;
const VIEWBOX_BAR_W = VIEWBOX_RIGHT - VIEWBOX_LEFT;
const toPx = (v: number) => ((v - VIEWBOX_LEFT) / VIEWBOX_BAR_W) * BAR_WIDTH;
/* 왼쪽에서 첫 번째 가로 막대 정가운데 → 문학동네 시인선 */
const BAR1_CENTER = (39.286 + 190.446) / 2;
const BAR2_CENTER = (190.446 + 320.581) / 2;
const BAR3_CENTER = (371.871 + 501.801) / 2;
const LABEL_LEFT_OFFSET = 80; /* 라벨 전체를 더 왼쪽으로 */
const LABEL_CENTER_X = [
  toPx(BAR1_CENTER) - LABEL_LEFT_OFFSET + 40, /* 문학동네 시인선 */
  toPx(BAR2_CENTER) - LABEL_LEFT_OFFSET - 60, /* 문학과 지성사 시인선 */
  toPx(BAR3_CENTER) - LABEL_LEFT_OFFSET - 230, /* 창비시선 230px 왼쪽 */
] as const;

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
      className="rounded-2xl p-5 border border-secondary overflow-hidden"
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
        className="relative w-full max-w-[760px] mx-auto cursor-pointer select-none"
        style={{ height: 330 }}
      >
        {/* 철봉 — 가로만 늘려 기둥 간격·가로 봉 길이 확대 (viewBox 512x512를 가로 넓은 영역에 맞춤) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-full"
          style={{ top: 0, height: 300, maxWidth: 720 }}
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
        </div>

        {/* 시리즈 이름 3개: 각 구간 정가운데, 창비시선이 컨테이너 안에 들어가도록 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-full overflow-visible"
          style={{ top: 118, maxWidth: BAR_WIDTH, height: 120, minWidth: 0 }}
        >
          {items.map((series, i) => (
            <motion.div
              key={i}
              className="absolute flex flex-col items-center justify-center text-center"
              style={{
                left: LABEL_CENTER_X[i],
                top: 0,
                x: "-50%",
                width: "max-content",
                maxWidth: 100,
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
    </section>
  );
}
