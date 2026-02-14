"use client";

<<<<<<< HEAD
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Sun, Cloud, CloudRain, CloudSnow, CloudFog, Moon, Scissors } from "lucide-react";
=======
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Sun, Cloud, CloudRain, CloudSnow, CloudFog, Moon, Search, Loader2 } from "lucide-react";
import PaperAirplaneReviewModal from "./PaperAirplaneReviewModal";
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
import type { Book } from "@/lib/useBooks";
import DecisionHorseModal from "./DecisionHorseModal";
import { OWNERSHIP_LABELS, READING_STATUS_LABELS } from "@/lib/supabase/types";
<<<<<<< HEAD
import { usePaperReviews } from "@/lib/usePaperReviews";
=======
import { isPreservedCategory, KDC_OPTIONS } from "@/lib/categories";
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1

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
<<<<<<< HEAD
  onDelete?: (id: string) => void;
=======
  onUpdateBook?: (book: Book) => void;
  onSetReadingStatus?: (id: string, status: import("@/lib/supabase/types").ReadingStatus) => void;
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
}

/** 대출 카드 한 줄: 라벨 | 값, 아래 실선 */
function CardRow({ label, value }: { label: string; value: string | number | undefined }) {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return (
<<<<<<< HEAD
    <div className="flex border-b border-amber-200/60 py-2.5">
      <span className="w-24 flex-shrink-0 text-[13px] font-mono text-text-main/70">{label}</span>
      <span className="text-[14px] font-handwriting text-text-main break-words">{String(value)}</span>
=======
    <div className="flex items-baseline min-h-[2.25rem] border-b border-[#8a7a6a]/40 font-serif text-[13px] sm:text-[14px]">
      <span className="w-20 flex-shrink-0 text-text-muted/90">{label}</span>
      <span className="flex-1 min-w-0 text-text-main break-words pb-0.5">
        {String(value)}
      </span>
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
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

<<<<<<< HEAD
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
=======
interface SearchBookItem {
  title: string;
  author: string;
  publisher?: string;
  pubDate?: string;
  cover?: string;
  description?: string;
  isbn?: string;
  retailPrice?: number;
  pageCount?: number;
}

interface AladinBookResponse {
  title: string;
  author: string;
  publisher?: string;
  pubDate?: string;
  cover?: string;
  description?: string;
  isbn?: string;
  retailPrice?: number;
  pageCount?: number;
  format?: string;
  category?: string;
  series?: string;
  translator?: string;
}

export default function BookDetailModal({ book, onClose, onUpdateCountry, onEdit, onUpdateBook }: BookDetailModalProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchBookItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchError("책 이름을 입력해주세요.");
      return;
    }
    setSearchError(null);
    setSearchLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) {
        setSearchError((data.error as string) || "검색에 실패했습니다.");
        return;
      }
      setSearchResults((data.books ?? []).map((b: Record<string, unknown>) => ({
        title: (b.title as string) ?? "",
        author: (b.author as string) ?? "",
        publisher: b.publisher as string | undefined,
        pubDate: b.pubDate as string | undefined,
        cover: b.cover as string | undefined,
        description: b.description as string | undefined,
        isbn: (b.isbn as string) ?? undefined,
        retailPrice: typeof b.retailPrice === "number" ? b.retailPrice : Number(b.retailPrice) || undefined,
        pageCount: typeof b.pageCount === "number" ? b.pageCount : Number(b.pageCount) || undefined,
      })));
    } catch {
      setSearchError("검색 중 오류가 발생했습니다.");
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery]);

  const handleSelectResult = useCallback(async (item: SearchBookItem) => {
    if (!onUpdateBook || !book || !item.isbn) return;
    setSelectLoading(item.isbn);
    setSearchError(null);
    try {
      const res = await fetch(`/api/book?isbn=${encodeURIComponent(item.isbn)}`);
      const data = await res.json();
      if (!res.ok) {
        setSearchError((data.error as string) || "상세 조회에 실패했습니다.");
        return;
      }
      const fetched = data as AladinBookResponse;
      const updated: Book = {
        ...book,
        title: fetched.title || item.title || book.title,
        author: fetched.author || item.author || book.author,
        publisher: fetched.publisher ?? item.publisher ?? book.publisher,
        pubDate: fetched.pubDate ?? item.pubDate ?? book.pubDate,
        cover: fetched.cover ?? item.cover ?? book.cover,
        description: fetched.description ?? item.description ?? book.description,
        isbn: fetched.isbn ?? item.isbn ?? book.isbn,
        retailPrice: fetched.retailPrice ?? item.retailPrice ?? book.retailPrice,
        pageCount: fetched.pageCount ?? item.pageCount ?? book.pageCount,
        format: fetched.format ?? book.format,
        category: fetched.category ?? book.category,
        series: fetched.series ?? book.series,
        translator: fetched.translator ?? book.translator,
      };
      onUpdateBook(updated);
      setSearchQuery("");
      setSearchResults([]);
    } catch {
      setSearchError("조회 중 오류가 발생했습니다.");
    } finally {
      setSelectLoading(null);
    }
  }, [book, onUpdateBook]);

  useEffect(() => {
    if (book) {
      setSearchQuery("");
      setSearchResults([]);
      setSearchError(null);
    }
  }, [book?.id]);
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1

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

  const regNo = book.id ? String(book.id).slice(-6) : "—";

  const modal = (
    <div
      className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-detail-title"
    >
      {/* 갈색 주머니 + 크림색 대출 카드 */}
      <div
<<<<<<< HEAD
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
=======
        className="w-full max-w-[480px] max-h-[90dvh] sm:max-h-[85vh] flex rounded-t-2xl sm:rounded-2xl overflow-hidden flex-col shadow-[0_8px_32px_rgba(58,49,40,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 왼쪽 갈색 주머니(띠) - 카드가 꽂혀 있는 느낌 */}
        <div className="flex flex-1 min-h-0">
          <div className="w-6 flex-shrink-0 checkout-pocket flex flex-col items-center justify-between py-2">
            <p className="text-[8px] font-serif text-[#5a4a3a] text-center leading-tight px-0.5" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
              주 의
            </p>
            <p className="text-[8px] font-serif text-[#5a4a3a] tracking-widest" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
              대출기록
            </p>
          </div>

          {/* 흰/크림색 카드 본문 */}
          <div className="flex-1 min-w-0 flex flex-col checkout-card-bg border border-[#c4b090] border-l-0 rounded-tr-2xl">
            {/* 맨 윗 칸: 도서 대출 카드 타이틀 (타자기/명조) */}
            <div className="px-4 pt-3 pb-2 border-b border-[#8a7a6a]/40 text-center">
              <p
                className="font-serif text-[15px] sm:text-[16px] font-bold text-[#3A3128] tracking-[0.35em]"
                style={{ letterSpacing: "0.35em" }}
              >
                도 서 대 출 카 드
              </p>
            </div>
            {/* 카드 상단: 닫기 버튼 + 등록번호·저자명·서명 (실제 대출 카드 레이아웃) */}
            <div className="relative px-4 pt-3 pb-2 border-b border-[#8a7a6a]/50">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/5 text-text-muted transition-colors"
                aria-label="닫기"
              >
                <X size={20} strokeWidth={2} />
              </button>
              <div className="font-serif text-[12px] text-text-muted/80 mb-1">등록번호</div>
              <div className="font-serif text-[13px] text-text-main mb-2 pb-1 border-b border-[#8a7a6a]/40">{regNo}</div>
              <div className="flex gap-3 mt-2">
                {book.cover && (
                  <img
                    src={book.cover}
                    alt=""
                    className="w-14 h-[72px] object-cover rounded border border-[#8a7a6a]/40 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[11px] text-text-muted/80 mb-0.5">저자명</div>
                  <div className="font-serif text-[13px] text-text-main border-b border-[#8a7a6a]/40 pb-0.5">{book.author || "—"}</div>
                  <div className="font-serif text-[11px] text-text-muted/80 mt-2 mb-0.5">서명</div>
                  <h2 id="book-detail-title" className="font-serif text-[13px] sm:text-[14px] font-semibold text-primary border-b border-[#8a7a6a]/40 pb-0.5">
                    {book.title}
                  </h2>
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
                </div>
              </div>
            </div>

            {/* 카드 본문: 타자기 테이블 (선 하나만) */}
            <div className="flex-1 overflow-y-auto px-4 py-2 checkout-card-line">
              {!book.cover && onUpdateBook && (
                <div className="mb-4 p-3 rounded-lg border border-[#8a7a6a]/50 bg-white/50">
                  <p className="text-[12px] font-serif text-primary mb-2">표지가 없어요. 책 이름을 검색하면 알라딘에서 표지와 정보를 가져옵니다.</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSearchError(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="책 이름 입력"
                      className="flex-1 min-w-0 px-3 py-2 rounded border border-[#8a7a6a]/50 text-[13px] outline-none focus:border-primary"
                      disabled={searchLoading}
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={searchLoading}
                      className="flex-shrink-0 px-4 py-2 rounded border-2 border-primary text-primary font-serif font-semibold text-[13px] hover:bg-primary hover:text-white active:opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      {searchLoading ? "검색 중" : "검색"}
                    </button>
                  </div>
                  {searchError && <p className="mt-2 text-[12px] text-red-600 font-serif">{searchError}</p>}
                  {searchResults.length > 0 && (
                    <div className="mt-3 max-h-[140px] overflow-y-auto space-y-1">
                      {searchResults.map((item, i) => (
                        <button
                          key={item.isbn ?? i}
                          type="button"
                          onClick={() => handleSelectResult(item)}
                          disabled={!!selectLoading}
                          className="w-full flex gap-2 p-2 rounded border border-[#8a7a6a]/30 hover:border-primary/50 hover:bg-primary/5 text-left transition-colors disabled:opacity-60"
                        >
                          {item.cover ? (
                            <img src={item.cover} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-8 h-11 rounded flex-shrink-0 bg-secondary/30 flex items-center justify-center text-[9px] text-text-muted">표지</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-primary truncate">{item.title}</p>
                            <p className="text-[11px] text-text-muted truncate">{item.author}</p>
                          </div>
                          {selectLoading === item.isbn ? (
                            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0 text-primary" />
                          ) : null}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <CardRow label="공동저자" value={book.coAuthor} />
              <CardRow label="출판사" value={book.publisher} />
              <CardRow label="출간일" value={book.pubDate} />
              <CardRow label="판형" value={book.format} />
              <CardRow label="시리즈" value={book.series} />
              <div className="flex items-baseline min-h-[2.25rem] border-b border-[#8a7a6a]/40 font-serif text-[13px] sm:text-[14px]">
                <span className="w-20 flex-shrink-0 text-text-muted/90">분야</span>
                <div className="flex-1 min-w-0 pb-0.5">
                  {onUpdateBook && !isPreservedCategory(book.category) ? (
                    <select
                      value={KDC_OPTIONS.includes(book.category as (typeof KDC_OPTIONS)[number]) ? book.category : "기타"}
                      onChange={(e) => {
                        const v = e.target.value as (typeof KDC_OPTIONS)[number];
                        onUpdateBook({ ...book, category: v });
                      }}
                      className="w-full max-w-[140px] text-[13px] text-text-main border-0 bg-transparent p-0 font-serif focus:ring-0"
                    >
                      {KDC_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-text-main">{book.category ?? "—"}</span>
                  )}
                </div>
              </div>
              <CardRow label="정가" value={book.retailPrice != null ? `₩${Number(book.retailPrice).toLocaleString()}` : undefined} />
              <CardRow label="ISBN" value={book.isbn} />
              <div className="flex items-baseline min-h-[2.25rem] border-b border-[#8a7a6a]/40 font-serif text-[13px] sm:text-[14px]">
                <span className="w-20 flex-shrink-0 text-text-muted/90">출판국가</span>
                <div className="flex-1 min-w-0 pb-0.5">
                  {onUpdateCountry ? (
                    <select
                      value={book.country?.toUpperCase() ?? ""}
                      onChange={(e) => {
                        const v = e.target.value.trim().toUpperCase().slice(0, 2);
                        onUpdateCountry(book.id, v);
                      }}
                      className="w-full max-w-[180px] text-[13px] text-text-main border-0 bg-transparent p-0 font-serif focus:ring-0"
                    >
                      {COUNTRY_OPTIONS.map(({ code, name }) => (
                        <option key={code || "empty"} value={code}>
                          {code ? `${name} (${code})` : name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-text-main">
                      {book.country
                        ? `${COUNTRY_OPTIONS.find((c) => c.code === book.country)?.name ?? book.country} (${book.country})`
                        : "미입력"}
                    </span>
                  )}
                </div>
              </div>
              <CardRow label="소유형태" value={ownershipLabel} />
              <CardRow label="독서상태" value={readingLabel} />

          {/* 감성 기록 - C-90 스타일 (흰 메모 + 빨간 밴드 + 흰 허브 릴) */}
          <div className="my-4">
            <p className="text-[11px] text-text-muted font-serif uppercase tracking-widest mb-2">감성 기록</p>
            <div
              className="relative w-full max-w-[320px] mx-auto overflow-hidden rounded-md"
              style={{
                aspectRatio: "1.95/1",
                background: "#2a2a2a",
                boxShadow: "0 4px 16px rgba(0,0,0,0.35), inset 0 0 0 1px #1a1a1a",
              }}
            >
              {/* 라벨: 상단 흰색(메모) + 하단 빨간 밴드 */}
              <div className="absolute inset-2 flex flex-col rounded-sm overflow-hidden">
                {/* 상단 흰색 영역: BGM 위 → 릴 정가운데 → A/IN/OUT 등 */}
                <div className="flex-1 min-h-0 bg-white flex flex-col px-2 pt-1.5 pb-0">
                  {/* BGM (맨 위) */}
                  <div className="flex-shrink-0 py-1 border-b border-black/20">
                    {book.bgmTitle || book.bgmArtist ? (
                      <p className="text-[9px] font-mono text-black/80 truncate w-full text-center">
                        {book.bgmArtist && book.bgmTitle ? `${book.bgmArtist} / ${book.bgmTitle}` : (book.bgmTitle || book.bgmArtist || "—")}
                      </p>
                    ) : (
                      <p className="text-[8px] font-mono text-black/50 text-center">이 책의 BGM을 기록해주세요</p>
                    )}
                  </div>
                  {/* 원형 릴 창 2개: 정가운데 배치 */}
                  <div className="flex-1 min-h-0 flex items-center justify-center gap-4 py-2 flex-shrink-0">
                    <div className="relative w-14 h-14 rounded-full flex items-center justify-center border-2 border-black overflow-hidden" style={{ background: "linear-gradient(135deg, #5c4a3a 0%, #4a3d32 30%, #3d3328 70%, #2a2218 100%)" }}>
                      <div className="absolute inset-1 rounded-full bg-white border-2 border-black" />
                      <div className="absolute inset-2 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, #6b5a4a, #3d3328 50%, #2a2218)" }} />
                    </div>
                    <div className="relative w-14 h-14 rounded-full flex items-center justify-center border-2 border-black overflow-hidden" style={{ background: "linear-gradient(135deg, #5c4a3a 0%, #4a3d32 30%, #3d3328 70%, #2a2218 100%)" }}>
                      <div className="absolute inset-1 rounded-full bg-white border-2 border-black" />
                      <div className="absolute inset-2 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, #6b5a4a, #3d3328 50%, #2a2218)" }} />
                    </div>
                  </div>
                  {/* 하단: A 박스 + IN/OUT + Compact Cassette */}
                  <div className="flex justify-between items-start flex-shrink-0 pt-1 border-t border-black/20">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 flex items-center justify-center bg-black rounded-sm">
                        <span className="text-[10px] font-bold text-white">A</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="flex items-center gap-1 text-[8px] text-black">
                          <span className="w-2.5 h-2.5 border border-black rounded-none" /> IN
                        </label>
                        <label className="flex items-center gap-1 text-[8px] text-black">
                          <span className="w-2.5 h-2.5 border border-black rounded-none" /> OUT
                        </label>
                      </div>
                    </div>
                    <p className="text-[7px] text-black/80 font-mono">-Compact Cassette-</p>
                  </div>
                </div>
                {/* 하단 빨간 밴드 */}
                <div className="h-6 flex flex-col items-center justify-center flex-shrink-0 border-t border-black/30" style={{ background: "#c41e3a" }}>
                  <span className="text-[11px] font-bold text-white tracking-wide">SIINSEON</span>
                  <span className="text-[7px] text-white/95 font-mono">LOW NOISE CASSETTE TAPE</span>
                </div>
              </div>

              {/* 나사 4개: 네 모서리 */}
              <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-black z-10" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-black z-10" />
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-black z-10" />
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-black z-10" />

              {/* 하단 구멍: 왼쪽 원, 중앙 흰 원+사각, 오른쪽 원 */}
              <div className="absolute bottom-0.5 left-1/4 w-1.5 h-1.5 rounded-full bg-black/80 -translate-x-1/2 z-10" />
              <div className="absolute bottom-0.5 left-1/2 flex items-center justify-center gap-0.5 -translate-x-1/2 z-10">
                <div className="w-1 h-1 rounded-full bg-white/90" />
                <div className="w-2 h-1.5 rounded-none bg-black/60" />
                <div className="w-1 h-1 rounded-full bg-white/90" />
              </div>
              <div className="absolute bottom-0.5 right-1/4 w-1.5 h-1.5 rounded-full bg-black/80 translate-x-1/2 z-10" />
            </div>
            {(book.weather || book.readDates?.[0]?.start || book.pubDate) && (
              <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-text-muted font-serif">
                {book.weather && (
                  <span className="flex items-center gap-1">
                    <WeatherIcon name={book.weather} className="w-3.5 h-3.5" />
                    {book.weather.replace(/^[^\s]+\s/, "")}
                  </span>
                )}
                {(book.readDates?.[0]?.start || book.pubDate) && (
                  <span>{formatMemoryDate(book.readDates?.[0]?.start ?? book.pubDate ?? "")}</span>
                )}
              </div>
            )}
          </div>

<<<<<<< HEAD
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
=======
          <div className="pt-4 pb-2 flex flex-col gap-2">
              {onUpdateBook && (
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(true)}
                  className="w-full py-3 min-h-[44px] rounded border-2 border-[#6a7c5a] font-serif font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors"
                  style={{ color: "#5a6c4a", backgroundColor: "rgba(106, 124, 90, 0.12)" }}
                >
                  ✈️ 종이비행기 리뷰
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onEdit(book);
                    onClose();
                  }}
                  className="w-full py-3 min-h-[44px] rounded border-2 border-primary text-primary font-serif font-semibold text-[14px] hover:bg-primary hover:text-white active:opacity-90 transition-colors"
                >
                  상세 기록 수정
                </button>
              )}
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
            </div>
            </div>

            {/* 카드 하단: 출빛소 (제조사명 느낌) */}
            <div className="px-4 py-2 border-t border-[#8a7a6a]/30 text-center flex-shrink-0">
              <p className="text-[9px] font-serif text-text-muted/70 uppercase tracking-widest">출빛소</p>
            </div>
          </div>
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
<<<<<<< HEAD
      {flyOverlay}
      <DecisionHorseModal isOpen={horseOpen} onClose={() => setHorseOpen(false)} />
=======
      {book && (
        <PaperAirplaneReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          bookTitle={book.title}
          initialReview={book.review}
          onSave={(reviewText) => {
            onUpdateBook?.({ ...book, review: reviewText });
            setReviewModalOpen(false);
          }}
        />
      )}
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
    </>,
    document.body
  );
}
