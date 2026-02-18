"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { parseReview, serializeReview, type BookReviewParts } from "@/lib/reviewUtils";

interface FloppyDiskReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  bookAuthor?: string;
  initialReview?: string;
  /** 편집 후 저장 (mode="edit"일 때만 사용) */
  onSave?: (text: string) => void;
  /** "view"면 읽기 전용(플로피 보관함에서 보기), "edit"면 쓰기/저장 */
  mode?: "edit" | "view";
}

type Phase = "writing" | "inserting" | "done";

const LABELS: { key: keyof BookReviewParts; label: string; placeholder: string }[] = [
  { key: "purchase", label: "구매버튼", placeholder: "" },
  { key: "make", label: "만듦새", placeholder: "" },
  { key: "review", label: "서평", placeholder: "" },
];

/** 철컥 효과용 비프음 */
function playInsertSound() {
  try {
    const Ctx = typeof window !== "undefined" ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) : null;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 200;
    osc.type = "square";
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // ignore
  }
}

export default function FloppyDiskReviewModal({
  isOpen,
  onClose,
  bookTitle,
  bookAuthor = "",
  initialReview = "",
  onSave,
  mode = "edit",
}: FloppyDiskReviewModalProps) {
  const [parts, setParts] = useState<BookReviewParts>(() => parseReview(initialReview));
  const [phase, setPhase] = useState<Phase>("writing");
  const isViewMode = mode === "view";
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const justOpened = isOpen && !wasOpenRef.current;
    wasOpenRef.current = isOpen;
    if (justOpened) {
      setParts(parseReview(initialReview));
      setPhase("writing");
    }
  }, [isOpen, initialReview]);

  const handleSave = useCallback(() => {
    if (!onSave) return;
    onSave(serializeReview(parts));
    setPhase("inserting");
    setTimeout(() => playInsertSound(), 900);
    setTimeout(() => {
      setPhase("done");
      onClose();
    }, 1800);
  }, [parts, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[3500] flex justify-center items-center bg-white/50"
      role="dialog"
      aria-modal="true"
      aria-label="플로피 디스크 리뷰"
    >
      {/* 딤 배경 */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={phase === "writing" ? onClose : undefined}
        aria-hidden
      />

      {/* 디스크 드라이브 슬롯 (inserting 시) */}
      {phase === "inserting" && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[3501] pointer-events-none animate-drive-slot-appear"
          style={{ bottom: "0" }}
        >
          <div
            className="relative w-[160px] rounded-t-xl px-5 pt-3 pb-8"
            style={{
              background: "linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 30%, #1a1a1a 100%)",
              boxShadow: "inset 0 0 0 1px #555, 0 -6px 24px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="w-full h-[28px] rounded-sm"
              style={{
                background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 50%, #050505 100%)",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9)",
              }}
            />
            <div
              className="absolute bottom-4 right-5 w-2.5 h-2.5 rounded-full animate-led-blink"
              style={{ background: "#ff2222", boxShadow: "0 0 8px #ff4444" }}
              aria-hidden
            />
          </div>
        </div>
      )}

      {/* 플로피 디스크 팝업 — 이미지 구조 그대로 */}
      <div
        className={`relative z-[3502] origin-center ${
          phase === "inserting"
            ? "animate-disk-insert"
            : "animate-floppy-pop-in"
        }`}
        style={
          phase === "inserting"
            ? ({ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } as React.CSSProperties)
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-[300px] overflow-visible rounded-lg"
          style={{
            background: "#1a1a1a",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
          }}
        >
          {/* 1. 상단 — 실버 라벨 영역 (책 제목, 저자 이름) — 둥근 모서리 */}
          <div
            className="relative px-4 py-3 mx-6 mt-3 rounded-lg border-b border-[#333]"
            style={{
              background: "linear-gradient(180deg, #c8c8c8 0%, #a8a8a8 50%, #909090 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            <div className="pr-12">
              <p className="text-[13px] font-bold text-black truncate">
                {bookTitle}
              </p>
              <p className="text-[12px] font-bold text-black mt-0.5 truncate">
                {bookAuthor || "저자 이름"}
              </p>
            </div>
            {/* 우측 블랙 컷아웃 (write-protect 탭 느낌) */}
            <div
              className="absolute top-3 right-3 w-4 h-10 rounded-sm"
              style={{ background: "#1a1a1a" }}
              aria-hidden
            />
          </div>

          {/* 검은색 영역 — 실버 라벨과 오프화이트 사이 */}
          <div
            className="h-6 mx-6"
            style={{ background: "#1a1a1a" }}
            aria-hidden
          />

          {/* 2. 메인 — 오프화이트 셔터 영역 (위쪽 여백 + 구매버튼, 만듦새, 서평) */}
          <div
            className="px-4 pt-10 pb-3 min-h-[165px] mx-6 mb-0 rounded-t-sm"
            style={{
              background: "linear-gradient(180deg, #f5f5f0 0%, #ebebe5 100%)",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
            }}
          >
            {phase === "writing" ? (
              isViewMode ? (
                <>
                  {LABELS.map(({ key, label }) => (
                    parts[key] ? (
                      <div key={key} className="mb-3">
                        <p className="text-[11px] font-bold text-[#666] mb-0.5">{label}</p>
                        <p className="text-[12px] text-black whitespace-pre-wrap break-words" style={{ color: "#1a1a1a" }}>
                          {parts[key]}
                        </p>
                      </div>
                    ) : null
                  ))}
                  {!parts.purchase && !parts.make && !parts.review && (
                    <p className="text-[12px] text-[#999]">작성된 내용이 없어요.</p>
                  )}
                </>
              ) : (
                <>
                  {LABELS.map(({ key, label, placeholder }) => (
                    <div key={key} className="mb-2">
                      <p className="text-[12px] font-bold text-black mb-1">{label}</p>
                      {key === "review" ? (
                        <textarea
                          value={parts[key]}
                          onChange={(e) => setParts((prev) => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          rows={2}
                          className="w-full text-[12px] resize-none bg-transparent border-0 border-b border-[#999] rounded-none px-0 py-1 focus:outline-none focus:ring-0 focus:border-[#666] placeholder:text-[#999]"
                          style={{ color: "#1a1a1a" }}
                          aria-label={label}
                        />
                      ) : (
                        <input
                          type="text"
                          value={parts[key]}
                          onChange={(e) => setParts((prev) => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full text-[12px] bg-transparent border-0 border-b border-[#999] rounded-none px-0 py-1 focus:outline-none focus:ring-0 focus:border-[#666] placeholder:text-[#999]"
                          style={{ color: "#1a1a1a" }}
                          aria-label={label}
                        />
                      )}
                    </div>
                  ))}
                </>
              )
            ) : phase === "inserting" ? (
              <div className="py-8 text-center text-[13px] font-bold" style={{ color: "#666" }}>
                저장 중...
              </div>
            ) : null}
          </div>

          {/* 3. 하단 — view면 닫기, edit면 저장 버튼 */}
          {phase === "writing" && (
            <div className="px-6">
              {isViewMode ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 text-[13px] font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-opacity hover:opacity-95 active:opacity-90 rounded-b-sm"
                  style={{
                    background: "#555",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  닫기
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full py-3 text-[13px] font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-opacity hover:opacity-95 active:opacity-90 rounded-b-sm"
                  style={{
                    background: "#2563eb",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  저장
                </button>
              )}
            </div>
          )}

          {/* 4. 다크 바디 하단 — 양쪽 작은 흰색 사각형 홀 */}
          <div className="h-5 px-4 flex items-center justify-between rounded-b-lg" style={{ background: "#1a1a1a" }}>
            <div
              className="w-2.5 h-2.5 rounded-[2px] flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid #444" }}
              aria-hidden
            />
            <div
              className="w-2.5 h-2.5 rounded-[2px] flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid #444" }}
              aria-hidden
            />
          </div>
        </div>

        {(phase === "writing" || isViewMode) && (
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 z-10"
            aria-label="닫기"
          >
            <X size={16} strokeWidth={2} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
