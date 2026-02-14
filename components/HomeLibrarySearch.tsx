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
<<<<<<< HEAD
      <div className="bg-chulbit-card rounded-xl px-4 py-3 min-h-[48px] flex items-center gap-3 shadow-card border border-ivory-border">
        <Search size={20} stroke="var(--point-color)" className="flex-shrink-0" />
=======
      <div className="bg-white rounded-xl px-4 py-3 min-h-[48px] flex items-center gap-3 shadow-card border border-secondary">
        <Search size={20} stroke="#4A5E42" className="flex-shrink-0" />
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="가진 책 검색 (제목, 저자)"
<<<<<<< HEAD
          className="flex-1 min-w-0 outline-none text-[15px] placeholder:text-muted"
=======
          className="flex-1 min-w-0 outline-none text-[15px] placeholder:text-text-muted"
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
        />
      </div>

      {hasQuery && (
<<<<<<< HEAD
        <div className="bg-chulbit-card rounded-xl p-4 shadow-card max-h-[240px] overflow-y-auto">
=======
        <div className="bg-white rounded-xl p-4 shadow-card border border-secondary max-h-[240px] overflow-y-auto">
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
          {matches.length === 0 ? (
            <div className="text-primary font-bold py-2">✓ 미보유 도서</div>
          ) : (
            <div className="space-y-2">
              {matches.slice(0, 20).map((book) => (
                <div
                  key={book.id}
<<<<<<< HEAD
                  className="py-2 border-b border-ivory-border last:border-0"
=======
                  className="py-2 border-b border-secondary/30 last:border-0"
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
                >
                  <div className="font-bold text-[15px] text-primary">
                    {book.title}
                  </div>
<<<<<<< HEAD
                  <div className="text-[13px] text-muted flex items-center gap-2">
                    {book.author}
                    <span className="text-gray-400">·</span>
                    <span className="text-primary text-[11px]">
=======
                  <div className="text-[13px] text-text-muted flex items-center gap-2">
                    {book.author}
                    <span className="text-text-muted">·</span>
                    <span className="text-accent-cool text-[11px]">
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
                      {getGroupLabel(book, books)}
                    </span>
                  </div>
                </div>
              ))}
              {matches.length > 20 && (
<<<<<<< HEAD
                <div className="text-[12px] text-muted pt-2">
=======
                <div className="text-[12px] text-text-muted pt-2">
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
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
