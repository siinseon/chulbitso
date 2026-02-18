"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { PublisherStat } from "@/lib/analysisStats";

/** 운동회 시상대 — 가장 많이 읽은 출판사 TOP 3. (기존 모래성 자리) */
export default function SandcastlesSection({
  topPublishers,
}: {
  topPublishers: PublisherStat[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  const top3 = topPublishers.slice(0, 3);

  if (top3.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="rounded-2xl p-5 bg-chulbit-card shadow-card border border-ivory-border"
      >
        <h3 className="text-[15px] font-bold text-primary mb-4 flex items-center gap-2">
          운동회 시상대
        </h3>
        <p className="text-[13px] text-muted">출판사 정보가 있는 도서가 없어요.</p>
      </section>
    );
  }

  // 시상대 순서: 왼쪽 2등, 가운데 1등, 오른쪽 3등 → 인덱스 [1, 0, 2], place [2, 1, 3]
  const order: [number, number, number] = [1, 0, 2];
  const places: (1 | 2 | 3)[] = [2, 1, 3];
  const podiumData = order.map((idx, i) => {
    const stat = top3[idx] ?? { name: "—", count: 0 };
    return { ...stat, place: places[i] };
  });

  return (
    <section
      ref={sectionRef}
      className="relative rounded-2xl overflow-hidden border border-secondary shadow-card"
    >
      {/* 배경: 옆 섹션과 동일 (F2E6D0 → E8DCC8) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        }}
      />
      <div className="relative p-5 pb-6">
        <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
          운동회 시상대
        </h3>
        <p className="text-[12px] text-primary/80 mb-5">가장 많이 읽은 출판사 Top 3</p>

        {/* 3단 시상대 — 2등(중간), 1등(제일 높음), 3등(제일 낮음), 칸 붙여서 */}
        <div className="flex items-end justify-center min-h-[200px]">
          {podiumData.map((p, i) => {
            const isFirst = p.place === 1;
            const heights = [88, 120, 72]; // 2등, 1등, 3등(가장 낮음)
            const widths = [88, 120, 88];
            const isLeft = i === 0;
            const isRight = i === 2;
            return (
              <motion.div
                key={p.name}
                className="flex flex-col items-center flex-shrink-0"
                initial={{ opacity: 0, y: 80 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* 단상 — 금속, 살짝 낡고 덜 녹슨 */}
                <motion.div
                  className="relative overflow-hidden"
                  style={{
                    width: widths[i],
                    height: heights[i],
                    borderTopLeftRadius: isLeft ? 8 : 0,
                    borderTopRightRadius: isRight ? 8 : 0,
                    background: "linear-gradient(180deg, #6B6B6B 0%, #525252 25%, #424242 60%, #323232 100%)",
                    boxShadow:
                      "inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.4)",
                    borderTop: "1px solid rgba(80,80,80,0.8)",
                    borderLeft: isLeft ? "1px solid rgba(60,60,60,0.9)" : "none",
                    borderRight: isRight ? "1px solid rgba(60,60,60,0.9)" : "none",
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
                  {/* 금속 반짝임(살짝만) */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.06]"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, transparent 100%)",
                    }}
                  />
                  {/* 녹 — 살짝만 (덜 녹슨) */}
                  <div
                    className="absolute top-0 right-0 w-1/2 h-1/2 rounded-bl-full opacity-45"
                    style={{
                      background: "radial-gradient(ellipse 80% 80% at 70% 20%, rgba(139,90,43,0.5), rgba(107,68,35,0.4) 40%, transparent 70%)",
                      boxShadow: "inset 0 0 6px rgba(0,0,0,0.15)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-full h-1/3 opacity-40"
                    style={{
                      background: "linear-gradient(180deg, transparent 0%, rgba(90,56,32,0.35) 30%, rgba(58,32,16,0.4) 100%)",
                    }}
                  />
                  <div
                    className="absolute top-1/3 left-2 w-8 h-5 rounded-full opacity-35"
                    style={{
                      background: "radial-gradient(ellipse at 50% 50%, rgba(155,107,60,0.4), rgba(74,40,24,0.35) 100%)",
                      boxShadow: "0 0 2px rgba(0,0,0,0.2)",
                    }}
                  />
                  <div
                    className="absolute bottom-8 right-4 w-6 h-4 rounded-full opacity-35"
                    style={{
                      background: "radial-gradient(ellipse at 40% 40%, rgba(139,90,43,0.35), transparent 60%)",
                    }}
                  />
                  <div
                    className="absolute top-2 left-1/4 w-4 h-3 rounded-full opacity-30"
                    style={{
                      background: "radial-gradient(ellipse at 50% 50%, rgba(122,74,42,0.35), transparent 100%)",
                    }}
                  />
                  {i === 1 && (
                    <>
                      <div
                        className="absolute top-1/2 left-0 w-3 h-12 opacity-40"
                        style={{
                          background: "linear-gradient(90deg, rgba(107,68,35,0.5) 0%, rgba(58,32,16,0.4) 100%)",
                          boxShadow: "inset 0 0 2px rgba(0,0,0,0.2)",
                        }}
                      />
                      <div
                        className="absolute bottom-4 left-1/3 w-5 h-3 rounded-full opacity-35"
                        style={{
                          background: "radial-gradient(ellipse at 50% 50%, rgba(139,90,43,0.4), transparent 100%)",
                        }}
                      />
                    </>
                  )}

                  {/* 위: 스텐실 숫자 */}
                  <span
                    className="absolute left-0 right-0 text-center text-[22px] sm:text-[26px] font-black leading-none tabular-nums"
                    style={{
                      top: 6,
                      fontFamily: "ui-monospace, 'Courier New', monospace",
                      color: "rgba(240,235,225,0.95)",
                      textShadow:
                        "0 1px 0 rgba(0,0,0,0.5), 1px 1px 0 rgba(0,0,0,0.4), -1px -1px 0 rgba(0,0,0,0.3)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {p.place}
                  </span>

                  {/* 가운데: 출판사 이름 */}
                  <span
                    className="absolute left-0 right-0 text-center font-bold truncate px-1"
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: i === 1 ? 11 : 9,
                      color: "rgba(250,245,235,0.95)",
                      textShadow: "0 1px 2px rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.5)",
                    }}
                    title={p.name}
                  >
                    {p.name}
                  </span>

                  {/* 아래: 권수 */}
                  <span
                    className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-medium"
                    style={{
                      color: "rgba(235,230,220,0.95)",
                      textShadow: "0 1px 1px rgba(0,0,0,0.5)",
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
