"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { SpringHorse } from "./icons/SpringHorse";

type Phase = "idle" | "thinking" | "result";
type Result = "buy" | "dont";

const THINKING_DURATION_MS = 2800;

/** ?? ? ??? ??? ???? (?? ??) */
const BOUNCE_KEYFRAMES = [
  0, -28, 26, -24, 22, -20, 18, -16, 14, -12, 10, -8, 6, -4, 2, 0,
];

type HorseViewProps = {
  phase: Phase;
  result: Result | null;
  rotateAnimate: { rotate: number | number[] };
  rotateTransition: Record<string, unknown>;
  onReset: () => void;
  onClick: () => void;
};

function HorseView({ phase, result, rotateAnimate, rotateTransition, onReset, onClick }: HorseViewProps) {
  const resultText = result === "buy" ? "책은 지식과 자산이 된다" : "도서관도 좋은 선택이다";

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 px-4">
        <motion.div
          className="origin-bottom cursor-pointer touch-manipulation select-none"
          style={{ paddingBottom: "36px" }}
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onClick()}
          aria-label="살까말까 목마 누르기"
          animate={rotateAnimate}
          transition={rotateTransition}
        >
          <motion.div
            animate={
              phase === "idle"
                ? {
                    rotate: [0, -1.5, 1.5, -1, 0],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }
                : {}
            }
          >
            {/* 목마 SVG 아이콘 */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center" style={{ marginBottom: "0" }}>
              <SpringHorse className="w-full h-full text-primary" />
            </div>
          </motion.div>
        </motion.div>

      {/* 컨테이너 양쪽 끝에 "살", "말" */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-serif text-primary/70 select-none pointer-events-none">
        살
      </span>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-serif text-primary/70 select-none pointer-events-none">
        말
      </span>

      {phase === "result" && result && (
        <motion.p
          className="mt-4 text-center text-sm font-serif text-primary font-medium max-w-[260px]"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {resultText}
        </motion.p>
      )}

      {phase === "result" && (
        <motion.button
          type="button"
          className="mt-4 px-4 py-2 rounded-lg text-sm font-bold border-2 border-primary/40 bg-primary/10 text-primary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
        >
          다시 하기
        </motion.button>
      )}

      <p className="mt-3 text-[11px] text-text-muted font-serif">
        목마를 눌러 흔들어 보세요
      </p>
    </div>
  );
}

export default function BuyOrNotHorse() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result | null>(null);

  const handleClick = useCallback(() => {
    if (phase === "thinking") return;
    setPhase("thinking");
    setResult(null);

    const resultValue: Result = Math.random() >= 0.5 ? "buy" : "dont";
    setTimeout(() => {
      setResult(resultValue);
      setPhase("result");
    }, THINKING_DURATION_MS);
  }, [phase]);

  const reset = useCallback(() => {
    setPhase("idle");
    setResult(null);
  }, []);

  const finalRotate = phase === "result" && result === "buy" ? -15 : phase === "result" && result === "dont" ? 15 : 0;

  const rotateAnimate =
    phase === "thinking"
      ? { rotate: BOUNCE_KEYFRAMES }
      : phase === "result"
        ? { rotate: finalRotate }
        : { rotate: 0 };

  const rotateTransition: { duration?: number; ease?: string; type?: string; stiffness?: number; damping?: number } =
    phase === "thinking"
      ? {
          duration: THINKING_DURATION_MS / 1000,
          ease: "easeOut",
        }
      : phase === "result"
        ? { type: "spring", stiffness: 120, damping: 16 }
        : { duration: 0.3 };

  return (
    <HorseView
      phase={phase}
      result={result}
      rotateAnimate={rotateAnimate}
      rotateTransition={rotateTransition}
      onReset={reset}
      onClick={handleClick}
    />
  );
}


