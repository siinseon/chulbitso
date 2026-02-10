"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { Book } from "@/lib/useBooks";

interface HomeLibrarySearchProps {
  books: { my: Book[]; read: Book[]; ebook: Book[] };
}

function getGroupLabel(book: Book, books: { my: Book[]; read: Book[]; ebook: Book[] }): string {
  if (books.my.some((b) => b.id === book.id)) return "쌓인 책";
  if (books.read.some((b) => b.id === book.id)) return "스친 책";
  if (books.ebook.some((b) => b.id === book.id)) return "빛으로 쓴 책";
  return "";
}

export default function HomeLibrarySearch({ books }: HomeLibrarySearchProps) {
  const [query, setQuery] = useState("");

  const allBooks = useMemo(
    () => [...books.my, ...books.read, ...books.ebook],
    [books.my, books.read, books.ebook]
  );

  const matches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return allBooks.filter((b) => {
      const title = (b.title || "").toLowerCase();
      const author = (b.author || "").toLowerCase();
      const series = (b.series || "").toLowerCase();
      return title.includes(q) || author.includes(q) || series.includes(q);
    });
  }, [query, allBooks]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="space-y-2 mb-5">
      <div className="bg-[#FFFFFF] rounded-xl px-4 py-3 flex items-center gap-3 shadow-card">
        <Search size={20} stroke="#11593F" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="가진 책 검색 (제목, 저자)"
          className="flex-1 outline-none text-[14px] placeholder:text-gray-400"
        />
      </div>

      {hasQuery && (
        <div className="bg-[#FFFFFF] rounded-xl p-4 shadow-card max-h-[240px] overflow-y-auto">
          {matches.length === 0 ? (
            <div className="text-[#11593F] font-bold py-2">✓ 미보유 도서</div>
          ) : (
            <div className="space-y-2">
              {matches.slice(0, 20).map((book) => (
                <div
                  key={book.id}
                  className="py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="font-bold text-[14px] text-[#11593F]">
                    {book.title}
                  </div>
                  <div className="text-[12px] text-gray-600 flex items-center gap-2">
                    {book.author}
                    <span className="text-gray-400">·</span>
                    <span className="text-[#11593F] text-[11px]">
                      {getGroupLabel(book, books)}
                    </span>
                  </div>
                </div>
              ))}
              {matches.length > 20 && (
                <div className="text-[12px] text-gray-500 pt-2">
                  외 {matches.length - 20}권 더 있음
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
