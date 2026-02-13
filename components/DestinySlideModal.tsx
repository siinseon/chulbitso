"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Book } from "@/lib/useBooks";
import type { BooksSnapshot } from "@/lib/analysisStats";

function isValidCoverUrl(url: string | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
}

function getAllBooks(books: BooksSnapshot): Book[] {
  return [...books.my, ...books.read, ...books.ebook];
}

function getUnreadBooks(books: BooksSnapshot): Book[] {
  return getAllBooks(books).filter((b) => b.recordStatus !== "완독");
}

function pickRandomUnread(books: BooksSnapshot, excludeId?: string): Book | null {
  const unread = getUnreadBooks(books).filter((b) => b.id !== excludeId);
  if (unread.length === 0) return null;
  return unread[Math.floor(Math.random() * unread.length)];
}

interface DestinySlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: BooksSnapshot;
  onReadNow?: (book: Book) => void;
}

export default function DestinySlideModal({
  isOpen,
  onClose,
  books,
  onReadNow,
}: DestinySlideModalProps) {
  const [phase, setPhase] = useState<"ready" | "sliding" | "result">("ready");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rerollUsed, setRerollUsed] = useState(false);

  const unreadCount = getUnreadBooks(books).length;

  const startSlide = useCallback(
    (excludeId?: string) => {
      const picked = pickRandomUnread(books, excludeId);
      if (!picked) {
        setSelectedBook(null);
        setPhase("result");
        return;
      }
      setSelectedBook(picked);
      setPhase("sliding");
    },
    [books]
  );

  useEffect(() => {
    if (!isOpen) return;
    setPhase("ready");
    setRerollUsed(false);
    setSelectedBook(null);
    const t = setTimeout(() => startSlide(), 400);
    return () => clearTimeout(t);
  }, [isOpen, startSlide]);

  const handleSlideEnd = () => {
    setPhase("result");
  };

  const handleReroll = () => {
    if (rerollUsed || !selectedBook) return;
    setRerollUsed(true);
    startSlide(selectedBook.id);
  };

  const handleReadNow = () => {
    if (selectedBook) onReadNow?.(selectedBook);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex flex-col"
      style={{
        background: "linear-gradient(160deg, #f5b88a 0%, #e8a070 25%, #d4855c 50%, #c27048 100%)",
      }}
      aria-modal="true"
      role="dialog"
    >
      {/* 닫기 */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/25 text-white flex items-center justify-center hover:bg-black/30 active:opacity-90 touch-manipulation"
        style={{ top: "max(1rem, env(safe-area-inset-top))", right: "max(1rem, env(safe-area-inset-right))" }}
        aria-label="닫기"
      >
        <span className="text-xl leading-none">×</span>
      </button>

      {/* 미끄럼틀 무대 — 픽셀 선명도를 위해 GPU 레이어·정밀 렌더링 */}
      <div className="flex-1 relative overflow-hidden min-h-[56vh]" style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
        {/* 미끄럼틀 SVG: shape-rendering으로 스케일 시 선명도 유지 */}
        <svg
          className="absolute pointer-events-none inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient id="slide-surface" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fcff" />
              <stop offset="15%" stopColor="#e4ecf4" />
              <stop offset="50%" stopColor="#c0c8d0" />
              <stop offset="85%" stopColor="#98a0a8" />
              <stop offset="100%" stopColor="#788088" />
            </linearGradient>
            <linearGradient id="slide-under" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#889098" />
              <stop offset="100%" stopColor="#485058" />
            </linearGradient>
            <linearGradient id="post-metal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a8b0b8" />
              <stop offset="50%" stopColor="#e8ecf0" />
              <stop offset="100%" stopColor="#889098" />
            </linearGradient>
            <linearGradient id="step-tread" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e85c4a" />
              <stop offset="40%" stopColor="#d84c3a" />
              <stop offset="100%" stopColor="#c03c2a" />
            </linearGradient>
            <linearGradient id="platform-wood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4a574" />
              <stop offset="50%" stopColor="#c49564" />
              <stop offset="100%" stopColor="#a87848" />
            </linearGradient>
            <linearGradient id="railing-red" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e85c4a" />
              <stop offset="100%" stopColor="#c03c2a" />
            </linearGradient>
            <filter id="slide-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.3)" />
            </filter>
          </defs>

          {/* 땅(바닥) — 계단 쪽 두껍게, stroke 정수로 선명도 확보 */}
          <line x1="0" y1="98" x2="100" y2="98" stroke="#7a6348" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="-14" y="96" width="28" height="4" fill="#6a5340" stroke="#5a4838" strokeWidth="0.5" rx="0.5" />

          {/* 세로 기둥: 플랫폼 받침 — 왼쪽 기둥과 동일 색(은색) 세트 */}
          <rect x="14" y="16" width="2.8" height="82" fill="url(#post-metal)" stroke="#4a4a4a" strokeWidth="0.5" rx="0.5" />

          {/* 계단 받침: 스트링어(대각 보) 두 개 + 사이 채움 — 맨 위 y=10에 맞춤 */}
          <path d="M -13 98 L 10 12 L 12 12 L -10.5 98 Z" fill="#505860" stroke="#4a4a4a" strokeWidth="0.6" />
          <path d="M -13 98 L 10 12" fill="none" stroke="#6a7078" strokeWidth="1" strokeLinecap="round" />
          <path d="M -10.5 98 L 12 12" fill="none" stroke="#6a7078" strokeWidth="1" strokeLinecap="round" />

          {/* 계단: 맨 위 단이 플랫폼(미끄럼틀 시작) x=12, 높이 y=10에 맞닿음 */}
          <g fill="url(#step-tread)" stroke="#a03020" strokeWidth="0.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
              const run = 2.5;
              const rise = 7.8;
              const th = 1.8;
              const xR = 12 - (9 - i) * run;
              const xL = xR - run;
              const yB = 98 - i * (rise + th);
              const yT = yB - th;
              return (
                <g key={i}>
                  {/* 발받이(세로면) */}
                  <path d={`M ${xL} ${yT} L ${xL} ${yB} L ${xR} ${yB} L ${xR} ${yT} Z`} />
                  {/* 발판(가로면, 살짝 돌출) */}
                  <path d={`M ${xL} ${yT} L ${xR + 0.5} ${yT} L ${xR + 0.5} ${yT + 0.5} L ${xL} ${yT + 0.5} Z`} />
                </g>
              );
            })}
          </g>
          {/* 계단 난간 (빨간색) — 맨 위 y=10에서 플랫폼 x=12에 연결 */}
          <path d="M -10.5 96 L -8 87 L -5.5 77 L -3 67 L -0.5 58 L 2 49 L 4.5 40 L 7 30 L 9.5 21 L 12 10" fill="none" stroke="url(#railing-red)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M -8.7 96 L -6.2 87 L -3.7 77 L -1.2 67 L 1.3 58 L 3.8 49 L 6.3 40 L 8.8 30 L 11.3 21 L 13.8 10" fill="none" stroke="url(#railing-red)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />

          {/* 맨 위 플랫폼 (미끄럼틀 타기 전 발 디딤) */}
          <path
            d="M 12 10 L 20 10 L 20 16 L 12 16 Z"
            fill="url(#platform-wood)"
            stroke="#8b6914"
            strokeWidth="0.6"
          />
          {/* 플랫폼 빨간 난간 */}
          <line x1="12" y1="10" x2="12" y2="16" stroke="url(#railing-red)" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="12" y1="13" x2="18" y2="13" stroke="url(#railing-red)" strokeWidth="0.7" strokeLinecap="round" />
          <line x1="18" y1="10" x2="18" y2="16" stroke="url(#railing-red)" strokeWidth="0.7" strokeLinecap="round" />

          {/* 은색 기둥: 트러프 시작 부근에서 땅까지 */}
          <rect x="8.5" y="14" width="2.5" height="84" fill="url(#post-metal)" stroke="#4a4a4a" strokeWidth="0.5" rx="0.5" />
          {/* 기둥: 아래쪽 */}
          <rect x="67" y="82" width="3" height="16" fill="url(#post-metal)" stroke="#4a4a4a" strokeWidth="0.5" rx="0.5" />

          {/* 미끄럼틀 몸통: 트러프 아래·옆면 — 최상단 y=10 (계단·플랫폼과 동일) */}
          <path
            d="M 10 16 L 66 84 L 76 84 L 14 10 Z"
            fill="url(#slide-under)"
            stroke="#3d3d3d"
            strokeWidth="0.6"
          />
          <path
            d="M 10 10 L 10 16 L 66 84 L 66 80 Z"
            fill="#707070"
            stroke="#4a4a4a"
            strokeWidth="0.5"
          />
          <path
            d="M 14 10 L 14 14 L 76 84 L 76 80 Z"
            fill="#606060"
            stroke="#4a4a4a"
            strokeWidth="0.5"
          />

          {/* 트러프 위쪽(미끄는 면): 끝이 퍼진 미끄럼틀 출구 */}
          <path
            d="M 10 10 L 66 80 L 76 80 L 14 10 Z"
            fill="url(#slide-surface)"
            filter="url(#slide-shadow)"
            stroke="#3d3d3d"
            strokeWidth="0.8"
          />
          {/* 미끄럼틀 옆면 프레임 */}
          <path
            d="M 9 10 L 65 81 L 65 82 L 9 12 Z"
            fill="#9ca4ac"
            stroke="#5a6068"
            strokeWidth="0.5"
          />
          <path
            d="M 15 10 L 15 11 L 77 80 L 77 79 Z"
            fill="#8c949c"
            stroke="#5a6068"
            strokeWidth="0.5"
          />
          {/* 난간 (테두리 위에) */}
          <path d="M 10 10 L 66 80" fill="none" stroke="#5a5a5a" strokeWidth="1" strokeLinecap="round" />
          <path d="M 14 10 L 76 80" fill="none" stroke="#5a5a5a" strokeWidth="1" strokeLinecap="round" />
        </svg>
        {/* 착지장: 줄여서 땅에 붙인 작은 모래 패치 */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            left: "62%",
            bottom: "2%",
            width: "18%",
            height: "10%",
            background: "linear-gradient(180deg, #d4b878 0%, #c4a868 50%, #a89050 100%)",
            boxShadow: "inset 0 1px 4px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.15)",
            border: "1px solid #8a7840",
          }}
        />

        {/* 책: 꼭대기 → 낙하 → 착지 후 앞으로 짠 */}
        {selectedBook && (phase === "sliding" || phase === "result") && (
          <div
            className="absolute z-10 w-[56px] rounded shadow-lg border-2 border-amber-900/40 overflow-hidden"
            style={{
              left: "12%",
              top: "10%",
              aspectRatio: "2/3",
              animation:
                phase === "sliding"
                  ? "destiny-slide-down 1.6s cubic-bezier(0.7, 0, 0.84, 0) forwards"
                  : "destiny-pop-forward 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              animationFillMode: "forwards",
            }}
            onAnimationEnd={phase === "sliding" ? handleSlideEnd : undefined}
          >
            {isValidCoverUrl(selectedBook.cover) ? (
              <Image
                src={selectedBook.cover!}
                alt=""
                width={112}
                height={168}
                className="w-full h-full object-cover"
                unoptimized
                sizes="56px"
              />
            ) : (
              <div className="w-full h-full min-h-[84px] bg-amber-100 flex items-center justify-center text-amber-900/70 text-[10px] font-bold p-1 text-center leading-tight">
                {(selectedBook.title ?? "").slice(0, 6)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 결과: 미끄럼틀 위 하단 오버레이 — 뒤 화면 그대로 유지 */}
      {phase === "result" && (
        <div
          className="absolute inset-x-0 bottom-0 animate-fadeIn px-4 pt-3 pb-4 flex flex-col items-center"
          style={{
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
            background: "linear-gradient(to top, rgba(245,184,138,0.97) 0%, rgba(232,160,112,0.9) 40%, transparent 100%)",
          }}
        >
          {selectedBook ? (
            <>
              <p className="text-amber-950/90 text-sm font-serif mb-1">오늘의 운명</p>
              <h3 className="text-primary font-bold text-base font-serif text-center mb-4 max-w-[280px]">
                {selectedBook.title ?? "제목 없음"}
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[280px]">
                <button
                  type="button"
                  onClick={handleReadNow}
                  className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-95 active:opacity-90"
                >
                  지금 바로 읽기
                </button>
                <button
                  type="button"
                  onClick={handleReroll}
                  disabled={rerollUsed || unreadCount <= 1}
                  className="flex-1 py-3.5 rounded-xl border-2 border-amber-800/50 text-amber-900 font-bold text-sm bg-amber-50/80 hover:bg-amber-100/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rerollUsed ? "기회 소진" : <>한 번만 다시<br />(기회 1번)</>}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-amber-950/90 font-serif mb-2">읽지 않은 책이 없어요</p>
              <p className="text-amber-900/70 text-sm mb-4">책을 먼저 담아 주세요.</p>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-6 rounded-xl bg-primary text-white font-bold text-sm"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
