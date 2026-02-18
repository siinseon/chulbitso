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
import DestinyGashapon from "@/components/DestinyGashapon";
import BuyOrNotHorse from "@/components/BuyOrNotHorse";
import SettingsModal from "@/components/SettingsModal";
import ReceiptModal from "@/components/ReceiptModal";
import GiftScreen from "@/components/GiftScreen";

const DestinyGashaponModal = dynamic(
  () => import("@/components/DestinyGashaponModal"),
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
            {/* 운명의 캡슐 뽑기 기계 */}
            <DestinyGashapon onClick={() => setDestinyOpen(true)} />
            {/* 살까말까 스프링 목마 */}
            <div
              className="rounded-2xl p-5 sm:p-6 border"
              style={{
                background: "linear-gradient(180deg, #e8ddc8 0%, #ddd4bc 100%)",
                borderColor: "rgba(100, 95, 85, 0.35)",
                boxShadow: "0 4px 20px rgba(58, 49, 40, 0.18), inset 0 0 60px rgba(180, 165, 140, 0.08)",
              }}
            >
              <h3 className="text-[15px] sm:text-[16px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
                🐴 살까말까 스프링 목마
              </h3>
              <p className="text-[12px] text-text-muted font-serif mb-4">
                책 살지 말지 고민될 때, 목마를 눌러서 결정해요.
              </p>
              <BuyOrNotHorse />
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
          <section className="animate-fadeIn overflow-x-hidden min-w-0">
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
        books={books}
        onUpdateBook={updateBook}
      />

      <ReceiptModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        books={receiptBooks}
      />

      <DestinyGashaponModal
        isOpen={destinyOpen}
        onClose={() => setDestinyOpen(false)}
        books={books}
        onReadNow={(book) => {
          setDestinyOpen(false);
          setActiveTab("category");
        }}
      />
    </div>
  );
}
