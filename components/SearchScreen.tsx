"use client";

import { useState } from "react";
import { Search, BookmarkPlus, Loader2 } from "lucide-react";
import type { Book } from "@/lib/useBooks";

interface AladdinBook {
  title: string;
  author: string;
  publisher?: string;
  pubDate?: string;
  cover?: string;
  description?: string;
  isbn?: string;
  retailPrice?: number;
  category?: string;
  translator?: string;
  series?: string;
}

export interface AddBookInput {
  title: string;
  author: string;
  publisher?: string;
  pubDate?: string;
  cover?: string;
  description?: string;
  isbn?: string;
  retailPrice?: number;
  category?: string;
  translator?: string;
  series?: string;
  readStatus?: "읽음" | "미독";
}

interface SearchScreenProps {
  onAddBook?: (book: AddBookInput) => void;
  onSelectBook?: (book: AddBookInput) => void;
  existingBooks: Book[];
}

function getBookId(book: AladdinBook): string {
  return book.isbn ?? `${book.title}-${book.author}`;
}

function isAlreadySaved(existing: Book[], book: AladdinBook): boolean {
  const id = getBookId(book);
  return existing.some(
    (b) => b.isbn === id || (b.title === book.title && b.author === book.author)
  );
}

export default function SearchScreen({ onAddBook, onSelectBook, existingBooks }: SearchScreenProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AladdinBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) {
      setError("검색어를 입력해주세요.");
      return;
    }

    setError(null);
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "검색 중 오류가 발생했습니다.");
      }

      const books = (data.books ?? []).map((b: Record<string, string | number>) => ({
        title: b.title ?? "",
        author: b.author ?? "",
        publisher: b.publisher ?? "",
        pubDate: b.pubDate ?? "",
        cover: b.cover ?? "",
        description: b.description ?? "",
        isbn: b.isbn ?? "",
        retailPrice: typeof b.retailPrice === "number" ? b.retailPrice : parseInt(String(b.retailPrice || "0"), 10) || 0,
        category: b.category as string | undefined,
        translator: b.translator as string | undefined,
        series: b.series as string | undefined,
      }));

      setResults(books);
    } catch (e) {
      setError(e instanceof Error ? e.message : "검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (book: AladdinBook) => {
    if (isAlreadySaved(existingBooks, book)) return;
    const payload = {
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      pubDate: book.pubDate,
      cover: book.cover,
      description: book.description,
      isbn: book.isbn,
      retailPrice: book.retailPrice ?? 0,
      category: book.category ?? undefined,
      translator: book.translator ?? undefined,
      series: book.series ?? undefined,
      readStatus: "미독" as const,
    };
    if (onSelectBook) {
      onSelectBook(payload);
    } else if (onAddBook) {
      onAddBook(payload);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-card">
        <Search size={20} stroke="var(--primary)" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="도서명 또는 ISBN 입력"
          className="flex-1 outline-none text-[14px] placeholder:text-text-muted"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-[14px] whitespace-nowrap flex items-center gap-2"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "검색"
          )}
        </button>
      </div>

      {error && (
        <div className="py-4 text-center text-red-600 font-bold">{error}</div>
      )}

      {results.length > 0 && (
        <div className="text-[13px] text-text-muted mb-2">
          검색 결과 {results.length}건 · 탭하여 상세 기록하기
        </div>
      )}

      <div className="flex flex-col gap-3">
        {results.map((book, idx) => {
          const saved = isAlreadySaved(existingBooks, book);
          return (
            <article
              key={book.isbn || idx}
              onClick={() => !saved && handleSelect(book)}
              className={`bg-white rounded-xl p-4 shadow-card flex gap-3 transition-all cursor-pointer border-2 ${
                saved ? "border-secondary opacity-60 cursor-default" : "border-transparent hover:border-primary"
              }`}
            >
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-[60px] h-[85px] object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-[60px] h-[85px] rounded-lg flex-shrink-0 flex items-center justify-center bg-secondary/10 text-primary font-bold text-[10px] text-center leading-tight px-1">
                  {book.title.slice(0, 8)}…
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-bold text-primary leading-snug line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-[13px] text-text-muted mt-1">{book.author}</p>
                {(book.publisher || book.pubDate) && (
                  <p className="text-[12px] text-text-muted mt-0.5">
                    {[book.publisher, book.pubDate].filter(Boolean).join(" · ")}
                  </p>
                )}
                {saved ? (
                  <span className="inline-flex items-center gap-1.5 mt-2 text-[12px] text-text-muted">
                    <BookmarkPlus size={14} strokeWidth={2} />
                    이미 담김
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 mt-2 text-[12px] text-primary font-bold">
                    <BookmarkPlus size={14} strokeWidth={2} />
                    나의 책에 추가
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {!loading && results.length === 0 && query.trim() && !error && (
        <div className="py-12 text-center text-text-muted font-bold">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
