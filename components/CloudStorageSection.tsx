"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Book } from "@/lib/useBooks";
import type { BooksSnapshot } from "@/lib/analysisStats";
import ReviewUnfoldModal from "./ReviewUnfoldModal";

function allBooksWithReview(books: BooksSnapshot): { book: Book; review: string }[] {
  const list: { book: Book; review: string }[] = [];
  for (const b of [...books.my, ...books.read, ...books.ebook]) {
    const r = b.review ?? "";
    if (r.trim()) list.push({ book: b, review: r });
  }
  return list;
}

function PaperPlaneIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4a5a52"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ ...style, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
      aria-hidden
    >
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

interface CloudStorageSectionProps {
  books: BooksSnapshot;
}

const PLANE_SLOTS = [
  { x: "35%", y: "45%", rotate: -28 },
  { x: "52%", y: "50%", rotate: 15 },
  { x: "65%", y: "40%", rotate: -45 },
  { x: "26%", y: "55%", rotate: 38 },
  { x: "72%", y: "58%", rotate: -12 },
  { x: "46%", y: "65%", rotate: 5 },
  { x: "58%", y: "30%", rotate: 22 },
  { x: "30%", y: "32%", rotate: -20 },
];

export default function CloudStorageSection({ books }: CloudStorageSectionProps) {
  const reviews = useMemo(() => allBooksWithReview(books), [books]);
  const [selected, setSelected] = useState<{ bookTitle: string; reviewText: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(w > 0 && w < 380 ? Math.min(1, w / 380) : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cloudFill = "radial-gradient(ellipse 75% 70% at 50% 35%, #ffffff, #f8fcfa 35%, #eef5f2 60%, #e0ebe8 85%, #d6e5e2)";
  const cloudShadow = "inset 0 4px 24px rgba(255,255,255,0.95), inset 0 -2px 12px rgba(180,200,195,0.35), 0 2px 12px rgba(100,120,115,0.08)";

  const CLOUD_PUFFS: { w: number; h: number; ml: number; mt: number }[] = [
    { w: 115, h: 75, ml: -95, mt: 42 },
    { w: 120, h: 78, ml: -15, mt: 45 },
    { w: 115, h: 75, ml: 68, mt: 42 },
    { w: 95, h: 70, ml: -72, mt: 15 },
    { w: 100, h: 72, ml: 0, mt: 12 },
    { w: 95, h: 70, ml: 68, mt: 15 },
    { w: 72, h: 58, ml: -48, mt: -25 },
    { w: 78, h: 62, ml: 5, mt: -30 },
    { w: 72, h: 58, ml: 52, mt: -25 },
    { w: 52, h: 48, ml: 0, mt: -58 },
    { w: 46, h: 44, ml: -82, mt: 5 },
    { w: 46, h: 44, ml: 82, mt: 5 },
  ];

  return (
    <section
      className="rounded-2xl p-5 border overflow-visible"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        borderColor: "rgba(140, 158, 131, 0.4)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
        구름 보관소
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">
        {reviews.length === 0 ? "종이비행기로 날린 리뷰가 여기 쌓여요" : `종이비행기로 날린 리뷰 ${reviews.length}개`}
      </p>
      <div
        ref={containerRef}
        className="relative rounded-xl w-full min-h-[200px] sm:min-h-[220px] flex items-center justify-center py-4 px-3 sm:px-2 overflow-hidden min-w-0"
        style={{
          background: "linear-gradient(180deg, #E8DCC8 0%, #ddd4bc 100%)",
          boxShadow: "inset 0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div className="relative w-full max-w-[380px] min-h-[180px] h-[200px] flex items-center justify-center mx-auto rounded-lg min-w-0">
          {/* 구름+비행기 전체를 컨테이너에 맞춰 스케일 (모바일에서 잘리지 않게) */}
          <div
            className="absolute left-1/2 top-1/2 w-[380px] h-[200px] -translate-x-1/2 -translate-y-1/2 origin-center pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
          {/* 뭉게뭉게 뭉게구름 - 여러 puffs가 겹쳐 fluffy한 형태 */}
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          {CLOUD_PUFFS.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: p.w,
                height: p.h,
                left: "50%",
                top: "50%",
                marginLeft: -p.w / 2 + p.ml,
                marginTop: -p.h / 2 + p.mt,
                background: cloudFill,
                boxShadow: cloudShadow,
              }}
            />
          ))}
          </div>
          </div>
          {/* 종이비행기: 구름에 꽂힌 모양 — 구름 스케일과 별도로 절대 위치 (pointer-events 복원) */}
          {reviews.slice(0, 8).map(({ book, review }, i) => {
            const slot = PLANE_SLOTS[i];
            if (!slot) return null;
            return (
              <button
                key={book.id}
                type="button"
                onClick={() => setSelected({ bookTitle: book.title, reviewText: review })}
                className="absolute p-0 border-0 bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 rounded-full z-10 inline-flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 transition-transform hover:scale-110 active:scale-95 touch-manipulation"
                style={{
                  left: slot.x,
                  top: slot.y,
                  transform: `translate(-50%, -50%) rotate(${slot.rotate}deg)`,
                }}
                aria-label={`${book.title} 리뷰 보기`}
                title={book.title}
              >
                <PaperPlaneIcon className="w-11 h-11 sm:w-9 sm:h-9" style={{ transform: "rotate(-45deg)" }} />
              </button>
            );
          })}
          {reviews.length > 8 ? (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[11px] font-serif text-text-muted">
              +{reviews.length - 8}개 더
            </span>
          ) : null}
        </div>
      </div>
      <ReviewUnfoldModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        bookTitle={selected?.bookTitle ?? ""}
        reviewText={selected?.reviewText ?? ""}
      />
    </section>
  );
}
