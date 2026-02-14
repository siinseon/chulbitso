export interface PaperReview {
  id: string;
  bookId: string;
  bookTitle: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = "chulbitso_paper_reviews";

function load(): PaperReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(reviews: PaperReview[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    //
  }
}

export function getPaperReviews(): PaperReview[] {
  return load();
}

export function addPaperReview(review: Omit<PaperReview, "id" | "createdAt">): PaperReview {
  const reviews = load();
  const newOne: PaperReview = {
    ...review,
    id: `review_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(newOne);
  save(reviews);
  return newOne;
}

export function removePaperReview(id: string) {
  const reviews = load().filter((r) => r.id !== id);
  save(reviews);
}
