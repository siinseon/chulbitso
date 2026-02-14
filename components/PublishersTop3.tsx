"use client";

import { useMemo, useState } from "react";
import type { Book } from "@/lib/useBooks";

interface PublishersTop3Props {
  books: Book[];
}

interface PublisherCount {
  name: string;
  count: number;
}

export default function PublishersTop3({ books }: PublishersTop3Props) {
  const top3 = useMemo(() => {
    const map = new Map<string, number>();
    books.forEach((b) => {
      const p = (b.publisher || "").trim();
      if (p) map.set(p, (map.get(p) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3) as PublisherCount[];
  }, [books]);

  const [hovered, setHovered] = useState<number | null>(null);

  if (top3.length === 0) {
    return (
      <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
        <h3 className="text-[15px] font-bold text-primary mb-4 flex items-center gap-2">
          🏰 취향의 모래성
        </h3>
        <p className="text-[13px] text-muted">출판사 정보가 있는 도서가 없어요.</p>
      </section>
    );
  }

  const sizes = [
    { w: "w-24", h: "h-28", flagH: "h-8", text: "text-[11px]" },
    { w: "w-16", h: "h-20", flagH: "h-6", text: "text-[10px]" },
    { w: "w-14", h: "h-16", flagH: "h-5", text: "text-[9px]" },
  ];

  return (
    <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
      <h3 className="text-[15px] font-bold text-primary mb-4 flex items-center gap-2">
        🏰 취향의 모래성
      </h3>
      <p className="text-[12px] text-muted mb-4">가장 많이 읽은 출판사 Top 3</p>

      <div className="flex items-end justify-center gap-2 sm:gap-4 min-h-[180px] pb-2">
        {top3.map((p, i) => {
          const style = sizes[i] ?? sizes[2];
          const isHover = hovered === i;
          return (
            <div
              key={p.name}
              className="flex flex-col items-center"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* 아이스크림 막대기 깃발 + 출판사 이름 */}
              <div
                className={`${style.flagH} flex flex-col items-center justify-end mb-0.5 transition-transform`}
              >
                <div
                  className={`${style.text} font-handwriting font-bold text-primary px-1.5 py-0.5 bg-amber-100/90 border border-amber-300/80 rounded-sm shadow-sm max-w-[80px] truncate text-center`}
                  title={p.name}
                >
                  {p.name}
                </div>
                <div className="w-0.5 h-3 bg-amber-700/70 rounded-b" />
              </div>

              {/* 모래성 / 모래무덤 */}
              <div
                className={`${style.w} ${style.h} relative rounded-b-lg transition-all duration-200 sandcastle-block ${
                  isHover ? "sandcastle-drip" : ""
                }`}
                style={{
                  background: "linear-gradient(180deg, #E8D5B5 0%, #D4C4A0 50%, #C4B090 100%)",
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(58,49,40,0.15)",
                  border: "1px solid rgba(184,160,120,0.6)",
                  borderBottom: "none",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                {i === 0 && (
                  <>
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-3 rounded-full bg-amber-200/80 border border-amber-400/60"
                      style={{ top: "-6px" }}
                    />
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-300/90 border border-amber-500/50"
                      style={{ top: "8px" }}
                    />
                  </>
                )}
                <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-amber-900/60 font-mono">
                  {p.count}권
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
