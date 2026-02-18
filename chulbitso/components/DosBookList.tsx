"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Book } from "@/lib/useBooks";
import { shouldClassifyAsPoetry } from "@/lib/categories";

const DOS_PROMPT = "C:\\USER\\CHULBITSO\\LIBRARY>";
const TITLE_COLOR = "#00FF00";
const FONT_MONO = "Courier New, Courier, DungGeunMo, monospace";
const VIGNETTE_COLOR = "rgba(0,0,0,0.6)";

function bookToLine(book: Book): string {
  const title = book.title || "제목 없음";
  const author = book.author ?? "저자 미상";
  return `${title}  —  ${author}`;
}

function isDone(book: Book): boolean {
  return book.recordStatus === "완독" || (book as { readingStatus?: string }).readingStatus === "FINISHED";
}

function isChulim(book: Book): boolean {
  return book.recordStatus === "소장중" || (book as { readingStatus?: string }).readingStatus === "EXCERPT";
}

function isMunjum(book: Book): boolean {
  return book.recordStatus === "멈춤" || (book as { readingStatus?: string }).readingStatus === "PAUSED";
}

function isAum(book: Book): boolean {
  return (book.rating ?? 0) >= 4 || (book as { readingStatus?: string }).readingStatus === "WISH";
}

function isNovel(book: Book): boolean {
  return (book.category ?? "").trim() === "소설";
}

function isPoem(book: Book): boolean {
  const cat = (book.category ?? "").trim();
  if (cat === "시집") return true;
  return shouldClassifyAsPoetry(book.series) || shouldClassifyAsPoetry(book.publisher);
}

function isHumanities(book: Book): boolean {
  return (book.category ?? "").trim() === "인문";
}

function isScience(book: Book): boolean {
  const cat = (book.category ?? "").trim();
  return cat === "자연과학" || cat === "기술과학" || cat.includes("과학");
}

type StatusFilter = "전체" | "끝냄" | "추림" | "멈춤" | "아낌";
type GenreFilter = "전체" | "소설" | "시" | "인문" | "과학";

const STATUS_MENUS: { id: StatusFilter; label: string }[] = [
  { id: "전체", label: "전체" },
  { id: "끝냄", label: "끝냄" },
  { id: "추림", label: "추림" },
  { id: "멈춤", label: "멈춤" },
  { id: "아낌", label: "아낌" },
];

const GENRE_MENUS: { id: GenreFilter; label: string }[] = [
  { id: "전체", label: "전체" },
  { id: "소설", label: "소설" },
  { id: "시", label: "시" },
  { id: "인문", label: "인문" },
  { id: "과학", label: "과학" },
];

const DUMMY_BOOKS: Book[] = [
  { id: "d1", title: "소년이 온다", author: "한강", ownershipType: "OWNED", readingStatus: "FINISHED", recordStatus: "완독", readDates: [{ start: "2024-02-01", end: "2024-02-15" }], category: "소설" } as Book,
  { id: "d2", title: "김영하 소설", author: "김영하", ownershipType: "OWNED", readingStatus: "READING", recordStatus: "읽는 중", category: "소설" } as Book,
  { id: "d3", title: "창비시선 123", author: "김작가", ownershipType: "OWNED", readingStatus: "FINISHED", recordStatus: "완독", publisher: "창비", category: "시집", readDates: [{ start: "2024-01-10", end: "2024-01-20" }] } as Book,
  { id: "d4", title: "민음의시 모음", author: "이시인", ownershipType: "OWNED", readingStatus: "PAUSED", recordStatus: "멈춤", publisher: "민음사", category: "시집" } as Book,
  { id: "d5", title: "인문 에세이", author: "박저자", ownershipType: "OWNED", readingStatus: "FINISHED", recordStatus: "완독", category: "인문", readDates: [{ start: "2024-02-10", end: "2024-02-14" }] } as Book,
  { id: "d6", title: "자연과학 개론", author: "최저자", ownershipType: "OWNED", readingStatus: "READING", recordStatus: "읽는 중", category: "자연과학" } as Book,
  { id: "d7", title: "아낌 책", author: "별점5저자", ownershipType: "OWNED", readingStatus: "FINISHED", recordStatus: "완독", rating: 5, category: "소설" } as Book,
];

interface DosBookListProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
  appendDummyForTest?: boolean;
}

export default function DosBookList({ books, onBookClick, appendDummyForTest }: DosBookListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("전체");
  const [genreFilter, setGenreFilter] = useState<GenreFilter>("전체");

  const displayBooks = useMemo(() => {
    const src = appendDummyForTest && books.length < 3 ? [...books, ...DUMMY_BOOKS] : books;
    let filtered = src;
    if (statusFilter !== "전체") {
      if (statusFilter === "끝냄") filtered = filtered.filter(isDone);
      else if (statusFilter === "추림") filtered = filtered.filter(isChulim);
      else if (statusFilter === "멈춤") filtered = filtered.filter(isMunjum);
      else if (statusFilter === "아낌") filtered = filtered.filter(isAum);
    }
    if (genreFilter !== "전체") {
      if (genreFilter === "소설") filtered = filtered.filter(isNovel);
      else if (genreFilter === "시") filtered = filtered.filter(isPoem);
      else if (genreFilter === "인문") filtered = filtered.filter(isHumanities);
      else if (genreFilter === "과학") filtered = filtered.filter(isScience);
    }
    return filtered;
  }, [books, statusFilter, genreFilter, appendDummyForTest]);

  const lines = useMemo(() => displayBooks.map(bookToLine), [displayBooks]);
  const [cursorVisible, setCursorVisible] = useState(true);

  const playBeep = useCallback(() => {
    try {
      const Ctx = typeof window !== "undefined" ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) : null;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "square";
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }, []);

  const handleStatusClick = useCallback((id: StatusFilter) => {
    setStatusFilter(id);
    playBeep();
  }, [playBeep]);

  const handleGenreClick = useCallback((id: GenreFilter) => {
    setGenreFilter(id);
    playBeep();
  }, [playBeep]);

  useEffect(() => {
    const t = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="w-full max-w-[100%] rounded-t-[28px] rounded-b-[12px] px-6 py-8 pb-5"
        style={{
          background: "linear-gradient(180deg, #c8c6c2 0%, #b0aeaa 25%, #9a9894 60%, #8a8884 100%)",
          boxShadow: "inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.1), 0 6px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="rounded-lg overflow-hidden"
          style={{ background: "#3a3836", boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.3)" }}
        >
          <div
            className="relative rounded overflow-hidden min-h-[320px] font-mono text-[13px] leading-relaxed flex flex-col"
            style={{
              background: "#0D110D",
              color: TITLE_COLOR,
              boxShadow: "inset 0 0 80px 20px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,255,0,0.08)",
              fontFamily: FONT_MONO,
            }}
          >
            <div className="flex-shrink-0 border-b border-[rgba(0,255,0,0.25)] overflow-x-auto scrollbar-hide">
              <div className="flex flex-col gap-1.5 p-2.5">
                <div className="flex gap-2 min-w-max">
                  {STATUS_MENUS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleStatusClick(id)}
                      className="px-2 py-1.5 rounded-sm text-[12px] font-bold whitespace-nowrap transition-colors border border-[rgba(0,255,0,0.3)]"
                      style={statusFilter === id ? { background: TITLE_COLOR, color: "#000", borderColor: TITLE_COLOR } : { background: "#000", color: TITLE_COLOR }}
                    >
                      [{label}]
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 min-w-max">
                  {GENRE_MENUS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleGenreClick(id)}
                      className="px-2 py-1.5 rounded-sm text-[12px] font-bold whitespace-nowrap transition-colors border border-[rgba(0,255,0,0.3)]"
                      style={genreFilter === id ? { background: TITLE_COLOR, color: "#000", borderColor: TITLE_COLOR } : { background: "#000", color: TITLE_COLOR }}
                    >
                      [{label}]
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 relative">
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,255,0,0.3) 2px, rgba(0,255,0,0.3) 3px)" }} />
              <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ boxShadow: `inset 0 0 60px 30px ${VIGNETTE_COLOR}` }} />
              <pre className="relative z-10 whitespace-pre-wrap break-all" style={{ textShadow: `0 0 8px ${TITLE_COLOR}, 0 0 16px ${TITLE_COLOR}80` }}>
                {DOS_PROMPT}
                {"\n"}
                {lines.map((line, i) => (
                  <span key={i} className={onBookClick ? "cursor-pointer hover:opacity-90" : ""} onClick={() => onBookClick?.(displayBooks[i])}>
                    {line}
                    {"\n"}
                  </span>
                ))}
                <span className="inline-block w-[0.6em] h-[1em] align-bottom ml-0.5" style={{ backgroundColor: cursorVisible ? TITLE_COLOR : "transparent", border: `1px solid ${TITLE_COLOR}` }} />
              </pre>
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-[55%] h-5 rounded-b-lg"
        style={{
          background: "linear-gradient(180deg, #a8a6a2 0%, #90908c 100%)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      />
    </div>
  );
}
