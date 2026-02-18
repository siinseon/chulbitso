"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "chulbitso-videotapes";

export interface VideoTapeEntry {
  id: string;
  title: string;
  episode: number;
  createdAt: string;
}

function loadTapes(): VideoTapeEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VideoTapeEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTapes(tapes: VideoTapeEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tapes));
}

export function useVideoTapes() {
  const [tapes, setTapes] = useState<VideoTapeEntry[]>([]);

  useEffect(() => {
    setTapes(loadTapes());
  }, []);

  const addTape = useCallback((title: string, episode: number) => {
    const t = (title || "").trim();
    if (!t) return;
    const entry: VideoTapeEntry = {
      id: crypto.randomUUID(),
      title: t,
      episode: Math.max(0, Math.min(9999, episode)),
      createdAt: new Date().toISOString(),
    };
    setTapes((prev) => {
      const next = [entry, ...prev];
      saveTapes(next);
      return next;
    });
    if (typeof navigator?.vibrate === "function") navigator.vibrate(30);
  }, []);

  const updateTape = useCallback((id: string, episode: number) => {
    setTapes((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, episode } : t));
      saveTapes(next);
      return next;
    });
  }, []);

  return { tapes, addTape, updateTape };
}
