"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { parseReview } from "@/lib/reviewUtils";

interface ReviewUnfoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  reviewText: string;
}

const SECTION_LABELS: { key: "purchase" | "make" | "review"; label: string }[] = [
  { key: "purchase", label: "구매버튼" },
  { key: "make", label: "만듦새" },
  { key: "review", label: "서평" },
];

export default function ReviewUnfoldModal({
  isOpen,
  onClose,
  bookTitle,
  reviewText,
}: ReviewUnfoldModalProps) {
  const [phase, setPhase] = useState<"folded" | "unfolding" | "open">("folded");
  const parts = parseReview(reviewText);
  const hasSections = !!(parts.purchase || parts.make || parts.review);

  useEffect(() => {
    if (isOpen) {
      setPhase("folded");
      const t = setTimeout(() => setPhase("unfolding"), 50);
      const t2 = setTimeout(() => setPhase("open"), 800);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[3600] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="리뷰 보기"
    >
      <div
        className="relative w-full max-w-[420px] max-h-[80vh] flex flex-col rounded-2xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg, #e8e4dc 0%, #ddd8d0 100%)",
          boxShadow:
            phase === "open"
              ? "inset 0 0 0 1px rgba(120,110,95,0.2), 0 12px 48px rgba(0,0,0,0.2)"
              : "0 8px 32px rgba(0,0,0,0.2)",
          transition: "transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1), box-shadow 0.4s ease",
          transform:
            phase === "folded"
              ? "scaleY(0.15) scaleX(0.7)"
              : "scaleY(1) scaleX(1)",
          transformOrigin: "center top",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#b8a898]/50">
          <h3 className="text-[14px] font-bold font-serif truncate pr-8" style={{ color: "#3A3128" }}>
            ✈️ {bookTitle}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/10 text-[#3A3128] absolute top-2 right-2"
            aria-label="닫기"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {!hasSections ? (
            <p
              className="text-[15px] font-handwriting leading-relaxed whitespace-pre-wrap break-words"
              style={{ color: "#3A3128" }}
            >
              {reviewText}
            </p>
          ) : (
            <div className="space-y-4">
              {SECTION_LABELS.map(({ key, label }) => {
                const value = parts[key as keyof typeof parts];
                if (!value) return null;
                return (
                  <div key={key}>
                    <p className="text-[11px] font-bold font-serif text-[#6a6155] mb-1">{label}</p>
                    <p
                      className="text-[15px] font-handwriting leading-relaxed whitespace-pre-wrap break-words"
                      style={{ color: "#3A3128" }}
                    >
                      {value}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
