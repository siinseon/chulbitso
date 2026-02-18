"use client";

import { useState } from "react";
import Link from "next/link";

/* 단축번호 1~6 = 서점 링크 */
const STORE_ITEMS = [
  { name: "알라딘", key: 1, label: "알라딘", textClass: "text-[10px]" },
  { name: "교보문고", key: 2, label: "교보문고", textClass: "text-[10px]" },
  { name: "예스24", key: 3, label: "예스24", textClass: "text-[10px]" },
  { name: "영풍문고", key: 4, label: "영풍문고", textClass: "text-[10px]" },
  { name: "밀리의 서재", key: 5, label: "밀리의\n서재", textClass: "text-[10px] leading-tight" },
  { name: "윌라", key: 6, label: "윌라", textClass: "text-[10px]" },
];

type StoreLink = { name: string; url: string };

function playPayphoneBeep(): void {
  // 띠-리-리- 전자음 효과 자리
}

const KEYPAD_LAYOUT = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ["*", 0, "#"],
];

export default function RetroPayphone({ links = [] }: { links?: StoreLink[] }) {
  const [handsetUp, setHandsetUp] = useState(false);
  const getHref = (name: string) => links.find((l) => l.name === name)?.url ?? "#";
  const getStoreByKey = (k: number) => STORE_ITEMS.find((s) => s.key === k);

  /* 스큐어모피즘: 금속 베젤 - 빵빵한 입체감 */
  const metallicFrame = {
    background:
      "linear-gradient(165deg, #f0f2f5 0%, #dde1e6 15%, #b8bec6 40%, #8c95a0 70%, #6b7280 90%, #4b5260 100%)",
    boxShadow:
      "inset 0 4px 8px rgba(255,255,255,0.6), inset 0 -4px 8px rgba(0,0,0,0.25), inset 2px 0 4px rgba(255,255,255,0.3), inset -2px 0 4px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)",
    border: "2px solid rgba(200,205,210,0.9)",
  };

  /* 키패드 버튼 - 눌리는 듯한 볼록 금속 */
  const keypadBtn = {
    background:
      "linear-gradient(180deg, #f4f5f7 0%, #e8eaed 20%, #d1d5db 60%, #b8bec6 100%)",
    boxShadow:
      "inset 0 3px 5px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.2)",
    border: "1px solid rgba(180,185,190,0.9)",
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl p-1"
      style={{
        ...metallicFrame,
      }}
    >
      {/* 노이즈/브러시 텍스처 - 금속 질감 */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="flex p-4 gap-4 relative rounded-xl overflow-hidden">
        {/* 왼쪽: 수화기 + 크라들 */}
        <div className="flex flex-col items-center flex-shrink-0 relative">
          {/* U자형 수화기 거치대 (크라들) - 수화기 길이에 맞춤 */}
          <div
            className="w-16 min-h-[14.5rem] rounded-xl relative overflow-visible"
            style={{
              background: "linear-gradient(180deg, #4b5563 0%, #3d4754 30%, #2d3542 60%, #1f2937 100%)",
              boxShadow:
                "inset 0 4px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.25)",
              border: "2px solid #2d3542",
            }}
          >
            {/* 수화기 머리(귀) 쪽 거치 접점 - 정사각형, 움푹 */}
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-md"
              style={{
                background: "linear-gradient(180deg, #1a1f2e 0%, #0f1419 100%)",
                boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6), inset 0 -1px 1px rgba(255,255,255,0.03)",
                border: "1px solid #0a0d12",
              }}
            />
            {/* 수화기 꼬리(입) 쪽 거치 접점 - 정사각형, 움푹 */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-md"
              style={{
                background: "linear-gradient(180deg, #1a1f2e 0%, #0f1419 100%)",
                boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6), inset 0 -1px 1px rgba(255,255,255,0.03)",
                border: "1px solid #0a0d12",
              }}
            />
            {/* 수화기 본체 - 클릭하면 들린 상태로 전환 */}
            <button
              type="button"
              onClick={() => setHandsetUp((u) => !u)}
              className="absolute left-1/2 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-1 focus:ring-offset-gray-700 rounded-[1.25rem] cursor-grab active:cursor-grabbing transition-all duration-300"
              aria-label={handsetUp ? "수화기 내려놓기" : "수화기 들기"}
              style={{
                transform: handsetUp
                  ? "translateX(-50%) translateY(-1.25rem) rotate(15deg)"
                  : "translateX(-50%) translateY(0)",
                top: "0.25rem",
              }}
            >
              {/* 수화기: 검은색 곡선 바 - 이어피스(넓음) + 그립 + 마이크(좁음), 7번 버튼 가운데까지 연장 */}
              <div
                className="relative w-9 h-[13.75rem] rounded-[1.25rem] overflow-hidden"
                style={{
                  background: "linear-gradient(155deg, #4a5160 0%, #374151 25%, #252d38 60%, #141920 100%)",
                  boxShadow:
                    "inset 0 3px 6px rgba(255,255,255,0.12), inset -2px -3px 6px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)",
                  border: "2px solid #1f2937",
                }}
              >
                {/* 이어피스 그릴 (둥근 구멍) */}
                <div
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full"
                  style={{ background: "#0f172a", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)" }}
                />
                {/* 마이크 그릴 (이어피스와 동일) */}
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full"
                  style={{ background: "#0f172a", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)" }}
                />
              </div>
            </button>
          </div>
          {/* 코일 코드 (검은색) - 입체 */}
          <div
            className={`mt-1.5 w-4 h-5 rounded-md transition-opacity duration-300 ${handsetUp ? "opacity-70" : ""}`}
            style={{
              background: "repeating-linear-gradient(90deg, #2d3542 0, #2d3542 1px, #1f2937 1px, #1f2937 3px)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)",
              border: "1px solid #1f2937",
            }}
          />
        </div>

        {/* 오른쪽: 조작 패널 (깊은 리세스, 두꺼운 베젤) */}
        <div
          className="flex-1 rounded-xl p-3 min-w-0"
          style={{
            background: "linear-gradient(180deg, #2d3542 0%, #1f2937 40%, #151b24 100%)",
            boxShadow:
              "inset 0 6px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.2)",
            border: "2px solid #1a1f2e",
          }}
        >
          {/* 상단 LCD 디스플레이 - 움푹 패인 */}
          <div
            className="h-6 w-full rounded-md mb-3"
            style={{
              background: "linear-gradient(180deg, #0f1419 0%, #080b0f 100%)",
              boxShadow: "inset 0 4px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
              border: "2px solid #0a0d12",
            }}
          />

          {/* 정보 패널 + 금색 카드 슬롯 - 볼록 */}
          <div
            className="rounded-lg px-2.5 py-1.5 mb-3 flex flex-col gap-1"
            style={{
              background: "linear-gradient(180deg, #fef8e7 0%, #fde68a 40%, #f5c842 100%)",
              boxShadow:
                "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.2)",
              border: "2px solid #b45309",
            }}
          >
            <span className="text-[9px] text-amber-900/90 font-mono font-semibold">Tel: 1544-BOOKS</span>
            <div
              className="h-2.5 w-full rounded-md"
              style={{
                background: "linear-gradient(180deg, #8b5a0b 0%, #6b4408 100%)",
                boxShadow: "inset 0 3px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                border: "1px solid #4a3005",
              }}
            />
          </div>

          {/* 키패드 영역: 3x4 키패드 | 우 기능버튼 */}
          <div className="flex gap-2 mb-2">
            {/* 3x4 숫자 키패드 (1~6 = 서점 링크) */}
            <div className="flex-1 grid grid-cols-3 gap-1.5 min-w-0">
              {KEYPAD_LAYOUT.flat().map((cell, idx) => {
                const num = typeof cell === "number" ? cell : null;
                const store = num !== null ? getStoreByKey(num) : null;
                const href = store ? getHref(store.name) : null;
                const label = store ? String(num) : String(cell);

                const btn = (
                  <div
                    key={idx}
                    className="aspect-square min-h-[2.25rem] rounded-lg flex flex-col items-center justify-center p-2 transition-all active:scale-95 active:shadow-inner"
                    style={keypadBtn}
                  >
                    {store ? (
                      <span
                        className={`font-bold text-gray-800 text-center max-w-full overflow-hidden break-words whitespace-pre-line leading-tight ${store.textClass ?? "text-[10px]"}`}
                      >
                        {store.label}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-gray-800 leading-none">{label}</span>
                    )}
                  </div>
                );

                if (href) {
                  return (
                    <Link
                      key={idx}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playPayphoneBeep()}
                      className="block"
                    >
                      {btn}
                    </Link>
                  );
                }
                return <div key={idx}>{btn}</div>;
              })}
            </div>

            {/* 우측 기능 버튼 3개 */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <Link
                href="https://www.youtube.com/@siinseon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-10 rounded-lg min-h-[2.25rem] flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, #ef4444 0%, #dc2626 30%, #991b1b 100%)",
                  boxShadow:
                    "inset 0 3px 5px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.25)",
                  border: "2px solid #7f1d1d",
                }}
              >
                <span className="text-[10px] font-bold text-white">긴급</span>
              </Link>
              <Link
                href="https://www.instagram.com/siinseon/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-10 rounded-lg min-h-[2.25rem] flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 30%, #1d4ed8 100%)",
                  boxShadow:
                    "inset 0 3px 5px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.25)",
                  border: "2px solid #1e40af",
                }}
              >
                <span className="text-[10px] font-bold text-white">help</span>
              </Link>
              <div
                className="w-8 h-10 rounded-lg min-h-[2.25rem]"
                style={{
                  ...keypadBtn,
                  boxShadow:
                    "inset 0 3px 5px rgba(255,255,255,0.85), inset 0 -2px 3px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </div>

          {/* 동전 반환 슬롯 2개 - 움푹 패인 */}
          <div className="flex gap-2 mt-3">
            <div
              className="flex-1 h-5 rounded-b-lg"
              style={{
                background: "linear-gradient(180deg, #1a1f2e 0%, #0f1419 100%)",
                boxShadow: "inset 0 4px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
                border: "2px solid #0a0d12",
                borderTop: "3px solid #374151",
              }}
            />
            <div
              className="flex-1 h-5 rounded-b-lg"
              style={{
                background: "linear-gradient(180deg, #1a1f2e 0%, #0f1419 100%)",
                boxShadow: "inset 0 4px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
                border: "2px solid #0a0d12",
                borderTop: "3px solid #374151",
              }}
            />
          </div>
        </div>
      </div>

      {/* 하단 베이스 - 금속 빵빵 */}
      <div
        className="h-3 w-full rounded-b-2xl"
        style={{
          background: "linear-gradient(180deg, #5b6575 0%, #3d4754 40%, #2d3542 100%)",
          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.12), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
          borderTop: "2px solid #4b5563",
        }}
      />
    </div>
  );
}
