"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const DEFAULT_MINUTES = 25;
const ACCENT_COLOR = "#C98C6E";

export default function FocusTimer() {
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_MINUTES * 60);
  const [remaining, setRemaining] = useState(DEFAULT_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);

  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  const tick = useCallback(() => {
    setRemaining((prev) => {
      if (prev <= 1) {
        setIsRunning(false);
        return 0;
      }
      return prev - 1;
    });
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRunning, tick]);

  const start = () => {
    if (remaining <= 0) setRemaining(DEFAULT_MINUTES * 60);
    setIsRunning(true);
  };
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setRemaining(DEFAULT_MINUTES * 60);
    setTotalSeconds(DEFAULT_MINUTES * 60);
  };

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const display = `${m}:${s.toString().padStart(2, "0")}`;

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-chulbit-card shadow-card border border-ivory-border">
      <h3 className="text-[16px] sm:text-[17px] font-bold text-primary mb-4 flex items-center gap-2">
        🎠 회전무대 (집중 타이머)
      </h3>

      <div className="flex flex-col items-center gap-6">
        {/* 원형 프로그레스 + 펜스 장식 */}
        <div className="relative w-[200px] h-[200px] flex items-center justify-center">
          <svg
            className="absolute w-full h-full -rotate-90"
            viewBox="0 0 100 100"
            aria-hidden
          >
            {/* 배경 트랙 */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E5DCC8"
              strokeWidth="6"
            />
            {/* 펜스 장식: 짧은 대시로 둘러싼 테두리 */}
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke={ACCENT_COLOR}
              strokeWidth="2"
              strokeOpacity="0.5"
              strokeDasharray="3 5"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={ACCENT_COLOR}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-1000 ease-linear ${isRunning ? "animate-spin-merry" : ""}`}
            />
          </svg>
          {/* 중앙 시간 */}
          <div className="relative z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-library-card border border-ivory-border shadow-inner">
            <span className="text-[22px] font-bold tabular-nums text-text-main">
              {display}
            </span>
            <span className="text-[10px] text-muted mt-0.5">
              {isRunning ? "집중 중..." : "대기"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isRunning ? (
            <button
              type="button"
              onClick={pause}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/90 text-white font-bold text-[14px] hover:bg-accent transition-colors shadow-sm"
            >
              <Pause size={18} /> 일시정지
            </button>
          ) : (
            <button
              type="button"
              onClick={start}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-[14px] transition-colors shadow-sm"
              style={{ backgroundColor: ACCENT_COLOR }}
            >
              <Play size={18} /> 시작
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-accent/50 text-accent font-bold text-[13px] hover:bg-accent/10 transition-colors"
          >
            <RotateCcw size={16} /> 리셋
          </button>
        </div>
      </div>
    </div>
  );
}
