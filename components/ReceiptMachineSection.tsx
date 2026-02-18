"use client";

interface ReceiptMachineSectionProps {
  onOpenReceipt: () => void;
}

/** 시대 주파수 튜너 라디오와 같은 컬러톤 + 낡은 느낌 */
const LCD_NEON_GREEN = "#39ff14";

/** 영수증 발급기 모양의 가쪽비 계산하기 섹션 (라디오 컬러 + 빈티지) */
export default function ReceiptMachineSection({ onOpenReceipt }: ReceiptMachineSectionProps) {
  return (
    <section className="flex flex-col items-center relative">
      <div
        className="w-full max-w-[272px] rounded-xl overflow-hidden relative"
        style={{
          background: "linear-gradient(165deg, #32302e 0%, #2a2826 40%, #1c1b1a 100%)",
          boxShadow:
            "0 10px 36px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.25) inset",
          border: "1px solid #3a3836",
        }}
      >
        {/* 낡은 느낌: 바랜 먼지·산화감 오버레이 */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
          style={{
            background: "radial-gradient(ellipse 90% 80% at 50% 20%, rgba(120, 100, 80, 0.12) 0%, transparent 60%), linear-gradient(180deg, transparent 0%, rgba(60, 50, 40, 0.06) 100%)",
          }}
        />
        {/* 상단 곡선 몸체 */}
        <div className="px-3 pt-4 pb-3 relative z-10">
          {/* LCD 화면: 스큐어모피즘 — 안으로 들어간 창, 프레임 베벨 */}
          <div
            className="rounded-lg overflow-hidden mb-4"
            style={{
              background: "linear-gradient(180deg, #a0a09e 0%, #8a8886 50%, #7a7876 100%)",
              boxShadow:
                "inset 0 2px 0 rgba(255,255,255,0.4), inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 4px 12px rgba(0,0,0,0.25)",
              border: "1px solid #6a6866",
            }}
          >
            <div
              className="rounded overflow-hidden"
              style={{
                background: "#0a0a0a",
                minHeight: 72,
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              <div className="px-2.5 py-2.5 font-mono text-[10px] font-bold leading-tight space-y-0.5" style={{ color: LCD_NEON_GREEN, textShadow: `0 0 6px ${LCD_NEON_GREEN}, 0 0 12px rgba(57,255,20,0.4)` }}>
                <div>1. 소비자소득공제</div>
                <div>2. 사업자지출증빙</div>
                <div>3. 자진(자동)발급</div>
                <div className="flex items-center justify-between opacity-90">
                  <span>4. 영수증출력</span>
                  <span className="text-[9px] opacity-70">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* 키패드 영역 */}
          <div className="flex gap-1.5">
            {/* 숫자/기능키 영역 */}
            <div className="flex-1 grid grid-cols-3 gap-0.5">
              {/* 상단 기능키 */}
              <div className="col-span-3 grid grid-cols-6 gap-0.5 mb-0.5">
                {["메뉴", "정산", "▲", "▼", "부가1", "부가2"].map((label) => (
                  <div
                    key={label}
                    className="h-5 rounded flex items-center justify-center text-[8px] font-bold"
                    style={{
                      background: "linear-gradient(145deg, #d0cecc 0%, #a8a6a4 30%, #7a7876 100%)",
                      color: "#1f2937",
                      boxShadow:
                        "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.25)",
                      border: "1px solid #9a9896",
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
              {/* 숫자 키패드 1-9: 볼록한 플라스틱 키 */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <div
                  key={n}
                  className="aspect-square rounded flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "linear-gradient(145deg, #d0cecc 0%, #a8a6a4 30%, #7a7876 100%)",
                    color: "#1f2937",
                    boxShadow:
                      "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.25)",
                    border: "1px solid #9a9896",
                  }}
                >
                  {n}
                </div>
              ))}
              {/* 하단 0, 00 */}
              <div
                className="aspect-square rounded flex items-center justify-center text-xs font-bold"
                style={{
                  background: "linear-gradient(145deg, #d0cecc 0%, #a8a6a4 30%, #7a7876 100%)",
                  color: "#1f2937",
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.25)",
                  border: "1px solid #9a9896",
                }}
              >
                0
              </div>
              <div
                className="aspect-square rounded flex items-center justify-center text-xs font-bold"
                style={{
                  background: "linear-gradient(145deg, #d0cecc 0%, #a8a6a4 30%, #7a7876 100%)",
                  color: "#1f2937",
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.25)",
                  border: "1px solid #9a9896",
                }}
              >
                00
              </div>
              <div
                className="aspect-square rounded flex items-center justify-center text-xs font-bold opacity-50"
                style={{
                  background: "linear-gradient(145deg, #9a9896 0%, #7a7876 50%, #6a6866 100%)",
                  color: "#4b5563",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.25)",
                  border: "1px solid #6b6a68",
                }}
              >
                .
              </div>
            </div>

            {/* 오른쪽 액션 버튼: 스큐어모피즘 볼록 버튼 */}
            <div className="flex flex-col gap-1 w-12">
              <button
                type="button"
                className="flex-1 min-h-[28px] rounded text-[8px] font-bold flex items-center justify-center px-1"
                style={{
                  background: "linear-gradient(145deg, #e8d88a 0%, #d4b86a 25%, #b8952e 60%, #8a6e1a 100%)",
                  color: "#422006",
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3)",
                  border: "1px solid #8a7a2a",
                }}
              >
                취소/정정
              </button>
              <button
                type="button"
                className="flex-1 min-h-[28px] rounded text-[8px] font-bold flex items-center justify-center px-1"
                style={{
                  background: "linear-gradient(145deg, #d89898 0%, #c47a7a 25%, #a84848 60%, #7a2a2a 100%)",
                  color: "#fff5f5",
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.3)",
                  border: "1px solid #6a3232",
                }}
              >
                지움
              </button>
              <button
                type="button"
                onClick={onOpenReceipt}
                className="flex-1 min-h-[28px] rounded text-[9px] font-bold flex items-center justify-center px-1 active:scale-95 transition-transform"
                style={{
                  background: "linear-gradient(180deg, #252525 0%, #1a1a1a 50%, #0a0a0a 100%)",
                  color: LCD_NEON_GREEN,
                  textShadow: `0 0 6px ${LCD_NEON_GREEN}, 0 0 10px rgba(57,255,20,0.5)`,
                  boxShadow:
                    "inset 0 2px 0 rgba(57,255,20,0.15), inset 0 -1px 0 rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)",
                  border: "1px solid #2a4a1a",
                }}
              >
                입력
              </button>
            </div>
          </div>
        </div>

        {/* 영수증 출력구: 안으로 파인 슬롯 */}
        <div
          className="h-2.5 mx-6 rounded-b flex items-center justify-center relative z-10"
          style={{
            background: "linear-gradient(180deg, #1a1918 0%, #0d0c0c 100%)",
            boxShadow: "inset 0 3px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
            borderTop: "1px solid #2a2826",
          }}
        >
          <div
            className="w-20 h-1 rounded-full"
            style={{
              background: "linear-gradient(180deg, #0a0a0a 0%, #000 100%)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)",
            }}
          />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-text-muted font-serif">가쪽비 영수증 발급기 · 입력 버튼을 누르세요</p>
    </section>
  );
}
