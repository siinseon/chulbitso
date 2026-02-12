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
      <div className="bg-white rounded-xl px-4 py-3 min-h-[48px] flex items-center gap-3 shadow-card border border-secondary">
        <Search size={20} stroke="#4A5E42" className="flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="가진 책 검색 (제목, 저자)"
          className="flex-1 min-w-0 outline-none text-[15px] placeholder:text-text-muted"
        />
      </div>

      {hasQuery && (
        <div className="bg-white rounded-xl p-4 shadow-card border border-secondary max-h-[240px] overflow-y-auto">
          {matches.length === 0 ? (
            <div className="text-primary font-bold py-2">✓ 미보유 도서</div>
          ) : (
            <div className="space-y-2">
              {matches.slice(0, 20).map((book) => (
                <div
                  key={book.id}
                  className="py-2 border-b border-secondary/30 last:border-0"
                >
                  <div className="font-bold text-[15px] text-primary">
                    {book.title}
                  </div>
                  <div className="text-[13px] text-text-muted flex items-center gap-2">
                    {book.author}
                    <span className="text-text-muted">·</span>
                    <span className="text-accent-cool text-[11px]">
                      {getGroupLabel(book, books)}
                    </span>
                  </div>
                </div>
              ))}
              {matches.length > 20 && (
                <div className="text-[12px] text-text-muted pt-2">
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
