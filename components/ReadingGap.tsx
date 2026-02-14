"use client";

import { useMemo, useState } from "react";
import type { Book } from "@/lib/useBooks";

interface ReadingGapProps {
  books: Book[];
}

interface BookGap {
  book: Book;
  gapDays: number;
  variant: "silver" | "rust" | "moss";
}

function parseDate(s: string | undefined): number | null {
  if (!s?.trim()) return null;
  const d = new Date(s.trim());
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

export default function ReadingGap({ books }: ReadingGapProps) {
  const items = useMemo(() => {
    const result: BookGap[] = [];
    const all = [...books];
    all.forEach((book) => {
      const start = book.readDates?.[0]?.start;
      const end = book.readDates?.[0]?.end;
      if (!end) return;
      const endMs = parseDate(end);
      const startMs = parseDate(start || book.pubDate);
      if (endMs == null) return;
      const refMs = startMs ?? endMs;
      const gapDays = Math.round((endMs - refMs) / (24 * 60 * 60 * 1000));
      const gap = Math.max(0, gapDays);
      let variant: "silver" | "rust" | "moss" = "silver";
      if (gap >= 365 * 3) variant = "moss";
      else if (gap >= 365) variant = "rust";
      result.push({ book, gapDays: gap, variant });
    });
    return result.sort((a, b) => b.gapDays - a.gapDays).slice(0, 12);
  }, [books]);

  const [tooltip, setTooltip] = useState<{ title: string; days: number } | null>(null);

  if (items.length === 0) {
    return (
      <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
        <h3 className="text-[15px] font-bold text-primary mb-4 flex items-center gap-2">
          ⏳ 기다림의 타임캡슐
        </h3>
        <p className="text-[13px] text-muted">완독 기록이 있는 도서가 없어요.</p>
      </section>
    );
  }

  const capsuleStyle = (v: BookGap["variant"]) => {
    switch (v) {
      case "silver":
        return {
          background: "linear-gradient(145deg, #E8E8E8 0%, #C0C0C0 50%, #A0A0A0 100%)",
          boxShadow: "inset 0 2px 8px rgba(255,255,255,0.6), 0 4px 12px rgba(0,0,0,0.15)",
          border: "2px solid #909090",
        };
      case "rust":
        return {
          background: "linear-gradient(145deg, #B87333 0%, #8B4513 50%, #654321 100%)",
          boxShadow: "inset 0 2px 4px rgba(255,200,150,0.2), 0 4px 12px rgba(58,49,40,0.25)",
          border: "2px solid #5C4033",
        };
      case "moss":
        return {
          background: "linear-gradient(145deg, #6B8E6B 0%, #4A6B4A 40%, #3d5a3d 100%)",
          boxShadow: "inset 0 2px 4px rgba(180,220,180,0.2), 0 4px 12px rgba(58,49,40,0.2)",
          border: "2px solid #2d4a2d",
        };
    }
  };

  return (
    <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
      <h3 className="text-[15px] font-bold text-primary mb-4 flex items-center gap-2">
        ⏳ 기다림의 타임캡슐
      </h3>
      <p className="text-[12px] text-muted mb-4">
        읽기 시작부터 완독까지의 시간(숙성도)
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        {items.map((item) => (
          <button
            key={item.book.id}
            type="button"
            className="relative w-12 h-14 rounded-lg transition-transform hover:scale-110 active:scale-95"
            style={capsuleStyle(item.variant)}
            onClick={() =>
              setTooltip(
                tooltip?.title === item.book.title
                  ? null
                  : { title: item.book.title, days: item.gapDays }
              )
            }
            title={`${item.book.title} · ${item.gapDays}일`}
          >
            {item.variant === "silver" && (
              <div className="absolute inset-0 rounded-lg overflow-hidden opacity-60">
                <div
                  className="absolute w-full h-1/2 top-0 left-0 bg-gradient-to-b from-white/50 to-transparent"
                  style={{ borderRadius: "inherit" }}
                />
              </div>
            )}
            {item.variant === "moss" && (
              <div
                className="absolute inset-0 rounded-lg opacity-40 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 30%, rgba(100,140,80,0.9) 1px, transparent 1px),
                    radial-gradient(circle at 70% 60%, rgba(80,120,60,0.8) 1px, transparent 1px)`,
                  backgroundSize: "6px 6px",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {tooltip && (
        <div
          className="mt-4 p-4 rounded-xl bg-amber-50/90 border border-amber-200/80 text-center"
          role="status"
        >
          <p className="text-[13px] font-handwriting text-text-main">
            &ldquo;{tooltip.title}&rdquo;
          </p>
          <p className="text-[14px] font-bold text-primary mt-1">
            이 책은 {tooltip.days}일 동안 기다렸어요
          </p>
        </div>
      )}
    </section>
  );
}
