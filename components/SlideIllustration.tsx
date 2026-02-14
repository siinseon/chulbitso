"use client";

/** 독서 습관 정글짐 색상만 사용 (#a89268, #6a7a8a, #9a6b58, #6a7c5a) */
const COLORS = {
  gold: "#a89268",
  blueGray: "#6a7a8a",
  rust: "#9a6b58",
  green: "#6a7c5a",
} as const;

interface SlideIllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

/** 놀이터 구조물 일러스트 (탑 + 계단 + 그물망 + 미끄럼틀, 정글짐 색상만 사용) */
export default function SlideIllustration({ className = "", width = 100, height = 80 }: SlideIllustrationProps) {
  return (
    <svg
      viewBox="0 0 130 90"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-hidden
    >
      {/* 땅 (초록) */}
      <rect x="0" y="78" width="130" height="14" fill={COLORS.green} />

      {/* 중앙 탑 - 기둥 (1층~2층 연결) */}
      <rect x="40" y="11" width="6" height="69" rx="1" fill={COLORS.rust} />
      <rect x="54" y="11" width="6" height="69" rx="1" fill={COLORS.rust} />

      {/* 1층 (중간층) - 건물 높이(2~78) 3등분 시 상단 1/3 지점 */}
      <rect x="28" y="27" width="36" height="8" rx="1" fill={COLORS.rust} />
      <rect x="30" y="29" width="32" height="5" rx="0.5" fill={COLORS.gold} />

      {/* 2층 가로 플랫폼 (지붕쪽으로 더 올림) */}
      <rect x="38" y="11" width="24" height="6" rx="1" fill={COLORS.rust} />
      <rect x="40" y="13" width="20" height="3" rx="0.5" fill={COLORS.gold} />

      {/* 2층 난간 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={40 + i * 4} y="9" width="1.5" height="5" rx="0.5" fill={COLORS.rust} />
      ))}
      <rect x="38" y="11" width="24" height="2" rx="0.5" fill={COLORS.rust} />

      {/* 지붕 (초록, 좁은 삼각형) */}
      <path
        d="M 36 15 L 50 2 L 64 15 L 36 15 Z"
        fill={COLORS.green}
      />

      {/* 왼쪽 계단 (8단) - 땅(78)에서 1층 중간층(27)까지, 완만한 층계 */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const run = 5; // 계단 깊이
        const treadThick = 2;
        const rise = 5; // 계단 높이 (rise:run 비율로 자연스러운 층계)
        const bottomY = 78 - i * (rise + treadThick);
        const treadTopY = bottomY - treadThick;
        const riserHeight = i === 0 ? treadThick : rise + treadThick;
        return (
          <g key={i}>
            {/* 발받이 (세로면) */}
            <rect x={8 + i * run} y={treadTopY} width={run} height={riserHeight} fill={COLORS.rust} />
            {/* 발판 (가로면, 앞으로 약간 돌출) */}
            <rect x={8 + i * run} y={treadTopY - treadThick} width={run + 3} height={treadThick} fill={COLORS.gold} />
            {/* 발판 앞쪽 그림자 (두께감) */}
            <line
              x1={8 + i * run}
              y1={treadTopY}
              x2={8 + i * run + run + 3}
              y2={treadTopY}
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="0.8"
            />
          </g>
        );
      })}

      {/* 앞쪽 그물망 (1층 바닥~땅 사이, 두 기둥 안쪽) */}
      <g stroke={COLORS.blueGray} strokeWidth="1" fill="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1={43} y1={38 + i * 8} x2={57} y2={38 + i * 8} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line key={`v${i}`} x1={43 + i * 4} y1={36} x2={43 + i * 4} y2={74} />
        ))}
      </g>

      {/* 미끄럼틀 - 중간층에서 땅까지, 그림자·디테일 추가 */}
      <defs>
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
      {/* 바닥 그림자 - 부드러운 타원 (바닥에 닿는 느낌) */}
      <ellipse cx="105" cy="80" rx="16" ry="3" fill="rgba(0,0,0,0.2)" />
      <path
        d="M 62 35 Q 88 58, 108 79 Q 116 78, 118 76 Q 100 54, 72 34 Q 66 32, 62 35 Z"
        fill="rgba(0,0,0,0.2)"
      />
      {/* 미끄럼틀 본체 (그라데이션) - 길게 쭉 뻗음 */}
      <path
        d="M 54 27 L 66 27 Q 92 52, 118 78 L 102 76 Q 76 50, 54 28 Z"
        fill="url(#slideGrad)"
      />
      {/* 미끄럼틀 내부 그림자 (오목한 곡면 느낌) */}
      <path
        d="M 54 27 L 66 27 Q 92 52, 118 78 L 102 76 Q 76 50, 54 28 Z"
        fill="url(#slideShadowGrad)"
      />
      {/* 왼쪽 가장자리 림 (두께감) */}
      <path
        d="M 54 27 Q 76 50, 102 76"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 오른쪽 가장자리 림 */}
      <path
        d="M 66 27 Q 92 52, 118 78"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* 상단 가장자리 림 (러스트) */}
      <path d="M 54 27 L 66 27" stroke={COLORS.rust} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity={0.8} />
      {/* 슬라이드 표면 하이라이트 (빛 반사) */}
      <path
        d="M 57 29 Q 80 48, 105 72"
        stroke="url(#slideHighlight)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 슬라이드 홈 라인 (미끄러지는 골 부분) */}
      <path
        d="M 60 32 Q 82 52, 108 74"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
