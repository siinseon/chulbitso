"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { PaperReview } from "@/lib/paperReviews";

interface PaperReviewViewModalProps {
  review: PaperReview | null;
  onClose: () => void;
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function PaperReviewViewModal({ review, onClose }: PaperReviewViewModalProps) {
  const [unfold, setUnfold] = useState(false);

  useEffect(() => {
    if (review) setUnfold(false);
    const t = setTimeout(() => setUnfold(true), 50);
    return () => clearTimeout(t);
  }, [review]);

  useEffect(() => {
    if (!review) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [review, onClose]);

  if (!review) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[3100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="종이비행기 리뷰"
    >
      <div
        className={`w-full max-w-[360px] rounded-xl overflow-hidden lined-paper shadow-2xl border border-amber-300/80 ${
          unfold ? "paper-unfold-active" : "paper-unfold-initial"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 20px 50px rgba(58,49,40,0.25)",
        }}
      >
        <div className="p-4 pb-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-[14px] font-mono font-bold text-primary flex-1">
              {review.bookTitle}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-amber-200/60 text-text-main"
              aria-label="닫기"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
          <p className="text-[12px] text-amber-800/70 mb-3">{formatDate(review.createdAt)}</p>
          <p className="text-[14px] font-handwriting text-text-main whitespace-pre-wrap min-h-[80px]">
            {review.content}
          </p>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
