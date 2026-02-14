"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const PENDULUM_DURATION_MS = 3000;
const FINAL_BUY_DEG = -5;
const FINAL_DONT_DEG = 5;
const AMPLITUDE_DEG = 15;

interface DecisionHorseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** 빈티지 목마 SVG: 낡고 칠이 벗겨진 스타일 (측면 실루엣) */
function VintageHorseSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="horse-wood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="30%" stopColor="#6B5344" />
          <stop offset="60%" stopColor="#5C4033" />
          <stop offset="100%" stopColor="#4A3520" />
        </linearGradient>
        <linearGradient id="horse-peel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C4A574" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8B7355" stopOpacity="0.6" />
        </linearGradient>
        <filter id="horse-shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="1" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* 바닥 받침대 */}
      <ellipse cx="60" cy="72" rx="38" ry="6" fill="#3A3128" opacity="0.4" />
      {/* 목마 본체: 낡은 나무 말 */}
      <g filter="url(#horse-shadow)">
        <path
          d="M28 68 L32 45 L38 28 L48 18 L62 14 L78 18 L88 28 L94 45 L98 68 Z"
          fill="url(#horse-wood)"
          stroke="#3A3128"
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />
        {/* 칠 벗겨진 부분 */}
        <path
          d="M42 52 L52 38 L68 35 L82 42 L88 58"
          fill="url(#horse-peel)"
          opacity="0.85"
        />
        <path
          d="M48 62 L55 50 L65 48"
          fill="url(#horse-peel)"
          opacity="0.7"
        />
        {/* 머리/목 (앞쪽) */}
        <path
          d="M78 18 L88 12 L92 8 L90 22 L82 28 Z"
          fill="url(#horse-wood)"
          stroke="#3A3128"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <path d="M84 16 L88 14" fill="none" stroke="#C4A574" strokeWidth="0.8" opacity="0.6" />
      </g>
    </svg>
  );
}

export default function DecisionHorseModal({ isOpen, onClose }: DecisionHorseModalProps) {
  const [phase, setPhase] = useState<"idle" | "swinging" | "result">("idle");
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<"buy" | "dont" | null>(null);
  const [showLeaf, setShowLeaf] = useState(false);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setPhase("idle");
      setRotation(0);
      setResult(null);
      setShowLeaf(false);
      return;
    }

    setPhase("swinging");
    setResult(null);
    setShowLeaf(false);
    const outcome: "buy" | "dont" = Math.random() < 0.5 ? "buy" : "dont";
    setResult(outcome);
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      if (elapsed >= PENDULUM_DURATION_MS) {
        setRotation(outcome === "buy" ? FINAL_BUY_DEG : FINAL_DONT_DEG);
        setPhase("result");
        setShowLeaf(true);
        return;
      }
      const t = elapsed / 1000;
      const decay = Math.exp(-elapsed / 900);
      const angle = AMPLITUDE_DEG * Math.sin(t * 4.2) * decay;
      setRotation(angle);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[3100] flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="고독한 목마"
    >
      <div
        className="relative w-full max-w-[320px] rounded-2xl bg-library-card border-2 border-amber-300/80 shadow-2xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 20px 50px rgba(58,49,40,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-amber-200/60 text-text-main"
          aria-label="닫기"
        >
          <X size={20} strokeWidth={2} />
        </button>

        <p className="text-center text-[12px] font-mono text-text-main/70 mb-4">
          고독한 목마
        </p>

        {/* 목마 + 진자 회전 */}
        <div className="flex justify-center items-end min-h-[140px] pb-2">
          <div
            className="origin-bottom transition-transform duration-75"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionProperty: phase === "result" ? "transform" : "none",
              transitionDuration: phase === "result" ? "0.4s" : "0s",
            }}
          >
            <VintageHorseSvg className="w-32 h-[85px] sm:w-36 sm:h-[95px]" />
          </div>
        </div>

        {/* 낙엽: 결과 구간에서만 떨어짐 */}
        {showLeaf && (
          <div
            className="absolute left-1/2 bottom-4 -translate-x-1/2 w-6 h-6 text-center animate-fall-leaf"
            aria-hidden
          >
            <span className="text-[22px] drop-shadow-sm">🍂</span>
          </div>
        )}

        <p className="text-center text-[11px] font-mono text-text-main/50 mt-2">
          {phase === "idle" && " "}
          {phase === "swinging" && "바람이 분다..."}
          {phase === "result" && " "}
        </p>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
