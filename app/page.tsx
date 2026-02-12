"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useBooks } from "@/lib/useBooks";
import Header from "@/components/Header";
import BottomNav, { type NavTab } from "@/components/BottomNav";
import StatsCard from "@/components/StatsCard";
import ReadingJungleGym from "@/components/ReadingJungleGym";
import PomodoroSpinnerSection from "@/components/PomodoroSpinnerSection";
import HomeLibrarySearch from "@/components/HomeLibrarySearch";
import CategoryScreen from "@/components/CategoryScreen";
import AnalysisScreen from "@/components/AnalysisScreen";
import AddBookModal from "@/components/AddBookModal";
import ExcelUpload from "@/components/ExcelUpload";
import SettingsModal from "@/components/SettingsModal";
import ReceiptModal from "@/components/ReceiptModal";
import GiftScreen from "@/components/GiftScreen";

const DestinySlideModal = dynamic(
  () => import("@/components/DestinySlideModal"),
  { ssr: false }
);

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
  const [destinyOpen, setDestinyOpen] = useState(false);

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
        <p className="text-primary font-bold font-serif">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-vintage-bg pb-24">
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
            <PomodoroSpinnerSection />
            <div className="mt-8">
              <ReadingJungleGym />
            </div>
            {/* 운명의 미끄럼틀: 독서습관 정글짐 밑 */}
            <div
              className="rounded-2xl p-5 sm:p-6 shadow-card border border-secondary cursor-pointer active:opacity-95 transition-opacity"
              style={{ background: "linear-gradient(180deg, #f8f6f2 0%, #f0ebe0 100%)" }}
              onClick={() => setDestinyOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && setDestinyOpen(true)}
              role="button"
              tabIndex={0}
            >
              <h3 className="text-[16px] sm:text-[17px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
                🎢 운명의 미끄럼틀
              </h3>
              <p className="text-[14px] text-text-muted">
                읽을 책을 무작위로 골라줘요. 미끄럼틀을 타고 내려온 책이 오늘의 운명이에요.
              </p>
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
            <AnalysisScreen
              books={books}
              onOpenReceipt={() => setReceiptOpen(true)}
              onReadBook={() => setActiveTab("category")}
            />
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

      <DestinySlideModal
        isOpen={destinyOpen}
        onClose={() => setDestinyOpen(false)}
        books={books}
        onReadNow={() => {
          setDestinyOpen(false);
          setActiveTab("category");
        }}
      />
    </div>
  );
}
