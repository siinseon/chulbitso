"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward, Square } from "lucide-react";

interface WebtoonVCRProps {
  title?: string;
  initialEpisode?: number;
  onEpisodeChange?: (episode: number) => void;
  onTitleChange?: (title: string) => void;
  onRecord?: (title: string, episode: number) => void;
  className?: string;
}

const VCR_GREY = "#3d3d3d";

export default function WebtoonVCR({
  title: initialTitle = "",
  initialEpisode = 1,
  onEpisodeChange,
  onTitleChange,
  onRecord,
  className = "",
}: WebtoonVCRProps) {
  const [episode, setEpisode] = useState(initialEpisode);
  const [title, setTitle] = useState(initialTitle);

  const handleDecrement = useCallback(() => {
    const next = Math.max(0, episode - 1);
    setEpisode(next);
    onEpisodeChange?.(next);
    if (typeof navigator?.vibrate === "function") navigator.vibrate(15);
  }, [episode, onEpisodeChange]);

  const handleIncrement = useCallback(() => {
    const next = Math.min(9999, episode + 1);
    setEpisode(next);
    onEpisodeChange?.(next);
    if (typeof navigator?.vibrate === "function") navigator.vibrate(15);
  }, [episode, onEpisodeChange]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setTitle(v);
      onTitleChange?.(v);
    },
    [onTitleChange]
  );

  const handleRecord = useCallback(() => {
    onRecord?.(title, episode);
  }, [title, episode, onRecord]);

  const noiseDataUri =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

  return (
    <div className="flex flex-col w-full p-5 sm:p-6">
      <h3 className="text-[16px] sm:text-[17px] font-bold text-white/90 font-serif mb-1">
        비디오 플레이어
      </h3>
      <p className="text-[12px] text-white/60 font-serif mb-4">
        웹소설·웹툰 이름과 화수를 입력하고 녹화 버튼을 누르면 비디오 테이프 보관함에 저장돼요.
      </p>
      <div
        className={`relative rounded-lg overflow-hidden w-full max-w-[400px] mx-auto ${className}`.trim()}
      style={{
        background: `linear-gradient(180deg, #454545 0%, #3d3d3d 20%, #383838 80%, #3a3a3a 100%)`,
        boxShadow:
          "0 12px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2)",
        borderTop: "1px solid #666",
        borderLeft: "1px solid #555",
        borderRight: "1px solid #333",
        borderBottom: "1px solid #222",
        padding: "16px 14px 14px",
      }}
    >
      {/* 미세한 노이즈 질감 (플라스틱/브러시 메탈) */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("${noiseDataUri}")`,
          backgroundRepeat: "repeat",
        }}
      />
      {/* GoldStar 브랜딩 */}
      <div
        className="absolute top-3 right-4 text-[10px] font-bold tracking-widest z-10"
        style={{ color: "#c9a227", fontFamily: "sans-serif" }}
      >
        GoldStar
      </div>

      {/* 상단 타이틀 — 슬롯 위 (Siinseon VideoPlayer) */}
      <div className="relative text-center mb-3 px-2 z-10">
        <h3
          className="text-[18px] font-bold italic text-white truncate"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          Siinseon VideoPlayer
        </h3>
      </div>

      {/* 테이프 삽입구 — 깊은 구멍 + 내부 벽 베벨 */}
      <div
        className="relative rounded overflow-hidden z-10"
        style={{
          background:
            "linear-gradient(180deg, #2a2a2a 0%, #222 30%, #1a1a1a 70%, #252525 100%)",
          boxShadow:
            "inset 0 10px 28px rgba(0,0,0,0.7), inset 0 -8px 20px rgba(0,0,0,0.5), inset 8px 0 24px rgba(0,0,0,0.4), inset -8px 0 24px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.06), inset 0 -2px 0 rgba(255,255,255,0.08)",
          border: "1px solid #383838",
          minHeight: 76,
          padding: "12px",
        }}
      >
        {/* 슬롯 내부 가장자리 — 구멍 안쪽 벽 느낌 */}
        <div
          className="absolute inset-2 rounded pointer-events-none"
          style={{
            boxShadow:
              "inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.3), inset 2px 0 0 rgba(255,255,255,0.04), inset -2px 0 0 rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        />
        {/* 테이프 spine — 비디오 테이프가 삽입된 모습 */}
        <div
          className="relative h-full rounded flex items-stretch overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, #2a3028 0%, #32382e 15%, #2a3028 50%, #343a30 85%, #262c24 100%)",
            boxShadow:
              "inset 1px 0 0 rgba(255,255,255,0.1), inset -1px 0 0 rgba(0,0,0,0.25), 0 3px 10px rgba(0,0,0,0.4)",
            border: "1px solid rgba(0,0,0,0.35)",
          }}
        >
          {/* 릴 윈도우 (VHS 테이프의 둥근 릴 부분) */}
          <div className="flex-shrink-0 flex items-center gap-0.5 ml-2 self-center">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, #1a1a1a, #0f0f0f)",
                boxShadow:
                  "inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(255,255,255,0.06)",
                border: "1px solid #1a1a1a",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full bg-stone-700"
                style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)" }}
              />
            </div>
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, #1a1a1a, #0f0f0f)",
                boxShadow:
                  "inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(255,255,255,0.06)",
                border: "1px solid #1a1a1a",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full bg-stone-700"
                style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)" }}
              />
            </div>
          </div>

          {/* 화수 라벨 — 노란 견출지 (흰색 제목칸과 같은 높이) */}
          <div
            className="flex-shrink-0 flex items-center justify-center px-2.5 rounded-sm my-1.5 ml-1 self-stretch"
            style={{
              background:
                "linear-gradient(180deg, #ffd700 0%, #ffc107 50%, #ffb300 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.15)",
            }}
          >
            <span
              className="text-[12px] font-bold text-black tabular-nums"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {episode}p
            </span>
          </div>

          {/* 제목 라벨 — 하얀 스티커 (화수 칸과 같은 높이) */}
          <div
            className="flex-1 min-w-0 flex items-center justify-center px-3 py-2 my-1.5 mr-2 ml-1 rounded-sm self-stretch"
            style={{
              background:
                "linear-gradient(180deg, #fafafa 0%, #f2f2f2 30%, #e8e8e8 70%, #e0e0e0 100%)",
              boxShadow:
                "inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.15)",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="웹툰·웹소설 이름"
              className="w-full bg-transparent border-none outline-none text-center text-[15px] font-bold text-[#1a1a1a] placeholder:text-[#999] truncate italic"
              style={{
                fontFamily: "var(--font-handwriting), Gaegu, cursive",
              }}
            />
          </div>
        </div>
      </div>

      {/* 컨트롤 버튼 — 5개: Rewind(-1) | Record | Stop | Play | FF */}
      <div className="relative flex items-center justify-center gap-1.5 mt-4 z-10">
        <VCRButton
          onClick={handleDecrement}
          icon={<Rewind size={14} strokeWidth={2.5} stroke="white" />}
        />
        <VCRButton
          onClick={handleRecord}
          icon={<span className="w-2.5 h-2.5 rounded-full bg-red-500" />}
          title="녹화"
        />
        <VCRButton icon={<Square size={10} strokeWidth={2.5} stroke="white" />} />
        <VCRButton
          icon={
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 ml-0.5" fill="#facc15">
              <path d="M8 5v14l11-7z" />
            </svg>
          }
        />
        <VCRButton
          onClick={handleIncrement}
          icon={<FastForward size={14} strokeWidth={2.5} stroke="white" />}
        />
      </div>
    </div>
    </div>
  );
}

function VCRButton({
  icon,
  label,
  onClick,
  title: buttonTitle,
}: {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  title?: string;
}) {
  const isInteractive = !!onClick;
  const isWide = !!label;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!isInteractive}
      title={buttonTitle}
      className={`
        flex items-center justify-center rounded-full relative
        ${isInteractive ? "cursor-pointer" : "cursor-default opacity-80"}
        ${isWide ? "px-4 min-w-[56px] h-9" : "w-9 h-9"}
      `}
      style={{
        background:
          "linear-gradient(180deg, #5a5a5a 0%, #454545 25%, #3a3a3a 60%, #2e2e2e 100%)",
        borderTop: "1px solid #666",
        borderLeft: "1px solid #4a4a4a",
        borderRight: "1px solid #2a2a2a",
        borderBottom: "1px solid #1a1a1a",
        boxShadow:
          "inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.4)",
        color: "white",
      }}
      whileTap={
        isInteractive
          ? {
              y: 1,
              boxShadow:
                "inset 0 4px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.2)",
            }
          : {}
      }
      transition={{ duration: 0.05 }}
    >
      {label ? (
        <span
          className="text-[10px] font-bold tracking-wider uppercase"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {label}
        </span>
      ) : (
        <span className="flex items-center justify-center">{icon}</span>
      )}
    </motion.button>
  );
}
