"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IpodClickWheel, { type IpodWheelItem } from "@/components/IpodClickWheel";
import type { Book } from "@/lib/useBooks";
import type { ReadDateEntry } from "@/lib/supabase/types";

const LCD_BG = "#D8D8D8";

/** 해당 월의 1일 00:00 (로컬) */
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** n달 뒤/앞의 같은 날 (월만 이동) */
function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function subMonths(d: Date, n: number): Date {
  return addMonths(d, -n);
}

/** "YYYY-MM" */
function toYearMonth(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** LCD 표시용 "YYYY. MM" */
function formatMonthDisplay(d: Date): string {
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** 모달 제목용 "YYYY년 M월" */
function formatMonthTitle(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}

/** 월별 계절 아이콘: 3~5 🌱, 6~8 🏖️, 9~11 🍂, 12~2 ☃️ */
function getSeasonIcon(month: number): string {
  if (month >= 3 && month <= 5) return "🌱";
  if (month >= 6 && month <= 8) return "🏖️";
  if (month >= 9 && month <= 11) return "🍂";
  return "☃️";
}

/** 이 책이 해당 연/월에 완독되었는지 (readDates.end 기준) */
function isBookCompletedInMonth(book: Book, yearMonth: string): boolean {
  const raw = book.readDates;
  if (!raw || !Array.isArray(raw)) return false;
  const entries = raw as ReadDateEntry[];
  return entries.some((e) => {
    const end = e && typeof e === "object" && "end" in e ? String((e as ReadDateEntry).end ?? "") : "";
    return end.slice(0, 7) === yearMonth;
  });
}

/** 휠용 월 목록: 과거 5년 ~ 미래 1년 */
const MONTHS_LIST: Date[] = (() => {
  const list: Date[] = [];
  const from = new Date();
  from.setFullYear(from.getFullYear() - 5);
  from.setMonth(0);
  from.setDate(1);
  const to = new Date();
  to.setFullYear(to.getFullYear() + 1);
  to.setMonth(11);
  to.setDate(1);
  for (let d = new Date(from.getTime()); d <= to; d.setMonth(d.getMonth() + 1)) {
    list.push(new Date(d.getFullYear(), d.getMonth(), 1));
  }
  return list;
})();

export interface IpodHistoryViewerProps {
  /** 전체 책 (readDates로 해당 월 완독 필터링) */
  allBooks?: Book[];
  className?: string;
}

export default function IpodHistoryViewer({
  allBooks = [],
  className = "",
}: IpodHistoryViewerProps) {
  const today = useMemo(() => startOfMonth(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(today.getTime()));
  const [detailOpen, setDetailOpen] = useState(false);

  const safeDate = selectedDate instanceof Date && !Number.isNaN(selectedDate.getTime()) ? selectedDate : today;
  const yearMonth = useMemo(() => toYearMonth(safeDate), [safeDate]);

  /** 선택된 연/월에 완독한 책만 */
  const booksInMonth = useMemo(() => {
    const list = Array.isArray(allBooks) ? allBooks : [];
    return list.filter((b) => b && isBookCompletedInMonth(b, yearMonth));
  }, [allBooks, yearMonth]);

  const selectedIndex = useMemo(() => {
    const i = MONTHS_LIST.findIndex(
      (m) => m.getFullYear() === safeDate.getFullYear() && m.getMonth() === safeDate.getMonth()
    );
    return i >= 0 ? i : 0;
  }, [safeDate]);

  const wheelItems: IpodWheelItem[] = useMemo(
    () =>
      MONTHS_LIST.map((m) => ({
        id: toYearMonth(m),
        title: formatMonthDisplay(m),
        subtitle: "",
        cover: undefined,
      })),
    []
  );

  const handleSelectIndex = useCallback((i: number) => {
    const idx = Math.max(0, Math.min(i, MONTHS_LIST.length - 1));
    const m = MONTHS_LIST[idx];
    if (m && !Number.isNaN(m.getTime())) setSelectedDate(new Date(m.getTime()));
  }, []);

  const openDetail = useCallback(() => {
    setDetailOpen(true);
  }, []);

  const hasBooks = booksInMonth.length > 0;
  const firstBook = hasBooks ? booksInMonth[0] : null;
  const seasonIcon = getSeasonIcon(safeDate.getMonth());

  return (
    <div
      className={`flex flex-col rounded-2xl overflow-hidden max-w-[360px] mx-auto ${className}`}
      style={{
        background: "linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #1e1e1e 100%)",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset",
        border: "1px solid #4a4a4a",
      }}
    >
      {/* 상단: LCD 스크린 — 은색 패널 + 안으로 들어간 유리 느낌 */}
      <div
        className="flex flex-col items-center justify-center min-h-[220px] px-4 py-5"
        style={{
          background: `linear-gradient(180deg, ${LCD_BG} 0%, #C0C0C0 40%, #B8B8B8 100%)`,
          boxShadow:
            "inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -3px 8px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.15)",
          borderBottom: "3px solid #505050",
        }}
      >
        <div
          className="relative w-[120px] h-[150px] rounded-lg overflow-hidden flex items-center justify-center mb-3"
          style={{
            background: "#1a1a1a",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 2px rgba(0,0,0,0.2)",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {hasBooks && firstBook ? (
              <motion.div
                key={yearMonth}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center p-2"
              >
                {firstBook?.cover ? (
                  <img
                    src={String(firstBook.cover)}
                    alt=""
                    className="max-w-full max-h-full object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center px-1 bg-[#263238] rounded text-[#78909C] text-[10px] font-serif">
                    <span className="line-clamp-2">{firstBook?.title ?? "—"}</span>
                    <span className="mt-0.5 line-clamp-1">{firstBook?.author ?? ""}</span>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={`empty-${yearMonth}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[#546E7A] text-xs font-serif text-center px-2"
              >
                기록 없음
                <br />
                <span className="text-[10px]">(No Track)</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-[20px] font-bold text-[#37474F] tracking-tight flex items-center gap-1.5" style={{ fontFamily: "var(--font-pixel), monospace" }}>
          <span>{seasonIcon}</span>
          <span>{formatMonthDisplay(safeDate)}</span>
        </p>
        <p className="text-[11px] text-[#546E7A] mt-0.5" style={{ fontFamily: "var(--font-pixel), monospace" }}>
          {hasBooks ? `총 ${booksInMonth.length}권 읽음` : "기록 없음 (No Track)"}
        </p>
      </div>

      {/* 하단: 클릭 휠 (한 칸 = 한 달) */}
      <div className="p-4 pb-6 pt-2 flex flex-col items-center">
        <IpodClickWheel
          items={wheelItems}
          selectedIndex={selectedIndex}
          onSelectIndex={handleSelectIndex}
          onCenterPress={openDetail}
          hideCenterDisplay
        />
      </div>

      {/* 가운데 버튼: 해당 월 독서 리스트 모달 */}
      <AnimatePresence>
        {detailOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setDetailOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-[#ECEFF1] rounded-2xl shadow-2xl max-h-[70vh] w-full max-w-[340px] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[#CFD8DC]" style={{ fontFamily: "var(--font-pixel), monospace" }}>
                <h3 className="text-lg font-bold text-[#37474F]">
                  {formatMonthTitle(safeDate)}의 독서 리스트
                </h3>
                <p className="text-sm text-[#546E7A] mt-0.5">
                  {hasBooks ? `총 ${booksInMonth.length}권 읽음` : "기록 없음 (No Track)"}
                </p>
              </div>
              <ul className="flex-1 overflow-y-auto p-3 space-y-2">
                {hasBooks ? (
                  booksInMonth.map((book, i) => (
                    <li
                      key={book?.id ? String(book.id) : `book-${i}`}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/80 border border-[#CFD8DC]/60"
                    >
                      {book?.cover ? (
                        <img src={String(book.cover)} alt="" className="w-10 h-14 object-cover rounded flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-14 rounded bg-[#B0BEC5] flex items-center justify-center text-[8px] text-[#546E7A] flex-shrink-0">
                          표지
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#263238] truncate">{book?.title ?? "—"}</p>
                        <p className="text-xs text-[#546E7A] truncate">{book?.author ?? ""}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-6 text-center text-[#546E7A] text-sm">
                    이 달에 읽은 책이 없습니다.
                  </li>
                )}
              </ul>
              <div className="p-3 border-t border-[#CFD8DC]">
                <button
                  type="button"
                  onClick={() => setDetailOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#37474F] text-white text-sm font-bold hover:bg-[#455A64] active:scale-[0.98] transition-colors"
                  style={{ fontFamily: "var(--font-pixel), monospace" }}
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 아이팟 휠로 연/월을 돌려 과거 독서 기록을 보는 뷰어 (별명) */
export const ReadingTimeTravel = IpodHistoryViewer;
