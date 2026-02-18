"use client";

import { motion } from "framer-motion";

interface DestinyGashaponProps {
  onClick: () => void;
}

/** 홈 화면에 보이는 운명의 캡슐 뽑기 기계 미리보기 — 첨부 이미지와 동일한 가챠폰 머신 */
export default function DestinyGashapon({ onClick }: DestinyGashaponProps) {
  return (
    <motion.div
      className="rounded-2xl p-5 sm:p-6 border cursor-pointer active:opacity-95 transition-opacity"
      style={{
        background: "linear-gradient(180deg, #e8ddc8 0%, #ddd4bc 100%)",
        borderColor: "rgba(100, 95, 85, 0.35)",
        boxShadow: "0 4px 20px rgba(58, 49, 40, 0.18), inset 0 0 60px rgba(180, 165, 140, 0.08)",
      }}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      role="button"
      tabIndex={0}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-[15px] sm:text-[16px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
        🎰 운명의 캡슐 뽑기
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">
        읽을 책을 무작위로 골라줘요.
        <br />
        손잡이를 돌리면 캡슐이 나와요.
      </p>
      <div
        className="relative flex justify-center rounded-xl py-6 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        }}
      >
        <GashaponPreviewIllustration />
      </div>
    </motion.div>
  );
}

/** 빈티지 스타일 — 낡은 금속·긁힌 아크릴·녹·먼지·햇빛 바램 */
function GashaponPreviewIllustration() {
  return (
    <div className="relative w-[150px] h-[200px] flex flex-col items-center z-10">
      {/* 뚜껑 — 우체국 빨강 */}
      <div
        className="relative w-[126px] h-3 rounded-t-xl flex-shrink-0 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #E31837 0%, #C41E3A 50%, #A81830 100%)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          border: "1px solid rgba(180,40,60,0.5)",
          borderBottom: "none",
        }}
      >
        <div className="absolute top-0 right-2 w-2 h-2 rounded-full opacity-40" style={{ background: "#8a1020" }} />
      </div>

      {/* 투명 컨테이너 — 누렇게 변색된 아크릴, 긁힘·먼지 오버레이 */}
      <div
        className="relative flex-1 overflow-hidden flex-shrink min-h-0"
        style={{
          width: "126px",
          clipPath: "polygon(2% 0, 98% 0, 94% 100%, 6% 100%)",
          background: `
            linear-gradient(180deg,
              rgba(220,210,180,0.5) 0%,
              rgba(200,190,165,0.45) 30%,
              rgba(185,175,150,0.5) 70%,
              rgba(170,160,140,0.55) 100%
            )`,
          border: "2px solid rgba(180,165,140,0.8)",
          borderTop: "none",
          boxShadow: `
            inset 0 0 30px rgba(0,0,0,0.08),
            inset 2px 0 8px rgba(100,90,70,0.15),
            inset -2px 0 8px rgba(100,90,70,0.15),
            0 3px 10px rgba(0,0,0,0.25)
          `,
        }}
      >
        {/* 때·먼지·빗물 자국 오버레이 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 30% 20% at 20% 30%, rgba(160,150,120,0.25) 0%, transparent 50%),
              radial-gradient(ellipse 25% 15% at 80% 60%, rgba(140,130,100,0.2) 0%, transparent 50%),
              linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.03) 100%)
            `,
          }}
        />
        {/* 바닥 그림자 — 쌓인 캡슐 무게감 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(ellipse 100% 40% at 50% 100%, rgba(0,0,0,0.2) 0%, transparent 70%)",
          }}
        />
        {/* 캡슐들 — 무질서하게 쌓인 느낌: 겹침, z순서, 눌린 그림자 */}
        {[
          { left: "0%", bottom: "0", c1: "#a89268", c2: "#f0e8d8", w: 24, h: 24, r: -12, z: 1 },
          { left: "18%", bottom: "-2px", c1: "#6a7a8a", c2: "#d8dcde", w: 26, h: 26, r: 8, z: 3 },
          { left: "36%", bottom: "0", c1: "#9a6b58", c2: "#e8d8d0", w: 28, h: 28, r: -6, z: 2 },
          { left: "54%", bottom: "-3px", c1: "#6a7c5a", c2: "#d8e0d4", w: 24, h: 24, r: 10, z: 4 },
          { left: "72%", bottom: "0", c1: "#a89268", c2: "#f0e8d8", w: 22, h: 22, r: -9, z: 1 },
          { left: "88%", bottom: "-1px", c1: "#6a7a8a", c2: "#d8dcde", w: 20, h: 20, r: 5, z: 2 },
          { left: "6%", bottom: "22px", c1: "#9a6b58", c2: "#e8d8d0", w: 26, h: 26, r: 6, z: 4 },
          { left: "28%", bottom: "24px", c1: "#6a7c5a", c2: "#d8e0d4", w: 24, h: 24, r: -8, z: 2 },
          { left: "50%", bottom: "20px", c1: "#a89268", c2: "#f0e8d8", w: 28, h: 28, r: 4, z: 5 },
          { left: "74%", bottom: "26px", c1: "#6a7a8a", c2: "#d8dcde", w: 22, h: 22, r: -7, z: 3 },
          { left: "14%", bottom: "48px", c1: "#9a6b58", c2: "#e8d8d0", w: 24, h: 24, r: -5, z: 3 },
          { left: "42%", bottom: "52px", c1: "#6a7c5a", c2: "#d8e0d4", w: 26, h: 26, r: 9, z: 4 },
          { left: "66%", bottom: "46px", c1: "#a89268", c2: "#f0e8d8", w: 22, h: 22, r: -4, z: 2 },
          { left: "8%", bottom: "74px", c1: "#6a7a8a", c2: "#d8dcde", w: 24, h: 24, r: 7, z: 4 },
          { left: "36%", bottom: "78px", c1: "#9a6b58", c2: "#e8d8d0", w: 26, h: 26, r: -10, z: 5 },
          { left: "64%", bottom: "72px", c1: "#6a7c5a", c2: "#d8e0d4", w: 22, h: 22, r: 5, z: 3 },
          { left: "48%", bottom: "98px", c1: "#a89268", c2: "#f0e8d8", w: 24, h: 24, r: -6, z: 4 },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: c.left,
              bottom: c.bottom,
              width: c.w,
              height: c.h,
              zIndex: c.z,
              transform: `rotate(${c.r}deg)`,
              background: `linear-gradient(180deg, ${c.c1} 0%, ${c.c1} 50%, ${c.c2} 50%, ${c.c2} 100%)`,
              boxShadow: `
                inset 0 2px 0 rgba(255,255,255,0.3),
                inset 0 -1px 0 rgba(0,0,0,0.08),
                0 3px 6px rgba(0,0,0,0.25),
                0 4px 8px rgba(0,0,0,0.12)
              `,
              border: "1px solid rgba(0,0,0,0.12)",
            }}
          />
        ))}
      </div>

      {/* 베이스 — 테이퍼 + 녹·칠 벗겨짐 + 아래 모서리 둥글게 */}
      <div className="relative w-[140px] flex-shrink-0 flex flex-col items-stretch">
        <div
          className="h-1 flex-shrink-0 mx-auto"
          style={{
            width: "79%",
            background: "linear-gradient(180deg, #c41e3a 0%, #a81830 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        />
        <div
          className="relative w-[140px] h-12 flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            clipPath: "path('M 14 0 L 126 0 L 140 36 Q 140 48 132 48 Q 130 48 8 48 Q 0 48 0 36 L 14 0 Z')",
            background: "linear-gradient(180deg, #E31837 0%, #C41E3A 40%, #A81830 100%)",
            boxShadow: "inset 0 2px 0 rgba(255,255,255,0.06), 0 6px 16px rgba(0,0,0,0.4), inset 0 0 40px rgba(0,0,0,0.1)",
            border: "2px solid rgba(0,0,0,0.2)",
            borderTop: "none",
          }}
        >
          {/* 우체통 빨강 — 은은한 음영 */}
          <div className="absolute top-1 left-2 w-3 h-1 rounded-full opacity-40" style={{ background: "#8a1020" }} />
          <div className="absolute top-2 right-4 w-2 h-1 rounded-full opacity-35" style={{ background: "#6a0c18" }} />
          {/* 낡고 기름때 낀 금속 손잡이 + 테두리 녹 */}
          <div
            className="absolute inset-0 m-auto w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(180deg, #8a8580 0%, #6a6560 50%, #5a5550 100%)",
              boxShadow: "inset 0 2px 0 rgba(140,135,130,0.5), 0 3px 8px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(90,80,70,0.8)",
              border: "1px solid rgba(80,70,60,0.6)",
            }}
          >
            <div className="w-6 h-2 rounded-full" style={{ background: "#4a4540", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />
          </div>
          {/* 500원 스티커 — 기계 옆면 */}
          <div
            className="absolute top-2 -left-1 px-1.5 py-0.5 rounded-sm text-[7px] font-bold whitespace-nowrap"
            style={{
              background: "#2a2520",
              color: "#e8e0d0",
              textShadow: "1px 1px 0 rgba(0,0,0,0.6), -0.5px -0.5px 0 rgba(255,255,255,0.1)",
              border: "1px solid rgba(0,0,0,0.4)",
            }}
          >
            500원
          </div>
          {/* 배출구 — 우체통 빨강 계열 다크 */}
          <div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-3 rounded-b-md"
            style={{
              background: "linear-gradient(180deg, #8a1828 0%, #6a1020 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,200,200,0.1), 0 2px 6px rgba(0,0,0,0.4)",
              border: "1px solid rgba(0,0,0,0.25)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
