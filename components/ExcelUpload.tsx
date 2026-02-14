"use client";

import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { parseAladdinExcel } from "@/lib/excelParser";
import type { Book } from "@/lib/useBooks";

interface ExcelUploadProps {
  onAddBook: (
    group: "my" | "read" | "ebook",
    book: Omit<Book, "id" | "ownershipType" | "readingStatus"> & {
      readStatus?: "읽음" | "미독";
    }
  ) => void | Promise<void>;
  existingBooks: { my: Book[]; read: Book[]; ebook: Book[] };
}

function isDuplicate(
  existing: { my: Book[]; read: Book[]; ebook: Book[] },
  group: "my" | "ebook",
  title: string,
  author: string,
  isbn?: string
): boolean {
  const all = [...existing.my, ...existing.read, ...existing.ebook];
  if (isbn) {
    if (all.some((b) => b.isbn === isbn)) return true;
  }
  return all.some((b) => b.title === title && b.author === author);
}

/** ISBN으로 알라딘 API에서 표지·설명·쪽수·판형 등 보강 */
async function fetchBookByIsbn(
  isbn: string
): Promise<Partial<Pick<Book, "cover" | "description" | "pageCount" | "format" | "category" | "series" | "publisher" | "pubDate" | "retailPrice">> | null> {
  try {
    const res = await fetch(`/api/book?isbn=${encodeURIComponent(isbn)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      cover: data.cover || undefined,
      description: data.description || undefined,
      pageCount: data.pageCount,
      format: data.format,
      category: data.category,
      series: data.series,
      publisher: data.publisher,
      pubDate: data.pubDate,
      retailPrice: data.retailPrice,
    };
  } catch {
    return null;
  }
}

export default function ExcelUpload({ onAddBook, existingBooks }: ExcelUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    let added = 0;
    let skipped = 0;

    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer | undefined;
          if (!arrayBuffer) {
            alert("파일을 읽을 수 없습니다.");
            setUploading(false);
            resolve();
            return;
          }

          const rows = parseAladdinExcel(arrayBuffer);
          if (rows.length === 0) {
            alert(
              "등록할 도서가 없습니다.\n알라딘 구매내역 엑셀(상품명, 저자 컬럼 포함)인지 확인해 주세요."
            );
            setUploading(false);
            resolve();
            return;
          }

          const total = rows.length;
          for (let i = 0; i < rows.length; i++) {
            const { group, book } = rows[i];
            setProgress(`${i + 1}/${total}권 처리 중…`);

            if (
              isDuplicate(
                existingBooks,
                group,
                book.title,
                book.author,
                book.isbn
              )
            ) {
              skipped++;
              continue;
            }

            let finalBook = { ...book };

            if (book.isbn) {
              const extra = await fetchBookByIsbn(book.isbn);
              if (extra) {
                if (extra.cover) finalBook.cover = extra.cover;
                if (extra.description) finalBook.description = extra.description;
                if (extra.pageCount != null) finalBook.pageCount = finalBook.pageCount ?? extra.pageCount;
                if (extra.format) finalBook.format = finalBook.format ?? extra.format;
                if (extra.category) finalBook.category = finalBook.category ?? extra.category;
                if (extra.series) finalBook.series = finalBook.series ?? extra.series;
                if (extra.publisher) finalBook.publisher = finalBook.publisher ?? extra.publisher;
                if (extra.pubDate) finalBook.pubDate = finalBook.pubDate ?? extra.pubDate;
                if (extra.retailPrice != null) finalBook.retailPrice = finalBook.retailPrice ?? extra.retailPrice;
              }
            }

            await Promise.resolve(onAddBook(group, finalBook));
            added++;
          }

          setProgress("");
          alert(
            `✅ ${added}권 등록 완료!${skipped > 0 ? `\n(중복 ${skipped}권 제외)` : ""}`
          );
        } catch (err) {
          console.error("엑셀 파싱 오류:", err);
          alert(
            "❌ 파일 처리 오류:\n" +
              (err instanceof Error ? err.message : String(err))
          );
        } finally {
          setUploading(false);
          setProgress("");
          if (inputRef.current) inputRef.current.value = "";
          resolve();
        }
      };
      reader.onerror = () => {
        setUploading(false);
        setProgress("");
        alert("파일을 읽는 중 오류가 발생했습니다.");
        resolve();
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="bg-chulbit-card rounded-2xl p-5 shadow-card">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-primary rounded-xl py-5 min-h-[52px] flex flex-col items-center gap-2 bg-ivory hover:bg-ivory-border/50 active:bg-ivory-border/50 transition-colors disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 size={32} stroke="var(--point-color)" className="animate-spin" />
        ) : (
          <Upload size={32} stroke="var(--point-color)" strokeWidth={2} />
        )}
        <span className="text-[15px] font-bold text-primary">
          {uploading ? progress || "업로드 중..." : "알라딘 구매내역 엑셀 업로드"}
        </span>
        <span className="text-[13px] text-muted">
          .xlsx, .xls · ISBN 있으면 표지 자동 조회
        </span>
      </button>
    </div>
  );
}
