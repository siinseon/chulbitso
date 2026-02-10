"use client";

import { useState } from "react";
import BookList from "./BookList";
import BookDetailModal from "./BookDetailModal";
import BookRecordModal from "./BookRecordModal";
import type { Book } from "@/lib/useBooks";

type BookGroup = "my" | "read" | "ebook";

interface CategoryScreenProps {
  books: { my: Book[]; read: Book[]; ebook: Book[] };
  onDelete: (group: BookGroup, id: string) => void;
  onSetReadingStatus: (group: BookGroup, id: string, status: import("@/lib/supabase/types").ReadingStatus) => void;
  onSetBookCountry?: (id: string, country: string) => void;
  onUpdateBook?: (book: Book) => void;
}

const TABS: { id: BookGroup; label: string }[] = [
  { id: "my", label: "쌓인 책" },
  { id: "read", label: "스친 책" },
  { id: "ebook", label: "빛으로 쓴 책" },
];

function findBookById(
  books: { my: Book[]; read: Book[]; ebook: Book[] },
  id: string | null
): Book | null {
  if (!id) return null;
  const b = books.my.find((x) => x.id === id) ?? books.read.find((x) => x.id === id) ?? books.ebook.find((x) => x.id === id);
  return b ?? null;
}

export default function CategoryScreen({
  books,
  onDelete,
  onSetReadingStatus,
  onSetBookCountry,
  onUpdateBook,
}: CategoryScreenProps) {
  const [activeTab, setActiveTab] = useState<BookGroup>("my");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const selectedBook = findBookById(books, selectedBookId);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex gap-2 p-1.5 bg-[#FFFFFF] rounded-xl shadow-card">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-3 rounded-lg text-[14px] font-bold transition-colors ${
              activeTab === id
                ? "bg-[#11593F] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <h2 className="text-[15px] font-bold text-[#11593F]">
        {TABS.find((t) => t.id === activeTab)?.label}
      </h2>

      <BookList
        books={books[activeTab]}
        group={activeTab}
        onDelete={(id) => onDelete(activeTab, id)}
        onCardClick={(book) => setSelectedBookId(book.id)}
        onSetReadingStatus={(id, status) => onSetReadingStatus(activeTab, id, status)}
      />

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBookId(null)}
        onUpdateCountry={onSetBookCountry}
        onEdit={onUpdateBook ? (b) => setEditingBook(b) : undefined}
      />

      <BookRecordModal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        initial={editingBook ?? { title: "", author: "" }}
        mode="edit"
        onSaveCreate={() => {}}
        onSaveEdit={(book) => {
          onUpdateBook?.(book);
          setEditingBook(null);
        }}
      />
    </div>
  );
}
