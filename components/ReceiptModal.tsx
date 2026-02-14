"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Download, ChevronRight, CheckSquare, Square, Search } from "lucide-react";
import html2canvas from "html2canvas";
import type { Book } from "@/lib/useBooks";

/** 영수증에 넣을 수 있는 도서 (내 도서만) */
export type ReceiptBookEntry = {
  id: string;
  title: string;
  author?: string;
  retailPrice?: number;
  pageCount?: number;
};

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
}

function getWittyComment(avgPerPage: number | null): string {
  if (avgPerPage === null || avgPerPage <= 0)
    return "책 정보(정가·쪽수)를 입력하면 영수증이 나옵니다.";
  if (avgPerPage < 30)
    return "완전 혜자! 작가님 뼈를 갈아 마셨네요.";
  if (avgPerPage < 50)
    return "합리적인 지식 쇼핑이었습니다.";
  return "비싼 만큼 값어치를 하는 문장이었기를...";
}

function FakeBarcode() {
  const bars = useMemo(() => Array.from({ length: 40 }, () => Math.random() > 0.45), []);
  return (
    <div className="flex justify-center gap-0.5 py-2" aria-hidden>
      {bars.map((w, i) => (
        <div
          key={i}
          className={`h-10 ${w ? "w-1 bg-black" : "w-0.5 bg-transparent"}`}
        />
      ))}
    </div>
  );
}

function bookToEntry(b: Book): ReceiptBookEntry {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    retailPrice: b.retailPrice,
    pageCount: b.pageCount,
  };
}

export default function ReceiptModal({
  isOpen,
  onClose,
  books,
}: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"select" | "receipt">("select");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const availableBooks = useMemo<ReceiptBookEntry[]>(
    () => books.map(bookToEntry),
    [books]
  );

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return availableBooks;
    return availableBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.author && b.author.toLowerCase().includes(q))
    );
  }, [availableBooks, searchQuery]);

  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setSelectedIds(new Set());
      setSearchQuery("");
    }
  }, [isOpen, books.length]);

  const selectedBooks = useMemo(
    () => availableBooks.filter((b) => selectedIds.has(b.id)),
    [availableBooks, selectedIds]
  );

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(availableBooks.map((b) => b.id)));
  const selectNone = () => setSelectedIds(new Set());

  const { items, totalPages, totalPrice, avgPerPage, hasData } = useMemo(() => {
    const list = selectedBooks.filter(
      (b) => (b.retailPrice ?? 0) > 0 || (b.pageCount ?? 0) > 0
    );
    const totalP = list.reduce((s, b) => s + (b.pageCount ?? 0), 0);
    const totalPx = list.reduce((s, b) => s + (b.retailPrice ?? 0), 0);
    const avg =
      totalP > 0 && totalPx > 0 ? Math.floor(totalPx / totalP) : null;
    const items = list.map((b) => {
      const price = b.retailPrice ?? 0;
      const pages = b.pageCount ?? 0;
      const measurable = price > 0 && pages > 0;
      const pricePerPage = measurable ? Math.floor(price / pages) : null;
      return {
        id: b.id,
        title: b.title,
        price,
        pages,
        pricePerPage,
        measurable,
      };
    });
    return {
      items,
      totalPages: totalP,
      totalPrice: totalPx,
      avgPerPage: avg,
      hasData: items.length > 0,
    };
  }, [selectedBooks]);

  const witty = getWittyComment(avgPerPage);

  const handleSaveImage = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `chulbitso-receipt-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
      alert("이미지 저장에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
    >
      <div
        className="w-full max-w-[400px] max-h-[90dvh] sm:max-h-[90vh] flex flex-col bg-[#F2F2F2] rounded-t-2xl sm:rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 bg-white border-b border-secondary/30 min-h-[52px]">
          <h2 id="receipt-modal-title" className="text-[16px] font-bold text-primary">
            {step === "select" ? "영수증에 넣을 도서 선택" : "가성비 독서 영수증"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -m-1 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-secondary/20 active:bg-secondary/30 text-text-muted"
            aria-label="닫기"
          >
            <X size={24} />
          </button>
        </div>

        {step === "select" && (
          <>
            <div className="px-4 py-2 border-b border-secondary/30 bg-white">
              <p className="text-[12px] font-bold text-text-muted mb-2">내 도서에서 검색</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="제목 또는 저자로 검색"
                  className="flex-1 px-3 py-2 rounded-lg border border-secondary text-[14px] outline-none focus:border-primary"
                />
                <span className="flex items-center px-3 py-2 text-text-muted" aria-hidden>
                  <Search size={18} />
                </span>
              </div>
            </div>
            <div className="px-4 py-2 flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-[12px] font-bold text-primary"
              >
                전체 선택
              </button>
              <button
                type="button"
                onClick={selectNone}
                className="text-[12px] font-bold text-text-muted"
              >
                선택 해제
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 max-h-[45dvh] sm:max-h-[40vh]">
              {availableBooks.length === 0 ? (
                <p className="text-[13px] text-text-muted py-6 text-center">
                  담긴 도서가 없습니다.
                </p>
              ) : filteredBooks.length === 0 ? (
                <p className="text-[13px] text-text-muted py-6 text-center">
                  검색 결과가 없어요. 다른 단어로 검색해 보세요.
                </p>
              ) : (
                <ul className="space-y-2">
                  {filteredBooks.map((b) => {
                    const price = b.retailPrice ?? 0;
                    const pages = b.pageCount ?? 0;
                    const measurable = price > 0 && pages > 0;
                    const pricePerPage = measurable ? Math.floor(price / pages) : null;
                    const checked = selectedIds.has(b.id);
                    return (
                      <li key={b.id}>
                        <button
                          type="button"
                          onClick={() => toggle(b.id)}
                          className="w-full flex items-center gap-3 p-3 min-h-[52px] rounded-xl bg-white shadow-card text-left hover:bg-secondary/10 active:bg-secondary/10"
                        >
                          {checked ? (
                            <CheckSquare size={22} className="text-primary flex-shrink-0" />
                          ) : (
                            <Square size={22} className="text-secondary flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-bold text-text-main truncate">
                              {b.title}
                            </p>
                            <p className="text-[12px] text-text-muted">
                              {measurable
                                ? `₩${price.toLocaleString()} / ${pages}쪽 → ${pricePerPage}원/p`
                                : "측정불가 (정가·쪽수 입력 시 표시)"}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="p-4 bg-white border-t border-secondary/30">
              <button
                type="button"
                onClick={() => setStep("receipt")}
                disabled={selectedIds.size === 0}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-[14px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                영수증 보기 ({selectedIds.size}권)
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}

        {step === "receipt" && (
          <>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center receipt-modal-paper w-full max-w-[350px] mx-auto">
                <div
                  className="w-full h-2 receipt-zigzag-top"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff 50%, transparent 50%), linear-gradient(225deg, #fff 50%, transparent 50%)",
                    backgroundSize: "12px 8px",
                    backgroundPosition: "0 0, 6px 0",
                  }}
                  aria-hidden
                />

                <div
                  ref={receiptRef}
                  className="w-full max-w-full bg-white font-mono text-[11px] text-text-main px-4 py-3 receipt-content box-border"
                >
                  <div className="text-center border-b border-dashed border-secondary pb-2 mb-2">
                    <p className="font-bold text-[13px] tracking-widest">
                      CU (Chulbitso Universe)
                    </p>
                    <p className="font-bold text-[12px]">문학점</p>
                    <p className="text-[9px] text-text-muted mt-1">
                      가성비 독서 영수증 (정가 ÷ 쪽수 = 원/p)
                    </p>
                  </div>

                  <div className="border-b border-dashed border-secondary pb-2 mb-2">
                    {!hasData ? (
                      <p className="text-text-muted py-2">선택한 도서 중 측정 가능한 항목 없음</p>
                    ) : (
                      items.map((item, i) => (
                        <div key={item.id} className="flex items-baseline gap-1 py-0.5">
                          <span
                            className="max-w-[55%]"
                            style={{ wordBreak: "keep-all", whiteSpace: "pre-wrap" }}
                          >
                            {item.title}
                          </span>
                          <span className="flex-1 min-w-2 border-b border-dotted border-secondary self-end mb-0.5" />
                          <span className="flex-shrink-0">
                            {item.measurable
                              ? `${item.pricePerPage}원/p`
                              : "측정불가"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {hasData && (
                    <div className="border-b border-dashed border-secondary pb-2 mb-2 text-[10px]">
                      <div className="flex justify-between">
                        <span>총 페이지 수</span>
                        <span>{totalPages.toLocaleString()}쪽</span>
                      </div>
                      <div className="flex justify-between">
                        <span>총 정가</span>
                        <span>₩{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>가성비 지수</span>
                        <span>{avgPerPage}원/p</span>
                      </div>
                    </div>
                  )}

                  <p className="text-center text-[10px] text-text-muted py-2 italic">
                    {witty}
                  </p>

                  <FakeBarcode />
                </div>

<div
                className="w-full h-2 receipt-zigzag-bottom"
                  style={{
                    background:
                      "linear-gradient(315deg, #fff 50%, transparent 50%), linear-gradient(45deg, #fff 50%, transparent 50%)",
                    backgroundSize: "12px 8px",
                    backgroundPosition: "0 0, 6px 0",
                  }}
                  aria-hidden
                />
              </div>
            </div>

            <div className="p-4 flex gap-2 bg-white border-t border-secondary/30">
              <button
                type="button"
                onClick={() => setStep("select")}
                className="flex-1 py-3 rounded-xl bg-secondary/30 text-text-main font-bold text-[14px]"
              >
                다시 선택
              </button>
              <button
                type="button"
                onClick={handleSaveImage}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-[14px] flex items-center justify-center gap-2"
              >
                <Download size={18} />
                이미지 저장
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
