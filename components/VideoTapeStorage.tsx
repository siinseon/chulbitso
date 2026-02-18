"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import type { VideoTapeEntry } from "@/lib/useVideoTapes";

const SHELF_COUNT = 3;
const SPINES_PER_SHELF = 14;
const SPINE_HEIGHT = 16;
const SPINE_GAP = 2;
/** 검은색, 은색, 노란색 (비디오 테이프 스타일) */
const TAPE_COLORS = ["#1a1a1a", "#A8A8A8", "#E6B800"];

const BOOKSHELF_PATH =
  "M34,0H478V256H34V0Z M34,5H478V82H34V5Z M34,87H478V164H34V87Z M34,169H478V251H34V169Z";

interface VideoTapeStorageProps {
  tapes: VideoTapeEntry[];
  onUpdateTape: (id: string, episode: number) => void;
  className?: string;
  variant?: "light" | "dark";
}

export default function VideoTapeStorage({
  tapes,
  onUpdateTape,
  className = "",
  variant = "dark",
}: VideoTapeStorageProps) {
  const [selectedTape, setSelectedTape] = useState<VideoTapeEntry | null>(null);

  const shelvesData = useMemo(() => {
    const list = [...tapes].reverse();
    const out: VideoTapeEntry[][] = [[], [], []];
    for (let i = 0; i < list.length; i++) {
      const shelf = i % SHELF_COUNT;
      if (out[shelf].length < SPINES_PER_SHELF) out[shelf].push(list[i]);
    }
    return out;
  }, [tapes]);

  const handleUpdateTape = useCallback(
    (id: string, episode: number) => {
      onUpdateTape(id, episode);
      setSelectedTape((prev) => (prev?.id === id ? { ...prev, episode } : prev));
    },
    [onUpdateTape]
  );

  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 flex flex-col min-h-[320px] sm:min-h-[420px] overflow-visible ${className}`}
      style={
        isDark
          ? {
              background: "linear-gradient(180deg, #252525 0%, #1a1a1a 100%)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }
          : {
              background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
              boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
              border: "1px solid var(--color-secondary, #c4b8a8)",
            }
      }
    >
      <h3 className={`text-[16px] sm:text-[17px] font-bold font-serif mb-1 ${isDark ? "text-white/90" : "text-primary"}`}>
        비디오 테이프 보관함
      </h3>
      <p className={`text-[12px] font-serif mb-4 ${isDark ? "text-white/60" : "text-text-muted"}`}>
        비디오 플레이어에서 이름과 화수를 입력한 뒤 녹화 버튼을 누르면 테이프가 보관돼요.
      </p>

      {/* 테이프 선반 (SVG viewBox 512x256과 비율 맞춤) */}
      <div className="flex justify-center items-center flex-1 min-h-[220px] w-full overflow-hidden">
        <div
          className="relative w-full max-w-[440px] mx-auto h-auto"
          style={{ aspectRatio: "512/256" }}
        >
          <svg
            className="absolute inset-0 w-full h-full object-contain opacity-95 pointer-events-none"
            viewBox="0 0 512 256"
            fill="#A8A8A8"
            fillRule="evenodd"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path d={BOOKSHELF_PATH} />
          </svg>
          {shelvesData.map((items, shelfIndex) => {
            const shelfBottomPct = [(256 - 82) / 256, (256 - 164) / 256, (256 - 251) / 256] as const;
            const shelfHeightPct = [82 / 256, (164 - 82) / 256, (251 - 169) / 256] as const;
            return (
              <div
                key={shelfIndex}
                className="absolute left-[6.64%] right-[6.64%] flex flex-wrap items-end gap-0.5 content-end z-10"
                style={{
                  bottom: `${shelfBottomPct[shelfIndex] * 100}%`,
                  height: `${shelfHeightPct[shelfIndex] * 100}%`,
                }}
              >
                {items.length === 0 ? (
                  <span className={`text-[10px] font-serif ${variant === "dark" ? "text-white/40" : "text-[#8a7a6a]"}`}>
                    비어 있음
                  </span>
                ) : (
                  items.map((tape, i) => {
                    const idx = (tape.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + shelfIndex * SPINES_PER_SHELF + i) % TAPE_COLORS.length;
                    const color = TAPE_COLORS[idx];
                    return (
                      <StandingTapeSpine
                        key={tape.id}
                        color={color}
                        title={tape.title}
                        onClick={() => setSelectedTape(tape)}
                      />
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      </div>

      <VideoTapeDetailModal
        tape={selectedTape}
        onClose={() => setSelectedTape(null)}
        onUpdateEpisode={handleUpdateTape}
      />
    </div>
  );
}

function StandingTapeSpine({
  color,
  title,
  onClick,
}: {
  color: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex-shrink-0 flex overflow-hidden transition-transform active:scale-[0.98] hover:brightness-110"
      style={{
        width: 16,
        height: SPINE_HEIGHT,
        borderRadius: 0,
        background: color,
        border: "1px solid rgba(0,0,0,0.35)",
        boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.2)",
      }}
      onClick={onClick}
      title={title}
    >
      <span
        className="block w-full h-full overflow-hidden text-[9px] font-medium text-white/90 py-0.5 px-0.5"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed", letterSpacing: "0.02em", lineHeight: 1.3, textShadow: "0 1px 1px rgba(0,0,0,0.5)" }}
      >
        {title || "테이프"}
      </span>
    </button>
  );
}

function VideoTapeDetailModal({
  tape,
  onClose,
  onUpdateEpisode,
}: {
  tape: VideoTapeEntry | null;
  onClose: () => void;
  onUpdateEpisode: (id: string, episode: number) => void;
}) {
  const [episode, setEpisode] = useState(tape?.episode ?? 0);
  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (tape && tape.id !== prevIdRef.current) {
      prevIdRef.current = tape.id;
      setEpisode(tape.episode);
    }
    if (!tape) prevIdRef.current = null;
  }, [tape]);

  const isOpen = tape !== null;
  if (!tape) return null;

  const handleIncrement = () => {
    const next = Math.min(9999, (tape ? episode : 0) + 1);
    setEpisode(next);
    onUpdateEpisode(tape.id, next);
  };
  const handleDecrement = () => {
    const next = Math.max(0, (tape ? episode : 0) - 1);
    setEpisode(next);
    onUpdateEpisode(tape.id, next);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[360px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-black/60 text-white text-sm flex items-center justify-center hover:bg-black/80"
        >
          ✕
        </button>

        {/* 비디오 테이프 SVG + 오버레이 (플로피 디스크처럼 큰 사이즈) */}
        <div className="relative w-full aspect-square" style={{ maxHeight: 420 }}>
          <img
            src="/videotape.svg"
            alt="비디오 테이프"
            className="w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.5))" }}
          />

          {/* 가운데 메모 영역 — 제목 & 몇화 (양쪽 릴에 +/- 버튼 있음) */}
          <div
            className="absolute left-[35%] right-[35%] top-[16%] bottom-[48%] flex flex-col justify-center px-1 overflow-hidden pointer-events-none"
            style={{ marginTop: "-5px" }}
          >
            <p className="text-[12px] sm:text-[13px] font-extrabold text-black truncate text-center leading-tight">
              {tape.title}
            </p>
            <p className="text-[14px] sm:text-[16px] font-extrabold text-black tabular-nums text-center mt-1">
              {episode}화
            </p>
          </div>

          {/* 왼쪽 릴 — 화 감소 */}
          <button
            type="button"
            onClick={handleDecrement}
            className="absolute left-[30%] top-[29.5%] w-[18%] aspect-square -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform active:scale-95 hover:bg-black/20"
            style={{ marginLeft: "-10px" }}
            title="화 감소"
          >
            <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 text-gray-700 shrink-0" fill="currentColor">
              <path d="M6 6v12h4V6H6zm4 0v12l8-6-8-6z" />
            </svg>
          </button>

          {/* 오른쪽 릴 — 화 증가 */}
          <button
            type="button"
            onClick={handleIncrement}
            className="absolute left-[70%] top-[29.5%] w-[18%] aspect-square -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform active:scale-95 hover:bg-black/20"
            style={{ marginLeft: "10px" }}
            title="화 증가"
          >
            <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 text-gray-700 shrink-0" fill="currentColor">
              <path d="M6 18l8-6-8-6v12zm10-6v6h4V6h-4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
