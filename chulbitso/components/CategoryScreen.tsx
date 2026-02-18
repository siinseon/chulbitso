"use client";

import { useState, useMemo } from "react";
import BookList from "./BookList";
import BookDetailModal from "./BookDetailModal";
import BookRecordModal from "./BookRecordModal";
import DosBookList from "./DosBookList";
import type { Book } from "@/lib/useBooks";

type BookGroup = "my" | "read" | "ebook";
type TabId = BookGroup | "dos";

interface CategoryScreenProps {
  books: { my: Book[]; read: Book[]; ebook: Book[] };
  onDelete: (group: BookGroup, id: string) => void;
  onSetReadingStatus: (group: BookGroup, id: string, status: import("@/lib/supabase/types").ReadingStatus) => void;
  onSetBookCountry?: (id: string, country: string) => void;
  onUpdateBook?: (book: Book) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "my", label: "쌓인 책" },
  { id: "read", label: "스친 책" },
  { id: "ebook", label: "빛으로 쓴 책" },
  { id: "dos", label: "컴퓨터실" },
];

function findBookById(
  books: { my: Book[]; read: Book[]; ebook: Book[] },
  id: string | null
): Book | null {
  if (!id) return null;
  const b = books.my.find((x) => x.id === id) ?? books.read.find((x) => x.id === id) ?? books.ebook.find((x) => x.id === id);
  return b ?? null;
}

function findBookGroup(books: { my: Book[]; read: Book[]; ebook: Book[] }, id: string): BookGroup | null {
  if (books.my.some((x) => x.id === id)) return "my";
  if (books.read.some((x) => x.id === id)) return "read";
  if (books.ebook.some((x) => x.id === id)) return "ebook";
  return null;
}

export default function CategoryScreen({
  books,
  onDelete,
  onSetReadingStatus,
  onSetBookCountry,
  onUpdateBook,
}: CategoryScreenProps) {
  const [activeTab, setActiveTab] = useState<TabId>("my");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const selectedBook = findBookById(books, selectedBookId);
  const allBooks = useMemo(() => [...books.my, ...books.read, ...books.ebook], [books]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex gap-2 p-1.5 sm:p-2 bg-[#E8DCC8] rounded-xl shadow-card border border-secondary">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-3.5 sm:py-3 rounded-lg text-[15px] font-bold transition-colors min-h-[48px] active:opacity-90 shadow-sm ${
              activeTab === id
                ? "bg-primary text-white shadow-[0_2px_12px_rgba(74,94,66,0.35)]"
                : "bg-secondary/20 text-text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <h2 className="text-[16px] sm:text-[17px] font-bold text-primary font-serif">
        {TABS.find((t) => t.id === activeTab)?.label}
      </h2>

      {activeTab === "dos" ? (
        <DosBookList
          books={allBooks}
          onBookClick={(book) => setSelectedBookId(book.id)}
          appendDummyForTest={allBooks.length < 3}
        />
      ) : (
        <BookList
          books={books[activeTab]}
          group={activeTab}
          onDelete={(id) => onDelete(activeTab, id)}
          onCardClick={(book) => setSelectedBookId(book.id)}
          onSetReadingStatus={(id, status) => onSetReadingStatus(activeTab, id, status)}
        />
      )}

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBookId(null)}
        onUpdateCountry={onSetBookCountry}
        onEdit={onUpdateBook ? (b) => setEditingBook(b) : undefined}
        onUpdateBook={onUpdateBook}
        onSetReadingStatus={
          selectedBookId
            ? (id, status) => {
                const g = findBookGroup(books, id);
                if (g) onSetReadingStatus(g, id, status);
              }
            : undefined
        }
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
