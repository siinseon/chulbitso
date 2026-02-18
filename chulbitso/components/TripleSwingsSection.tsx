"use client";

import type { AuthorStat } from "@/lib/analysisStats";

/** 운동회 달리기 도장 — svgrepo 도장 형태, 머리 동그란 부분에 1·2·3등, 찍는 부분에 작가 이름 */
interface TripleSwingsSectionProps {
  topAuthors: AuthorStat[];
}

const RANK_LABELS = ["1등", "2등", "3등"] as const;

function StampBlock({
  rank,
  author,
}: {
  rank: 1 | 2 | 3;
  author: AuthorStat | null;
}) {
  const label = RANK_LABELS[rank - 1];
  const name = author?.name ?? "—";
  const id = `stamp-${rank}`;

  return (
    <div className="stamp-container flex-shrink-0 flex flex-col items-center group relative pb-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 120"
        className="w-24 h-auto mx-auto transition-transform duration-150 ease-out cursor-pointer group-hover:translate-y-2 group-active:translate-y-2"
      >
        <defs>
          {/* 손잡이 — 갈색에 가까운 붉은 플라스틱 */}
          <radialGradient id={`${id}-handle`} cx="35%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#C86858" />
            <stop offset="70%" stopColor="#A84840" />
            <stop offset="100%" stopColor="#883830" />
          </radialGradient>
          {/* 이름판 — 누렇게 바랜 플라스틱 */}
          <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D8D4CC" />
            <stop offset="50%" stopColor="#C4C0B8" />
            <stop offset="100%" stopColor="#A8A49C" />
          </linearGradient>
          {/* 목 — 갈색 붉은 플라스틱 */}
          <linearGradient id={`${id}-neck`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B85850" />
            <stop offset="50%" stopColor="#A04038" />
            <stop offset="100%" stopColor="#883830" />
          </linearGradient>
          {/* 바닥 고무 — 낡은 느낌 */}
          <linearGradient id={`${id}-base`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A4540" />
            <stop offset="100%" stopColor="#2A2520" />
          </linearGradient>
          <filter id={`${id}-shadow`} x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
          </filter>
        </defs>

        <g filter={`url(#${id}-shadow)`}>
          {/* 1. 도장 목 — 붉은 기둥 + 가로 홈(리브) */}
          <rect
            x="42"
            y="30"
            width="16"
            height="40"
            fill={`url(#${id}-neck)`}
            stroke="#884038"
            strokeWidth="0.5"
          />
          {[35, 45, 55, 65].map((py) => (
            <line
              key={py}
              x1="43"
              y1={py}
              x2="57"
              y2={py}
              stroke="#784038"
              strokeWidth="0.4"
              opacity={0.5}
            />
          ))}

          {/* 2. 도장 바닥 고무 — 얇게 */}
          <rect
            x="15"
            y="91"
            width="70"
            height="5"
            rx="1.5"
            fill={`url(#${id}-base)`}
            stroke="#3A3530"
            strokeWidth="0.5"
          />

          {/* 3. 이름판 — 은색 금속 */}
          <rect
            x="10"
            y="60"
            width="80"
            height="30"
            rx="4"
            fill={`url(#${id}-body)`}
            stroke="#5A5550"
            strokeWidth="1"
          />
          {/* 이름판 안쪽 테두리 */}
          <rect
            x="13"
            y="63"
            width="74"
            height="24"
            rx="2"
            fill="none"
            stroke="#9A968E"
            strokeWidth="0.4"
            opacity={0.5}
          />

          {/* 4. 조이스틱 손잡이 — 빨간 구슬 + 하이라이트 */}
          <circle
            cx="50"
            cy="25"
            r="18"
            fill={`url(#${id}-handle)`}
            stroke="#784038"
            strokeWidth="0.75"
          />
          <ellipse
            cx="42"
            cy="17"
            rx="5"
            ry="4"
            fill="#E8E4DC"
            opacity={0.25}
          />
        </g>

        {/* 5. 텍스트 (Name) — 은색 이름판 세로 가운데 */}
        <text
          x="50"
          y="75"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#000000"
          fontSize="14"
          fontWeight="bold"
          style={{ pointerEvents: "none" }}
        >
          {name}
        </text>

        {/* 6. 순위 뱃지 (Rank) — 빨간 동그라미 가운데 */}
        <text
          x="50"
          y="25"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#FFFFFF"
          fontSize="14"
          fontWeight="bold"
        >
          {label}
        </text>
      </svg>
      {/* 호버/클릭 시 도장 내려가면서 밑에 찍히는 자국 — 동그라미 안에 1등/2등/3등 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full -mt-5 flex items-center justify-center rounded-full opacity-0 transition-opacity duration-150 delay-75 group-hover:opacity-100 group-active:opacity-100"
        style={{
          minWidth: "2.25rem",
          minHeight: "2.25rem",
          border: "2px solid rgba(136, 56, 48, 0.55)",
          background: "rgba(255, 255, 255, 0.4)",
        }}
        aria-hidden
      >
        <span
          className="text-base font-black tracking-tight"
          style={{
            color: "rgba(136, 56, 48, 0.55)",
            textShadow: "0 0 1px rgba(0,0,0,0.15)",
            fontFamily: "var(--font-serif-myeongjo), serif",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default function TripleSwingsSection({ topAuthors }: TripleSwingsSectionProps) {
  const authors = [
    topAuthors[0] ?? null,
    topAuthors[1] ?? null,
    topAuthors[2] ?? null,
  ] as (AuthorStat | null)[];

  return (
    <section
      className="rounded-2xl p-5 border border-secondary overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
        🏃 운동회 달리기 도장
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">
        가장 많이 읽은 작가 TOP 3 — 1등·2등·3등 도장에 작가 이름
      </p>

      <div
        className="relative rounded-xl overflow-visible flex items-end justify-center pt-8 pb-0 px-4 min-h-[200px]"
        style={{
          gap: 20,
          background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        }}
      >
        {authors.map((author, i) => (
          <StampBlock
            key={i}
            rank={(i + 1) as 1 | 2 | 3}
            author={author}
          />
        ))}
      </div>
    </section>
  );
}
