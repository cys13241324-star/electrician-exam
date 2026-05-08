/**
 * 학습자 컨텍스트 수집 — 클라이언트 측 localStorage에서 끌어와
 * AI 프롬프트에 주입할 수 있는 형태로 정리.
 *
 * 모든 함수는 브라우저 환경 가정. SSR에서 호출하면 안 됨.
 */

import type { Attempt } from "@/lib/cbt/types";
import type { CardProgress } from "@/lib/flashcards/types";

const ATTEMPT_KEY_PREFIX = "cbt-attempt-";
const CARD_PROGRESS_KEY = "flashcard-progress";

export type LearnerSnapshot = {
  recentAttempts: Array<{
    examId: string;
    submittedAt: number;
    score: number;
    weakSubjects: string[];
  }>;
  cards: {
    total: number;
    dueToday: number;
    mastered: number;
    weak: number;
  };
  weakTopics: string[];
};

export function collectLearnerSnapshot(): LearnerSnapshot {
  if (typeof window === "undefined") {
    return {
      recentAttempts: [],
      cards: { total: 0, dueToday: 0, mastered: 0, weak: 0 },
      weakTopics: [],
    };
  }

  const recentAttempts = getRecentAttempts();
  const cards = getCardStats();
  const weakTopics = getWeakTopics(recentAttempts);

  return { recentAttempts, cards, weakTopics };
}

function getRecentAttempts() {
  const out: LearnerSnapshot["recentAttempts"] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(ATTEMPT_KEY_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const att = JSON.parse(raw) as Attempt;
      if (!att.submittedAt) continue;
      out.push({
        examId: att.examId,
        submittedAt: att.submittedAt,
        score: 0,
        weakSubjects: [],
      });
    } catch {
      continue;
    }
  }
  return out
    .sort((a, b) => b.submittedAt - a.submittedAt)
    .slice(0, 5);
}

function getCardStats() {
  try {
    const raw = localStorage.getItem(CARD_PROGRESS_KEY);
    if (!raw) return { total: 0, dueToday: 0, mastered: 0, weak: 0 };
    const map = JSON.parse(raw) as Record<string, CardProgress>;
    const list = Object.values(map);
    const now = Date.now();
    return {
      total: list.length,
      dueToday: list.filter((c) => c.nextReviewAt <= now).length,
      mastered: list.filter((c) => c.status === "mastered").length,
      weak: list.filter((c) => c.lapses >= 2).length,
    };
  } catch {
    return { total: 0, dueToday: 0, mastered: 0, weak: 0 };
  }
}

function getWeakTopics(_attempts: LearnerSnapshot["recentAttempts"]): string[] {
  return [];
}

export function snapshotToPrompt(snap: LearnerSnapshot): string {
  const lines: string[] = [];
  if (snap.recentAttempts.length > 0) {
    lines.push(`- 최근 ${snap.recentAttempts.length}회 모의고사 응시 기록 있음`);
  } else {
    lines.push("- 아직 모의고사 응시 기록 없음");
  }
  if (snap.cards.total > 0) {
    lines.push(
      `- 플립카드 ${snap.cards.total}장 중 오늘 복습할 카드 ${snap.cards.dueToday}장, 마스터 ${snap.cards.mastered}장`
    );
  } else {
    lines.push("- 아직 플립카드 학습 시작 안함");
  }
  if (snap.cards.weak > 0) {
    lines.push(`- 자주 틀리는 카드 ${snap.cards.weak}장 (lapses ≥ 2)`);
  }
  return lines.join("\n");
}
