"use client";

import { useMemo, useState, useCallback } from "react";
import type { BooksSnapshot } from "@/lib/analysisStats";
import type { Book } from "@/lib/useBooks";
import FloppyDiskReviewModal from "./FloppyDiskReviewModal";

const SHELF_COUNT = 3;
const SPINES_PER_SHELF = 14;
const SPINE_HEIGHT = 16;
const SPINE_GAP = 2;

/** 검은색, 은색, 붉은색만 사용 (책등 느낌) */
const SPINE_COLORS = ["#1a1a1a", "#A8A8A8", "#DC2626"];

interface RetroDiskStorageProps {
  books?: BooksSnapshot;
  className?: string;
  /** 비디오방 등 어두운 배경에 맞출 때 사용 */
  variant?: "light" | "dark";
}

function getBooksWithReviews(books: BooksSnapshot | undefined): { book: Book; review: string }[] {
  if (!books) return [];
  const all = [...books.my, ...books.read, ...books.ebook];
  return all
    .filter((b) => (b.review ?? "").trim().length > 0)
    .map((b) => ({ book: b, review: (b.review ?? "").trim() }));
}

/**
 * 리뷰 보관함 — 나무/대나무 롤탑 책장 3개 (CD·미디어 선반 스타일).
 * 플로피 리뷰를 차곡차곡, 스파인 클릭 시 전에 쓴 리뷰 다시 보기.
 */
export default function RetroDiskStorage({ books, className = "", variant = "light" }: RetroDiskStorageProps) {
  const booksWithReviews = useMemo(() => getBooksWithReviews(books), [books]);
  const [selected, setSelected] = useState<{ bookTitle: string; reviewText: string } | null>(null);

  const shelvesData = useMemo(() => {
    const list = [...booksWithReviews];
    const out: { book: Book; review: string }[][] = [[], [], []];
    for (let i = 0; i < list.length; i++) {
      const shelf = i % SHELF_COUNT;
      if (out[shelf].length < SPINES_PER_SHELF) out[shelf].push(list[i]);
    }
    return out;
  }, [booksWithReviews]);

  const openReview = useCallback((bookTitle: string, reviewText: string) => {
    setSelected({ bookTitle, reviewText });
  }, []);
  const closeReview = useCallback(() => setSelected(null), []);

  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 flex flex-col min-h-[320px] sm:min-h-[420px] overflow-visible ${className}`}
      style={
        isDark
          ? {
              background: "linear-gradient(180deg, #252525 0%, #1a1a1a 100%)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }
          : {
              background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
              boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
              border: "1px solid var(--color-secondary, #c4b8a8)",
            }
      }
    >
      <h3 className={`text-[16px] sm:text-[17px] font-bold font-serif mb-1 ${isDark ? "text-white/90" : "text-primary"}`}>
        💾 플로피 디스크 보관함
      </h3>
      <p className={`text-[12px] font-serif mb-4 ${isDark ? "text-white/60" : "text-text-muted"}`}>
        썼던 플로피 디스크 리뷰를 차곡차곡 보관해요. 디스크를 누르면 다시 볼 수 있어요.
      </p>
      <div className="flex justify-center items-center flex-1 min-h-[220px] sm:min-h-[300px] w-full overflow-hidden">
        <BookshelfWithSpines shelvesData={shelvesData} onSpineClick={openReview} variant={variant} />
      </div>
      <FloppyDiskReviewModal
        isOpen={selected !== null}
        onClose={closeReview}
        bookTitle={selected?.bookTitle ?? ""}
        initialReview={selected?.reviewText ?? ""}
        mode="view"
      />
    </div>
  );
}

/** 책장 SVG — 선반만 (책 없음), 가로 길게 viewBox로 선이 전체 너비에 꽉 차게 */
const BOOKSHELF_PATH =
  "M34,0H478V256H34V0Z M34,5H478V82H34V5Z M34,87H478V164H34V87Z M34,169H478V251H34V169Z";

function BookshelfFrameSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 512 256"
      fill="#A8A8A8"
      fillRule="evenodd"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={BOOKSHELF_PATH} />
    </svg>
  );
}

/** 책등 모양 플로피 디스크 1개 — 세로로 길고 두껍게, 세로 글씨, 스큐어모피즘 */
const STANDING_SPINE_WIDTH = 14;
const STANDING_SPINE_HEIGHT = 48;

function StandingFloppySlot({
  color,
  title,
  onClick,
}: {
  color: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex-shrink-0 flex flex-col rounded-sm overflow-hidden transition-transform active:scale-[0.98] hover:brightness-110"
      style={{
        width: STANDING_SPINE_WIDTH,
        height: STANDING_SPINE_HEIGHT,
        border: "1px solid rgba(0,0,0,0.35)",
        boxShadow:
          "inset 1px 1px 0 rgba(255,255,255,0.25), inset -1px -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2)",
      }}
      onClick={onClick}
      title={title}
    >
      {/* 라벨 띠 (위쪽) — 금속 라벨 베벨 */}
      <div
        className="w-full flex-shrink-0"
        style={{
          height: 6,
          background: "linear-gradient(180deg, #e0e0e0 0%, #b8b8b8 40%, #989898 100%)",
          boxShadow:
            "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.15)",
        }}
      />
      {/* 책등 몸통 — 플라스틱 두께감, 왼쪽 엣지 하이라이트 */}
      <div
        className="flex-1 min-h-0 flex items-center justify-end overflow-hidden"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, ${color} 30%, ${darken(color, 20)} 100%)`,
          boxShadow:
            "inset 2px 0 0 rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1), inset -1px -1px 0 rgba(0,0,0,0.15)",
        }}
      >
        <span
          className="block text-[10px] font-medium text-white/95 py-0.5 overflow-hidden text-right"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            letterSpacing: "0.05em",
            lineHeight: 1.4,
          }}
        >
          {title || "리뷰"}
        </span>
      </div>
    </button>
  );
}

/** 책장 + 선반별로 세운 플로피 디스크 꽂기 */
function BookshelfWithSpines({
  shelvesData,
  onSpineClick,
  variant = "light",
}: {
  shelvesData: { book: Book; review: string }[][];
  onSpineClick: (bookTitle: string, reviewText: string) => void;
  variant?: "light" | "dark";
}) {
  /* viewBox 512×256: 선반 막대 위쪽 y=82,164,251 → 전체 높이 대비 32.03%, 64.06%, 98.04%. bottom 기준으로 행 배치 */
  const shelfBottomPct = [(256 - 82) / 256, (256 - 164) / 256, (256 - 251) / 256] as const; // 컨테이너 하단으로부터
  const shelfHeightPct = [82 / 256, (164 - 82) / 256, (251 - 169) / 256] as const;

  return (
    <div
      className="relative w-full max-w-[440px] mx-auto h-auto"
      style={{ aspectRatio: "440/220" }}
    >
      <BookshelfFrameSvg className="absolute inset-0 w-full h-full object-contain opacity-95 pointer-events-none" />
      {/* 선반 3줄 — 플로피가 SVG 위에 보이도록 z-10, 컨테이너 안에 딱 맞게 */}
      {shelvesData.map((items, shelfIndex) => (
        <div
          key={shelfIndex}
          className="absolute left-[6.64%] right-[6.64%] flex flex-wrap items-end gap-0.5 content-end z-10"
          style={{
            bottom: `${shelfBottomPct[shelfIndex] * 100}%`,
            height: `${shelfHeightPct[shelfIndex] * 100}%`,
          }}
        >
          {items.length === 0 ? (
            <span className={`text-[10px] font-serif ${variant === "dark" ? "text-white/40" : "text-[#8a7a6a]"}`}>비어 있음</span>
          ) : (
            items.map(({ book, review }, i) => {
              const color = SPINE_COLORS[(shelfIndex * SPINES_PER_SHELF + i) % SPINE_COLORS.length];
              return (
                <StandingFloppySlot
                  key={book.id}
                  color={color}
                  title={book.title || "리뷰"}
                  onClick={() => onSpineClick(book.title, review)}
                />
              );
            })
          )}
        </div>
      ))}
    </div>
  );
}

/** 어두운 나무 결 텍스처 */
const WOOD_GRAIN = {
  backgroundImage: `repeating-linear-gradient(
    90deg,
    transparent 0,
    transparent 2px,
    rgba(0,0,0,0.12) 2px,
    rgba(0,0,0,0.12) 3px
  )`,
};

/** 나무/대나무 롤탑 책장 1칸 — CD 보관함 디테일: 나무결, 슬롯 칸막이, 측면 노치, 스파인 입체감 (레거시, 책장 뷰에서 미사용) */
function WoodenRack({
  items,
  cabinetIndex,
  onSpineClick,
}: {
  items: { book: Book; review: string }[];
  cabinetIndex: number;
  onSpineClick: (bookTitle: string, reviewText: string) => void;
}) {
  const slotHeight = SPINE_HEIGHT + SPINE_GAP;
  const shelfHeight = SPINES_PER_SHELF * slotHeight + 14;
  const width = 96;

  return (
    <div
      className="relative flex-shrink-0 rounded-sm overflow-hidden"
      style={{
        width,
        minHeight: 32 + shelfHeight + 14,
        background: "linear-gradient(180deg, #3D3228 0%, #2E251E 40%, #251E18 100%)",
        border: "1px solid #1a1512",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.2), 0 4px 14px rgba(0,0,0,0.2)",
        ...WOOD_GRAIN,
      }}
    >
      {/* 상단: 롤탑(탬버) — 슬랫이 더 선명하게, 슬랫 사이 그림자 */}
      <div
        className="relative h-8 flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #3D3228 0%, #2E251E 50%, #251E18 100%)",
          borderBottom: "2px solid #1a1512",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2)",
          ...WOOD_GRAIN,
        }}
      >
        {/* 슬랫 줄 — 각 슬랫에 살짝 두께감 */}
        <div className="absolute inset-0 flex flex-col justify-end">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="w-full shrink-0"
              style={{
                height: "2px",
                background: i % 2 === 0
                  ? "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
                boxShadow: i % 2 === 1 ? "0 1px 0 rgba(0,0,0,0.15)" : undefined,
              }}
            />
          ))}
        </div>
        {/* 황금 손잡이 */}
        <div
          className="relative z-10 w-3 h-3 rounded-full border border-amber-900/30"
          style={{
            background: "linear-gradient(145deg, #F0D850 0%, #D4A818 40%, #B08810 100%)",
            boxShadow:
              "inset 0 2px 0 rgba(255,255,220,0.6), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* 선반 영역 테두리(안쪽 프레임) — 플로피가 쏙 들어가도록 여백 조정 */}
      <div
        className="relative flex mx-1 mt-0.5 rounded-sm"
        style={{
          minHeight: shelfHeight,
          background: "rgba(30, 25, 20, 0.4)",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        {/* 좌측 세로 기둥(나무 가이드) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-sm pointer-events-none"
          style={{
            background: "linear-gradient(90deg, #2E251E 0%, #251E18 100%)",
            borderRight: "1px solid #1a1512",
            boxShadow: "inset 1px 0 0 rgba(255,255,255,0.05)",
            ...WOOD_GRAIN,
          }}
        >
          {/* 측면 노치 — 슬롯마다 홈 */}
          {Array.from({ length: SPINES_PER_SHELF }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-black/35"
              style={{ top: 8 + i * (SPINE_HEIGHT + SPINE_GAP) }}
            />
          ))}
        </div>
        {/* 우측 세로 기둥 */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2.5 rounded-r-sm pointer-events-none"
          style={{
            background: "linear-gradient(90deg, #251E18 0%, #2E251E 100%)",
            borderLeft: "1px solid #1a1512",
            boxShadow: "inset -1px 0 0 rgba(255,255,255,0.05)",
            ...WOOD_GRAIN,
          }}
        >
          {Array.from({ length: SPINES_PER_SHELF }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-black/35"
              style={{ top: 8 + i * (SPINE_HEIGHT + SPINE_GAP) }}
            />
          ))}
        </div>

        {/* 슬롯 + 스파인 — 기둥 안쪽에 쏙 들어가도록 좁은 여백 */}
        <div className="relative flex-1 flex flex-col pl-1.5 pr-1.5 py-2 gap-0 min-w-0">
          {items.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-[10px] text-[#a09080] font-serif">비어 있음</div>
          ) : (
            items.map(({ book, review }, i) => {
              const color = SPINE_COLORS[(cabinetIndex * SPINES_PER_SHELF + i) % SPINE_COLORS.length];
              const rowHeight = i === 0 ? SPINE_HEIGHT : SPINE_GAP + SPINE_HEIGHT;
              return (
                <div key={book.id} className="flex flex-col flex-shrink-0" style={{ height: rowHeight }}>
                  {/* 슬롯 칸막이(나무 막대) — 스파인 사이 */}
                  {i > 0 && (
                    <div
                      className="w-full flex-shrink-0 rounded-sm"
            style={{
              height: SPINE_GAP,
              background: "linear-gradient(180deg, #2E251E 0%, #251E18 100%)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 1px 0 rgba(0,0,0,0.2)",
            }}
                    />
                  )}
                  {/* CD 스파인 — 플라스틱 케이스 느낌 (왼쪽 스파인 엣지 하이라이트) */}
                  <button
                    type="button"
                    className="flex-1 w-full text-left rounded-sm transition-transform active:scale-[0.98] hover:brightness-110 flex-shrink-0 relative overflow-hidden"
                    style={{
                      minHeight: SPINE_HEIGHT,
                      background: `linear-gradient(90deg, ${color} 0%, ${color} 15%, ${darken(color, 25)} 100%)`,
                      border: "1px solid rgba(0,0,0,0.15)",
                      boxShadow:
                        "inset 2px 0 0 rgba(255,255,255,0.25), inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 0 rgba(0,0,0,0.06)",
                    }}
                    onClick={() => onSpineClick(book.title, review)}
                    title={book.title}
                  >
                    <span
                      className="block truncate px-2 text-[8px] font-medium leading-tight text-white/95 drop-shadow-sm"
                      style={{ lineHeight: `${SPINE_HEIGHT - 2}px` }}
                    >
                      {book.title || "리뷰"}
                    </span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 하단 받침(발) — 두껍게 */}
      <div
        className="absolute left-0 right-0 bottom-0 h-2 rounded-b-sm"
        style={{
          background: "linear-gradient(180deg, #2E251E 0%, #251E18 70%, #1a1512 100%)",
          borderTop: "1px solid #1a1512",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 4px rgba(0,0,0,0.25)",
          ...WOOD_GRAIN,
        }}
      />
    </div>
  );
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
