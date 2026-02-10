"use client";

import { useState } from "react";
import { useBooks } from "@/lib/useBooks";
import Header from "@/components/Header";
import BottomNav, { type NavTab } from "@/components/BottomNav";
import StatsCard from "@/components/StatsCard";
import HomeLibrarySearch from "@/components/HomeLibrarySearch";
import CategoryScreen from "@/components/CategoryScreen";
import AnalysisScreen from "@/components/AnalysisScreen";
import AddBookModal from "@/components/AddBookModal";
import ExcelUpload from "@/components/ExcelUpload";
import SettingsModal from "@/components/SettingsModal";
import ReceiptModal from "@/components/ReceiptModal";
import GiftScreen from "@/components/GiftScreen";

export default function Home() {
  const {
    books,
    isHydrated,
    addBook,
    updateBook,
    removeBook,
    setReadingStatus,
    setBookCountry,
    resetAll,
    totalCount,
  } = useBooks();

  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const totalValue =
    books.my.reduce((s, b) => s + (b.retailPrice ?? 0), 0) +
    books.read.reduce((s, b) => s + (b.retailPrice ?? 0), 0) +
    books.ebook.reduce((s, b) => s + (b.retailPrice ?? 0), 0);
  const allBooksForGift = [...books.my, ...books.read, ...books.ebook];
  const giftCount = allBooksForGift.filter((b) => b.source === "선물").length;

  const totalPages = allBooksForGift.reduce((s, b) => s + (b.pageCount ?? 0), 0);
  const heightCm = totalPages * 0.1 / 10;
  const receiptBooks = [...books.my, ...books.read];

  const handleAddBook = (
    group: "my" | "read" | "ebook",
    book: {
      title: string;
      author: string;
      publisher?: string;
      pubDate?: string;
      cover?: string;
      description?: string;
      isbn?: string;
      category?: string;
      retailPrice?: number;
      readStatus?: "읽음" | "미독";
    }
  ) => {
    addBook(group, book);
  };

  const handleDelete = (group: "my" | "read" | "ebook", id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      removeBook(group, id);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#11593F] font-bold">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F2F2F2] pb-24">
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      <main className="px-4 sm:px-6 py-5 sm:py-6 max-w-[480px] mx-auto pt-[env(safe-area-inset-top,0px)]">
        {activeTab === "home" && (
          <section className="space-y-6 animate-fadeIn">
            <HomeLibrarySearch books={books} />
            <StatsCard
              totalValue={totalValue}
              totalCount={totalCount}
              giftCount={giftCount}
            />
            <div className="rounded-2xl p-5 sm:p-6 bg-white shadow-card border border-accent/15">
              <h3 className="text-[16px] sm:text-[17px] font-bold text-[#11593F] mb-2">
                가쪽비 계산하기
              </h3>
              <p className="text-[14px] sm:text-[15px] text-gray-600">
                페이지와 가격으로 환산한 지식의 가치
              </p>
              <button
                type="button"
                onClick={() => setReceiptOpen(true)}
                className="mt-4 w-full py-3.5 min-h-[48px] rounded-xl bg-[#11593F] text-white font-bold text-[14px] hover:bg-[#0d4630] active:opacity-95 transition-opacity"
              >
                가쪽비 영수증 발급기
              </button>
            </div>
            <ExcelUpload
              onAddBook={handleAddBook}
              existingBooks={books}
            />
          </section>
        )}

        {activeTab === "category" && (
          <section className="animate-fadeIn">
            <CategoryScreen
              books={books}
              onDelete={handleDelete}
              onSetReadingStatus={(group, id, status) => setReadingStatus(group, id, status)}
              onSetBookCountry={setBookCountry}
              onUpdateBook={updateBook}
            />
          </section>
        )}

        {activeTab === "analysis" && (
          <section className="animate-fadeIn">
            <AnalysisScreen books={books} />
          </section>
        )}

        {activeTab === "gift" && <GiftScreen />}
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onFabClick={() => setAddBookOpen(true)}
      />

      <AddBookModal
        isOpen={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        onAddBook={handleAddBook}
        existingBooks={[...books.my, ...books.read, ...books.ebook]}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onReset={resetAll}
      />

      <ReceiptModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        books={receiptBooks}
      />
    </div>
  );
}
