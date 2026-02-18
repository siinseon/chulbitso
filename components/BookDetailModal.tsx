"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Sun, Cloud, CloudRain, CloudSnow, CloudFog, Moon, Search, Loader2 } from "lucide-react";
import FloppyDiskReviewModal from "./FloppyDiskReviewModal";
import type { Book } from "@/lib/useBooks";
import { OWNERSHIP_LABELS, READING_STATUS_LABELS } from "@/lib/supabase/types";
import { FULL_CATEGORY_OPTIONS } from "@/lib/categories";

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
  onUpdateBook?: (book: Book) => void;
  onSetReadingStatus?: (id: string, status: import("@/lib/supabase/types").ReadingStatus) => void;
}

/** 대출 카드 한 줄: 라벨 | 값, 아래 실선 */
function CardRow({ label, value }: { label: string; value: string | number | undefined }) {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return (
    <div className="flex items-baseline min-h-[2.25rem] border-b border-[#8a7a6a]/40 font-serif text-[13px] sm:text-[14px]">
      <span className="w-20 flex-shrink-0 text-text-muted/90">{label}</span>
      <span className="flex-1 min-w-0 text-text-main break-words pb-0.5">
        {String(value)}
      </span>
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
  }, [book]);

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
                  {onUpdateBook ? (
                    <select
                      value={FULL_CATEGORY_OPTIONS.includes(book.category as (typeof FULL_CATEGORY_OPTIONS)[number]) ? book.category : "기타"}
                      onChange={(e) => {
                        const v = e.target.value as (typeof FULL_CATEGORY_OPTIONS)[number];
                        onUpdateBook({ ...book, category: v });
                      }}
                      className="w-full max-w-[140px] text-[13px] text-text-main border-0 bg-transparent p-0 font-serif focus:ring-0"
                    >
                      {FULL_CATEGORY_OPTIONS.map((c) => (
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
                background: "linear-gradient(165deg, #363636 0%, #2a2a2a 50%, #1e1e1e 100%)",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.25) inset",
                border: "1px solid #404040",
              }}
            >
              {/* 라벨: 상단 흰색(메모) + 하단 빨간 밴드 — 스큐어모피즘 */}
              <div
                className="absolute inset-2 flex flex-col rounded-sm overflow-hidden"
                style={{
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(0,0,0,0.15)",
                }}
              >
                {/* 상단 흰색 영역: 살짝 안으로 들어간 라벨 느낌 */}
                <div
                  className="flex-1 min-h-0 flex flex-col px-2 pt-1.5 pb-0"
                  style={{
                    background: "linear-gradient(180deg, #fafaf9 0%, #f0eeeb 100%)",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
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
                  {/* 원형 릴 2개: 스큐어모피즘 — 플라스틱 릴 휠 입체감 */}
                  <div className="flex-1 min-h-0 flex items-center justify-center gap-4 py-2 flex-shrink-0">
                    <div
                      className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
                      style={{
                        background: "linear-gradient(145deg, #6b5a4a 0%, #4a3d32 40%, #3d3328 80%, #2a2218 100%)",
                        boxShadow:
                          "inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.25)",
                        border: "2px solid #3d3328",
                      }}
                    >
                      <div
                        className="absolute inset-1 rounded-full"
                        style={{
                          background: "linear-gradient(180deg, #f5f5f3 0%, #e8e6e2 100%)",
                          border: "2px solid #2a2218",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                        }}
                      />
                      <div
                        className="absolute inset-2 rounded-full"
                        style={{
                          background: "radial-gradient(circle at 28% 28%, #7a6a5a, #4a3d32 45%, #2a2218 100%)",
                          boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)",
                        }}
                      />
                    </div>
                    <div
                      className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
                      style={{
                        background: "linear-gradient(145deg, #6b5a4a 0%, #4a3d32 40%, #3d3328 80%, #2a2218 100%)",
                        boxShadow:
                          "inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.25)",
                        border: "2px solid #3d3328",
                      }}
                    >
                      <div
                        className="absolute inset-1 rounded-full"
                        style={{
                          background: "linear-gradient(180deg, #f5f5f3 0%, #e8e6e2 100%)",
                          border: "2px solid #2a2218",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                        }}
                      />
                      <div
                        className="absolute inset-2 rounded-full"
                        style={{
                          background: "radial-gradient(circle at 28% 28%, #7a6a5a, #4a3d32 45%, #2a2218 100%)",
                          boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)",
                        }}
                      />
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
                {/* 하단 빨간 밴드: 스큐어모피즘 — 살짝 볼록한 테이프 밴드 */}
                <div
                  className="h-6 flex flex-col items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(180deg, #d42a42 0%, #c41e3a 50%, #a01830 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)",
                    borderTop: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  <span className="text-[11px] font-bold text-white tracking-wide drop-shadow-sm">SIINSEON</span>
                  <span className="text-[7px] text-white/95 font-mono">LOW NOISE CASSETTE TAPE</span>
                </div>
              </div>

              {/* 나사 4개: 금속 느낌 — 위쪽 하이라이트 */}
              <div
                className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full z-10"
                style={{
                  background: "linear-gradient(145deg, #5a5a5a 0%, #2a2a2a 60%, #1a1a1a 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4)",
                }}
              />
              <div
                className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full z-10"
                style={{
                  background: "linear-gradient(145deg, #5a5a5a 0%, #2a2a2a 60%, #1a1a1a 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4)",
                }}
              />
              <div
                className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full z-10"
                style={{
                  background: "linear-gradient(145deg, #5a5a5a 0%, #2a2a2a 60%, #1a1a1a 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4)",
                }}
              />
              <div
                className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full z-10"
                style={{
                  background: "linear-gradient(145deg, #5a5a5a 0%, #2a2a2a 60%, #1a1a1a 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4)",
                }}
              />

              {/* 하단 구멍: 안으로 파인 느낌 */}
              <div
                className="absolute bottom-0.5 left-1/4 w-1.5 h-1.5 rounded-full -translate-x-1/2 z-10"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #2a2a2a, #0a0a0a)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)",
                }}
              />
              <div className="absolute bottom-0.5 left-1/2 flex items-center justify-center gap-0.5 -translate-x-1/2 z-10">
                <div
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: "linear-gradient(145deg, #e0e0e0, #a0a0a0)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                  }}
                />
                <div
                  className="w-2 h-1.5 rounded-none"
                  style={{
                    background: "linear-gradient(180deg, #1a1a1a, #0a0a0a)",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
                  }}
                />
                <div
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: "linear-gradient(145deg, #e0e0e0, #a0a0a0)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                  }}
                />
              </div>
              <div
                className="absolute bottom-0.5 right-1/4 w-1.5 h-1.5 rounded-full translate-x-1/2 z-10"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #2a2a2a, #0a0a0a)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)",
                }}
              />
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

          <div className="pt-4 pb-2 flex flex-col gap-2">
              {onUpdateBook && (
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(true)}
                  className="w-full py-3 min-h-[44px] rounded border-2 border-[#6a7c5a] font-serif font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors"
                  style={{ color: "#5a6c4a", backgroundColor: "rgba(106, 124, 90, 0.12)" }}
                >
                  💾 플로피 디스크 리뷰
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

  if (typeof document === "undefined") return null;
  return createPortal(
    <>
      {modal}
      {book && (
        <FloppyDiskReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          bookTitle={book.title}
          bookAuthor={book.author}
          initialReview={book.review}
          onSave={(reviewText) => {
            onUpdateBook?.({ ...book, review: reviewText });
            // 닫기는 슬롯+디스크 삽입 애니메이션 후 FloppyDiskReviewModal이 onClose로 처리
          }}
        />
      )}
    </>,
    document.body
  );
}
