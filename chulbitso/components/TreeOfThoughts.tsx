"use client";

import { useState } from "react";
import type { PaperReview } from "@/lib/paperReviews";
import PaperReviewViewModal from "./PaperReviewViewModal";

interface TreeOfThoughtsProps {
  reviews: PaperReview[];
}

/** 하얀 종이비행기 아이콘 (SVG) */
function PaperPlaneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7L22 2z" />
    </svg>
  );
}

export default function TreeOfThoughts({ reviews }: TreeOfThoughtsProps) {
  const [selected, setSelected] = useState<PaperReview | null>(null);

  return (
    <>
      <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border relative overflow-hidden min-h-[200px]">
        <h3 className="text-[15px] font-bold text-primary mb-2 flex items-center gap-2">
          🌳 생각의 나무
        </h3>
        <p className="text-[12px] text-muted mb-4">
          {reviews.length === 0
            ? "책 상세에서 리뷰를 쓰고 [ 날리기 ]를 누르면 여기 나무에 걸려요."
            : "날린 리뷰가 나무에 걸려 있어요. 비행기를 눌러 펼쳐보세요."}
        </p>

        {/* 나무 일러스트: 줄기 + 가지 + 비행기들 */}
        <div className="relative w-full h-[180px] flex justify-center">
          <svg
            viewBox="0 0 200 180"
            className="w-full max-w-[280px] h-full text-primary/90"
            aria-hidden
          >
            <defs>
              <linearGradient id="tree-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5C4033" />
                <stop offset="100%" stopColor="#3A2820" />
              </linearGradient>
              <linearGradient id="tree-branch" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6B5344" />
                <stop offset="100%" stopColor="#4A3520" />
              </linearGradient>
            </defs>
            {/* 줄기 */}
            <path
              d="M 95 180 L 105 180 L 102 40 Q 100 20 100 0"
              fill="url(#tree-trunk)"
              stroke="#3A2820"
              strokeWidth="1"
            />
            {/* 가지: 왼쪽 위 */}
            <path
              d="M 100 50 Q 50 45 25 30"
              fill="none"
              stroke="url(#tree-branch)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 100 85 Q 55 80 30 65"
              fill="none"
              stroke="url(#tree-branch)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 100 120 Q 60 118 35 105"
              fill="none"
              stroke="url(#tree-branch)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* 가지: 오른쪽 위 */}
            <path
              d="M 100 45 Q 150 42 175 28"
              fill="none"
              stroke="url(#tree-branch)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 100 80 Q 145 78 170 62"
              fill="none"
              stroke="url(#tree-branch)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 100 115 Q 142 114 168 100"
              fill="none"
              stroke="url(#tree-branch)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>

          {/* 비행기 위치: 가지 끝에 매달림 (절대 위치) */}
          {reviews.slice(0, 8).map((r, i) => {
            const positions = [
              { left: "18%", top: "22%", rot: -25 },
              { left: "22%", top: "42%", rot: -15 },
              { left: "25%", top: "62%", rot: -10 },
              { left: "72%", top: "20%", rot: 25 },
              { left: "68%", top: "38%", rot: 18 },
              { left: "70%", top: "58%", rot: 12 },
              { left: "48%", top: "15%", rot: 0 },
              { left: "50%", top: "35%", rot: 5 },
            ];
            const pos = positions[i % positions.length];
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r)}
                className="absolute w-8 h-8 flex items-center justify-center text-white drop-shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                style={{
                  left: pos.left,
                  top: pos.top,
                  transform: `rotate(${pos.rot}deg)`,
                }}
                title={r.bookTitle}
              >
                <PaperPlaneIcon className="w-6 h-6" />
              </button>
            );
          })}
        </div>
      </section>

      <PaperReviewViewModal review={selected} onClose={() => setSelected(null)} />
    </>
  );
}
