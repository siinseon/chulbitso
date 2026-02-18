"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** 휠에서 한 칸에 해당하는 아이템 */
export interface IpodWheelItem {
  id: string;
  title: string;
  subtitle?: string;
  cover?: string;
}

const WHEEL_RING = "#E8E8E8";
const WHEEL_RING_HIGHLIGHT = "#F8F8F8";
const WHEEL_RING_SHADOW = "#D0D0D0";
const CENTER_BG = "#D0D0D0";
const LABEL_COLOR = "#606060";
const DEG_PER_TICK = 36;
const TICK_MS = 80;

function playTickSound(): void {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

function triggerHaptic(): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export interface IpodClickWheelProps {
  items: IpodWheelItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onCenterPress?: () => void;
  onMenuPress?: () => void;
  hideCenterDisplay?: boolean;
  className?: string;
}

export default function IpodClickWheel({
  items,
  selectedIndex,
  onSelectIndex,
  onCenterPress,
  onMenuPress,
  hideCenterDisplay = false,
  className = "",
}: IpodClickWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const lastTickTimeRef = useRef(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  const clampIndex = useCallback(
    (i: number) => {
      if (items.length === 0) return 0;
      return ((i % items.length) + items.length) % items.length;
    },
    [items.length]
  );

  const goNext = useCallback(() => {
    if (items.length <= 1) return;
    const next = clampIndex(selectedIndex + 1);
    if (next !== selectedIndex) {
      setSlideDirection("right");
      onSelectIndex(next);
      const now = Date.now();
      if (now - lastTickTimeRef.current > TICK_MS) {
        playTickSound();
        triggerHaptic();
        lastTickTimeRef.current = now;
      }
    }
  }, [items.length, selectedIndex, clampIndex, onSelectIndex]);

  const goPrev = useCallback(() => {
    if (items.length <= 1) return;
    const prev = clampIndex(selectedIndex - 1);
    if (prev !== selectedIndex) {
      setSlideDirection("left");
      onSelectIndex(prev);
      const now = Date.now();
      if (now - lastTickTimeRef.current > TICK_MS) {
        playTickSound();
        triggerHaptic();
        lastTickTimeRef.current = now;
      }
    }
  }, [items.length, selectedIndex, clampIndex, onSelectIndex]);

  const getCenter = useCallback(() => {
    const el = wheelRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
  }, []);

  const getAngle = useCallback((clientX: number, clientY: number) => {
    const c = getCenter();
    if (!c) return 0;
    return Math.atan2(clientY - c.cy, clientX - c.cx) * (180 / Math.PI);
  }, [getCenter]);

  const isInCenter = useCallback(
    (clientX: number, clientY: number) => {
      const c = getCenter();
      if (!c) return false;
      const r = 58 * (wheelRef.current?.getBoundingClientRect().width ?? 280) / 280;
      const dx = clientX - c.cx;
      const dy = clientY - c.cy;
      return dx * dx + dy * dy <= r * r;
    },
    [getCenter]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isInCenter(e.clientX, e.clientY)) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      lastAngleRef.current = getAngle(e.clientX, e.clientY);
      accumulatedRef.current = 0;
    },
    [getAngle, isInCenter]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (lastAngleRef.current === null) return;
      const angle = getAngle(e.clientX, e.clientY);
      let delta = angle - lastAngleRef.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      lastAngleRef.current = angle;
      accumulatedRef.current += delta;

      while (accumulatedRef.current >= DEG_PER_TICK) {
        accumulatedRef.current -= DEG_PER_TICK;
        goNext();
      }
      while (accumulatedRef.current <= -DEG_PER_TICK) {
        accumulatedRef.current += DEG_PER_TICK;
        goPrev();
      }
    },
    [getAngle, goNext, goPrev]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    lastAngleRef.current = null;
  }, []);

  const currentItem = items[clampIndex(selectedIndex)];

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {!hideCenterDisplay && (
        <>
          <div className="relative w-[140px] h-[180px] flex items-center justify-center overflow-hidden rounded-lg bg-[#1a1a1a] shadow-inner">
            <AnimatePresence initial={false} mode="wait">
              {currentItem ? (
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, x: slideDirection === "right" ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection === "right" ? -40 : 40 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center p-2"
                >
                  {currentItem.cover ? (
                    <img
                      src={currentItem.cover}
                      alt={currentItem.title}
                      className="max-w-full max-h-full object-contain rounded shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center px-2 bg-[#2a2a2a] rounded text-[#888] text-[11px] font-serif">
                      <span className="line-clamp-3">{currentItem.title}</span>
                      {currentItem.subtitle && <span className="mt-1 line-clamp-1">{currentItem.subtitle}</span>}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#666] text-sm font-serif">
                  없음
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {currentItem && (
            <p className="text-center text-[12px] text-primary font-serif max-w-[200px] truncate" title={currentItem.title}>
              {currentItem.title}
            </p>
          )}
        </>
      )}

      <div
        ref={wheelRef}
        className="relative select-none touch-none"
        style={{ width: 280, height: 280 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 280 280"
          className="drop-shadow-lg"
          style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.25)) drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
        >
          <defs>
            <linearGradient id="ipod-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={WHEEL_RING_HIGHLIGHT} />
              <stop offset="35%" stopColor={WHEEL_RING} />
              <stop offset="70%" stopColor={WHEEL_RING_SHADOW} />
              <stop offset="100%" stopColor="#C8C8C8" />
            </linearGradient>
            <linearGradient id="ipod-center" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ececec" />
              <stop offset="30%" stopColor="#e0e0e0" />
              <stop offset="100%" stopColor={CENTER_BG} />
            </linearGradient>
          </defs>
          <circle
            cx="140"
            cy="140"
            r="130"
            fill="url(#ipod-ring)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.8"
            style={{ paintOrder: "stroke fill" }}
          />
          <circle cx="140" cy="140" r="72" fill="#1a1a1a" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
          <circle
            cx="140"
            cy="140"
            r="58"
            fill="url(#ipod-center)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.2"
            style={{ paintOrder: "stroke fill" }}
          />
          <circle cx="140" cy="140" r="58" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ width: 280, height: 280 }}>
          {onMenuPress ? (
            <button
              type="button"
              onClick={onMenuPress}
              className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-widest pointer-events-auto cursor-pointer hover:opacity-80 active:scale-95 transition-opacity rounded px-2 py-1"
              style={{ color: LABEL_COLOR }}
              aria-label="메뉴"
            >
              MENU
            </button>
          ) : (
            <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-widest" style={{ color: LABEL_COLOR }}>
              MENU
            </span>
          )}
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-lg" style={{ color: LABEL_COLOR }}>⏯️</span>
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg" style={{ color: LABEL_COLOR }}>⏮️</span>
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg" style={{ color: LABEL_COLOR }}>⏭️</span>
        </div>

        <button
          type="button"
          onClick={onCenterPress}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[116px] h-[116px] rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/30 active:scale-[0.98]"
          aria-label="선택"
        />
      </div>
      {!hideCenterDisplay && <p className="text-[11px] text-text-muted font-serif">휠을 돌려 넘기세요</p>}
    </div>
  );
}