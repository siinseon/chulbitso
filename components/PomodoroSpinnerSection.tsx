"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const FOCUS_MINUTES = 25;
const ROTATION_DURATION_MS = 3500; // 3.5초에 1바퀴
const ACCELERATE_MS = 800;
const DECELERATE_MS = 1200;

/* 십자가 손잡이 4색: 바랜 느낌 (낡고 흐려진 톤) */
const HANDLE_RUSTY_ORANGE = "#9a6b58";
const HANDLE_VINTAGE_BLUE = "#6a7278";
const HANDLE_SAGE_GREEN = "#7a8268";
const HANDLE_YELLOW = "#a89268";
const HANDLE_COLORS = [HANDLE_RUSTY_ORANGE, HANDLE_VINTAGE_BLUE, HANDLE_SAGE_GREEN, HANDLE_YELLOW] as const;

/* 바닥: 진한 갈색 + 바랜 낡은 느낌 */
const FLOOR_DARK = "#35281f";
const FLOOR_MID = "#423528";
const FLOOR_LIGHT = "#524532";

export default function PomodoroSpinnerSection() {
  const [phase, setPhase] = useState<"idle" | "accelerating" | "running" | "decelerating">("idle");
  const [remainingSec, setRemainingSec] = useState(FOCUS_MINUTES * 60);
  const [rotationDeg, setRotationDeg] = useState(0);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rotationRef = useRef(0);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const stopSpinner = useCallback(() => {
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
      spinIntervalRef.current = null;
    }
    setPhase("idle");
    setRemainingSec(FOCUS_MINUTES * 60);
  }, []);

  /* 빨간 버튼: 한 번 누르면 시작, 한 번 더 누르면 멈춤 */
  const handleRedButton = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase === "running" || phase === "accelerating") {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
      setPhase("idle");
      setRemainingSec(FOCUS_MINUTES * 60);
    } else if (phase === "idle" || phase === "decelerating") {
      setPhase("accelerating");
      setRemainingSec(FOCUS_MINUTES * 60);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "accelerating") {
      const t0 = Date.now();
      const run = () => {
        const elapsed = Date.now() - t0;
        if (elapsed >= ACCELERATE_MS) {
          setPhase("running");
          return;
        }
        const t = elapsed / ACCELERATE_MS;
        const eased = t * t; // ease-in
        rotationRef.current = eased * 90;
        setRotationDeg(rotationRef.current);
      };
      const id = setInterval(run, 16);
      return () => clearInterval(id);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "running") {
      const degPerMs = 360 / ROTATION_DURATION_MS;
      const startDeg = rotationRef.current;
      const t0 = Date.now();

      spinIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - t0;
        const newRemaining = Math.max(0, FOCUS_MINUTES * 60 - Math.floor(elapsed / 1000));
        setRemainingSec(newRemaining);

        if (newRemaining <= 0) {
          if (spinIntervalRef.current) {
            clearInterval(spinIntervalRef.current);
            spinIntervalRef.current = null;
          }
          setPhase("decelerating");
          return;
        }

        rotationRef.current = startDeg + elapsed * degPerMs;
        setRotationDeg(rotationRef.current);
      }, 50);

      return () => {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "decelerating") {
      const startDeg = rotationRef.current;
      const t0 = Date.now();
      const degPerMs = 360 / ROTATION_DURATION_MS;
      const coastDeg = degPerMs * DECELERATE_MS * 0.5; // 감속 동안 더 돌 거리

      const run = () => {
        const elapsed = Date.now() - t0;
        if (elapsed >= DECELERATE_MS) {
          setRotationDeg(startDeg + coastDeg);
          stopSpinner();
          return;
        }
        const t = elapsed / DECELERATE_MS;
        const eased = 1 - (1 - t) * (1 - t);
        rotationRef.current = startDeg + coastDeg * eased;
        setRotationDeg(rotationRef.current);
      };

      const id = setInterval(run, 16);
      const final = setTimeout(() => stopSpinner(), DECELERATE_MS);
      return () => {
        clearInterval(id);
        clearTimeout(final);
      };
    }
  }, [phase, stopSpinner]);

  return (
    <section
      className="rounded-2xl p-5 border overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #e8ddc8 0%, #ddd4bc 100%)",
        borderColor: "rgba(100, 95, 85, 0.35)",
        boxShadow: "0 4px 20px rgba(58, 49, 40, 0.18), inset 0 0 60px rgba(180, 165, 140, 0.08)",
      }}
    >
      <h3 className="text-[15px] sm:text-[16px] font-bold text-primary font-serif mb-4 flex items-center gap-2">
        🎠 놀이터 회전무대
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4">
        빨간 버튼을 누르면 25분 타이머 시작,
        <br />
        한 번 더 누르면 멈춰요.
      </p>

      {/* 회전무대 컨테이너 (시작/멈춤은 빨간 버튼으로) */}
      <div
        className="relative mx-auto flex items-center justify-center select-none touch-pan-y"
        style={{ width: 220, height: 220 }}
      >
        {/* 그림자 */}
        <div
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 200,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse 80% 30% at 50% 100%, rgba(0,0,0,0.15), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* 회전 플랫폼: 낡고 바랜 느낌 */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            width: 180,
            height: 180,
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 0 0 2px rgba(60,50,40,0.4), inset 0 2px 8px rgba(0,0,0,0.15)",
            transition: phase === "idle" ? "transform 0.1s ease-out" : "none",
          }}
        >
          {/* 바닥: 진한 갈색 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${FLOOR_LIGHT} 0%, ${FLOOR_MID} 50%, ${FLOOR_DARK} 100%)`,
              boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.3)",
            }}
          />
          {/* 낡은 나무 결 + 얼룩 */}
          <div
            className="absolute inset-0 rounded-full opacity-[0.45]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 5px),
                repeating-linear-gradient(0deg, transparent 0px, transparent 6px, rgba(0,0,0,0.05) 6px, rgba(0,0,0,0.05) 8px)
              `,
            }}
          />
          {/* 바랜 먼지/햇빛 오버레이 */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(180,165,140,0.18) 0%, transparent 70%)",
            }}
          />

          {/* 십자가 손잡이 4개: 알록달록 (녹슨 오렌지, 빈티지 블루, 세이지 그린, 노랑) */}
          {[0, 90, 180, 270].map((deg, i) => (
            <div
              key={deg}
              className="absolute"
              style={{
                width: 180,
                height: 180,
                left: "50%",
                top: "50%",
                marginLeft: -90,
                marginTop: -90,
                transform: `rotate(${deg}deg)`,
                transformOrigin: "center center",
              }}
            >
              <svg
                width="180"
                height="180"
                viewBox="0 0 180 180"
                fill="none"
                style={{ overflow: "visible" }}
              >
                <line
                  x1="90"
                  y1="90"
                  x2="90"
                  y2="8"
                  stroke={HANDLE_COLORS[i]}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity={0.92}
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                  }}
                />
              </svg>
            </div>
          ))}
        </div>

        {/* 빨간 버튼: 원의 정가운데 */}
        <div
          className="absolute z-10"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <button
            type="button"
            onClick={handleRedButton}
            className="rounded-full flex-shrink-0 cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-primary/40"
            style={{
              width: 37,
              height: 37,
              background: "linear-gradient(180deg, #7a3530 0%, #5e2620 50%, #3d1a16 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.35), 0 3px 10px rgba(0,0,0,0.35)",
              border: "2px solid #4a221c",
            }}
            aria-label={phase === "running" || phase === "accelerating" ? "타이머 멈춤" : "타이머 시작"}
          />
          {/* 버튼 위 바랜 먼지감 */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              width: 37,
              height: 37,
              marginTop: -18.5,
              marginLeft: -18.5,
              background: "radial-gradient(circle at 30% 30%, rgba(200,180,160,0.12) 0%, transparent 60%)",
            }}
          />
        </div>
      </div>

      {/* 시간 표시: 회전무대 밑으로 (바랜 톤) */}
      <p
        className="font-mono text-[13px] font-bold tabular-nums text-center mt-2"
        style={{
          color: "#4a4035",
          textShadow: "0 1px 0 rgba(255,248,240,0.4)",
        }}
      >
        {formatTime(remainingSec)}
      </p>

      {(phase === "running" || phase === "accelerating") && (
        <p className="text-[11px] text-text-muted text-center mt-3 font-serif">
          집중 시간이 흐르는 중...
        </p>
      )}
    </section>
  );
}
