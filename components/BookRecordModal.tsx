"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, BookOpen, BookMarked, Cloud, Package, Plus, Trash2, Star } from "lucide-react";
import type { Book, BookGroup } from "@/lib/useBooks";
import type { RecordStatus } from "@/lib/supabase/types";
import type { ReadingStatus } from "@/lib/supabase/types";
import { OWNERSHIP_LABELS, RECORD_STATUS_DISPLAY } from "@/lib/supabase/types";

const RECORD_STATUS_OPTIONS: RecordStatus[] = ["읽는 중", "완독", "멈춤", "소장중"];

/** 독서상태에 맞춰 기록 칸 기본값 (끝냄→완독, 펼침→읽는 중, 멈춤→멈춤) */
function defaultRecordStatus(readingStatus: ReadingStatus | undefined): RecordStatus {
  if (readingStatus === "FINISHED") return "완독";
  if (readingStatus === "READING") return "읽는 중";
  if (readingStatus === "PAUSED") return "멈춤";
  return "소장중";
}
const SOURCE_OPTIONS = ["구매", "선물", "도서관", "대여", "기타"];
const WEATHER_OPTIONS = ["☀️ 맑음", "⛅ 흐림", "🌧️ 비", "❄️ 눈", "🌫️ 안개", "🌙 밤"];

export type BookRecordInitial = Partial<Book> & { title: string; author: string };

interface BookRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 생성 시: 초기 데이터 + group. 수정 시: 전체 Book */
  initial: BookRecordInitial;
  mode: "create" | "edit";
  initialGroup?: BookGroup;
  onSaveCreate: (group: BookGroup, book: Omit<Book, "id" | "ownershipType" | "readingStatus"> & { readStatus?: "읽음" | "미독" }) => void;
  onSaveEdit: (book: Book) => void;
}

export default function BookRecordModal({
  isOpen,
  onClose,
  initial,
  mode,
  initialGroup = "my",
  onSaveCreate,
  onSaveEdit,
}: BookRecordModalProps) {
  const [tab, setTab] = useState<"basic" | "record" | "mood" | "own">("basic");
  const [group, setGroup] = useState<BookGroup>(initialGroup);

  const [title, setTitle] = useState(initial.title ?? "");
  const [author, setAuthor] = useState(initial.author ?? "");
  const [cover, setCover] = useState(initial.cover ?? "");
  const [translator, setTranslator] = useState(initial.translator ?? "");
  const [publisher, setPublisher] = useState(initial.publisher ?? "");
  const [pageCount, setPageCount] = useState(initial.pageCount ?? undefined);
  const [price, setPrice] = useState(initial.retailPrice ?? undefined);
  const [isbn, setIsbn] = useState(initial.isbn ?? "");
  const [pubDate, setPubDate] = useState(initial.pubDate ?? "");

  const [readDates, setReadDates] = useState<{ start: string; end: string }[]>(
    initial.readDates?.length ? [...initial.readDates] : [{ start: "", end: "" }]
  );
  const [recordStatus, setRecordStatus] = useState<RecordStatus>(
    initial.recordStatus ?? defaultRecordStatus(initial.readingStatus)
  );
  const [rating, setRating] = useState(initial.rating ?? undefined);

  const [sentenceFirst, setSentenceFirst] = useState(initial.sentences?.first ?? "");
  const [sentenceLast, setSentenceLast] = useState(initial.sentences?.last ?? "");
  const [bgmTitle, setBgmTitle] = useState(initial.bgmTitle ?? "");
  const [bgmArtist, setBgmArtist] = useState(initial.bgmArtist ?? "");
  const [weather, setWeather] = useState(initial.weather ?? "");

  const [source, setSource] = useState(initial.source ?? "");
  const [sourceDetail, setSourceDetail] = useState(initial.sourceDetail ?? "");
  const [resale, setResale] = useState(initial.resale ?? false);
  const [spineColor, setSpineColor] = useState(initial.spineColor ?? "#11593F");
  const [spineFont, setSpineFont] = useState(initial.spineFont ?? "#FFFFFF");

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initial.title ?? "");
    setAuthor(initial.author ?? "");
    setCover(initial.cover ?? "");
    setTranslator(initial.translator ?? "");
    setPublisher(initial.publisher ?? "");
    setPageCount(initial.pageCount);
    setPrice(initial.retailPrice);
    setIsbn(initial.isbn ?? "");
    setPubDate(initial.pubDate ?? "");
    setReadDates(initial.readDates?.length ? [...initial.readDates] : [{ start: "", end: "" }]);
    setRecordStatus(initial.recordStatus ?? defaultRecordStatus(initial.readingStatus));
    setRating(initial.rating);
    setSentenceFirst(initial.sentences?.first ?? "");
    setSentenceLast(initial.sentences?.last ?? "");
    setBgmTitle(initial.bgmTitle ?? "");
    setBgmArtist(initial.bgmArtist ?? "");
    setWeather(initial.weather ?? "");
    setSource(initial.source ?? "");
    setSourceDetail(initial.sourceDetail ?? "");
    setResale(initial.resale ?? false);
    setSpineColor(initial.spineColor ?? "#11593F");
    setSpineFont(initial.spineFont ?? "#FFFFFF");
    if (initialGroup) setGroup(initialGroup);
    setTab("basic");
  }, [isOpen, initial, initialGroup]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const addReadDate = () => setReadDates((prev) => [...prev, { start: "", end: "" }]);
  const removeReadDate = (i: number) =>
    setReadDates((prev) => (prev.length <= 1 ? [{ start: "", end: "" }] : prev.filter((_, idx) => idx !== i)));
  const setReadDateAt = (i: number, field: "start" | "end", value: string) =>
    setReadDates((prev) => prev.map((d, idx) => (idx === i ? { ...d, [field]: value } : d)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    const a = author.trim();
    if (!t || !a) {
      alert("제목과 저자는 필수입니다.");
      return;
    }
    const filteredReadDates = readDates.filter((d) => d.start || d.end);
    const payload = {
      title: t,
      author: a,
      cover: cover.trim() || undefined,
      publisher: publisher.trim() || undefined,
      pubDate: pubDate.trim() || undefined,
      isbn: isbn.trim() || undefined,
      retailPrice: price ?? undefined,
      translator: translator.trim() || undefined,
      pageCount: pageCount ?? undefined,
      source: source.trim() || undefined,
      sourceDetail: sourceDetail.trim() || undefined,
      resale,
      readDates: filteredReadDates.length ? filteredReadDates : undefined,
      recordStatus,
      rating: rating ?? undefined,
      bgmTitle: bgmTitle.trim() || undefined,
      bgmArtist: bgmArtist.trim() || undefined,
      weather: weather.trim() || undefined,
      sentences:
        sentenceFirst.trim() || sentenceLast.trim()
          ? { first: sentenceFirst.trim() || undefined, last: sentenceLast.trim() || undefined }
          : undefined,
      spineColor: spineColor || undefined,
      spineFont: spineFont || undefined,
      country: (initial as Book).country,
      category: (initial as Book).category,
      series: (initial as Book).series,
      description: (initial as Book).description,
      format: (initial as Book).format,
      coAuthor: (initial as Book).coAuthor,
    };

    if (mode === "edit" && "id" in initial && initial.id) {
      onSaveEdit({
        ...initial,
        ...payload,
        id: initial.id,
        ownershipType: (initial as Book).ownershipType,
        readingStatus: (initial as Book).readingStatus,
      } as Book);
    } else {
      onSaveCreate(group, {
        ...payload,
        readStatus: group === "read" ? "읽음" : "미독",
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "basic" as const, label: "기본", icon: BookOpen },
    { id: "record" as const, label: "기록", icon: BookMarked },
    { id: "mood" as const, label: "감성", icon: Cloud },
    { id: "own" as const, label: "소장", icon: Package },
  ];

  const modal = (
    <div
      className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-record-title"
    >
      <div
        className="w-full max-w-[480px] max-h-[90vh] bg-[#FFFFFF] rounded-2xl overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 id="book-record-title" className="text-[18px] font-bold text-[#11593F]">
            {mode === "edit" ? "상세 기록 수정" : "상세 기록"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="닫기"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        {mode === "create" && (
          <div className="px-4 py-2 border-b border-gray-100">
            <span className="text-[12px] text-gray-500 font-bold">추가할 그룹</span>
            <div className="flex gap-2 mt-2">
              {(["my", "read", "ebook"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  className={`flex-1 py-2 rounded-lg text-[13px] font-bold ${
                    group === g ? "bg-[#11593F] text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {OWNERSHIP_LABELS[g === "my" ? "OWNED" : g === "read" ? "PASSED" : "EBOOK"]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 min-w-[80px] py-3 flex items-center justify-center gap-1.5 text-[13px] font-bold transition-colors ${
                tab === id ? "text-[#11593F] border-b-2 border-[#11593F]" : "text-gray-500"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {tab === "basic" && (
              <>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">표지 URL</label>
                  <input
                    type="text"
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                    placeholder="이미지 주소"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                  />
                  {cover && (
                    <img
                      src={cover}
                      alt=""
                      className="mt-2 w-20 h-[112px] object-cover rounded-lg bg-gray-100"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">제목 *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="도서 제목"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">저자 *</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="저자명"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">번역가</label>
                  <input
                    type="text"
                    value={translator}
                    onChange={(e) => setTranslator(e.target.value)}
                    placeholder="번역가명"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">출판사</label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="출판사명"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-bold text-[#11593F] mb-2">쪽수</label>
                    <input
                      type="number"
                      value={pageCount ?? ""}
                      onChange={(e) => setPageCount(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      placeholder="320"
                      min={1}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#11593F] mb-2">정가 (원)</label>
                    <input
                      type="number"
                      value={price ?? ""}
                      onChange={(e) => setPrice(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      placeholder="15000"
                      min={0}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">ISBN</label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="978-89-..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">출간일</label>
                  <input
                    type="text"
                    value={pubDate}
                    onChange={(e) => setPubDate(e.target.value)}
                    placeholder="2024-01-01"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                  />
                </div>
              </>
            )}

            {tab === "record" && (
              <>
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-[#11593F]">독서 기간 (N회차)</label>
                  <button
                    type="button"
                    onClick={addReadDate}
                    className="flex items-center gap-1.5 text-[12px] font-bold text-[#11593F]"
                  >
                    <Plus size={16} />
                    회차 추가
                  </button>
                </div>
                <div className="space-y-3">
                  {readDates.map((d, i) => (
                    <div key={i} className="flex gap-2 items-center flex-wrap">
                      <input
                        type="date"
                        value={d.start}
                        onChange={(e) => setReadDateAt(i, "start", e.target.value)}
                        className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-gray-200 text-[13px]"
                      />
                      <span className="text-gray-400">~</span>
                      <input
                        type="date"
                        value={d.end}
                        onChange={(e) => setReadDateAt(i, "end", e.target.value)}
                        className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-gray-200 text-[13px]"
                      />
                      <button
                        type="button"
                        onClick={() => removeReadDate(i)}
                        className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="삭제"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">상태</label>
                  <div className="flex flex-wrap gap-2">
                    {RECORD_STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRecordStatus(s)}
                        className={`px-4 py-2 rounded-lg text-[13px] font-bold ${
                          recordStatus === s ? "bg-[#11593F] text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {RECORD_STATUS_DISPLAY[s]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2 flex items-center gap-2">
                    <Star size={16} /> 별점 (1~5)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(rating === n ? undefined : n)}
                        className={`w-10 h-10 rounded-full text-[14px] font-bold ${
                          (rating ?? 0) >= n ? "bg-[#11593F] text-white" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === "mood" && (
              <>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">첫 문장</label>
                  <textarea
                    value={sentenceFirst}
                    onChange={(e) => setSentenceFirst(e.target.value)}
                    placeholder="책의 첫 문장을 적어보세요"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">마지막 문장</label>
                  <textarea
                    value={sentenceLast}
                    onChange={(e) => setSentenceLast(e.target.value)}
                    placeholder="책의 마지막 문장을 적어보세요"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">BGM (노래 제목 / 가수)</label>
                  <input
                    type="text"
                    value={bgmTitle}
                    onChange={(e) => setBgmTitle(e.target.value)}
                    placeholder="노래 제목"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px] mb-2"
                  />
                  <input
                    type="text"
                    value={bgmArtist}
                    onChange={(e) => setBgmArtist(e.target.value)}
                    placeholder="가수"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">날씨</label>
                  <div className="flex flex-wrap gap-2">
                    {WEATHER_OPTIONS.map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWeather(weather === w ? "" : w)}
                        className={`px-3 py-2 rounded-lg text-[13px] font-bold ${
                          weather === w ? "bg-[#11593F] text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === "own" && (
              <>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">구매처 / 입수 경로</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {SOURCE_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSource(source === s ? "" : s)}
                        className={`px-4 py-2 rounded-lg text-[13px] font-bold ${
                          source === s ? "bg-[#11593F] text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={sourceDetail}
                    onChange={(e) => setSourceDetail(e.target.value)}
                    placeholder="예: 선물 준 사람, 구매한 서점"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#11593F] text-[14px]"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={resale}
                    onChange={(e) => setResale(e.target.checked)}
                    className="rounded border-gray-300 text-[#11593F] focus:ring-[#11593F]"
                  />
                  <span className="text-[13px] font-bold text-[#11593F]">중고 판매 여부</span>
                </label>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">책등 배경색</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={spineColor}
                      onChange={(e) => setSpineColor(e.target.value)}
                      className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={spineColor}
                      onChange={(e) => setSpineColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#11593F] mb-2">책등 폰트 색상</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={spineFont}
                      onChange={(e) => setSpineFont(e.target.value)}
                      className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={spineFont}
                      onChange={(e) => setSpineFont(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] font-mono"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#11593F] text-white font-bold text-[15px] hover:bg-[#0d4630] transition-colors"
            >
              {mode === "edit" ? "저장" : "저장하고 담기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
