"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/** 치지직 노이즈 사운드 (Web Audio API) */
function playStaticSound(durationMs: number = 600) {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const bufferSize = ctx.sampleRate * (durationMs / 1000);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(ctx.currentTime);
    src.stop(ctx.currentTime + durationMs / 1000);
  } catch {}
}

type Phase = "idle" | "flash" | "noise" | "navigate";

export default function SecretTV() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");

  const handleTurnOn = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("flash");
    playStaticSound(800);

    // 1. 플래시 (0.15초)
    setTimeout(() => setPhase("noise"), 150);

    // 2. 노이즈 (지지직) 후 이동
    setTimeout(() => {
      setPhase("navigate");
      router.push("/video-room");
    }, 750);
  }, [phase, router]);

  return (
    <>
      {/* TV 본체 — 오른쪽 하단, 풀숲 근처 */}
      <motion.div
        className="relative flex justify-end mt-12 mb-4 cursor-pointer select-none"
        style={{ minHeight: 120 }}
        onMouseEnter={() => {}}
      >
        <motion.div
          className="relative w-[100px] sm:w-[120px] group"
          onClick={handleTurnOn}
          title="비밀의 입구: 버려진 브라운관 TV"
          aria-label="비밀의 입구: TV를 켜서 비디오방으로 이동"
          whileHover={{
            scale: 1.02,
            x: [0, -2, 2, -1, 0],
            y: [0, 1, -1, 0, 0],
            transition: { duration: 0.4 },
          }}
          animate={
            phase === "idle"
              ? {}
              : phase === "flash" || phase === "noise"
                ? { scale: 1 }
                : {}
          }
        >
          {/* TV SVG */}
          <svg viewBox="0 0 120 100" className="w-full h-auto drop-shadow-lg">
            <defs>
              <linearGradient id="tv-body" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a4a4a" />
                <stop offset="50%" stopColor="#3a3a3a" />
                <stop offset="100%" stopColor="#2a2a2a" />
              </linearGradient>
              <linearGradient id="tv-screen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </linearGradient>
              <linearGradient id="tv-glass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="50%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
              </linearGradient>
            </defs>

            {/* 본체 — 두꺼운 플라스틱 케이스 */}
            <rect x="8" y="25" width="104" height="70" rx="4" fill="url(#tv-body)" stroke="#333" strokeWidth="1" />
            <rect x="12" y="29" width="96" height="50" rx="2" fill="url(#tv-screen)" stroke="#1a1a1a" strokeWidth="1" />

            {/* 볼록한 유리 광택 */}
            <rect x="12" y="29" width="96" height="50" rx="2" fill="url(#tv-glass)" style={{ mixBlendMode: "overlay" }} />

            {/* 안테나 — 비뚤어진 V자 (호버 시 찌릿) */}
            <g transform="translate(60, 15)">
              <line x1="-10" y1="10" x2="-25" y2="-10" stroke="#555" strokeWidth="2" strokeLinecap="round" />
              <line x1="10" y1="10" x2="25" y2="-10" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* 오른쪽: 채널 다이얼 */}
            <circle cx="95" cy="55" r="8" fill="#2a2a2a" stroke="#444" strokeWidth="1" />
            <circle cx="95" cy="55" r="5" fill="#333" stroke="#555" strokeWidth="0.5" />

            {/* 전원 버튼 */}
            <circle cx="95" cy="72" r="4" fill="#8b2525" stroke="#5a1515" strokeWidth="1" />
            <circle cx="95" cy="72" r="2" fill="#a03030" />
          </svg>
        </motion.div>
      </motion.div>

      {/* 전체 화면 오버레이 — 켜질 때 */}
      <AnimatePresence>
        {(phase === "flash" || phase === "noise") && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 1. 플래시 — 가로 하얀 선 */}
            <AnimatePresence>
              {phase === "flash" && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <motion.div
                    className="w-full h-[2px] bg-white"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.05 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. 노이즈 — 지지직 (첫 번째 것만 유지) */}
            <AnimatePresence>
              {phase === "noise" && (
                <motion.div
                  className="absolute inset-0 bg-black flex items-center justify-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className="absolute inset-0 w-full h-full static-noise"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      opacity: 1,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
