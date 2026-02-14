"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "./supabase/client";
import type {
  OwnershipType,
  ReadingStatus,
  BookRow,
  RecordStatus,
  ReadDateEntry,
  BookSentences,
} from "./supabase/types";

export type BookGroup = "my" | "read" | "ebook";

const GROUP_TO_OWNERSHIP: Record<BookGroup, OwnershipType> = {
  my: "OWNED",
  read: "PASSED",
  ebook: "EBOOK",
};

const OWNERSHIP_TO_GROUP: Record<OwnershipType, BookGroup> = {
  OWNED: "my",
  PASSED: "read",
  EBOOK: "ebook",
};

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  pubDate?: string;
  cover?: string;
  description?: string;
  isbn?: string;
  category?: string;
  series?: string;
  retailPrice?: number;
  ownershipType: OwnershipType;
  readingStatus: ReadingStatus;
  format?: string;
  coAuthor?: string;
  country?: string;
  /** 기본 정보 */
  translator?: string;
  pageCount?: number;
  /** price = retailPrice (정가), retailPrice 유지 호환 */
  /** 소장 정보 */
  source?: string;
  sourceDetail?: string;
  resale?: boolean;
  /** 독서 기록 */
  readDates?: ReadDateEntry[];
  recordStatus?: RecordStatus;
  rating?: number;
  /** 감성 기록 */
  bgmLink?: string;
  bgmTitle?: string;
  bgmArtist?: string;
  weather?: string;
  sentences?: BookSentences;
  /** 커스텀 디자인 */
  spineColor?: string;
  spineFont?: string;
  /** 책 리뷰 (종이비행기) */
  review?: string;
}

export interface BooksState {
  my: Book[];
  read: Book[];
  ebook: Book[];
}

/** DB/스토리지에 '중단'으로 저장된 값은 화면에서는 '멈춤'으로 통일 */
function normalizeRecordStatus(v: unknown): RecordStatus | undefined {
  if (v === "중단") return "멈춤";
  if (v === "읽는 중" || v === "완독" || v === "멈춤" || v === "소장중") return v as RecordStatus;
  return undefined;
}

function rowToBook(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    publisher: row.publisher,
    pubDate: row.pub_date,
    cover: row.cover,
    description: row.description,
    isbn: row.isbn,
    category: row.category,
    series: row.series,
    retailPrice: row.retail_price,
    ownershipType: row.ownership_type as OwnershipType,
    readingStatus: row.reading_status as ReadingStatus,
    country: row.country?.trim() ? row.country.trim().toUpperCase().slice(0, 2) : "KR",
    translator: row.translator,
    pageCount: row.page_count,
    source: row.source,
    sourceDetail: row.source_detail,
    resale: row.resale,
    readDates: row.read_dates,
    recordStatus: normalizeRecordStatus(row.record_status),
    rating: row.rating,
    bgmLink: row.bgm_link,
    bgmTitle: row.bgm_title ?? undefined,
    bgmArtist: row.bgm_artist ?? undefined,
    weather: row.weather,
    sentences: row.sentences,
    spineColor: row.spine_color,
    spineFont: row.spine_font,
    review: (row as { review?: string }).review,
  };
}

function bookToRow(
  book: Partial<Book> & { title: string; author: string },
  ownershipType: OwnershipType,
  readingStatus: ReadingStatus
): Record<string, unknown> {
  return {
    title: book.title,
    author: book.author,
    publisher: book.publisher ?? null,
    pub_date: book.pubDate ?? null,
    cover: book.cover ?? null,
    description: book.description ?? null,
    isbn: book.isbn ?? null,
    category: book.category ?? null,
    series: book.series ?? null,
    retail_price: book.retailPrice ?? 0,
    ownership_type: ownershipType,
    reading_status: readingStatus,
    country: book.country?.trim() ? book.country.trim().toUpperCase().slice(0, 2) : "KR",
    translator: book.translator ?? null,
    page_count: book.pageCount ?? null,
    source: book.source ?? null,
    source_detail: book.sourceDetail ?? null,
    resale: book.resale ?? null,
    read_dates: book.readDates ?? null,
    record_status: book.recordStatus ?? null,
    rating: book.rating ?? null,
    bgm_link: book.bgmLink ?? null,
    bgm_title: book.bgmTitle ?? null,
    bgm_artist: book.bgmArtist ?? null,
    weather: book.weather ?? null,
    sentences: book.sentences ?? null,
    spine_color: book.spineColor ?? null,
    spine_font: book.spineFont ?? null,
    review: book.review ?? null,
  };
}

const STORAGE_KEY = "chulbitso_v3151";
const INITIAL: BooksState = { my: [], read: [], ebook: [] };

function loadFromStorage(): BooksState {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw);
    const ensure = (arr: unknown[], ownershipType: OwnershipType): Book[] =>
      arr
        .filter((b): b is Record<string, unknown> => b != null && typeof b === "object")
        .map((b) => {
          const rs = b.readingStatus ?? b.read_status;
          const readingStatus: ReadingStatus =
            rs === "읽음" || rs === "FINISHED"
              ? "FINISHED"
              : rs === "READING" || rs === "EXCERPT" || rs === "PAUSED"
              ? (rs as ReadingStatus)
              : "WISH";
          return {
            ...b,
            id: (b.id as string) ?? (b.isbn as string) ?? String(Date.now()),
            ownershipType: (b.ownershipType as OwnershipType) ?? ownershipType,
            readingStatus,
            retailPrice: (b.retailPrice ?? b.retail_price) as number | undefined,
            pubDate: (b.pubDate ?? b.pub_date) as string | undefined,
            country: (b.country as string)?.trim() ? String((b.country as string).trim()).toUpperCase().slice(0, 2) : "KR",
            translator: (b.translator as string) ?? undefined,
            pageCount: (b.pageCount ?? (b as Record<string, unknown>).page_count) as number | undefined,
            source: (b.source as string) ?? undefined,
            sourceDetail: (b.sourceDetail ?? (b as Record<string, unknown>).source_detail) as string | undefined,
            resale: (b.resale as boolean) ?? undefined,
            readDates: (b.readDates ?? (b as Record<string, unknown>).read_dates) as ReadDateEntry[] | undefined,
            recordStatus: normalizeRecordStatus(b.recordStatus ?? (b as Record<string, unknown>).record_status),
            rating: (b.rating as number) ?? undefined,
            bgmLink: (b.bgmLink ?? (b as Record<string, unknown>).bgm_link) as string | undefined,
            bgmTitle: (b.bgmTitle ?? (b as Record<string, unknown>).bgm_title) as string | undefined,
            bgmArtist: (b.bgmArtist ?? (b as Record<string, unknown>).bgm_artist) as string | undefined,
            weather: (b.weather as string) ?? undefined,
            sentences: (b.sentences ?? (b as Record<string, unknown>).sentences) as Book["sentences"],
            spineColor: (b.spineColor ?? (b as Record<string, unknown>).spine_color) as string | undefined,
            spineFont: (b.spineFont ?? (b as Record<string, unknown>).spine_font) as string | undefined,
            review: (b.review ?? (b as Record<string, unknown>).review) as string | undefined,
          } as Book;
        });
    return {
      my: ensure(Array.isArray(parsed.my) ? parsed.my : [], "OWNED"),
      read: ensure(Array.isArray(parsed.read) ? parsed.read : [], "PASSED"),
      ebook: ensure(Array.isArray(parsed.ebook) ? parsed.ebook : [], "EBOOK"),
    };
  } catch {
    return INITIAL;
  }
}

function saveToStorage(books: BooksState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function useBooks() {
  const [books, setBooks] = useState<BooksState>(INITIAL);
  const [isHydrated, setIsHydrated] = useState(false);

  const fetchFromSupabase = useCallback(async (): Promise<BooksState> => {
    if (!supabase) return loadFromStorage();
    const timeoutMs = 5000;
    const fetchPromise = (async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase fetch error:", error);
        return loadFromStorage();
      }
      const result: BooksState = { my: [], read: [], ebook: [] };
      (data ?? []).forEach((row) => {
        const book = rowToBook(row as BookRow);
        const group = OWNERSHIP_TO_GROUP[book.ownershipType];
        result[group].push(book);
      });
      return result;
    })();
    const timeoutPromise = new Promise<BooksState>((resolve) => {
      setTimeout(() => resolve(loadFromStorage()), timeoutMs);
    });
    return Promise.race([fetchPromise, timeoutPromise]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fallbackTimer = setTimeout(() => {
      if (!cancelled) {
        setIsHydrated(true);
        setBooks((prev) => (prev.my.length || prev.read.length || prev.ebook.length ? prev : loadFromStorage()));
      }
    }, 2500);
    const load = async () => {
      try {
        if (isSupabaseConfigured) {
          const data = await fetchFromSupabase();
          if (!cancelled) setBooks(data);
        } else {
          if (!cancelled) setBooks(loadFromStorage());
        }
      } catch (e) {
        console.error("load error:", e);
        if (!cancelled) setBooks(loadFromStorage());
      } finally {
        if (!cancelled) setIsHydrated(true);
        clearTimeout(fallbackTimer);
      }
    };
    load();
    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
    };
  }, [fetchFromSupabase]);

  const addBook = useCallback(
    async (
      group: BookGroup,
      book: Omit<Book, "id" | "ownershipType" | "readingStatus"> & {
        readStatus?: "읽음" | "미독";
      }
    ) => {
      const ownershipType = GROUP_TO_OWNERSHIP[group];
      const readingStatus: ReadingStatus =
        group === "read"
          ? "FINISHED"
          : book.readStatus === "읽음"
          ? "FINISHED"
          : "WISH";

      if (supabase) {
        const { data, error } = await supabase
          .from("books")
          .insert(
            bookToRow(
              {
                ...book,
                retailPrice: book.retailPrice,
                pubDate: book.pubDate,
              },
              ownershipType,
              readingStatus
            )
          )
          .select("id")
          .single();
        if (error) {
          console.error("Supabase insert error:", error);
          return;
        }
        const newBook: Book = {
          ...book,
          id: data.id,
          ownershipType,
          readingStatus,
          retailPrice: book.retailPrice,
          pubDate: book.pubDate,
          country: book.country?.trim() ? book.country.trim().toUpperCase().slice(0, 2) : "KR",
          translator: book.translator,
          pageCount: book.pageCount,
          source: book.source,
          sourceDetail: book.sourceDetail,
          resale: book.resale,
          readDates: book.readDates,
          recordStatus: book.recordStatus,
          rating: book.rating,
          bgmLink: book.bgmLink,
          bgmTitle: book.bgmTitle,
          bgmArtist: book.bgmArtist,
          weather: book.weather,
          sentences: book.sentences,
          spineColor: book.spineColor,
          spineFont: book.spineFont,
        };
        setBooks((prev) => ({
          ...prev,
          [group]: [newBook, ...prev[group]],
        }));
      } else {
        const id = book.isbn ?? String(Date.now());
        const newBook: Book = {
          ...book,
          id,
          ownershipType,
          readingStatus,
          retailPrice: book.retailPrice,
          pubDate: book.pubDate,
          country: book.country?.trim() ? book.country.trim().toUpperCase().slice(0, 2) : "KR",
          translator: book.translator,
          pageCount: book.pageCount,
          source: book.source,
          sourceDetail: book.sourceDetail,
          resale: book.resale,
          readDates: book.readDates,
          recordStatus: book.recordStatus,
          rating: book.rating,
          bgmLink: book.bgmLink,
          bgmTitle: book.bgmTitle,
          bgmArtist: book.bgmArtist,
          weather: book.weather,
          sentences: book.sentences,
          spineColor: book.spineColor,
          spineFont: book.spineFont,
        };
        setBooks((prev) => {
          const exists = prev[group].some(
            (b) =>
              (b.isbn && b.isbn === book.isbn) ||
              (b.title === book.title && b.author === book.author)
          );
          if (exists) return prev;
          const next = { ...prev, [group]: [newBook, ...prev[group]] };
          saveToStorage(next);
          return next;
        });
      }
    },
    []
  );

  const removeBook = useCallback(async (group: BookGroup, id: string) => {
    if (supabase) {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) {
        console.error("Supabase delete error:", error);
        return;
      }
    }
    setBooks((prev) => {
      const next = { ...prev, [group]: prev[group].filter((b) => b.id !== id) };
      if (!supabase) saveToStorage(next);
      return next;
    });
  }, []);

  const setBookCountry = useCallback(
    async (id: string, country: string) => {
      const code = country.trim().toUpperCase().slice(0, 2);
      if (!code) return;
      if (supabase) {
        const { error } = await supabase
          .from("books")
          .update({ country: code })
          .eq("id", id);
        if (error) {
          console.error("Supabase update country error:", error);
          return;
        }
      }
      setBooks((prev) => {
        const updateIn = (arr: Book[]) =>
          arr.map((b) => (b.id === id ? { ...b, country: code } : b));
        const next = {
          my: updateIn(prev.my),
          read: updateIn(prev.read),
          ebook: updateIn(prev.ebook),
        };
        if (!supabase) saveToStorage(next);
        return next;
      });
    },
    []
  );

  const updateBook = useCallback(async (book: Book) => {
    const group = OWNERSHIP_TO_GROUP[book.ownershipType];
    if (supabase) {
      const row = bookToRow(book, book.ownershipType, book.readingStatus) as Record<string, unknown>;
      delete row.id;
      const { error } = await supabase.from("books").update(row).eq("id", book.id);
      if (error) {
        console.error("Supabase update book error:", error);
        return;
      }
    }
    setBooks((prev) => {
      const next = {
        ...prev,
        [group]: prev[group].map((b) => (b.id === book.id ? book : b)),
      };
      if (!supabase) saveToStorage(next);
      return next;
    });
  }, []);

  const setReadingStatus = useCallback(
    async (group: BookGroup, id: string, status: ReadingStatus) => {
      if (supabase) {
        const { error } = await supabase
          .from("books")
          .update({ reading_status: status })
          .eq("id", id);
        if (error) {
          console.error("Supabase update error:", error);
          return;
        }
      }
      setBooks((prev) => {
        const next = {
          ...prev,
          [group]: prev[group].map((b) =>
            b.id === id ? { ...b, readingStatus: status } : b
          ),
        };
        if (!supabase) saveToStorage(next);
        return next;
      });
    },
    []
  );

  const resetAll = useCallback(async () => {
    if (supabase) {
      await supabase.from("books").delete().neq("id", "");
    }
    setBooks(INITIAL);
    saveToStorage(INITIAL);
  }, []);

  const totalCount = books.my.length + books.read.length + books.ebook.length;

  return {
    books,
    isHydrated,
    addBook,
    updateBook,
    removeBook,
    setReadingStatus,
    setBookCountry,
    resetAll,
    totalCount,
  };
}
