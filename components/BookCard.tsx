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
    <article className="library-card relative z-0 rounded-tl-md rounded-tr-[6px] rounded-br-md rounded-bl-[5px] p-3 shadow-card border border-ivory-border transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover group">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(book.id);
        }}
        className="absolute top-2 right-2 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full text-muted hover:bg-accent/15 hover:text-accent active:bg-accent/25 transition-colors z-10 opacity-0 group-hover:opacity-100"
        aria-label="삭제"
      >
        <Trash2 size={14} strokeWidth={2.5} />
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
        <div className="flex gap-2.5 items-start pr-6">
          {/* 표지 */}
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="w-14 h-[72px] sm:w-16 sm:h-[84px] object-cover rounded-sm flex-shrink-0 shadow-sm border border-ivory-border"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-14 h-[72px] sm:w-16 sm:h-[84px] rounded-sm flex-shrink-0 bg-ivory-border/60 flex items-end justify-center pb-1 border border-ivory-border">
              <span className="text-[9px] text-muted text-center px-0.5 line-clamp-3 leading-tight w-full">
                {book.title}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-primary border border-primary/40 bg-primary/5 mb-1.5">
              수경 소유
            </span>
            <h3 className="text-[13px] sm:text-[14px] font-bold text-text-main leading-snug line-clamp-2">
              {book.title}
            </h3>
            {book.author && (
              <p className="text-[11px] sm:text-[12px] text-muted mt-0.5 line-clamp-1">
                {book.author}
              </p>
            )}
          </div>
        </div>

        {onSetReadingStatus && (
          <div
            className="flex gap-1.5 mt-2.5 flex-wrap justify-center w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {getReadingOptions(group).map((status) => (
              <button
                key={status}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetReadingStatus(book.id, status);
                }}
                className={`px-2 py-1.5 min-h-[32px] rounded text-[11px] font-bold transition-colors ${
                  book.readingStatus === status
                    ? "bg-primary text-white"
                    : "bg-ivory-border/80 text-muted"
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
