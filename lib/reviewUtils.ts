/** 종이비행기 리뷰 3칸: 구매버튼 · 만듦새 · 서평 */
export interface BookReviewParts {
  purchase: string;
  make: string;
  review: string;
}

const EMPTY: BookReviewParts = { purchase: "", make: "", review: "" };

export function parseReview(raw: string | undefined): BookReviewParts {
  const s = (raw ?? "").trim();
  if (!s) return { ...EMPTY };
  try {
    const parsed = JSON.parse(s) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const o = parsed as Record<string, unknown>;
      return {
        purchase: String(o.purchase ?? "").trim(),
        make: String(o.make ?? "").trim(),
        review: String(o.review ?? "").trim(),
      };
    }
  } catch {
    // legacy: 한 덩어리 문자열 → 서평 칸으로
  }
  return { ...EMPTY, review: s };
}

export function serializeReview(parts: BookReviewParts): string {
  const { purchase, make, review } = parts;
  if (!purchase && !make && !review) return "";
  return JSON.stringify({ purchase, make, review });
}

/** 리뷰가 하나라도 있는지 (저장/표시용) */
export function hasAnyReview(raw: string | undefined): boolean {
  const p = parseReview(raw);
  return !!(p.purchase || p.make || p.review);
}
