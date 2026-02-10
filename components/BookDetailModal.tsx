"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Disc, Sun, Cloud, CloudRain, CloudSnow, CloudFog, Moon } from "lucide-react";
import type { Book } from "@/lib/useBooks";
import { OWNERSHIP_LABELS, READING_STATUS_LABELS } from "@/lib/supabase/types";

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
}

function Row({ label, value }: { label: string; value: string | number | undefined }) {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return (
    <div className="flex border-b border-gray-100 py-3">
      <span className="w-24 flex-shrink-0 text-[13px] text-gray-500">{label}</span>
      <span className="text-[14px] text-gray-800 break-words">{String(value)}</span>
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

export default function BookDetailModal({ book, onClose, onUpdateCountry, onEdit }: BookDetailModalProps) {
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

  const modal = (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-detail-title"
    >
      <div
        className="w-full max-w-[480px] max-h-[85vh] bg-[#FFFFFF] rounded-2xl overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 p-4 border-b border-gray-100">
          <div className="flex-shrink-0">
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="w-24 h-[132px] object-cover rounded-lg shadow-md"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-[132px] rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-[11px] text-gray-500 text-center px-2 line-clamp-4 leading-tight">
                  {book.title}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="book-detail-title" className="text-[18px] font-bold text-[#11593F] leading-snug">
              {book.title}
            </h2>
            {book.author && (
              <p className="text-[14px] text-gray-600 mt-1">{book.author}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 flex-shrink-0"
            aria-label="닫기"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <Row label="작가" value={book.author} />
          <Row label="공동저자" value={book.coAuthor} />
          <Row label="출판사" value={book.publisher} />
          <Row label="출간일" value={book.pubDate} />
          <Row label="판형" value={book.format} />
          <Row label="시리즈" value={book.series} />
          <Row label="분야" value={book.category} />
          <Row label="정가" value={book.retailPrice != null ? `₩${Number(book.retailPrice).toLocaleString()}` : undefined} />
          <Row label="ISBN" value={book.isbn} />
          <div className="flex border-b border-gray-100 py-3 items-center gap-2">
            <span className="w-24 flex-shrink-0 text-[13px] text-gray-500">출판 국가</span>
            <div className="flex-1 min-w-0">
              {onUpdateCountry ? (
                <select
                  value={book.country?.toUpperCase() ?? ""}
                  onChange={(e) => {
                    const v = e.target.value.trim().toUpperCase().slice(0, 2);
                    onUpdateCountry(book.id, v);
                  }}
                  className="w-full max-w-[200px] text-[14px] text-gray-800 border border-gray-200 rounded-lg px-3 py-2 bg-white"
                >
                  {COUNTRY_OPTIONS.map(({ code, name }) => (
                    <option key={code || "empty"} value={code}>
                      {code ? `${name} (${code})` : name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-[14px] text-gray-800">
                  {book.country
                    ? `${COUNTRY_OPTIONS.find((c) => c.code === book.country)?.name ?? book.country} (${book.country})`
                    : "미입력"}
                </span>
              )}
            </div>
          </div>
          <Row label="소유형태" value={ownershipLabel} />
          <Row label="독서상태" value={readingLabel} />

          {/* 감성 기록: LP 뮤직 카드 */}
          <div className="rounded-xl bg-[#f9f9f9] border border-[#eee] p-4 my-4">
            <p className="text-[12px] font-bold text-[#11593F] mb-3">감성 기록</p>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 text-[#11593F]">
                <Disc className="w-24 h-24 animate-spin-slow" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                {book.bgmTitle || book.bgmArtist ? (
                  <p className="text-[14px] text-gray-800 font-medium">
                    🎵 {[book.bgmTitle, book.bgmArtist].filter(Boolean).join(" - ")}
                  </p>
                ) : (
                  <p className="text-[13px] text-gray-500 italic">이 책의 BGM을 기록해주세요</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-gray-600">
                  {book.weather && (
                    <span className="flex items-center gap-1.5 text-[12px]">
                      <WeatherIcon name={book.weather} className="w-4 h-4" />
                      {book.weather.replace(/^[^\s]+\s/, "")}
                    </span>
                  )}
                  {(book.readDates?.[0]?.start || book.pubDate) && (
                    <span className="text-[12px]">
                      {formatMemoryDate(book.readDates?.[0]?.start ?? book.pubDate ?? "")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {onEdit && (
            <div className="pt-4 pb-2">
              <button
                type="button"
                onClick={() => {
                  onEdit(book);
                  onClose();
                }}
                className="w-full py-3 rounded-xl border-2 border-[#11593F] text-[#11593F] font-bold text-[14px] hover:bg-[#11593F] hover:text-white transition-colors"
              >
                상세 기록 수정
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
