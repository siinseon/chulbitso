"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Sun, Cloud, CloudRain, CloudSnow, CloudFog, Moon, Scissors } from "lucide-react";
import type { Book } from "@/lib/useBooks";
import DecisionHorseModal from "./DecisionHorseModal";
import { OWNERSHIP_LABELS, READING_STATUS_LABELS } from "@/lib/supabase/types";
import { usePaperReviews } from "@/lib/usePaperReviews";

const COUNTRY_OPTIONS: { code: string; name: string }[] = [
  { code: "", name: "미입력 / 선택" },
  { code: "KR", name: "한국" },
  { code: "US", name: "미국" },
  { code: "JP", name: "일본" },
  { code: "GB", name: "영국" },
  { code: "DE", name: "독일" },
  { code: "FR", name: "프랑스" },
  { code: "CN", name: "중국" },
  { code: "TW", name: "대만" },
  { code: "IT", name: "이탈리아" },
  { code: "ES", name: "스페인" },
  { code: "RU", name: "러시아" },
  { code: "IN", name: "인도" },
  { code: "BR", name: "브라질" },
  { code: "CA", name: "캐나다" },
  { code: "AU", name: "호주" },
  { code: "MX", name: "멕시코" },
  { code: "NL", name: "네덜란드" },
  { code: "PL", name: "폴란드" },
  { code: "TR", name: "터키" },
  { code: "GR", name: "그리스" },
  { code: "PT", name: "포르투갈" },
  { code: "SE", name: "스웨덴" },
  { code: "NO", name: "노르웨이" },
  { code: "DK", name: "덴마크" },
  { code: "AT", name: "오스트리아" },
  { code: "CH", name: "스위스" },
  { code: "BE", name: "벨기에" },
  { code: "IE", name: "아일랜드" },
  { code: "TH", name: "태국" },
  { code: "VN", name: "베트남" },
  { code: "SG", name: "싱가포르" },
  { code: "IL", name: "이스라엘" },
  { code: "AR", name: "아르헨티나" },
  { code: "CL", name: "칠레" },
  { code: "CO", name: "콜롬비아" },
];

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onUpdateCountry?: (id: string, country: string) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (id: string) => void;
}

function Row({ label, value }: { label: string; value: string | number | undefined }) {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return (
    <div className="flex border-b border-amber-200/60 py-2.5">
      <span className="w-24 flex-shrink-0 text-[13px] font-mono text-text-main/70">{label}</span>
      <span className="text-[14px] font-handwriting text-text-main break-words">{String(value)}</span>
    </div>
  );
}

function WeatherIcon({ name, className }: { name: string; className?: string }) {
  if (name.includes("맑음")) return <Sun className={className} strokeWidth={1.5} />;
  if (name.includes("흐림")) return <Cloud className={className} strokeWidth={1.5} />;
  if (name.includes("비")) return <CloudRain className={className} strokeWidth={1.5} />;
  if (name.includes("눈")) return <CloudSnow className={className} strokeWidth={1.5} />;
  if (name.includes("안개")) return <CloudFog className={className} strokeWidth={1.5} />;
  if (name.includes("밤")) return <Moon className={className} strokeWidth={1.5} />;
  return <Cloud className={className} strokeWidth={1.5} />;
}

function formatMemoryDate(value: string | undefined): string {
  if (!value || !value.trim()) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}. ${m}. ${day}.`;
  } catch {
    return "—";
  }
}

export default function BookDetailModal({
  book,
  onClose,
  onUpdateCountry,
  onEdit,
  onDelete,
}: BookDetailModalProps) {
  const [tearActive, setTearActive] = useState(false);
  const [horseOpen, setHorseOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [flyPhase, setFlyPhase] = useState<"idle" | "folding" | "flying">("idle");
  const flyContentRef = useRef("");
  const { addReview } = usePaperReviews();

  useEffect(() => {
    if (!book) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [book, onClose]);

  if (!book) return null;

  const ownershipLabel = book.ownershipType ? OWNERSHIP_LABELS[book.ownershipType] : "쌓인 책";
  const readingLabel = book.readingStatus ? READING_STATUS_LABELS[book.readingStatus] : "-";
  const isCompleted = book.readingStatus === "FINISHED";

  const handleDelete = () => {
    if (!onDelete) return;
    setTearActive(true);
    setTimeout(() => {
      onDelete(book.id);
      onClose();
    }, 480);
  };

  const handleFlyReview = () => {
    flyContentRef.current = reviewText.trim() || "(빈 리뷰)";
    setFlyPhase("folding");
    setTimeout(() => setFlyPhase("flying"), 1000);
    setTimeout(() => {
      addReview({
        bookId: book.id,
        bookTitle: book.title,
        content: flyContentRef.current,
      });
      setReviewText("");
      setFlyPhase("idle");
    }, 2200);
  };

  const modal = (
    <div
      className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-detail-title"
    >
      <div
        className={`w-full max-w-[480px] max-h-[90dvh] sm:max-h-[85vh] loan-card rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-xl border border-amber-200/80 ${tearActive ? "tear-off-active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단: 닫기 + (선택) 삭제 */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-amber-200/60">
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300/80 bg-amber-50/80 font-mono text-[12px] text-amber-800 hover:bg-amber-100/80 transition-colors"
                aria-label="삭제하기"
              >
                <Scissors size={14} strokeWidth={2} />
                <span>삭제하기</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-100/80 text-text-main flex-shrink-0"
            aria-label="닫기"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* 대출 카드 본문: 폴라로이드(왼쪽) + 손글씨 정보(오른쪽) */}
          <div className="flex gap-4 items-start">
            {/* 폴라로이드: 책 표지 */}
            <div className="flex-shrink-0 pt-1">
              <div
                className="bg-white px-2.5 pt-2.5 pb-8 shadow-md border border-amber-200/80 rounded-sm"
                style={{ transform: "rotate(-2deg)", boxShadow: "4px 4px 12px rgba(58,49,40,0.12)" }}
              >
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-24 h-[132px] object-cover rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-24 h-[132px] rounded-sm bg-amber-100/60 flex items-center justify-center border border-amber-200/60">
                    <span className="text-[10px] font-mono text-amber-800/80 text-center px-2 line-clamp-4 leading-tight">
                      {book.title}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 relative">
              {/* 완독 도장 */}
              {isCompleted && (
                <div className="absolute top-0 right-0 stamp-completed" aria-hidden>
                  [ 수경 확인 ]
                </div>
              )}
              <h2
                id="book-detail-title"
                className="text-[17px] sm:text-[18px] font-mono font-bold text-primary leading-snug pr-28"
              >
                {book.title}
              </h2>
              {book.author && (
                <p className="text-[14px] font-handwriting text-text-main mt-1">{book.author}</p>
              )}
              {/* 구매하기 + 고독한 목마 (상단 노출) */}
              <div className="flex items-center gap-2 mt-3">
                <a
                  href={`https://search.kyobobook.co.kr/search?keyword=${encodeURIComponent(book.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg border border-amber-300/80 bg-amber-50/60 font-mono text-[12px] text-amber-900 text-center hover:bg-amber-100/80 transition-colors"
                >
                  구매하기
                </a>
                <button
                  type="button"
                  onClick={() => setHorseOpen(true)}
                  className="flex-shrink-0 w-10 h-10 rounded-lg border border-amber-300/80 bg-amber-50/60 hover:bg-amber-100/80 transition-colors flex items-center justify-center text-[18px]"
                  aria-label="고독한 목마"
                  title="고독한 목마"
                >
                  🐴
                </button>
              </div>
            </div>
          </div>

          {/* 타자기 느낌 라벨 + 손글씨 값 */}
          <div className="mt-4 font-mono text-[11px] text-text-main/60 uppercase tracking-wider border-b border-amber-200/60 pb-2">
            — 도서 정보 —
          </div>
          <div className="mt-2">
            <Row label="작가" value={book.author} />
            <Row label="공동저자" value={book.coAuthor} />
            <Row label="출판사" value={book.publisher} />
            <Row label="출간일" value={book.pubDate} />
            <Row label="판형" value={book.format} />
            <Row label="시리즈" value={book.series} />
            <Row label="분야" value={book.category} />
            <Row
              label="정가"
              value={
                book.retailPrice != null
                  ? `₩${Number(book.retailPrice).toLocaleString()}`
                  : undefined
              }
            />
            <Row label="ISBN" value={book.isbn} />
            <div className="flex border-b border-amber-200/60 py-2.5 items-center gap-2">
              <span className="w-24 flex-shrink-0 text-[13px] font-mono text-text-main/70">
                출판 국가
              </span>
              <div className="flex-1 min-w-0">
                {onUpdateCountry ? (
                  <select
                    value={book.country?.toUpperCase() ?? ""}
                    onChange={(e) => {
                      const v = e.target.value.trim().toUpperCase().slice(0, 2);
                      onUpdateCountry(book.id, v);
                    }}
                    className="w-full max-w-[200px] text-[14px] font-handwriting text-text-main border border-amber-300/80 rounded-lg px-3 py-2 bg-white/90 min-h-[44px]"
                  >
                    {COUNTRY_OPTIONS.map(({ code, name }) => (
                      <option key={code || "empty"} value={code}>
                        {code ? `${name} (${code})` : name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-[14px] font-handwriting text-text-main">
                    {book.country
                      ? `${COUNTRY_OPTIONS.find((c) => c.code === book.country)?.name ?? book.country} (${book.country})`
                      : "미입력"}
                  </span>
                )}
              </div>
            </div>
            <Row label="소유형태" value={ownershipLabel} />
            <Row label="독서상태" value={readingLabel} />
          </div>

          {/* 감성 기록 */}
          <div className="rounded-xl bg-amber-50/60 border border-amber-200/60 p-4 my-4">
            <p className="text-[12px] font-mono font-bold text-primary mb-3">감성 기록</p>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary flex items-center justify-center animate-spin-slow shadow-md">
                <div className="w-4 h-4 rounded-full bg-ivory ring-2 ring-primary" />
              </div>
              <div className="flex-1 min-w-0">
                {book.bgmTitle || book.bgmArtist ? (
                  <p className="text-[14px] font-handwriting text-text-main">
                    🎵 {[book.bgmTitle, book.bgmArtist].filter(Boolean).join(" - ")}
                  </p>
                ) : (
                  <p className="text-[13px] text-amber-800/70">이 책의 BGM을 기록해주세요</p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-[12px] text-amber-800/60">
                  {book.weather && (
                    <span className="flex items-center gap-1">
                      <WeatherIcon name={book.weather} className="w-3.5 h-3.5" />
                      {book.weather.replace(/^[^\s]+\s/, "")}
                    </span>
                  )}
                  {(book.readDates?.[0]?.start || book.pubDate) && (
                    <span>
                      {formatMemoryDate(book.readDates?.[0]?.start ?? book.pubDate ?? "")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 종이비행기 리뷰: 누런 갱지 */}
          <div className="lined-paper rounded-lg p-4 my-4 min-h-[100px]">
            <p className="text-[11px] font-mono text-amber-900/70 mb-2">✈️ 종이비행기 리뷰</p>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="이 책에 대한 생각을 적어 날려보세요..."
              className="w-full min-h-[72px] bg-transparent border-none outline-none resize-none text-[13px] font-handwriting text-text-main placeholder:text-amber-800/50"
              rows={4}
            />
            <button
              type="button"
              onClick={handleFlyReview}
              disabled={flyPhase !== "idle"}
              className="mt-2 w-full py-2.5 rounded-lg border-2 border-primary/60 bg-primary/10 font-mono text-[13px] font-bold text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors"
            >
              [ 날리기 ]
            </button>
          </div>

          {/* 포스트잇 메모 */}
          <div className="post-it-note p-4 rounded-sm my-4">
            <p className="text-[11px] font-mono text-amber-900/70 mb-2">메모</p>
            <p className="text-[13px] font-handwriting text-text-main min-h-[60px] whitespace-pre-wrap">
              {book.description?.trim() || "메모를 남겨보세요 (상세 기록 수정에서 입력)"}
            </p>
          </div>

          {onEdit && (
            <div className="pt-2 pb-4">
              <button
                type="button"
                onClick={() => {
                  onEdit(book);
                  onClose();
                }}
                className="w-full py-3.5 min-h-[48px] rounded-xl border-2 border-primary text-primary font-mono font-bold text-[14px] hover:bg-primary hover:text-white active:opacity-90 transition-colors"
              >
                상세 기록 수정
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const flyOverlay =
    flyPhase !== "idle" ? (
      <div
        className="fixed inset-0 z-[3200] flex items-center justify-center bg-black/20 pointer-events-none"
        aria-hidden
      >
        <div
          className={`absolute bottom-1/4 w-4/5 max-w-[280px] rounded-lg overflow-hidden lined-paper p-4 shadow-2xl ${
            flyPhase === "folding" ? "paper-fold-active" : "paper-fly-active"
          }`}
          style={{ minHeight: "100px" }}
        >
          <p className="text-[12px] font-handwriting text-text-main whitespace-pre-wrap line-clamp-6">
            {flyContentRef.current}
          </p>
        </div>
      </div>
    ) : null;

  if (typeof document === "undefined") return null;
  return createPortal(
    <>
      {modal}
      {flyOverlay}
      <DecisionHorseModal isOpen={horseOpen} onClose={() => setHorseOpen(false)} />
    </>,
    document.body
  );
}
