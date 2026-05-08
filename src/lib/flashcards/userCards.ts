"use client";

import type { Flashcard } from "./types";

const KEY = "flashcard-user-cards";

export type UserCardInput = Omit<Flashcard, "id" | "source"> & {
  memorizingTip?: string;
};

export function loadUserCards(): Flashcard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Flashcard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserCards(cards: Flashcard[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cards));
  } catch {
    /* ignore */
  }
}

export function addUserCards(newCards: UserCardInput[]): Flashcard[] {
  const existing = loadUserCards();
  const stamp = Date.now();
  const made: Flashcard[] = newCards.map((c, i) => {
    const tip = c.memorizingTip
      ? `\n\n💡 ${c.memorizingTip}`
      : "";
    return {
      id: `user-${stamp}-${i}`,
      front: c.front,
      back: c.back + tip,
      subject: c.subject,
      topic: c.topic,
      source: "user",
      hint: c.hint,
      example: c.example,
    };
  });
  const next = [...existing, ...made];
  saveUserCards(next);
  return made;
}

export function deleteUserCard(id: string): void {
  const existing = loadUserCards();
  saveUserCards(existing.filter((c) => c.id !== id));
}
