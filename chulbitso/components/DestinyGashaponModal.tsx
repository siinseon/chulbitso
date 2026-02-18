"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Book } from "@/lib/useBooks";
import type { BooksSnapshot } from "@/lib/analysisStats";

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

function isValidCoverUrl(url: string | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
}

/** 정글짐 색상만 (#a89268 골드, #6a7a8a 블루그레이, #9a6b58 러스트, #6a7c5a 그린) */
const CAPSULE_TWO_TONE: { c1: string; c2: string }[] = [
  { c1: "#a89268", c2: "#f0e8d8" },
  { c1: "#6a7a8a", c2: "#d8dcde" },
  { c1: "#9a6b58", c2: "#e8d8d0" },
  { c1: "#6a7c5a", c2: "#d8e0d4" },
];

interface DestinyGashaponModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: BooksSnapshot;
  onReadNow?: (book: Book) => void;
}

type Phase = "idle" | "spinning" | "dropping" | "opening" | "result";

export default function DestinyGashaponModal({
  isOpen,
  onClose,
  books,
  onReadNow,
}: DestinyGashaponModalProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rerollUsed, setRerollUsed] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  const unreadCount = getUnreadBooks(books).length;

  const startPull = useCallback(
    (excludeId?: string) => {
      const picked = pickRandomUnread(books, excludeId);
      if (!picked) {
        setSelectedBook(null);
        setPhase("result");
        return;
      }
      setSelectedBook(picked);
      setPhase("spinning");
    },
    [books]
  );

  useEffect(() => {
    if (!isOpen) return;
    setPhase("idle");
    setRerollUsed(false);
    setSelectedBook(null);
  }, [isOpen]);

  const handleCrankClick = () => {
    if (phase !== "idle") return;
    setSpinKey((k) => k + 1);
    startPull();
  };

  const handleSpinComplete = () => {
    setPhase("dropping");
  };

  const handleDropComplete = () => {
    setPhase("opening");
    setTimeout(() => setPhase("result"), 800);
  };

  const handleReroll = () => {
    if (rerollUsed || !selectedBook) return;
    setRerollUsed(true);
    setSpinKey((k) => k + 1);
    setPhase("idle");
    setSelectedBook(null);
    setTimeout(() => startPull(selectedBook.id), 100);
  };

  const handleReadNow = () => {
    if (selectedBook) onReadNow?.(selectedBook);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
      }}
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/25 text-white flex items-center justify-center hover:bg-black/30 active:opacity-90 touch-manipulation"
        style={{ top: "max(1rem, env(safe-area-inset-top))", right: "max(1rem, env(safe-area-inset-right))" }}
        aria-label="닫기"
      >
        <span className="text-xl leading-none">×</span>
      </button>

      <AnimatePresence mode="wait">
        {phase !== "result" ? (
          <motion.div
            key="machine"
            className="relative flex flex-col items-center z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 플로팅 — 대기 시 살짝 둥둥 */}
            <motion.div
              className="relative flex flex-col items-center"
              animate={phase === "idle" ? { y: [0, -4, 0] } : {}}
              transition={phase === "idle" ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
            >
              {/* 뚜껑 — 우체국 빨강 */}
              <div
                className="relative w-[146px] h-4 rounded-t-xl flex-shrink-0 overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, #E31837 0%, #C41E3A 50%, #A81830 100%)",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  border: "2px solid rgba(180,40,60,0.5)",
                  borderBottom: "none",
                }}
              >
                <div className="absolute top-0.5 right-3 w-2.5 h-2.5 rounded-full opacity-40" style={{ background: "#8a1020" }} />
              </div>

              {/* 투명 컨테이너 — 누렇게 변색된 아크릴, 긁힘·먼지·때 */}
              <div
                className="relative h-[180px] overflow-hidden flex-shrink-0"
                style={{
                  width: "146px",
                  clipPath: "polygon(2% 0, 98% 0, 94% 100%, 6% 100%)",
                  background: `
                    linear-gradient(180deg,
                      rgba(220,210,180,0.5) 0%,
                      rgba(200,190,165,0.45) 30%,
                      rgba(185,175,150,0.5) 70%,
                      rgba(170,160,140,0.55) 100%
                    )`,
                  border: "3px solid rgba(180,165,140,0.8)",
                  borderTop: "none",
                  boxShadow: `
                    inset 0 0 40px rgba(0,0,0,0.1),
                    inset 2px 0 12px rgba(100,90,70,0.2),
                    inset -2px 0 12px rgba(100,90,70,0.2),
                    0 6px 20px rgba(0,0,0,0.35)
                  `,
                }}
              >
                {/* 때·먼지·빗물 자국 오버레이 */}
                <div
                  className="absolute inset-0 pointer-events-none z-[1]"
                  style={{
                    background: `
                      radial-gradient(ellipse 35% 25% at 20% 35%, rgba(160,150,120,0.3) 0%, transparent 55%),
                      radial-gradient(ellipse 30% 20% at 75% 55%, rgba(140,130,100,0.25) 0%, transparent 50%),
                      linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.04) 100%)
                    `,
                  }}
                />
                {/* 바닥 그림자 — 쌓인 캡슐 무게감 */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(ellipse 120% 50% at 50% 100%, rgba(0,0,0,0.22) 0%, transparent 65%)",
                  }}
                />
                {/* 두 톤 캡슐들 — 무질서하게 쌓인 디테일: 겹침, z순서, 눌린 그림자 */}
                <motion.div
                  className="absolute inset-0"
                  animate={phase === "spinning" ? { x: [0, -5, 5, -4, 4, 0], rotate: [0, 4, -4, 3, -3, 0] } : {}}
                  transition={phase === "spinning" ? { duration: 0.8, ease: "easeInOut" } : {}}
                >
                  {[
                    { left: "0%", bottom: "0", rotate: -12, i: 0, w: 34, h: 34, z: 1 },
                    { left: "20%", bottom: "-4px", rotate: 9, i: 1, w: 38, h: 38, z: 4 },
                    { left: "42%", bottom: "0", rotate: -7, i: 2, w: 36, h: 36, z: 2 },
                    { left: "62%", bottom: "-6px", rotate: 11, i: 3, w: 36, h: 36, z: 5 },
                    { left: "82%", bottom: "0", rotate: -9, i: 0, w: 32, h: 32, z: 2 },
                    { left: "94%", bottom: "-2px", rotate: 6, i: 1, w: 28, h: 28, z: 3 },
                    { left: "4%", bottom: "36px", rotate: 7, i: 2, w: 36, h: 36, z: 5 },
                    { left: "26%", bottom: "38px", rotate: -10, i: 3, w: 34, h: 34, z: 2 },
                    { left: "48%", bottom: "32px", rotate: 5, i: 0, w: 40, h: 40, z: 6 },
                    { left: "70%", bottom: "40px", rotate: -8, i: 1, w: 34, h: 34, z: 4 },
                    { left: "12%", bottom: "72px", rotate: -6, i: 2, w: 34, h: 34, z: 4 },
                    { left: "40%", bottom: "76px", rotate: 10, i: 3, w: 36, h: 36, z: 5 },
                    { left: "64%", bottom: "68px", rotate: -5, i: 0, w: 32, h: 32, z: 3 },
                    { left: "6%", bottom: "108px", rotate: 8, i: 1, w: 34, h: 34, z: 5 },
                    { left: "38%", bottom: "112px", rotate: -9, i: 2, w: 36, h: 36, z: 6 },
                    { left: "66%", bottom: "104px", rotate: 6, i: 3, w: 32, h: 32, z: 4 },
                    { left: "24%", bottom: "144px", rotate: -7, i: 0, w: 34, h: 34, z: 4 },
                    { left: "50%", bottom: "148px", rotate: 5, i: 1, w: 32, h: 32, z: 5 },
                  ].map((c, idx) => {
                    const t = CAPSULE_TWO_TONE[c.i % CAPSULE_TWO_TONE.length];
                    return (
                      <motion.div
                        key={idx}
                        className="absolute rounded-full"
                        style={{
                          left: c.left,
                          bottom: c.bottom,
                          width: c.w,
                          height: c.h,
                          zIndex: c.z,
                          background: `linear-gradient(180deg, ${t.c1} 0%, ${t.c1} 50%, ${t.c2} 50%, ${t.c2} 100%)`,
                          boxShadow: `
                            inset 0 2px 0 rgba(255,255,255,0.28),
                            inset 0 -1px 0 rgba(0,0,0,0.1),
                            0 4px 10px rgba(0,0,0,0.28),
                            0 6px 12px rgba(0,0,0,0.14)
                          `,
                          border: "1px solid rgba(0,0,0,0.12)",
                          opacity: 0.95,
                          rotate: c.rotate,
                        }}
                      />
                    );
                  })}
                </motion.div>
              </div>

              {/* 베이스 — 테이퍼 + 녹·칠 벗겨짐 + 아래 모서리 둥글게 */}
              <div className="relative w-[160px] flex-shrink-0 flex flex-col items-stretch">
                <div
                  className="h-1 flex-shrink-0 mx-auto"
                  style={{
                    width: "80%",
                    background: "linear-gradient(180deg, #c41e3a 0%, #a81830 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                />
                <div
                  className="relative w-[160px] h-[68px] flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{
                    clipPath: "path('M 16 0 L 144 0 L 160 56 Q 160 68 152 68 L 8 68 Q 0 68 0 56 L 16 0 Z')",
                    background: "linear-gradient(180deg, #E31837 0%, #C41E3A 40%, #A81830 100%)",
                    boxShadow: "inset 0 3px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.45), inset 0 0 50px rgba(0,0,0,0.12)",
                    border: "2px solid rgba(0,0,0,0.25)",
                    borderTop: "none",
                  }}
                >
                  {/* 우체통 빨강 — 은은한 음영 */}
                  <div className="absolute top-1.5 left-3 w-4 h-1.5 rounded-full opacity-40" style={{ background: "#8a1020" }} />
                  <div className="absolute top-3 right-6 w-2.5 h-1 rounded-full opacity-35" style={{ background: "#6a0c18" }} />
                  {/* 낡고 기름때 낀 금속 손잡이 + 테두리 녹 */}
                  <motion.button
                    key={spinKey}
                    type="button"
                    onClick={handleCrankClick}
                    disabled={phase !== "idle"}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-70 disabled:cursor-not-allowed z-10"
                    style={{
                      background: "linear-gradient(180deg, #8a8580 0%, #6a6560 50%, #5a5550 100%)",
                      boxShadow: "inset 0 2px 0 rgba(140,135,130,0.4), 0 4px 12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(90,80,70,0.9)",
                      border: "2px solid rgba(80,70,60,0.6)",
                    }}
                    initial={{ rotate: 0 }}
                    animate={phase === "spinning" ? { rotate: 360 } : { rotate: 0 }}
                    transition={phase === "spinning" ? { duration: 0.8, ease: "easeInOut" } : {}}
                    onAnimationComplete={phase === "spinning" ? handleSpinComplete : undefined}
                    aria-label="손잡이 돌리기"
                  >
                    <div className="w-7 h-2.5 rounded-full" style={{ background: "#4a4540", boxShadow: "0 1px 4px rgba(0,0,0,0.5)" }} />
                  </motion.button>
                  {/* 500원 / 캡슐 토이 스티커 */}
                  <div
                    className="absolute top-1.5 -left-1 px-2 py-0.5 rounded-sm text-[8px] font-bold whitespace-nowrap"
                    style={{
                      background: "#2a2520",
                      color: "#e8e0d0",
                      textShadow: "1px 1px 0 rgba(0,0,0,0.6), -0.5px -0.5px 0 rgba(255,255,255,0.08)",
                      border: "1px solid rgba(0,0,0,0.4)",
                    }}
                  >
                    500원
                  </div>
                  <div
                    className="absolute bottom-2 -right-0.5 px-1.5 py-0.5 rounded-sm text-[7px] font-bold whitespace-nowrap"
                    style={{
                      background: "#2a2520",
                      color: "#e8e0d0",
                      textShadow: "1px 1px 0 rgba(0,0,0,0.6)",
                      border: "1px solid rgba(0,0,0,0.4)",
                    }}
                  >
                    캡슐 토이
                  </div>
                  {/* 배출구 — 우체통 빨강 계열 다크 */}
                  <div
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-14 h-4 rounded-b-md"
                    style={{
                      background: "linear-gradient(180deg, #8a1828 0%, #6a1020 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,200,200,0.1), 0 3px 8px rgba(0,0,0,0.4)",
                      border: "1px solid rgba(0,0,0,0.25)",
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* 캡슐 중앙 등장 → 갈라지며 안에서 책 나옴 */}
            <AnimatePresence>
              {(phase === "dropping" || phase === "opening") && selectedBook && (
                <motion.div
                  key="capsule-reveal"
                  className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* 캡슐 — 동그랗게, 중앙에 뜨고, opening 시 상하로 갈라짐 */}
                  <motion.div
                    className="relative w-24 h-24 flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                      phase === "dropping"
                        ? { scale: 1, opacity: 1 }
                        : { scale: 1.1, opacity: 0 }
                    }
                    transition={
                      phase === "dropping"
                        ? { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
                        : { duration: 0.5 }
                    }
                    onAnimationComplete={phase === "dropping" ? handleDropComplete : undefined}
                  >
                    {/* 상단 반쪽 — 반원, 갈라질 때 위로 */}
                    <motion.div
                      className="absolute inset-x-0 top-0 h-1/2 rounded-t-full overflow-hidden"
                      style={{
                        background: "linear-gradient(180deg, #ff6b9d 0%, #e0557a 100%)",
                        boxShadow: "inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.25)",
                        border: "2px solid rgba(0,0,0,0.1)",
                        borderBottom: "none",
                      }}
                      animate={
                        phase === "opening"
                          ? { y: -24, opacity: 0.5 }
                          : { y: 0, opacity: 1 }
                      }
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    {/* 하단 반쪽 — 반원, 갈라질 때 아래로 */}
                    <motion.div
                      className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-full overflow-hidden"
                      style={{
                        background: "linear-gradient(180deg, #c44569 0%, #a83855 100%)",
                        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.25)",
                        border: "2px solid rgba(0,0,0,0.1)",
                        borderTop: "none",
                      }}
                      animate={
                        phase === "opening"
                          ? { y: 24, opacity: 0.5 }
                          : { y: 0, opacity: 1 }
                      }
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    {/* 가운데 이음선 ( dropping 시만 ) */}
                    {phase === "dropping" && (
                      <div
                        className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-black/20"
                        style={{ width: "70%", margin: "0 auto" }}
                      />
                    )}
                    {/* 책 — opening 시 캡슐 갈라진 틈에서 나옴 */}
                    <motion.div
                      className="absolute w-14 aspect-[2/3] rounded-lg overflow-hidden shadow-xl border-2 border-amber-200/60 bg-amber-50 flex items-center justify-center"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={
                        phase === "opening"
                          ? { scale: 1, opacity: 1 }
                          : { scale: 0, opacity: 0 }
                      }
                      transition={{
                        duration: 0.4,
                        delay: phase === "opening" ? 0.15 : 0,
                      }}
                    >
                      {isValidCoverUrl(selectedBook.cover) ? (
                        <Image
                          src={selectedBook.cover!}
                          alt={selectedBook.title ?? ""}
                          width={56}
                          height={84}
                          className="w-full h-full object-cover"
                          unoptimized
                          sizes="56px"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-amber-900/70 text-center px-1 line-clamp-3">
                          {selectedBook.title ?? "제목 없음"}
                        </span>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {phase === "idle" && (
              <p className="mt-4 text-sm text-text-muted font-serif">손잡이를 돌려보세요</p>
            )}
          </motion.div>
        ) : (
          /* 결과 화면 — 당첨 카드 모달 */
          <motion.div
            key="result"
            className="w-full max-w-[320px] px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {selectedBook ? (
              <motion.div
                className="rounded-2xl p-6 bg-white/95 shadow-xl border-2 border-amber-200/60"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <p className="text-center text-amber-800/90 text-sm font-serif font-bold mb-3">오늘 읽을 책은?</p>
                <div className="flex justify-center mb-4">
                  <div className="w-24 aspect-[2/3] rounded-lg shadow-lg overflow-hidden border-2 border-amber-200/60">
                    {isValidCoverUrl(selectedBook.cover) ? (
                      <Image
                        src={selectedBook.cover!}
                        alt={selectedBook.title}
                        width={96}
                        height={144}
                        className="w-full h-full object-cover"
                        unoptimized
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-900/70 text-xs font-bold p-2 text-center">
                        {(selectedBook.title ?? "").slice(0, 8)}
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-primary font-bold text-base font-serif text-center mb-4 line-clamp-2">
                  {selectedBook.title ?? "제목 없음"}
                </h3>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleReadNow}
                    className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-95 active:opacity-90"
                  >
                    지금 바로 읽기
                  </button>
                  <button
                    type="button"
                    onClick={handleReroll}
                    disabled={rerollUsed || unreadCount <= 1}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 active:opacity-90"
                    style={{
                      background: "#4a6a8a",
                      border: "2px solid rgba(0,0,0,0.15)",
                    }}
                  >
                    {rerollUsed ? "기회 소진" : "한 번만 다시"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 text-sm text-text-muted font-serif hover:text-primary"
                  >
                    닫기
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="rounded-2xl p-6 bg-white/95 shadow-xl border-2 border-amber-200/60 text-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <p className="text-amber-950/90 font-serif mb-2">읽지 않은 책이 없어요</p>
                <p className="text-amber-900/70 text-sm mb-4">책을 먼저 담아 주세요.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-6 rounded-xl bg-primary text-white font-bold text-sm"
                >
                  닫기
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
