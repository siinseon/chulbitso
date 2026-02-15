"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Book } from "@/lib/useBooks";
import type { BooksSnapshot } from "@/lib/analysisStats";

/** SlideIllustration과 동일한 색상 팔레트 */
const COLORS = {
  gold: "#a89268",
  blueGray: "#6a7a8a",
  rust: "#9a6b58",
  green: "#6a7c5a",
} as const;

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

const MAGIC_DUST_DURATION_MS = 4500; // 2.2s 애니 + max delay (56 * 35ms)

function MagicDustOverlay({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, MAGIC_DUST_DURATION_MS);
    return () => clearTimeout(t);
  }, [onComplete]);

  const count = 56;
  const pillarCenterLeft = 14; // 기둥 중앙 %
  const pillarWidth = 4; // 기둥 폭 %

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2; // 기둥 둘레에 분포
        const radius = (pillarWidth / 2) * (0.6 + (i % 3) * 0.2); // 안쪽~바깥쪽
        const left = pillarCenterLeft + Math.cos(angle) * radius + (i % 2) * 1;
        const spiral = i % 2 === 0 ? "magic-dust-spiral-cw" : "magic-dust-spiral-ccw";
        return (
          <div
            key={i}
            className="absolute rounded-full bg-amber-300/90"
            style={{
              left: `${left}%`,
              bottom: "4%",
              width: 2 + (i % 2),
              height: 2 + (i % 2),
              boxShadow: "0 0 4px rgba(251,191,36,0.85)",
              animation: `${spiral} 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
              animationDelay: `${i * 35}ms`,
            }}
          />
        );
      })}
    </div>
  );
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
  const [phase, setPhase] = useState<"ready" | "magic" | "sliding" | "result">("ready");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rerollUsed, setRerollUsed] = useState(false);

  const unreadCount = getUnreadBooks(books).length;

  const startMagic = useCallback(
    (excludeId?: string) => {
      const picked = pickRandomUnread(books, excludeId);
      if (!picked) {
        setSelectedBook(null);
        setPhase("result");
        return;
      }
      setSelectedBook(picked);
      setPhase("magic");
    },
    [books]
  );

  const handleMagicEnd = useCallback(() => {
    setPhase("sliding");
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setPhase("ready");
    setRerollUsed(false);
    setSelectedBook(null);
    const t = setTimeout(() => startMagic(), 400);
    return () => clearTimeout(t);
  }, [isOpen, startMagic]);

  const handleSlideEnd = () => {
    setPhase("result");
  };

  const handleReroll = () => {
    if (rerollUsed || !selectedBook) return;
    setRerollUsed(true);
    startMagic(selectedBook.id);
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
          viewBox="0 -2 100 102"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <filter id="modal-house-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.18" />
            </filter>
            <filter id="modal-slide-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.2" />
            </filter>
            {/* 서커스 천막 — 세로 줄무늬 패턴 (참고 이미지: dark gray / white) */}
            <pattern id="tent-stripes" patternUnits="userSpaceOnUse" width="3" height="100">
              <rect width="1.5" height="100" fill="#4a4a4a" />
              <rect width="1.5" height="100" x="1.5" fill="#fff" />
            </pattern>
            {/* 미끄럼틀 — 레드카펫 (벨벳 톤, 골드 트림) */}
            <linearGradient id="slide-peel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b1a1a" />
              <stop offset="35%" stopColor="#6b0a0a" />
              <stop offset="70%" stopColor="#5a0505" />
              <stop offset="100%" stopColor="#4a0000" />
            </linearGradient>
            <linearGradient id="slide-peel-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="30%" stopColor="rgba(220,180,180,0.15)" />
              <stop offset="70%" stopColor="rgba(180,100,100,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="slide-gold-trim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8c84a" />
              <stop offset="50%" stopColor="#c9a82a" />
              <stop offset="100%" stopColor="#a88218" />
            </linearGradient>
            {/* 기둥용 목재 — 원통형 음영 */}
            <linearGradient id="pillar-wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7a5040" />
              <stop offset="35%" stopColor={COLORS.rust} />
              <stop offset="65%" stopColor="#8a5a48" />
              <stop offset="100%" stopColor="#5a3830" />
            </linearGradient>
            {/* 포크 나무 — 두께감·나뭇결용 */}
            <linearGradient id="fork-wood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a87858" />
              <stop offset="40%" stopColor="#8a6048" />
              <stop offset="100%" stopColor="#5a4030" />
            </linearGradient>
            {/* 기둥 화려 장식 — 골드 반짝임 */}
            <linearGradient id="pillar-gold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f5d86a" />
              <stop offset="30%" stopColor="#e8c84a" />
              <stop offset="70%" stopColor="#c9a82a" />
              <stop offset="100%" stopColor="#a88218" />
            </linearGradient>
            {/* 기둥 나선 줄무늬 (서커스 바버폴 스타일) */}
            <pattern id="pillar-spiral" patternUnits="userSpaceOnUse" width="4" height="20">
              <rect width="4" height="20" fill="#5a3828" />
              <line x1="0" y1="0" x2="4" y2="20" stroke="#c9a82a" strokeWidth="0.9" />
            </pattern>
          </defs>

          {/* 서커스 천막 — 참고 이미지 (원뿔 지붕 + 원통 벽 + 스컬럽 밸런스 + 입구 천막 + 가이 로프 + 깃발) */}
          <g filter="url(#modal-house-shadow)">
            {/* 본 천막 — 원뿔형 지붕 (세로 줄무늬) */}
            <path d="M 14 1 L 4 12 L 24 12 Z" fill="url(#tent-stripes)" stroke="#3a3a3a" strokeWidth="0.3" />
            {/* 스컬럽 밸런스 — 지붕 아래 반원형 장식 (아래로 향한 반원) */}
            <path d="M 4 12 Q 6 14 8 12 Q 10 14 12 12 Q 14 14 16 12 Q 18 14 20 12 Q 22 14 24 12" fill="none" stroke="#3a3a3a" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* 원통형 벽 — 좌우 패널 (세로 줄무늬) */}
            <path d="M 4 12 L 4 24 L 9 24 L 9 12 Z" fill="url(#tent-stripes)" stroke="#3a3a3a" strokeWidth="0.3" />
            <path d="M 19 12 L 19 24 L 24 24 L 24 12 Z" fill="url(#tent-stripes)" stroke="#3a3a3a" strokeWidth="0.3" />
            {/* 입구 천막 — 뾰족한 아치(V자), 양옆으로 벌어짐, 세로 줄무늬, 중앙 개방 */}
            <path fillRule="evenodd" d="M 7 24 L 14 17 L 22 24 Z M 9 22 A 5 5 0 0 0 19 22 L 9 22 Z" fill="url(#tent-stripes)" stroke="#3a3a3a" strokeWidth="0.3" />
            {/* 입구 안쪽 (미끄럼틀 출구) */}
            <path d="M 9 22 L 19 22 A 5 10 0 0 0 9 22 Z" fill="#2a2018" stroke="#1a1410" strokeWidth="0.35" />
            {/* 깃대 + 깃발 — 꼭대기 */}
            <line x1="14" y1="1" x2="14" y2="-1.2" stroke="#3a3a3a" strokeWidth="0.25" />
            <path d="M 14 -1.2 L 17 -1 L 16.5 -0.8 L 17 -0.6 Z" fill="#4a4a4a" stroke="#3a3a3a" strokeWidth="0.2" />
            {/* 가이 로프 — 좌 2개, 우 2개, 앵커 사각형 */}
            <line x1="6" y1="11" x2="2" y2="18" stroke="#3a3a3a" strokeWidth="0.2" />
            <line x1="9" y1="10" x2="3" y2="20" stroke="#3a3a3a" strokeWidth="0.2" />
            <line x1="19" y1="10" x2="25" y2="20" stroke="#3a3a3a" strokeWidth="0.2" />
            <line x1="22" y1="11" x2="28" y2="18" stroke="#3a3a3a" strokeWidth="0.2" />
            <rect x="1.5" y="17.5" width="0.8" height="0.8" fill="#4a4a4a" stroke="none" />
            <rect x="2.5" y="19.5" width="0.8" height="0.8" fill="#4a4a4a" stroke="none" />
            <rect x="26.5" y="19.5" width="0.8" height="0.8" fill="#4a4a4a" stroke="none" />
            <rect x="27.5" y="17.5" width="0.8" height="0.8" fill="#4a4a4a" stroke="none" />
          </g>
          {/* 천막 중심 기둥 — 화려한 서커스 스타일 (두께 3배) */}
          <g filter="url(#modal-house-shadow)">
            {/* 기둥 본체 — 나선 줄무늬 (바버폴), 폭 3.6 */}
            <path d="M 12.2 98 L 15.8 98 L 15.5 24 L 12.5 24 Z" fill="url(#pillar-spiral)" stroke="url(#pillar-gold)" strokeWidth="0.25" />
            {/* 골드 밴드 — 상·중·하 */}
            <rect x="12" y="24" width="4" height="1.2" rx="0.3" fill="url(#pillar-gold)" stroke="#a88218" strokeWidth="0.15" />
            <rect x="12" y="58" width="4" height="1" rx="0.2" fill="url(#pillar-gold)" stroke="#a88218" strokeWidth="0.12" />
            <rect x="12" y="96.5" width="4" height="1.2" rx="0.3" fill="url(#pillar-gold)" stroke="#a88218" strokeWidth="0.15" />
            {/* 기둥머리 — 장식 캐피탈 */}
            <path d="M 11.8 24 L 14 21 L 16.2 24 L 14 22.8 Z" fill="url(#pillar-gold)" stroke="#a88218" strokeWidth="0.2" />
            <rect x="12.2" y="21.5" width="3.6" height="0.6" fill="#c9a82a" stroke="#a88218" strokeWidth="0.1" />
            {/* 기둥받침 — 화려한 베이스 */}
            <path d="M 11.5 98 L 14 101 L 16.5 98 L 14 99.2 Z" fill="url(#pillar-gold)" stroke="#a88218" strokeWidth="0.2" />
            <ellipse cx="14" cy="98.5" rx="1.8" ry="0.4" fill="#e8c84a" stroke="#c9a82a" strokeWidth="0.1" opacity={0.8} />
          </g>
          {/* 미끄럼틀 착지부 받침 기둥 — 화려하게 (두께 3배: 4→12) */}
          <g filter="url(#modal-house-shadow)">
            <rect x="62.5" y="90" width="12" height="12" fill="url(#pillar-spiral)" stroke="url(#pillar-gold)" strokeWidth="0.4" rx="0.8" />
            <rect x="63" y="90" width="10" height="1.5" fill="url(#pillar-gold)" stroke="#a88218" strokeWidth="0.15" rx="0.4" />
            <rect x="63" y="99" width="10" height="1.5" fill="url(#pillar-gold)" stroke="#a88218" strokeWidth="0.15" rx="0.4" />
          </g>

          {/* 미끄럼틀 — 레드카펫 (폭 일정, 끝 돌돌 말린 디테일) */}
          <g filter="url(#modal-slide-shadow)">
            {/* 카펫 본체 — 폭 10 일정 (평행 곡선) */}
            <path
              d="M 9 22 Q 40 50 64 92 L 74 92 Q 50 50 19 22 Z"
              fill="url(#slide-peel)"
              stroke="url(#slide-gold-trim)"
              strokeWidth="0.5"
            />
            {/* 벨벳 질감 하이라이트 */}
            <path
              d="M 9 22 Q 40 50 64 92 L 74 92 Q 50 50 19 22 Z"
              fill="url(#slide-peel-highlight)"
              stroke="none"
            />
            {/* 골드 트림 — 윗선 (카펫 가장자리) */}
            <path d="M 9 22 Q 40 50 64 92" stroke="url(#slide-gold-trim)" strokeWidth="0.4" fill="none" strokeLinecap="round" />
            <path d="M 19 22 Q 50 50 74 92" stroke="url(#slide-gold-trim)" strokeWidth="0.35" fill="none" strokeLinecap="round" />
            {/* 착지부 — 레드카펫 (땅 닿는 부분) */}
            <rect x="64" y="91" width="10" height="4" fill="url(#slide-peel)" stroke="url(#slide-gold-trim)" strokeWidth="0.5" rx="0.5" />
            <path d="M 64 91 L 74 91" stroke="url(#slide-gold-trim)" strokeWidth="0.35" fill="none" />
            <path d="M 64 95 L 74 95" stroke="url(#slide-gold-trim)" strokeWidth="0.35" fill="none" />
            {/* 돌돌 말린 카펫 — 끝부분 풀리지 않은 롤 (땅에 닿는 쪽) */}
            <ellipse cx="69" cy="94.6" rx="5" ry="1.4" fill="#2a0808" stroke="#4a1515" strokeWidth="0.35" />
            <path d="M 64 95 Q 67 96.8 69 95.2 Q 71 93.6 74 95" fill="none" stroke="#3a0a0a" strokeWidth="0.6" strokeLinecap="round" opacity={0.9} />
            <path d="M 65.5 94.8 Q 67.5 96 69 95 Q 70.5 94 72.5 95" fill="none" stroke="#1a0505" strokeWidth="0.4" opacity={0.8} />
            <path d="M 66.5 94.5 Q 68 95.4 69 94.8 Q 70 94.2 71.5 94.6" fill="none" stroke="#0a0202" strokeWidth="0.3" opacity={0.6} />
            {/* 술 장식 — 착지부 하단 */}
            {[64.5, 65.5, 66.5, 67.5, 68.5, 69.5, 70.5, 71.5, 72.5, 73.5].map((x, i) => (
              <line key={i} x1={x} y1={95} x2={x + 0.3} y2={96.5} stroke="#c9a82a" strokeWidth="0.25" strokeLinecap="round" />
            ))}
            {/* 양쪽 코너 타슬 (골드) */}
            <path d="M 64 95 L 63.5 96 L 64 96.5 L 64.5 96 Z" fill="#c9a82a" stroke="#a88218" strokeWidth="0.15" />
            <path d="M 74 95 L 73.5 96 L 74 96.5 L 74.5 96 Z" fill="#c9a82a" stroke="#a88218" strokeWidth="0.15" />
          </g>

          {/* 땅 (초록 네모) — 맨 마지막에 그려서 SlideIllustration과 동일 */}
          <rect x="-5" y="95" width="120" height="8" fill={COLORS.green} />
        </svg>

        {/* 금색 요술가루 — 기둥 밑에서 천막으로 상승 (magic phase) */}
        {phase === "magic" && (
          <MagicDustOverlay onComplete={handleMagicEnd} />
        )}

        {/* 책: 요술가루 끝난 후 꼭대기 → 낙하 → 착지 후 앞으로 짠 */}
        {selectedBook && (phase === "sliding" || phase === "result") && (
          <div
            className="absolute z-10 w-[56px] rounded shadow-lg border-2 border-amber-900/40 overflow-hidden"
            style={{
              left: "12%",
              top: "14%",
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
              <div className="w-16 aspect-[2/3] rounded shadow-lg border-2 border-amber-900/40 overflow-hidden mb-3">
                {isValidCoverUrl(selectedBook.cover) ? (
                  <Image
                    src={selectedBook.cover!}
                    alt=""
                    width={64}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full min-h-[72px] bg-amber-100 flex items-center justify-center text-amber-900/70 text-[10px] font-bold p-1 text-center leading-tight">
                    {(selectedBook.title ?? "").slice(0, 6)}
                  </div>
                )}
              </div>
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
