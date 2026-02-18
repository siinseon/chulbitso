"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Book } from "@/lib/useBooks";

interface PublishersTop3Props {
  books: Book[];
}

interface PublisherCount {
  name: string;
  count: number;
}

/** 운동회 시상대 — 가장 많이 읽은 출판사 TOP 3. 낡은 나무 3단 시상대 + 깃발. */
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

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  if (top3.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border"
      >
        <h3 className="text-[15px] font-bold text-primary mb-4 flex items-center gap-2">
          🏅 운동회 시상대
        </h3>
        <p className="text-[13px] text-muted">출판사 정보가 있는 도서가 없어요.</p>
      </section>
    );
  }

  // 시상대 순서: 왼쪽 2등, 가운데 1등, 오른쪽 3등 → top3 인덱스 [1, 0, 2], place [2, 1, 3]
  const order: [number, number, number] = [1, 0, 2];
  const places: (1 | 2 | 3)[] = [2, 1, 3];
  const podiumData = order.map((idx, i) => ({ ...top3[idx], place: places[i] }));

  return (
    <section
      ref={sectionRef}
      className="relative rounded-2xl overflow-hidden border border-ivory-border shadow-card"
    >
      {/* 배경: 운동장 모래 + 하늘 */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, #87CEEB 0%, #B8D4E3 35%, #E8DCC8 70%, #D4C4A0 100%)",
          boxShadow: "inset 0 0 80px rgba(255,255,255,0.15)",
        }}
      />
      <div className="relative p-5 pb-6">
        <h3 className="text-[15px] font-bold text-primary mb-1 flex items-center gap-2">
          🏅 운동회 시상대
        </h3>
        <p className="text-[12px] text-primary/80 mb-5">가장 많이 읽은 출판사 Top 3</p>

        {/* 3단 시상대 컨테이너 */}
        <div className="flex items-end justify-center gap-0 min-h-[200px]">
          {podiumData.map((p, i) => {
            const isFirst = p.place === 1;
            const heights = [72, 120, 88]; // 2등, 1등, 3등 px
            const widths = [88, 120, 88];
            return (
              <motion.div
                key={p.name}
                className="flex flex-col items-center flex-1 max-w-[140px]"
                initial={{ opacity: 0, y: 80 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* 깃발(Pennant) — 위에서 툭 떨어져 꽂힘 */}
                <motion.div
                  className="flex flex-col items-center justify-end mb-0.5"
                  initial={{ opacity: 0, y: -40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.35,
                    delay: 0.4 + i * 0.1,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <div
                    className={`font-bold text-primary text-center truncate max-w-full px-1.5 py-1 rounded-sm border-2 shadow-md ${
                      isFirst
                        ? "text-[12px] bg-amber-100 border-amber-400/90 text-amber-900"
                        : "text-[10px] bg-white/95 border-amber-200/80 text-stone-700"
                    }`}
                    style={{
                      boxShadow: isFirst
                        ? "0 2px 8px rgba(180,140,60,0.4), inset 0 1px 0 rgba(255,255,255,0.8)"
                        : "0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}
                    title={p.name}
                  >
                    {p.name}
                  </div>
                  <div
                    className={`rounded-b ${isFirst ? "w-1 h-4 bg-amber-600/80" : "w-0.5 h-3 bg-amber-700/60"}`}
                  />
                </motion.div>

                {/* 단상 블록 — 낡은 나무, 스텐실 숫자 */}
                <motion.div
                  className="relative rounded-t-lg flex flex-col items-center justify-end overflow-hidden"
                  style={{
                    width: widths[i],
                    height: heights[i],
                    background: isFirst
                      ? "linear-gradient(180deg, #E8C84A 0%, #D4A83A 30%, #B88820 70%, #9A7218 100%)"
                      : "linear-gradient(180deg, #E8E0D0 0%, #D0C4B0 25%, #B8A890 60%, #A09078 100%)",
                    boxShadow:
                      "inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.2)",
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderBottom: "none",
                  }}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* 빈티지 나무 결 */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.08]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        90deg,
                        transparent 0,
                        transparent 4px,
                        rgba(0,0,0,0.2) 4px,
                        rgba(0,0,0,0.2) 5px
                      )`,
                    }}
                  />
                  {/* 페인트 벗겨진 부분 (2·3등만) */}
                  {!isFirst && (
                    <>
                      <div
                        className="absolute top-1 right-1 w-5 h-3 rounded-sm opacity-70"
                        style={{
                          background: "linear-gradient(135deg, #C4B090 0%, #A09070 100%)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 1px rgba(0,0,0,0.1)",
                        }}
                      />
                      <div
                        className="absolute bottom-6 left-2 w-3 h-2 rounded opacity-50"
                        style={{
                          background: "linear-gradient(135deg, #B8A080 0%, #987860 100%)",
                        }}
                      />
                    </>
                  )}

                  {/* 앞면 스텐실 숫자 (투박한 페인트) */}
                  <span
                    className="relative text-[26px] sm:text-[30px] font-black leading-none tabular-nums"
                    style={{
                      fontFamily: "ui-monospace, 'Courier New', monospace",
                      color: isFirst ? "rgba(70,48,18,0.9)" : "rgba(55,48,42,0.88)",
                      textShadow:
                        "2px 0 0 rgba(255,255,255,0.4), -1px 0 0 rgba(255,255,255,0.3), 0 2px 0 rgba(0,0,0,0.15), 1px 1px 0 rgba(0,0,0,0.2)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {p.place}
                  </span>

                  {/* 권수 */}
                  <span
                    className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-medium opacity-90"
                    style={{
                      color: isFirst ? "rgba(70,50,20,0.9)" : "rgba(60,50,40,0.85)",
                    }}
                  >
                    {p.count}권
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
