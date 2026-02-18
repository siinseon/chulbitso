"use client";

import { useState } from "react";
import { X, Search, PenLine } from "lucide-react";
import SearchScreen from "./SearchScreen";
import BookRecordModal, { type BookRecordInitial } from "./BookRecordModal";
import type { Book, BookGroup } from "@/lib/useBooks";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (
    group: BookGroup,
    book: Omit<Book, "id" | "ownershipType" | "readingStatus"> & {
      readStatus?: "읽음" | "미독";
    }
  ) => void;
  existingBooks: Book[];
}

import { FULL_CATEGORY_OPTIONS } from "@/lib/categories";

export default function AddBookModal({
  isOpen,
  onClose,
  onAddBook,
  existingBooks,
}: AddBookModalProps) {
  const [tab, setTab] = useState<"search" | "manual">("search");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [category, setCategory] = useState("기타");
  const [retailPrice, setRetailPrice] = useState("");
  const [recordInitial, setRecordInitial] = useState<BookRecordInitial | null>(null);

  const handleSelectBook = (book: BookRecordInitial) => {
    setRecordInitial({
      ...book,
      title: book.title,
      author: book.author,
      retailPrice: book.retailPrice ?? (book as unknown as { retailPrice?: number }).retailPrice,
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    const a = author.trim();
    if (!t || !a) {
      alert("제목과 작가는 필수입니다.");
      return;
    }
    setRecordInitial({
      title: t,
      author: a,
      publisher: publisher.trim() || undefined,
      category: category || undefined,
      retailPrice: parseInt(retailPrice, 10) || undefined,
    });
    setTitle("");
    setAuthor("");
    setPublisher("");
    setCategory("기타");
    setRetailPrice("");
  };

  const handleSaveCreate = (
    group: BookGroup,
    book: Omit<Book, "id" | "ownershipType" | "readingStatus"> & { readStatus?: "읽음" | "미독" }
  ) => {
    onAddBook(group, book);
    setRecordInitial(null);
    alert("✓ 담겼습니다!");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-book-title"
    >
      <div
        className="w-full max-w-[480px] max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-secondary/30">
          <h2 id="add-book-title" className="text-[18px] font-bold text-primary">
            도서 추가
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary/20 text-text-muted"
            aria-label="닫기"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="flex border-b border-secondary/30">
          <button
            type="button"
            onClick={() => setTab("search")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-[14px] font-bold transition-colors ${
              tab === "search"
                ? "text-primary border-b-2 border-primary"
                : "text-text-muted"
            }`}
          >
            <Search size={18} />
            알라딘 검색
          </button>
          <button
            type="button"
            onClick={() => setTab("manual")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-[14px] font-bold transition-colors ${
              tab === "manual"
                ? "text-primary border-b-2 border-primary"
                : "text-text-muted"
            }`}
          >
            <PenLine size={18} />
            수기 추가
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "search" && (
            <SearchScreen
              onSelectBook={handleSelectBook}
              existingBooks={existingBooks}
            />
          )}

          {tab === "manual" && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-primary mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="도서 제목"
                  className="w-full px-4 py-3 rounded-xl border border-secondary outline-none focus:border-primary text-[14px]"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-primary mb-2">
                  작가 *
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="저자명"
                  className="w-full px-4 py-3 rounded-xl border border-secondary outline-none focus:border-primary text-[14px]"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-primary mb-2">
                  출판사
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="출판사명"
                  className="w-full px-4 py-3 rounded-xl border border-secondary outline-none focus:border-primary text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-primary mb-2">
                  분야
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-secondary outline-none focus:border-primary text-[14px]"
                >
                  {FULL_CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-primary mb-2">
                  정가 (원)
                </label>
                <input
                  type="number"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value)}
                  placeholder="15000"
                  min={0}
                  className="w-full px-4 py-3 rounded-xl border border-secondary outline-none focus:border-primary text-[14px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-[15px] hover:bg-primary/90 transition-colors"
              >
                상세 기록하기
              </button>
            </form>
          )}
        </div>
      </div>

      <BookRecordModal
        isOpen={!!recordInitial}
        onClose={() => setRecordInitial(null)}
        initial={recordInitial ?? { title: "", author: "" }}
        mode="create"
        initialGroup="my"
        onSaveCreate={handleSaveCreate}
        onSaveEdit={() => {}}
      />
    </div>
  );
}
