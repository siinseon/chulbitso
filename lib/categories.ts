/**
 * 한국십진분류표(KDC) 기반 분야 옵션
 * 시집·소설은 유지, 기타만 KDC 목록에서 선택 가능
 */

/** 시집·소설은 변경 불가, 그대로 표시 */
export const PRESERVED_CATEGORIES = ["시집", "소설"] as const;

/** KDC 대분류 (기타인 책만 선택 가능) */
export const KDC_OPTIONS = [
  "총류",
  "철학",
  "인문",
  "종교",
  "사회과학",
  "자연과학",
  "기술과학",
  "예술",
  "언어",
  "문학",
  "역사",
  "기타",
] as const;

/** 도서 추가/기록 시 선택 가능한 전체 분야 (시집·소설 + 에세이 + KDC) */
export const FULL_CATEGORY_OPTIONS = [
  ...PRESERVED_CATEGORIES,
  "에세이",
  ...KDC_OPTIONS.filter((c) => c !== "기타"),
  "기타",
] as const;

export type PreservedCategory = (typeof PRESERVED_CATEGORIES)[number];
export type KdcCategory = (typeof KDC_OPTIONS)[number];
export type FullCategory = (typeof FULL_CATEGORY_OPTIONS)[number];

/** 시 시리즈/출판사/키워드 — 제목·출판사·시리즈 등에 이 중 하나만 있어도 무조건 시집으로 분류 */
export const POETRY_KEYWORDS = [
  "창비시선",
  "민음의시",
  "민음시의 시",
  "문학과지성사시인선",
  "문학과지성사 시인선",
  "문학동네 시인선",
  "시집",
] as const;

/** 시리즈 또는 출판사 문자열이 시 시리즈면 true (레거시 호환용) */
export const POETRY_SERIES_OR_PUBLISHERS = POETRY_KEYWORDS;

/** 제목·시리즈·출판사·분야 등에 시집 키워드가 있으면 true */
export function shouldClassifyAsPoetry(text: string | undefined): boolean {
  if (!text?.trim()) return false;
  const s = text.trim();
  return POETRY_KEYWORDS.some((key) => s.includes(key));
}

/** 시리즈 또는 출판사 문자열이 시 시리즈면 true */
export function isPoetrySeriesOrPublisher(seriesOrPublisher: string | undefined): boolean {
  return shouldClassifyAsPoetry(seriesOrPublisher);
}

/** 시집·소설이면 true (변경 불가) */
export function isPreservedCategory(cat: string | undefined): boolean {
  if (!cat) return false;
  return PRESERVED_CATEGORIES.includes(cat as PreservedCategory);
}

/** 알라딘 categoryName(예: 국내도서>소설/시/희곡>일본소설) → 우리 카테고리 */
export function mapAladdinCategory(categoryName: string | undefined): FullCategory | undefined {
  if (!categoryName?.trim()) return undefined;
  const s = categoryName;
  if (shouldClassifyAsPoetry(s)) return "시집";
  if (s.includes("소설")) return "소설";
  if (s.includes("시집") || /시\s*\/\s*시/.test(s) || /^시\b/.test(s)) return "시집";
  if (s.includes("에세이")) return "에세이";
  if (s.includes("만화") || s.includes("소설/시/희곡")) return "문학";
  if (s.includes("경제") || s.includes("경영")) return "사회과학";
  if (s.includes("총류")) return "총류";
  if (s.includes("철학")) return "철학";
  if (s.includes("인문")) return "인문";
  if (s.includes("종교")) return "종교";
  if (s.includes("사회")) return "사회과학";
  if (s.includes("자연과학") || (s.includes("과학") && !s.includes("기술과학"))) return "자연과학";
  if (s.includes("기술") || s.includes("공학") || s.includes("의학")) return "기술과학";
  if (s.includes("예술")) return "예술";
  if (s.includes("언어")) return "언어";
  if (s.includes("문학")) return "문학";
  if (s.includes("역사")) return "역사";
  return "기타";
}

/** raw 분류(엑셀·수동입력 등) → KDC 분류 기준으로 정규화 */
export function normalizeToKdcCategory(raw: string | undefined): FullCategory {
  if (!raw?.trim()) return "기타";
  const s = raw.trim();
  if (FULL_CATEGORY_OPTIONS.includes(s as FullCategory)) return s as FullCategory;
  return mapAladdinCategory(s) ?? "기타";
}
