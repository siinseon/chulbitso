"use client";

import type { PublisherStat } from "@/lib/analysisStats";

const SAND_LIGHT = "#e8dcc4";
const SAND_MID = "#d4c4a0";
const SAND_DARK = "#c4b090";

function SandNoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none rounded-xl opacity-[0.22] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

export default function SandcastlesSection({
  topPublishers,
}: {
  topPublishers: PublisherStat[];
}) {
  return (
    <section
      className="rounded-2xl p-5 border border-secondary overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
        🏖️ 취향의 모래성
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">출판사 TOP 3</p>

      <div
        className="relative rounded-xl overflow-hidden py-8 px-3 min-h-[320px] flex items-end justify-center"
        style={{
          background: `linear-gradient(180deg, #e8dcc4 0%, #d4c4a0 35%, #c4b498 100%)`,
          boxShadow: "inset 0 2px 16px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid rgba(180, 160, 130, 0.5)",
        }}
      >
        <SandNoiseOverlay />

        <div className="relative w-[min(100%,400px)] flex-shrink-0 mx-auto flex items-end justify-center" style={{ height: 320 }}>
          <svg
            viewBox="0 0 400 200"
            className="w-full h-full block"
            fill="none"
            preserveAspectRatio="xMidYMax meet"
          >
            <defs>
              <linearGradient id="sg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={SAND_LIGHT} />
                <stop offset="50%" stopColor={SAND_MID} />
                <stop offset="100%" stopColor={SAND_DARK} />
              </linearGradient>
            </defs>
            <g stroke="#2a2520" strokeWidth="1" strokeLinejoin="round">
              {/* 불규칙 모래 둔덕 베이스 (사진: 올라가는 둔덕) */}
              <path d="M0 200 L0 188 Q30 182 60 185 Q100 180 150 178 Q200 175 250 178 Q300 180 350 185 Q385 182 400 188 L400 200 Z" fill="url(#sg)" />

              {/* 맨 왼쪽: 넓은 낮은 성벽 — 밑에 큰 아치 문, 위에 타원 창 2개, 상단 총안 */}
              <path d="M22 188 L22 148 L58 148 L58 188 Z" fill="url(#sg)" />
              <path d="M26 188 L26 165 Q38 158 50 165 L50 188 Z" fill="#6b5a4a" stroke="#2a2520" strokeWidth="0.7" />
              <path d="M28 162 Q38 157 48 162 L48 168 Q38 164 28 168 Z" fill="#5a4a3a" />
              <ellipse cx="32" cy="155" rx="3" ry="2" fill="#5a4a3a" stroke="#2a2520" strokeWidth="0.5" />
              <ellipse cx="44" cy="155" rx="3" ry="2" fill="#5a4a3a" stroke="#2a2520" strokeWidth="0.5" />
              <rect x="26" y="146" width="6" height="4" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />
              <rect x="36" y="146" width="6" height="4" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />
              <rect x="46" y="146" width="6" height="4" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />

              {/* 왼쪽: 키 큰 둥근 탑 — 둥근 돔 꼭대기, 원형 창 1개 */}
              <path d="M54 188 L54 128 Q72 122 90 128 L90 188 Z" fill="url(#sg)" />
              <path d="M58 128 Q72 120 86 128 L86 135 Q72 128 58 135 Z" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.6" />
              <path d="M60 126 Q72 119 84 126 L84 131 Q72 125 60 131 Z" fill="#5a4a3a" />
              <circle cx="72" cy="148" r="2.8" fill="#5a4a3a" stroke="#2a2520" strokeWidth="0.5" />

              {/* 왼쪽 곡선 성벽 (총안) — 둥근 탑과 중앙 사이 */}
              <path d="M90 188 L90 152 Q108 145 128 150 L138 188 Z" fill="url(#sg)" />
              <rect x="94" y="148" width="6" height="4" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />
              <rect x="104" y="148" width="6" height="4" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />
              <rect x="114" y="148" width="6" height="4" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />

              {/* 중앙 앞: 문루 — 아치 문 + 총안 3개 */}
              <path d="M132 188 L132 152 L162 152 L162 188 Z" fill="url(#sg)" />
              <path d="M136 188 L136 162 Q144 156 152 162 L152 188 Z" fill="#6b5a4a" stroke="#2a2520" strokeWidth="0.6" />
              <path d="M138 159 Q144 155 150 159 L150 165 Q144 161 138 165 Z" fill="#5a4a3a" />
              <rect x="134" y="150" width="5" height="3" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />
              <rect x="142" y="150" width="5" height="3" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />
              <rect x="150" y="150" width="5" height="3" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />

              {/* 문루 앞 계단 3단 (디딤판·계단 선명) */}
              <path d="M162 188 L162 178 L168 178 L168 188 Z" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />
              <path d="M168 178 L168 168 L174 168 L174 178 Z" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />
              <path d="M174 168 L174 158 L180 158 L180 168 Z" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />

              {/* 중앙 메인탑: 원뿔형, 하단 1/3에 수평 선반(층), 세로 아치 창 3개, 깃발 막대 왼쪽으로 기울임 */}
              <path d="M178 188 L178 55 Q226 40 272 55 L272 188 Z" fill="url(#sg)" />
              <path d="M182 118 L268 118 L268 124 L182 124 Z" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.6" />
              <path d="M184 115 L266 115 L266 120 L184 120 Z" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />
              <path d="M192 82 Q202 76 212 82 L212 90 Q202 84 192 90 Z" fill="#6b5a4a" stroke="#2a2520" strokeWidth="0.6" />
              <path d="M195 79 Q202 74 209 79 L209 85 Q202 81 195 85 Z" fill="#5a4a3a" />
              <path d="M218 82 Q228 76 238 82 L238 90 Q228 84 218 90 Z" fill="#6b5a4a" stroke="#2a2520" strokeWidth="0.6" />
              <path d="M221 79 Q228 74 235 79 L235 85 Q228 81 221 85 Z" fill="#5a4a3a" />
              <path d="M244 82 Q254 76 264 82 L264 90 Q254 84 244 90 Z" fill="#6b5a4a" stroke="#2a2520" strokeWidth="0.6" />
              <path d="M247 79 Q254 74 261 79 L261 85 Q254 81 247 85 Z" fill="#5a4a3a" />
              <path d="M228 40 L230 36 L232 40 L230 43 Z" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.5" />
              <line x1="230" y1="36" x2="222" y2="26" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M222 26 L240 22 L240 30 L222 26 Z" fill="#c94a4a" stroke="#2a2520" strokeWidth="0.5" />

              {/* 오른쪽: 넓은 원통형 탑 (총안 + 세로 아치 창 2개) + 밑에서 중앙으로 곡선 성벽 */}
              <path d="M268 188 L268 115 L332 115 L332 188 Z" fill="url(#sg)" />
              <rect x="272" y="111" width="8" height="5" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.6" />
              <rect x="286" y="111" width="8" height="5" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.6" />
              <rect x="300" y="111" width="8" height="5" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.6" />
              <rect x="314" y="111" width="8" height="5" fill="url(#sg)" stroke="#2a2520" strokeWidth="0.6" />
              <path d="M278 132 Q292 126 306 132 L306 142 Q292 136 278 142 Z" fill="#6b5a4a" stroke="#2a2520" strokeWidth="0.6" />
              <path d="M281 129 Q292 124 303 129 L303 137 Q292 132 281 137 Z" fill="#5a4a3a" />
              <path d="M298 138 Q312 132 326 138 L326 148 Q312 142 298 148 Z" fill="#6b5a4a" stroke="#2a2520" strokeWidth="0.6" />
              <path d="M301 135 Q312 130 323 135 L323 143 Q312 138 301 143 Z" fill="#5a4a3a" />
              <path d="M272 188 L272 165 Q290 158 310 162 L318 188 Z" fill="url(#sg)" />
            </g>
          </svg>
        </div>
      </div>

      <p className="text-[11px] text-text-muted font-serif text-center mt-3 italic">
        모래사장에 쌓인 출판사의 성
      </p>
    </section>
  );
}
