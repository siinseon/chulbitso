"use client";

import { useState, useEffect, useCallback } from "react";
import type { PaperReview } from "./paperReviews";
import {
  getPaperReviews,
  addPaperReview as addStorage,
  removePaperReview as removeStorage,
} from "./paperReviews";

export function usePaperReviews() {
  const [reviews, setReviews] = useState<PaperReview[]>([]);

  useEffect(() => {
    setReviews(getPaperReviews());
  }, []);

  const addReview = useCallback(
    (review: Omit<PaperReview, "id" | "createdAt">) => {
      const added = addStorage(review);
      setReviews((prev) => [added, ...prev]);
      return added;
    },
    []
  );

  const removeReview = useCallback((id: string) => {
    removeStorage(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const refresh = useCallback(() => {
    setReviews(getPaperReviews());
  }, []);

  return { reviews, addReview, removeReview, refresh };
}
