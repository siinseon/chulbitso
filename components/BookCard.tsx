"use client";

import { Trash2 } from "lucide-react";
import type { Book } from "@/lib/useBooks";
import type { ReadingStatus } from "@/lib/supabase/types";
import { READING_STATUS_LABELS } from "@/lib/supabase/types";

interface BookCardProps {
  book: Book;
  group: "my" | "read" | "ebook";
  onDelete: (id: string) => void;
  onCardClick?: (book: Book) => void;
  onSetReadingStatus?: (id: string, status: ReadingStatus) => void;
}

/** 쌓인 책·빛으로 쓴 책: 펼침, 끝냄, 추림, 멈춤, 아낌 */
const READING_OPTIONS_FULL: ReadingStatus[] = ["READING", "FINISHED", "EXCERPT", "PAUSED", "WISH"];
/** 스친 책(읽은 책): 끝냄, 추림만 */
const READING_OPTIONS_PASSED: ReadingStatus[] = ["FINISHED", "EXCERPT"];

function getReadingOptions(group: "my" | "read" | "ebook"): ReadingStatus[] {
  return group === "read" ? READING_OPTIONS_PASSED : READING_OPTIONS_FULL;
}

export default function BookCard({
  book,
  group,
  onDelete,
  onCardClick,
  onSetReadingStatus,
}: BookCardProps) {
  return (
    <article className="vintage-ticket relative rounded-xl p-4 sm:p-5 shadow-card hover:shadow-asset-card transition-all overflow-visible">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(book.id);
        }}
        className="absolute top-3 right-3 w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-text-muted hover:bg-red-50 hover:text-red-600 active:bg-red-100 transition-colors z-10"
        aria-label="삭제"
      >
        <Trash2 size={18} strokeWidth={2.5} />
      </button>

      <div
        className="cursor-pointer"
        onClick={() => onCardClick?.(book)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onCardClick?.(book);
          }
        }}
      >
        <div className="flex gap-4 mb-3 items-end pr-10">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="w-20 h-[112px] object-cover rounded-lg flex-shrink-0 shadow-sm bg-secondary/20"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-[112px] rounded-lg flex-shrink-0 bg-secondary/30 flex items-end justify-center pb-2.5">
              <span className="text-[10px] text-text-muted text-center px-1 line-clamp-3 leading-tight w-full">
                {book.title}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] sm:text-[17px] font-bold text-primary font-serif leading-snug line-clamp-2">
              {book.title}
            </h3>
            {book.author && (
              <p className="text-[14px] text-text-muted mt-1">{book.author}</p>
            )}
            {(book.series || book.publisher || book.category) && (
              <div className="flex flex-wrap gap-2 text-[13px] text-text-muted mt-2">
                {book.series && (
                  <span className="text-accent-cool font-medium">📚 {book.series}</span>
                )}
                {book.publisher && <span>🏢 {book.publisher}</span>}
                {book.category && <span>📖 {book.category}</span>}
              </div>
            )}
            {book.retailPrice && book.retailPrice > 0 && (
              <p className="text-[13px] text-text-muted mt-1">
                ₩{book.retailPrice.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {onSetReadingStatus && (
          <div className="flex gap-2 mt-3 flex-wrap justify-center w-full" onClick={(e) => e.stopPropagation()}>
            {getReadingOptions(group).map((status) => (
              <button
                key={status}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetReadingStatus(book.id, status);
                }}
                className={`px-3 py-2 min-h-[40px] rounded-lg text-[12px] font-bold transition-colors shadow-sm ${
                  book.readingStatus === status
                    ? "bg-primary text-white shadow-[0_2px_8px_rgba(74,94,66,0.3)]"
                    : "bg-secondary/20 text-text-muted"
                }`}
              >
                {READING_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
