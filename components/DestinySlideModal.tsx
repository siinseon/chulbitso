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
  const [phase, setPhase] = useState<"ready" | "sliding" | "bounce" | "result">("ready");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rerollUsed, setRerollUsed] = useState(false);
  const [dustKey, setDustKey] = useState(0);

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
      setDustKey((k) => k + 1);
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
    setPhase("bounce");
    setTimeout(() => setPhase("result"), 400);
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
      className="fixed inset-0 z-[100] flex flex-col"
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
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/30"
        aria-label="닫기"
      >
        <span className="text-xl leading-none">×</span>
      </button>

      {/* 미끄럼틀 무대 */}
      <div className="flex-1 relative overflow-hidden min-h-[56vh]">
        {/* 미끄럼틀: 책이 움직이는 직선 경로(12%,10% → +58vw,+68vh)를 그대로 따라 그림. viewBox 0 0 100 100 + none으로 퍼센트와 1:1 대응 */}
        <svg
          className="absolute pointer-events-none inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
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
            <linearGradient id="pole-blue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7eb8d8" />
              <stop offset="50%" stopColor="#a8d4f0" />
              <stop offset="100%" stopColor="#6aa8c8" />
            </linearGradient>
            <linearGradient id="beam-yellow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f0d030" />
              <stop offset="50%" stopColor="#ffe060" />
              <stop offset="100%" stopColor="#e0c020" />
            </linearGradient>
            <linearGradient id="railing-red" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e85c4a" />
              <stop offset="100%" stopColor="#c03c2a" />
            </linearGradient>
            <filter id="slide-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.35)" />
            </filter>
          </defs>

          {/* 땅(바닥) */}
          <line x1="0" y1="98" x2="100" y2="98" stroke="#7a6348" strokeWidth="2" strokeLinecap="round" />

          {/* 하늘색 기둥: 플랫폼 받치는 굵은 세로 기둥 (사진처럼) */}
          <rect x="17" y="16" width="2.8" height="82" fill="url(#pole-blue)" stroke="#4a8ab0" strokeWidth="0.35" rx="0.4" />

          {/* 노란 대각선 보강대: 계단/플랫폼에서 땅으로 */}
          <line x1="5" y1="16" x2="2" y2="98" stroke="url(#beam-yellow)" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="20" y1="14" x2="14" y2="98" stroke="url(#beam-yellow)" strokeWidth="1.4" strokeLinecap="round" />

          {/* 계단: 왼쪽에서 플랫폼까지 올라가는 빨간 계단 + 난간 */}
          <g fill="url(#step-tread)" stroke="#a03020" strokeWidth="0.4">
            <path d="M 2 98 L 2 84 L 6 84 L 6 98 Z" />
            <path d="M 4 84 L 4 70 L 8 70 L 8 84 Z" />
            <path d="M 6 70 L 6 56 L 10 56 L 10 70 Z" />
            <path d="M 8 56 L 8 42 L 12 42 L 12 56 Z" />
            <path d="M 10 42 L 10 28 L 14 28 L 14 42 Z" />
            <path d="M 12 28 L 12 14 L 18 14 L 18 28 Z" />
          </g>
          {/* 계단 난간 (빨간색 — 사진처럼) */}
          <path d="M 2 84 L 4 70 L 6 56 L 8 42 L 10 28 L 12 14" fill="none" stroke="url(#railing-red)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 6 84 L 8 70 L 10 56 L 12 42 L 14 28 L 18 14" fill="none" stroke="url(#railing-red)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />

          {/* 맨 위 플랫폼 (미끄럼틀 타기 전 발 디딤) */}
          <path
            d="M 12 10 L 20 10 L 20 16 L 12 16 Z"
            fill="url(#platform-wood)"
            stroke="#8b6914"
            strokeWidth="0.5"
          />
          {/* 플랫폼 빨간 난간 (사진처럼 가로 봉) */}
          <line x1="12" y1="10" x2="12" y2="16" stroke="url(#railing-red)" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="12" y1="13" x2="18" y2="13" stroke="url(#railing-red)" strokeWidth="0.6" strokeLinecap="round" />
          <line x1="18" y1="10" x2="18" y2="16" stroke="url(#railing-red)" strokeWidth="0.6" strokeLinecap="round" />

          {/* 은색 기둥: 트러프 시작 부근에서 땅까지 */}
          <rect x="8.5" y="14" width="2.5" height="84" fill="url(#post-metal)" stroke="#4a4a4a" strokeWidth="0.4" rx="0.5" />
          {/* 기둥: 아래쪽 */}
          <rect x="67" y="82" width="3" height="16" fill="url(#post-metal)" stroke="#4a4a4a" strokeWidth="0.4" rx="0.5" />

          {/* 미끄럼틀 몸통: 트러프 아래·옆면 */}
          <path
            d="M 10 16 L 66 84 L 76 84 L 14 12 Z"
            fill="url(#slide-under)"
            stroke="#3d3d3d"
            strokeWidth="0.5"
          />
          <path
            d="M 10 12 L 10 16 L 66 84 L 66 80 Z"
            fill="#707070"
            stroke="#4a4a4a"
            strokeWidth="0.4"
          />
          <path
            d="M 14 8 L 14 12 L 76 84 L 76 80 Z"
            fill="#606060"
            stroke="#4a4a4a"
            strokeWidth="0.4"
          />

          {/* 트러프 위쪽(미끄는 면): 끝이 퍼진 미끄럼틀 출구 */}
          <path
            d="M 10 12 L 66 80 L 76 80 L 14 8 Z"
            fill="url(#slide-surface)"
            filter="url(#slide-shadow)"
            stroke="#3d3d3d"
            strokeWidth="0.8"
          />
          {/* 미끄럼틀 옆면 프레임 (사진처럼 들어 올려진 회색 테두리) */}
          <path
            d="M 9 13 L 65 81 L 65 82 L 9 14 Z"
            fill="#9ca4ac"
            stroke="#5a6068"
            strokeWidth="0.4"
          />
          <path
            d="M 15 7 L 77 79 L 77 80 L 15 8 Z"
            fill="#8c949c"
            stroke="#5a6068"
            strokeWidth="0.4"
          />
          {/* 난간 (테두리 위에) */}
          <path d="M 10 12 L 66 80" fill="none" stroke="#5a5a5a" strokeWidth="0.9" strokeLinecap="round" />
          <path d="M 14 8 L 76 80" fill="none" stroke="#5a5a5a" strokeWidth="0.9" strokeLinecap="round" />
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

        {/* 책: 꼭대기 → 낙하 (ease-in-expo) → 착지 바운스 */}
        {selectedBook && phase !== "result" && (
          <>
            {phase === "bounce" ? (
              <div
                className="absolute z-10"
                style={{ left: "12%", top: "10%", transform: "translate(58vw, 68vh)" }}
              >
                <div
                  className="w-14 h-20 rounded shadow-lg border-2 border-amber-900/40 overflow-hidden"
                  style={{ animation: "destiny-bounce 0.4s ease-out forwards" }}
                >
                  {isValidCoverUrl(selectedBook.cover) ? (
                    <Image
                      src={selectedBook.cover!}
                      alt=""
                      width={56}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-900/70 text-[10px] font-bold p-1 text-center leading-tight">
                      {(selectedBook.title ?? "").slice(0, 6)}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="absolute z-10 w-14 h-20 rounded shadow-lg border-2 border-amber-900/40 overflow-hidden"
                style={{
                  left: "12%",
                  top: "10%",
                  animation: "destiny-slide-down 1.6s cubic-bezier(0.7, 0, 0.84, 0) forwards",
                  animationFillMode: "forwards",
                }}
                onAnimationEnd={handleSlideEnd}
              >
                {isValidCoverUrl(selectedBook.cover) ? (
                  <Image
                    src={selectedBook.cover!}
                    alt=""
                    width={56}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-900/70 text-[10px] font-bold p-1 text-center leading-tight">
                    {(selectedBook.title ?? "").slice(0, 6)}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 낙하 끝 착지 시 모래 먼지 */}
        {phase === "bounce" && (
          <div className="absolute pointer-events-none z-10" style={{ left: "68%", top: "74%" }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={`${dustKey}-${i}`}
                className="absolute rounded-full bg-amber-200/90"
                style={{
                  width: 8,
                  height: 8,
                  left: (i - 2) * 18,
                  top: (i % 3) * 10,
                  animation: `destiny-dust 0.5s ease-out forwards`,
                  animationDelay: `${i * 0.03}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 결과: 오늘의 운명 카드 */}
      {phase === "result" && (
        <div className="animate-fadeIn px-4 pb-8 pt-2 flex flex-col items-center">
          {selectedBook ? (
            <>
              <div className="w-28 h-36 rounded-lg overflow-hidden shadow-xl border-2 border-amber-900/30 mb-3">
                {isValidCoverUrl(selectedBook.cover) ? (
                  <Image
                    src={selectedBook.cover!}
                    alt=""
                    width={112}
                    height={144}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-900/80 text-xs font-bold p-2 text-center">
                    {selectedBook.title ?? ""}
                  </div>
                )}
              </div>
              <p className="text-amber-950/90 text-sm font-serif mb-1">오늘의 운명</p>
              <h3 className="text-primary font-bold text-lg font-serif text-center mb-4 max-w-[280px]">
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
                  {rerollUsed ? "기회 소진" : "한 번만 다시 (기회 1번)"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
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
