"use client";

import type { CardProgress } from "./types";
import { createInitialProgress } from "./srs";

const KEY = "flashcard-progress";

type ProgressMap = Record<string, CardProgress>;

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

export function saveProgress(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function getOrCreateProgress(
  map: ProgressMap,
  cardId: string,
): CardProgress {
  return map[cardId] ?? createInitialProgress(cardId);
}

export function setProgress(
  map: ProgressMap,
  cardId: string,
  progress: CardProgress,
): ProgressMap {
  return { ...map, [cardId]: progress };
}

export function toggleFavorite(
  map: ProgressMap,
  cardId: string,
): ProgressMap {
  const cur = getOrCreateProgress(map, cardId);
  return {
    ...map,
    [cardId]: { ...cur, favorite: !cur.favorite },
  };
}
