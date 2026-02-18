import * as XLSX from "xlsx";
import { parseAuthorTranslator } from "@/lib/authorParser";
import { normalizeToKdcCategory, shouldClassifyAsPoetry } from "@/lib/categories";

export type OwnershipFromExcel = "my" | "ebook";

export interface ParsedBookRow {
  group: OwnershipFromExcel;
  book: {
    title: string;
    author: string;
    translator?: string;
    publisher?: string;
    pubDate?: string;
    isbn?: string;
    category?: string;
    series?: string;
    retailPrice?: number;
    pageCount?: number;
    format?: string;
    readStatus?: "읽음" | "미독";
    cover?: string;
    description?: string;
  };
}

/** 행에서 키 후보들 중 처음으로 있는 값 반환 */
function pick<T>(row: Record<string, unknown>, ...keys: string[]): T {
  for (const k of keys) {
    const v = row[k] ?? row[k.trim()];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v).trim() as T;
    }
  }
  return "" as T;
}

/** 알라딘 구매내역 엑셀에서 '상품명' 또는 '제목'이 있는 헤더 행 찾기 */
function findHeaderRow(sheet: XLSX.WorkSheet): number {
  for (let R = 0; R <= 15; R++) {
    for (let C = 0; C <= 15; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = sheet[cellAddress];
      const v = cell?.v ? String(cell.v).trim() : "";
      if (v.includes("상품명") || v === "제목" || v === "도서명") {
        return R;
      }
    }
  }
  return -1;
}

/** 엑셀 분야/카테고리/장르 → KDC 분류 기준으로 정규화 (시집 키워드 있으면 시집) */
function parseCategory(field: string): string {
  if (shouldClassifyAsPoetry(field)) return "시집";
  return normalizeToKdcCategory(field);
}

/** 출간일/출판일 셀 값을 YYYY-MM-DD 형태로 */
function normalizePubDate(val: string): string {
  let s = String(val ?? "").replace(/\.0$/, "").trim();
  if (!s) return "";
  s = s.replace(/\D/g, "");
  if (s.length === 8) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  return s ? String(val).trim() : "";
}

/** 정가/가격 숫자 추출 */
function parsePrice(val: unknown): number {
  const n = parseInt(String(val ?? "0").replace(/[^0-9]/g, ""), 10);
  return n > 0 ? n : 15000;
}

/** 페이지수 숫자 추출 (없으면 undefined) */
function parsePageCount(val: unknown): number | undefined {
  const n = parseInt(String(val ?? "").replace(/[^0-9]/g, ""), 10);
  return n > 0 ? n : undefined;
}

/**
 * 알라딘 구매내역 엑셀 파싱 - 다양한 컬럼명 지원
 * ISBN13, 작가(저자), 출판사, 출간일, 분야, 시리즈명, 정가 등 모두 수집
 */
export function parseAladdinExcel(arrayBuffer: ArrayBuffer): ParsedBookRow[] {
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet || !sheet["!ref"]) return [];

  const headerRow = findHeaderRow(sheet);
  if (headerRow < 0) return [];

  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    range: headerRow,
    raw: false,
    defval: "",
  });

  const result: ParsedBookRow[] = [];

  for (const row of json) {
    const type = pick<string>(row, "구분", "유형", "타입", "분류").trim();

    let group: OwnershipFromExcel = "my";
    if (type === "전자책") {
      group = "ebook";
    } else if (type !== "국내도서" && type !== "온라인중고" && type !== "") {
      continue;
    }

    const title = pick<string>(row, "상품명", "제목", "도서명", "title");
    const authorRaw = pick<string>(row, "저자/아티스트", "저자", "작가", "아티스트", "author");
    const { author, translator } = parseAuthorTranslator(authorRaw);

    if (!title || !author) continue;

    const isbn13 = pick<string>(row, "ISBN13", "ISBN13 ", "ISBN", "isbn").replace(/\D/g, "");
    const pubDate = normalizePubDate(
      pick<string>(row, "출간일", "출판일", "발행일", "pubDate", "출판년월일")
    );
    const field = pick<string>(row, "분야", "카테고리", "장르", "category");
    let category = parseCategory(field);
    const publisher = pick<string>(row, "출판사/제작사", "출판사", "제작사", "publisher");
    const series = pick<string>(row, "시리즈명", "시리즈", "series");
    if (shouldClassifyAsPoetry(title) || shouldClassifyAsPoetry(publisher) || shouldClassifyAsPoetry(series)) {
      category = "시집";
    }
    const retailPrice = parsePrice(
      pick<string>(row, "정가", "가격", "판매가", "price", "정가격") || "15000"
    );
    const pageCount = parsePageCount(
      pick<string>(row, "페이지수", "쪽수", "페이지", "pageCount")
    );
    const format = pick<string>(row, "판형", "형태", "format");
    const description = pick<string>(row, "설명", "내용", "description");

    result.push({
      group,
      book: {
        title,
        author,
        translator: translator || undefined,
        publisher: publisher || undefined,
        pubDate: pubDate || undefined,
        isbn: isbn13 || undefined,
        category: category || undefined,
        series: series || undefined,
        retailPrice,
        pageCount,
        format: format || undefined,
        readStatus: "미독",
        description: description || undefined,
      },
    });
  }

  return result;
}
