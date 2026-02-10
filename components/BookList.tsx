"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { Book } from "@/lib/useBooks";
import BookCard from "./BookCard";

type BookGroup = "my" | "read" | "ebook";

interface BookListProps {
  books: Book[];
  group: BookGroup;
  onDelete: (id: string) => void;
  onCardClick?: (book: Book) => void;
  onSetReadingStatus?: (id: string, status: import("@/lib/supabase/types").ReadingStatus) => void;
}

const FILTER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "시집", label: "시집" },
  { value: "소설", label: "소설" },
  { value: "에세이", label: "에세이" },
  { value: "인문", label: "인문" },
] as const;

export default function BookList({
  books,
  group,
  onDelete,
  onCardClick,
  onSetReadingStatus,
}: BookListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | string>("all");

  const filtered = books
    .filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const match =
          (b.title || "").toLowerCase().includes(q) ||
          (b.author || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filter !== "all") {
        return (b.category || "") === filter;
      }
      return true;
    })
    .sort((a, b) => {
      const titleA = (a.title || "").localeCompare(b.title || "", "ko");
      if (a.category === "시집" && b.category === "시집") {
        const seriesA = a.series || "";
        const seriesB = b.series || "";
        if (seriesA && seriesB) return seriesA.localeCompare(seriesB, "ko");
      }
      return titleA;
    });

  return (
    <div className="space-y-4">
      <div className="bg-[#FFFFFF] rounded-xl px-4 py-3 flex items-center gap-3 shadow-card border border-ivory-border">
        <Search size={20} stroke="#11593F" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="도서 검색"
          className="flex-1 outline-none text-[14px] placeholder:text-gray-400"
        />
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-0.5 px-0.5">
        <div className="flex gap-2 p-1.5 bg-[#FFFFFF] rounded-xl shadow-card border border-ivory-border w-max min-w-full justify-start sm:justify-center">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-2 rounded-lg text-[12px] sm:text-[13px] font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
                filter === opt.value
                  ? "bg-[#11593F] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-right text-[13px] text-gray-600">
        총 <span className="font-bold text-[#11593F]">{filtered.length}</span>권
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-500 font-bold">
          도서 없음
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              group={group}
              onDelete={onDelete}
              onCardClick={onCardClick}
              onSetReadingStatus={onSetReadingStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
