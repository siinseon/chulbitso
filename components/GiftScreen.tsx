"use client";

import RetroPayphone from "./RetroPayphone";

const STORE_LINKS: { name: string; url: string }[] = [
  { name: "알라딘", url: "https://www.aladin.co.kr/events/wevent.aspx?EventId=138432" },
  { name: "교보문고", url: "https://event.kyobobook.co.kr/gift-promotions" },
  { name: "예스24", url: "https://event.yes24.com/monthlygift" },
  { name: "영풍문고", url: "https://www.ypbooks.co.kr/" },
  { name: "밀리의 서재", url: "https://www.millie.co.kr/" },
  { name: "윌라", url: "https://www.welaaa.com/" },
];

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

        <RetroPayphone links={STORE_LINKS} />

      </div>
    </section>
  );
}
