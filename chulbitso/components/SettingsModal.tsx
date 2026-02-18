"use client";

import { useState } from "react";
import { X, Loader2, RefreshCw } from "lucide-react";
import type { Book } from "@/lib/useBooks";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  books?: { my: Book[]; read: Book[]; ebook: Book[] };
  onUpdateBook?: (book: Book) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onReset,
  books = { my: [], read: [], ebook: [] },
  onUpdateBook,
}: SettingsModalProps) {
  const [enriching, setEnriching] = useState(false);
  const [enrichProgress, setEnrichProgress] = useState("");
  const allBooks = [...books.my, ...books.read, ...books.ebook];
  const booksWithIsbn = allBooks.filter((b) => (b.isbn || "").replace(/\D/g, "").length >= 10);

  const handleBulkEnrich = async () => {
    if (!onUpdateBook) return;
    if (booksWithIsbn.length === 0) {
      alert("ISBN이 있는 도서가 없어요. 검색 추가나 엑셀 업로드로 ISBN을 채운 뒤 시도해 주세요.");
      return;
    }
    setEnriching(true);
    let updated = 0;
    try {
      for (let i = 0; i < booksWithIsbn.length; i++) {
        const book = booksWithIsbn[i];
        setEnrichProgress(`${i + 1}/${booksWithIsbn.length} - ${book.title?.slice(0, 20) ?? ""}…`);
        try {
          const res = await fetch(`/api/book?isbn=${encodeURIComponent(book.isbn!)}`);
          if (!res.ok) continue;
          const data = await res.json();
          const merged: Book = {
            ...book,
            title: data.title || book.title,
            author: data.author || book.author,
            publisher: book.publisher || data.publisher,
            pubDate: book.pubDate || data.pubDate,
            cover: book.cover || data.cover,
            description: book.description || data.description,
            isbn: data.isbn || book.isbn,
            retailPrice: book.retailPrice ?? data.retailPrice,
            pageCount: book.pageCount ?? data.pageCount,
            format: book.format || data.format,
            category: book.category || data.category,
            series: book.series || data.series,
            translator: book.translator || data.translator,
          };
          onUpdateBook(merged);
          updated++;
        } catch {
          /* skip on error */
        }
      }
      alert(`✓ 보강 완료! ${updated}권 업데이트됐어요.`);
    } finally {
      setEnriching(false);
      setEnrichProgress("");
    }
  };

  const handleReset = () => {
    if (!confirm("⚠️ 정말로 모든 데이터를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.")) {
      return;
    }
    if (!confirm("⚠️ 한 번 더 확인합니다.\n\n모든 책 정보(나의 책, 읽은 책, 전자책)가 영구적으로 삭제됩니다.\n\n계속하시겠습니까?")) {
      return;
    }
    onReset();
    onClose();
    alert("✓ 모든 데이터가 삭제되었습니다.");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="w-full max-w-[480px] bg-white rounded-t-2xl p-6 pb-[max(24px,env(safe-area-inset-bottom))] shadow-lg border-t border-x border-secondary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="settings-title" className="text-[18px] font-bold text-primary font-serif">
            설정
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

        <button
          type="button"
          onClick={handleBulkEnrich}
          disabled={enriching}
          className="w-full py-4 rounded-xl border-2 border-primary/40 text-primary font-bold text-[15px] hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enriching ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {enrichProgress || "보강 중…"}
            </>
          ) : (
            <>
              <RefreshCw size={20} />
              전체 도서 정보 보강 {booksWithIsbn.length > 0 ? `(${booksWithIsbn.length}권)` : ""}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full py-4 rounded-xl border-2 border-red-200 text-red-600 font-bold text-[15px] hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          🗑️ 모든 데이터 초기화
        </button>
      </div>
    </div>
  );
}
