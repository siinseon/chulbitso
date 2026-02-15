"use client";

import { useState, useMemo } from "react";
import type { Book } from "@/lib/useBooks";
import type { RecordStatus } from "@/lib/supabase/types";
import { shouldClassifyAsPoetry } from "@/lib/categories";

const NOTE_BG = "#FDFBF7";
const LINE_COLOR = "rgba(140, 170, 200, 0.25)";
const LINE_SPACING = 24;

type GenreTab = "전체" | "소설" | "시" | "인문" | "에세이";
type StatusTab = "전체" | "펼침" | "끝냄" | "추림" | "멈춤" | "아낌";

const GENRE_TABS: { id: GenreTab; label: string }[] = [
  { id: "전체", label: "전체" },
  { id: "소설", label: "소설" },
  { id: "시", label: "시" },
  { id: "인문", label: "인문" },
  { id: "에세이", label: "에세이" },
];

const STATUS_TABS: { id: StatusTab; label: string }[] = [
  { id: "전체", label: "전체" },
  { id: "펼침", label: "펼침" },
  { id: "끝냄", label: "끝냄" },
  { id: "추림", label: "추림" },
  { id: "멈춤", label: "멈춤" },
  { id: "아낌", label: "아낌" },
];

function getBookGenre(book: Book): GenreTab | null {
  const cat = book.category?.trim() || "";
  if (cat === "소설") return "소설";
  if (cat === "시집" || shouldClassifyAsPoetry(book.series) || shouldClassifyAsPoetry(book.publisher)) return "시";
  if (cat === "인문") return "인문";
  if (cat.includes("에세이") || cat === "문학" || cat === "예술") return "에세이";
  return null;
}

function matchesGenre(book: Book, genre: GenreTab): boolean {
  if (genre === "전체") return true;
  return getBookGenre(book) === genre;
}

function matchesStatus(book: Book, status: StatusTab): boolean {
  if (status === "전체") return true;
  const rs = book.recordStatus;
  const readingStatus = (book as { readingStatus?: string }).readingStatus;
  const rating = book.rating ?? 0;
  if (status === "펼침") return rs === "읽는 중";
  if (status === "끝냄") return rs === "완독";
  if (status === "추림") return rs === "소장중" || readingStatus === "EXCERPT";
  if (status === "멈춤") return rs === "멈춤";
  if (status === "아낌") return rating >= 4;
  return false;
}

interface ExplorationLogProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
}

export default function ExplorationLog({ books, onBookClick }: ExplorationLogProps) {
  const [genreTab, setGenreTab] = useState<GenreTab>("전체");
  const [statusTab, setStatusTab] = useState<StatusTab>("전체");

  const filteredBooks = useMemo(() => {
    return books.filter((b) => matchesGenre(b, genreTab) && matchesStatus(b, statusTab));
  }, [books, genreTab, statusTab]);

  return (
    <div className="relative pt-8 pr-16">
      {/* 탐구일지 노트 본체 */}
      <div
        id="exploration-note"
        className="rounded-lg overflow-hidden min-h-[320px] relative"
        style={{
          background: NOTE_BG,
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent ${LINE_SPACING - 1}px,
            ${LINE_COLOR} ${LINE_SPACING - 1}px,
            ${LINE_COLOR} ${LINE_SPACING}px
          )`,
        }}
      >
        <div className="py-4 px-4">
        {filteredBooks.length === 0 ? (
          <p className="py-8 text-center font-serif text-[14px] text-text-muted">기록된 책이 없어요.</p>
        ) : (
          <ul>
            {filteredBooks.map((book) => (
              <BookRow key={book.id} book={book} onClick={() => onBookClick?.(book)} />
            ))}
          </ul>
        )}
        </div>
      </div>

      {/* 견출지 인덱스 — 위쪽 상태별 탭, 노트 상단에 붙음 (overflow 밖에 배치) */}
      <div className="absolute left-0 right-16 top-0 flex gap-0.5 z-20">
        {STATUS_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setStatusTab(t.id)}
            className={`min-w-[2.5rem] h-8 rounded-t-md rounded-b-none shadow-sm border-2 border-b-0 border-red-500 font-handwriting text-[12px] font-medium px-2 transition-all hover:scale-105 active:opacity-90 ${
              statusTab === t.id ? "bg-red-50 text-red-800" : "bg-white text-gray-600"
            }`}
            title={t.label}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 견출지 인덱스 — 오른쪽 분류별 탭, 노트 우측에 붙음 (상단 탭 아래부터) */}
      <div className="absolute right-0 top-8 bottom-0 flex flex-col gap-0.5 z-20 justify-start">
        {GENRE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setGenreTab(t.id)}
            className={`min-w-[3.5rem] w-16 h-9 rounded-r-md rounded-l-none shadow-sm border-2 border-l-0 border-red-500 font-handwriting text-[12px] font-medium px-2 transition-all hover:scale-105 active:opacity-90 ${
              genreTab === t.id ? "bg-red-50 text-red-800" : "bg-white text-gray-600"
            }`}
            title={t.label}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BookRow({ book, onClick }: { book: Book; onClick?: () => void }) {
  const stamp = getStamp(book);
  return (
    <li
      className="flex items-center justify-between gap-3 px-4 py-2.5 min-h-[36px] hover:bg-white/40 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="min-w-0 flex-1">
        <p className="font-serif font-bold text-[14px] text-[#3a3028] truncate">{book.title || "—"}</p>
        <p className="font-serif text-[12px] text-text-muted truncate">{book.author || "—"}</p>
      </div>
      <div className="shrink-0">{stamp}</div>
    </li>
  );
}

function getStamp(book: Book): React.ReactNode {
  const status: RecordStatus | undefined = book.recordStatus;
  const rating = book.rating ?? 0;
  const isFavorite = rating >= 4;

  if (isFavorite) {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[14px] shadow-sm"
        style={{
          background: "linear-gradient(135deg, #f5d86a 0%, #e8c84a 100%)",
          color: "#8a6a18",
          border: "1px solid rgba(138,106,24,0.3)",
          fontFamily: "serif",
        }}
        title="아낌"
      >
        ★
      </span>
    );
  }

  if (status === "읽는 중") {
    return (
      <span
        className="inline-block px-2 py-0.5 rounded text-[11px] font-bold italic"
        style={{
          background: "rgba(100, 160, 100, 0.25)",
          color: "#2a5a2a",
          border: "1px solid rgba(80, 120, 80, 0.4)",
          transform: "rotate(-3deg)",
          fontFamily: "serif",
        }}
      >
        펼침
      </span>
    );
  }

  if (status === "완독") {
    return (
      <span
        className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold italic"
        style={{
          background: "rgba(200, 80, 80, 0.2)",
          color: "#8a2020",
          border: "1px solid rgba(180, 60, 60, 0.5)",
          transform: "rotate(2deg)",
          fontFamily: "serif",
        }}
      >
        참 잘했어요
      </span>
    );
  }

  if (status === "멈춤" || status === "소장중") {
    return (
      <span
        className="inline-block px-2 py-0.5 rounded text-[11px] italic opacity-60"
        style={{
          background: "rgba(120, 120, 120, 0.15)",
          color: "#6a6a6a",
          border: "1px dashed rgba(100, 100, 100, 0.3)",
          transform: "rotate(-1deg)",
          fontFamily: "serif",
        }}
      >
        {status === "소장중" ? "소장" : status === "멈춤" ? "멈춤" : "추림"}
      </span>
    );
  }

  return null;
}
