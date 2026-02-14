"use client";

import { useState } from "react";

const PALETTE = ["#8C9E83", "#6A8B9A", "#C98C6E"] as const; // 세이지 그린, 빈티지 블루, 녹슨 오렌지

const STORE_LINKS: { name: string; url: string }[] = [
  { name: "알라딘", url: "https://www.aladin.co.kr/events/wevent.aspx?EventId=138432" },
  { name: "교보문고", url: "https://event.kyobobook.co.kr/gift-promotions" },
  { name: "예스24", url: "https://event.yes24.com/monthlygift" },
  { name: "영풍문고", url: "https://www.ypbooks.co.kr/" },
  { name: "밀리의 서재", url: "https://www.millie.co.kr/" },
  { name: "윌라", url: "https://www.welaaa.com/" },
];

function RustyNail() {
  return (
    <div
      className="absolute w-2.5 h-2.5 rounded-full"
      style={{
        background: "radial-gradient(circle at 30% 30%, #6a5a4a, #4a3a2a)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.4)",
        border: "1px solid #3a2a1a",
      }}
    />
  );
}

function Plank({
  name,
  url,
  color,
  side,
}: {
  name: string;
  url: string;
  color: string;
  side: "left" | "right";
}) {
  const [wobble, setWobble] = useState(false);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative"
      style={{
        transform: side === "left" ? "translateX(8px)" : "translateX(-8px)",
      }}
      onMouseEnter={() => setWobble(true)}
      onMouseLeave={() => setWobble(false)}
      onAnimationEnd={() => setWobble(false)}
    >
      <span
        className={`block ${wobble ? "animate-signpost-wobble" : ""}`}
        style={{ transformOrigin: side === "left" ? "left center" : "right center" }}
      >
        <div
          className="relative py-2.5 px-4 rounded-sm min-w-[120px] text-center border-2"
          style={{
            background: `linear-gradient(180deg, ${color} 0%, ${color} 50%, ${color} 100%)`,
            borderColor: "rgba(58,49,40,0.35)",
            boxShadow:
              "inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.12), 0 3px 8px rgba(58,49,40,0.2)",
          }}
        >
          {/* 나무 결 질감 */}
          <div
            className="absolute inset-0 rounded-sm pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 3px)",
              opacity: 0.9,
            }}
          />
          <div
            className="absolute inset-0 rounded-sm pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 9px)",
              opacity: 0.8,
            }}
          />
          <span
            className="relative z-10 text-[16px] font-paint text-white"
            style={{
              textShadow: "0 0 0 2px rgba(0,0,0,0.25), 0 2px 0 rgba(0,0,0,0.2), 1px 1px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(0,0,0,0.1)",
              letterSpacing: "0.02em",
            }}
          >
            {name}
          </span>
          {side === "left" ? (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
              <RustyNail />
            </div>
          ) : (
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
              <RustyNail />
            </div>
          )}
        </div>
      </span>
    </a>
  );
}

export default function GiftScreen() {
  return (
    <section className="animate-fadeIn min-h-[420px] relative overflow-hidden">
      {/* 모래사장/놀이터 배경 - 연한 질감 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='%238a7a6a' fill-opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />
      {/* 정글짐 실루엣 - 흐릿하게 */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-16 opacity-[0.06] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, #4A5E42 100%)",
          clipPath: "polygon(20% 100%, 30% 40%, 50% 20%, 70% 40%, 80% 100%)",
        }}
      />

      <div className="relative px-4 pt-4 pb-8">
        <p
          className="text-center text-[14px] text-text-muted font-paint mb-6"
          style={{
            textShadow: "0 0 0 1px rgba(58,49,40,0.2), 0 1px 0 rgba(58,49,40,0.15)",
          }}
        >
          비밀 이정표
        </p>

        {/* 중앙 나무 기둥 (삐딱하게) */}
        <div className="flex justify-center mb-2">
          <div
            className="relative w-8 h-48 rounded-b-lg"
            style={{
              transform: "rotate(-4deg)",
              background: "linear-gradient(90deg, #6B5A48 0%, #5A4A38 30%, #4A3A28 70%, #5A4A38 100%)",
              boxShadow: "inset 2px 0 0 rgba(255,255,255,0.06), inset -2px 0 0 rgba(0,0,0,0.2), 4px 8px 20px rgba(58,49,40,0.25)",
              border: "1px solid #4a3a28",
            }}
          >
            <div
              className="absolute inset-0 rounded-b-lg opacity-20 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 5px)",
              }}
            />
          </div>
        </div>

        {/* 판자들: 지그재그 Left-Right */}
        <div className="flex flex-col items-center gap-3 -mt-40">
          {STORE_LINKS.map((store, i) => (
            <div key={store.name} className="flex justify-center w-full">
              <Plank
                name={store.name}
                url={store.url}
                color={PALETTE[i % 3]}
                side={i % 2 === 0 ? "left" : "right"}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
