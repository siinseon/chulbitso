"use client";

interface SkyLadderSectionProps {
  totalPages: number;
  heightCm: number;
}

const CM_PER_STEP = 10;
const VISIBLE_STEPS = 5;

/* 금속 놀이터 사다리 비율: 세로 기둥(파이프) 두께 : 발판(파이프) 두께 ≈ 1.5 : 1, 발판 간격 일정 */
const POST_DIAMETER = 12; // 세로 기둥 둥근 파이프 지름
const RUNG_DIAMETER = 8;  // 발판 파이프 지름 (기둥의 약 2/3)
const RUNG_SPACING = 32;  // 발판 사이 수직 간격
const TOP_MARGIN = 4;  // 첫 발판 위 여백
const INNER_GAP = 56;  // 두 기둥 사이 거리 (발판 길이)

/* 녹슨 오렌지 + 음영 */
const RUST_LIGHT = "#d4a078";
const RUST_MID = "#C98C6E";
const RUST_DARK = "#a86f52";

export default function SkyLadderSection({ totalPages, heightCm }: SkyLadderSectionProps) {
  const hasData = totalPages > 0;
  const stepCount = hasData ? Math.floor(heightCm / CM_PER_STEP) : 0;
  const heightM = heightCm >= 100 ? (heightCm / 100).toFixed(1) : null;
  const heightDisplay = hasData
    ? heightCm >= 100
      ? `${heightM}m`
      : `${heightCm.toFixed(1)}cm`
    : "-";

  const totalSteps = Math.max(stepCount, 1);
  const postsHeight = TOP_MARGIN + (totalSteps - 1) * RUNG_SPACING + RUNG_DIAMETER;
  const containerHeight = TOP_MARGIN + VISIBLE_STEPS * RUNG_SPACING + RUNG_DIAMETER + 16;

  const totalWidth = POST_DIAMETER * 2 + INNER_GAP;

  return (
    <section
      className="rounded-2xl p-5 border border-secondary overflow-visible"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
        🪜 하늘사다리
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4 leading-relaxed">
        지식의 높이!
        <br />
        읽은 페이지만큼 한 칸씩 올라가요
        <br />
        <span className="text-[11px] opacity-90">(총 쪽수 × 0.1mm (종이 두께), 10cm = 1칸)</span>
      </p>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-6">
        <div
          className="relative flex-shrink-0 order-1 sm:order-1 overflow-hidden sm:mx-0 mx-auto"
          style={{ width: totalWidth, height: containerHeight }}
        >
          {/* 왼쪽 세로 기둥 */}
          <div
            className="absolute rounded-full"
            style={{
              left: 0,
              top: 0,
              width: POST_DIAMETER,
              height: postsHeight,
              background: `linear-gradient(90deg, ${RUST_LIGHT} 0%, ${RUST_MID} 50%, ${RUST_DARK} 100%)`,
              boxShadow: "inset 1px 0 0 rgba(255,255,255,0.2), inset -1px 0 0 rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
          {/* 오른쪽 세로 기둥 */}
          <div
            className="absolute rounded-full"
            style={{
              right: 0,
              top: 0,
              width: POST_DIAMETER,
              height: postsHeight,
              background: `linear-gradient(90deg, ${RUST_DARK} 0%, ${RUST_MID} 50%, ${RUST_LIGHT} 100%)`,
              boxShadow: "inset 1px 0 0 rgba(0,0,0,0.25), inset -1px 0 0 rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
          {/* 발판 (가로 파이프) */}
          {[...Array(totalSteps)].map((_, i) => {
            const topPx = TOP_MARGIN + i * RUNG_SPACING;
            return (
              <div
                key={i}
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  left: POST_DIAMETER,
                  top: topPx,
                  width: INNER_GAP,
                  height: RUNG_DIAMETER,
                  background: `linear-gradient(180deg, ${RUST_LIGHT} 0%, ${RUST_MID} 40%, ${RUST_DARK} 100%)`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            );
          })}
        </div>
        <div className="flex-1 order-2 sm:order-2 text-center sm:text-left">
          <p className="text-[20px] sm:text-[24px] font-bold text-primary font-serif">
            {heightDisplay}의 기록
          </p>
          {hasData && (
            <>
              <p className="text-[14px] font-medium text-accent-warm mt-1 font-sans">
                {stepCount}번째 칸에 올라왔어요
              </p>
              <p className="text-[13px] text-text-muted mt-0.5 font-sans">
                총 {totalPages.toLocaleString()}쪽 읽음 (10cm = 1칸)
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
