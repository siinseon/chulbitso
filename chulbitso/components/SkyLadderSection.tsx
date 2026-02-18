"use client";

interface SkyLadderSectionProps {
  totalPages: number;
  heightCm: number;
}

const CM_PER_STEP = 10;

/* SVG Repo ladder-svgrepo-com (viewBox 0 0 512 512) */
function LadderSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      fill="none"
    >
      <g>
        <path fill="#957755" d="M100.512,100.512L100.512,100.512c0-12.575,10.193-22.768,22.768-22.768h265.44 c12.575,0,22.768,10.193,22.768,22.768l0,0c0,12.575-10.193,22.768-22.768,22.768H123.28 C110.705,123.28,100.512,113.086,100.512,100.512z" />
        <path fill="#957755" d="M100.512,256.555L100.512,256.555c0-12.575,10.193-22.768,22.768-22.768h265.44 c12.575,0,22.768,10.193,22.768,22.768l0,0c0,12.575-10.193,22.768-22.768,22.768H123.28 C110.705,279.323,100.512,269.13,100.512,256.555z" />
        <path fill="#957755" d="M100.512,410.933L100.512,410.933c0-12.575,10.193-22.768,22.768-22.768h265.44 c12.575,0,22.768,10.193,22.768,22.768l0,0c0,12.575-10.193,22.768-22.768,22.768H123.28 C110.705,433.701,100.512,423.507,100.512,410.933z" />
      </g>
      <g>
        <path fill="#806749" d="M157.153,100.512L157.153,100.512c0-12.575,10.193-22.768,22.768-22.768H123.28 c-12.575,0-22.768,10.193-22.768,22.768l0,0c0,12.575,10.193,22.768,22.768,22.768h56.641 C167.346,123.28,157.153,113.086,157.153,100.512z" />
        <path fill="#806749" d="M157.153,256.555L157.153,256.555c0-12.575,10.193-22.768,22.768-22.768H123.28 c-12.575,0-22.768,10.193-22.768,22.768l0,0c0,12.575,10.193,22.768,22.768,22.768h56.641 C167.346,279.323,157.153,269.13,157.153,256.555z" />
        <path fill="#806749" d="M157.153,410.933L157.153,410.933c0-12.575,10.193-22.768,22.768-22.768H123.28 c-12.575,0-22.768,10.193-22.768,22.768l0,0c0,12.575,10.193,22.768,22.768,22.768h56.641 C167.346,433.701,157.153,423.507,157.153,410.933z" />
      </g>
      <g>
        <path fill="#6B5742" d="M411.488,512c-12.555,0-22.768-10.213-22.768-22.768V22.768C388.72,10.213,398.934,0,411.488,0 s22.768,10.213,22.768,22.768v466.464C434.256,501.787,424.043,512,411.488,512z" />
        <path fill="#6B5742" d="M100.512,512c-12.555,0-22.768-10.213-22.768-22.768V22.768C77.744,10.213,87.957,0,100.512,0 s22.768,10.213,22.768,22.768v466.464C123.28,501.787,113.066,512,100.512,512z" />
      </g>
      <g>
        <path fill="#5F4C37" d="M416.486,489.232V22.768c0-7.327,3.493-13.837,8.885-18.004C421.524,1.789,416.716,0,411.488,0 c-12.555,0-22.768,10.213-22.768,22.768v466.464c0,12.555,10.213,22.768,22.768,22.768c5.228,0,10.036-1.789,13.883-4.763 C419.979,503.069,416.486,496.559,416.486,489.232z" />
        <path fill="#5F4C37" d="M105.51,489.232V22.768c0-7.327,3.493-13.837,8.885-18.004C110.548,1.789,105.74,0,100.512,0 C87.957,0,77.744,10.213,77.744,22.768v466.464c0,12.555,10.213,22.768,22.768,22.768c5.228,0,10.036-1.789,13.883-4.763 C109.003,503.069,105.51,496.559,105.51,489.232z" />
      </g>
    </svg>
  );
}

export default function SkyLadderSection({ totalPages, heightCm }: SkyLadderSectionProps) {
  const hasData = totalPages > 0;
  const stepCount = hasData ? Math.floor(heightCm / CM_PER_STEP) : 0;
  const heightM = heightCm >= 100 ? (heightCm / 100).toFixed(1) : null;
  const heightDisplay = hasData
    ? heightCm >= 100
      ? `${heightM}m`
      : `${heightCm.toFixed(1)}cm`
    : "-";

  return (
    <section
      className="rounded-2xl p-5 border border-secondary overflow-visible"
      style={{
        background: "linear-gradient(180deg, #F2E6D0 0%, #E8DCC8 100%)",
        boxShadow: "0 4px 24px rgba(58, 49, 40, 0.1)",
      }}
    >
      <h3 className="text-[15px] font-bold text-primary font-serif mb-1 flex items-center gap-2">
        하늘사다리
      </h3>
      <p className="text-[12px] text-text-muted font-serif mb-4 leading-relaxed">
        지식의 높이!
        <br />
        읽은 페이지만큼 한 칸씩 올라가요
        <br />
        <span className="text-[12px] opacity-90">(총 쪽수 × 0.1mm (종이 두께), 10cm = 1칸)</span>
      </p>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-6">
        <div className="flex-shrink-0 order-1 sm:order-1 sm:mx-0 mx-auto w-28 h-36 flex items-center justify-center">
          <LadderSvg className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 order-2 sm:order-2 text-center sm:text-left">
          <p className="text-[20px] sm:text-[24px] font-bold text-primary font-serif">
            {heightDisplay}의 기록
          </p>
          {hasData && (
            <>
              <p className="text-[14px] font-medium text-accent-warm mt-1 font-sans">
                {stepCount}번째 칸에 올라왔어요
              </p>
              <p className="text-[13px] text-text-muted mt-0.5 font-sans">
                총 {totalPages.toLocaleString()}쪽 읽음 (10cm = 1칸)
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
