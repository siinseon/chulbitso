"use client";

/** 독서 습관 정글짐 색상만 사용 (#a89268, #6a7a8a, #9a6b58, #6a7c5a) */
const COLORS = {
  gold: "#a89268",
  blueGray: "#6a7a8a",
  rust: "#9a6b58",
  green: "#6a7c5a",
} as const;

const GROUND_Y = 82.4; // 땅 표면 y
const PLATFORM_TOP_Y = 27; // 1층·미끄럼틀 최상단 y (맨 위 계단 시작점과 같아야 함)

interface SlideIllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

/** 놀이터 구조물 일러스트 (탑 + 계단 + 그물망 + 미끄럼틀, 정글짐 색상만 사용) */
export default function SlideIllustration({ className = "", width = 100, height = 80 }: SlideIllustrationProps) {
  return (
    <svg
      viewBox="-18 0 148 95"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-hidden
    >
      <g transform="translate(-18, 0)">
      <defs>
        <clipPath id="aboveGroundClip">
          <rect x="-50" y="-10" width="250" height={GROUND_Y + 10} />
        </clipPath>
      </defs>
      {/* 땅 (초록) — 맨 마지막에 그려서 땅 뚫고 나가는 부분 덮음 */}

      {/* 구조물·계단 (땅 아래로 나가는 부분 클리핑) */}
      <g clipPath="url(#aboveGroundClip)">
      {/* 가운데 집 모양 - 살짝 그림자 */}
      <g filter="url(#houseShadow)">
        {/* 중앙 탑 - 기둥 (1층~2층 연결, 땅에 닿게) */}
        <rect x="40" y="11" width="6" height="71.4" rx="1" fill={COLORS.rust} />
        <rect x="54" y="11" width="6" height="71.4" rx="1" fill={COLORS.rust} />

        {/* 1층 (중간층) - 계단·미끄럼틀 시작, 양쪽 기둥에서 튀어나오지 않게 */}
        <rect x="40" y="27" width="20" height="8" rx="1" fill={COLORS.rust} />
        <rect x="42" y="29" width="16" height="5" rx="0.5" fill={COLORS.gold} />

        {/* 2층 가로 플랫폼 (지붕쪽으로 더 올림) */}
        <rect x="38" y="11" width="24" height="6" rx="1" fill={COLORS.rust} />
        <rect x="40" y="13" width="20" height="3" rx="0.5" fill={COLORS.gold} />

        {/* 2층 난간 */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={40 + i * 4} y="9" width="1.5" height="5" rx="0.5" fill={COLORS.rust} />
        ))}
        <rect x="38" y="11" width="24" height="2" rx="0.5" fill={COLORS.rust} />

        {/* 지붕 (초록) — 기둥 상단(y=11)에 밑변 맞춤 */}
        <path
          d="M 36 11 L 50 -2 L 64 11 L 36 11 Z"
          fill={COLORS.green}
        />
      </g>

      {/* 왼쪽 계단 (5단) - 살짝 그림자 */}
      <g filter="url(#stepShadow)">
      {[0, 1, 2, 3, 4].map((i) => {
        const run = 7; // 계단 깊이 (두꺼워 보이게)
        const treadThick = 3.5; // 발판 두께
        const treadOverhang = 4; // 발판 앞쪽 돌출
        const totalClimb = GROUND_Y - (PLATFORM_TOP_Y + treadThick); // 맨위 발판 윗면(27)~땅
        const stepHeight = totalClimb / 5; // 5단 균등
        const rise = stepHeight - treadThick;
        const treadTopY = PLATFORM_TOP_Y + treadThick + (4 - i) * stepHeight; // i=4: 윗면=27, i=0: 맨 아래
        const riserHeight = rise + treadThick;
        const stepX = 40 - (4 - i) * run - (run + treadOverhang); // 맨 위 단이 x=40에서 끝나도록
        return (
          <g key={i}>
            {/* 발받이 (세로면) - 모서리 살짝 둥글게 */}
            <rect x={stepX} y={treadTopY} width={run} height={riserHeight} rx="0.8" fill={COLORS.rust} />
            {/* 발판 (가로면, 앞으로 약간 돌출) - 모서리 살짝 둥글게 */}
            <rect x={stepX} y={treadTopY - treadThick} width={run + treadOverhang} height={treadThick} rx="0.6" fill={COLORS.gold} />
            {/* 발판 앞쪽 그림자 (두께감) */}
            <line
              x1={stepX}
              y1={treadTopY}
              x2={stepX + run + treadOverhang}
              y2={treadTopY}
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="0.8"
            />
          </g>
        );
      })}
      </g>

      {/* 앞쪽 그물망 (1층 바닥~땅 사이, 두 기둥 안쪽) */}
      <g stroke={COLORS.blueGray} strokeWidth="1" fill="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1={43} y1={38 + i * 8} x2={57} y2={38 + i * 8} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line key={`v${i}`} x1={43 + i * 4} y1={36} x2={43 + i * 4} y2={74} />
        ))}
      </g>

      {/* 미끄럼틀 - 살짝 그림자 추가 */}
      <defs>
        <filter id="slideShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.2" />
        </filter>
        <filter id="stepShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.18" />
        </filter>
        <filter id="houseShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.18" />
        </filter>
        <linearGradient id="slideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a8e6c" />
          <stop offset="50%" stopColor={COLORS.green} />
          <stop offset="100%" stopColor="#5a6c4a" />
        </linearGradient>
        <linearGradient id="slideHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <radialGradient id="slideShadowGrad" cx="55%" cy="70%" r="60%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="80%" stopColor="rgba(0,0,0,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
        </radialGradient>
      </defs>
      <g filter="url(#slideShadow)">
        {/* 미끄럼틀과 같은 색 네모 - 오른쪽 기둥 끝(x=60)에서 시작, 미끄럼틀 최상단(y=27)에 맞춤 */}
        <rect x="60" y="27" width="12" height="8" fill={COLORS.blueGray} />
        {/* 미끄럼틀 끝·땅 닿은 곳 - 같은 모양(12x8) 네모 */}
        <rect x="118" y="74.4" width="12" height="8" fill={COLORS.blueGray} />
        {/* 미끄럼틀 본체 */}
        <path
          d="M 60 27 L 72 27 Q 104 55, 130 80 L 118 78 Q 92 53, 60 28 Z"
          fill={COLORS.blueGray}
        />
      </g>
      </g>
      {/* 땅 (초록 네모) — 맨 마지막에 그려서 구조물이 땅을 침범하는 부분만 덮음 */}
      <rect x="-5" y={GROUND_Y} width="135" height="10" fill={COLORS.green} />
      </g>
    </svg>
  );
}
