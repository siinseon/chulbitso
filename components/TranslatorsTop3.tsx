"use client";

import { useMemo, useState } from "react";
import type { Book } from "@/lib/useBooks";

interface TranslatorsTop3Props {
  books: Book[];
}

interface TranslatorCount {
  name: string;
  count: number;
}

export default function TranslatorsTop3({ books }: TranslatorsTop3Props) {
  const top3 = useMemo(() => {
    const map = new Map<string, number>();
    books.forEach((b) => {
      const t = (b.translator || "").trim();
      if (t) map.set(t, (map.get(t) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3) as TranslatorCount[];
  }, [books]);

  const [hovered, setHovered] = useState<number | null>(null);

  if (top3.length === 0) {
    return (
      <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
        <h3 className="text-[15px] font-bold text-primary mb-4 flex items-center gap-2">
          📣 언어의 울림통
        </h3>
        <p className="text-[13px] text-muted">번역가 정보가 있는 도서가 없어요.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border">
      <h3 className="text-[15px] font-bold text-primary mb-4 flex items-center gap-2">
        📣 언어의 울림통
      </h3>
      <p className="text-[12px] text-muted mb-4">가장 많이 읽은 번역가 Top 3</p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
        {top3.map((t, i) => {
          const isHover = hovered === i;
          return (
            <div
              key={t.name}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* 말풍선: 호버 시 퐁 */}
              {isHover && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white border-2 border-primary/40 rounded-xl shadow-lg z-10 animate-bubble"
                  style={{
                    filter: "drop-shadow(0 2px 6px rgba(58,49,40,0.15))",
                  }}
                >
                  <p className="text-[13px] font-handwriting font-bold text-primary text-center max-w-[120px]">
                    {t.name}
                  </p>
                  <p className="text-[10px] text-muted text-center mt-0.5">{t.count}권</p>
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
                    style={{ filter: "drop-shadow(0 1px 0 rgba(74,94,66,0.3))" }}
                  />
                </div>
              )}

              {/* 울림통 파이프 (놀이터 소리 전달 파이프) */}
              <div
                className="relative w-14 h-20 flex flex-col items-center"
                style={{
                  background: "linear-gradient(180deg, #8B7355 0%, #6B5344 30%, #5C4033 100%)",
                  borderRadius: "8px 8px 4px 4px",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 8px rgba(58,49,40,0.2)",
                  border: "2px solid #4A3520",
                }}
              >
                {/* 입구 (원형) */}
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(145deg, #5C4033, #3A2820)",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(58,49,40,0.3)",
                    border: "2px solid #2A1A10",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      background: "radial-gradient(circle at 30% 30%, #2A1A10, #0a0806)",
                    }}
                  />
                </div>
                {/* 파이프 본체 */}
                <div className="flex-1 w-full min-h-[48px]" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
