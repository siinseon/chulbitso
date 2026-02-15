"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { parseReview, serializeReview, type BookReviewParts } from "@/lib/reviewUtils";

interface PaperAirplaneReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  initialReview?: string;
  onSave: (text: string) => void;
}

type Phase = "writing" | "flying" | "done";

const FLY_TOTAL_MS = 3000;

const LABELS: { key: keyof BookReviewParts; label: string; placeholder: string }[] = [
  { key: "purchase", label: "구매버튼", placeholder: "왜 구매하게 되었는지 적어주세요" },
  { key: "make", label: "만듦새", placeholder: "표지, 무게, 물성 등" },
  { key: "review", label: "서평", placeholder: "책에 대한 리뷰를 적어주세요" },
];

export default function PaperAirplaneReviewModal({
  isOpen,
  onClose,
  bookTitle,
  initialReview = "",
  onSave,
}: PaperAirplaneReviewModalProps) {
  const [parts, setParts] = useState<BookReviewParts>(() => parseReview(initialReview));
  const [phase, setPhase] = useState<Phase>("writing");
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setParts(parseReview(initialReview));
      setPhase("writing");
    }
  }, [isOpen, initialReview]);

  const hasAny = !!(parts.purchase.trim() || parts.make.trim() || parts.review.trim());

  const handleFly = useCallback(() => {
    if (!hasAny) return;
    setPhase("flying");
  }, [hasAny]);

  useEffect(() => {
    if (phase !== "flying") return;
    const id = setTimeout(() => {
      setPhase("done");
      onSave(serializeReview(parts));
      onClose();
    }, FLY_TOTAL_MS);
    return () => clearTimeout(id);
  }, [phase, parts, onSave, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY == null || phase !== "writing") return;
    const endY = e.changedTouches[0].clientY;
    if (touchStartY - endY > 80) handleFly();
    setTouchStartY(null);
  };

  if (!isOpen) return null;

  const isAnimating = phase === "flying";

  return (
    <div
      className="fixed inset-0 z-[3500] flex items-center justify-center bg-black/40 p-4"
      onClick={phase === "writing" ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="책 리뷰 종이비행기"
    >
      {/* 종이비행기 아이콘 — overflow 바깥에 두어 잘리지 않게 (전체 화면 기준) */}
      {phase === "flying" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[3502]">
          <div className="animate-paper-plane-fly">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f5f2eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
              aria-hidden
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative w-full max-w-[420px] max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.2)]"
        style={{
          background: "linear-gradient(180deg, #e8e4dc 0%, #ddd8d0 50%, #d2cdc4 100%)",
          boxShadow: "inset 0 0 0 1px rgba(120,110,95,0.2), 0 12px 48px rgba(0,0,0,0.2)",
        }}
      >
        {phase === "writing" && (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#b8a898]/50">
              <h3 className="text-[15px] font-bold font-serif" style={{ color: "#3A3128" }}>
                ✈️ 종이비행기 리뷰
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/10 text-[#3A3128]"
                aria-label="닫기"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>
            <p className="px-4 pt-2 pb-1 text-[12px] font-serif text-[#6a6155] truncate">
              {bookTitle}
            </p>
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col p-4 gap-4">
              {LABELS.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-[12px] font-bold font-serif text-[#5a5248] mb-1.5">
                    {label}
                  </label>
                  <textarea
                    value={parts[key]}
                    onChange={(e) => setParts((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full min-h-[72px] resize-none rounded-xl p-3 text-[14px] leading-relaxed font-handwriting border border-[#b8a898]/60 bg-[#f5f2eb]/80 placeholder:text-[#9a8f82] focus:outline-none focus:ring-2 focus:ring-primary/30"
                    style={{ color: "#3A3128" }}
                    aria-label={label}
                  />
                </div>
              ))}
              <p className="text-[11px] text-[#8a7f72] font-serif text-center">
                위로 스와이프해도 날려요
              </p>
              <button
                type="button"
                onClick={handleFly}
                disabled={!hasAny}
                className="mt-4 w-full py-3.5 rounded-xl font-bold text-[15px] font-serif disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-95 active:opacity-90"
                style={{
                  background: "linear-gradient(180deg, #6a7c5a 0%, #5a6c4a 100%)",
                  color: "#f5f2eb",
                  boxShadow: "0 2px 8px rgba(58,49,40,0.2)",
                }}
              >
                ✈️ 날리기 (저장)
              </button>
            </div>
          </>
        )}

        {phase === "flying" && (
          <>
            {/* 리뷰 카드 접히며 날아감 (배경) */}
            <div
              className="absolute inset-4 flex flex-col rounded-xl overflow-hidden pointer-events-none animate-paper-fold-and-fly opacity-60"
              style={{
                background: "linear-gradient(180deg, #e8e4dc 0%, #ddd8d0 100%)",
                boxShadow: "inset 0 0 0 1px rgba(120,110,95,0.25), 0 8px 24px rgba(0,0,0,0.15)",
                transformOrigin: "center bottom",
              }}
            >
              <div className="p-4 flex-1 overflow-hidden">
                <p className="text-[11px] text-[#8a7f72] font-serif mb-1 truncate">{bookTitle}</p>
                <p
                  className="text-[14px] font-handwriting leading-relaxed whitespace-pre-wrap break-words line-clamp-6"
                  style={{ color: "#3A3128" }}
                >
                  {[parts.purchase, parts.make, parts.review].filter(Boolean).join("\n\n") || "(빈 종이)"}
                </p>
              </div>
            </div>
            <p className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-4 text-[#3A3128]/40 text-[14px] font-serif pointer-events-none z-20 animate-pulse">
              슈우웅—
            </p>
          </>
        )}
      </div>
    </div>
  );
}
