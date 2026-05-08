/**
 * 간격 반복 알고리즘 (SM-2 라이트 버전)
 * Anki 알고리즘 기반, 단순화.
 *
 * 사용자가 답을 보고 자가 평가하면(다시/어려움/보통/쉬움)
 * 다음 복습 시기를 자동 계산합니다.
 */

import type { CardProgress, CardStatus, Rating } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MIN_EASE = 1.3;
const INITIAL_EASE = 2.5;

export function createInitialProgress(cardId: string): CardProgress {
  return {
    cardId,
    ease: INITIAL_EASE,
    intervalDays: 0,
    reps: 0,
    correctReps: 0,
    lapses: 0,
    nextReviewAt: Date.now(),
    lastReviewAt: 0,
    status: "new",
  };
}

/**
 * 다음 학습 일정을 계산.
 * 학습 단계(learning)에서는 분 단위로 짧게, 복습 단계에서는 일 단위로 길어짐.
 */
export function rateCard(
  progress: CardProgress,
  rating: Rating,
  now: number = Date.now(),
): CardProgress {
  const next: CardProgress = {
    ...progress,
    reps: progress.reps + 1,
    lastReviewAt: now,
  };

  if (rating === "again") {
    // 처음부터 다시 — learning 상태로
    next.lapses = progress.lapses + 1;
    next.intervalDays = 0;
    next.status = "learning";
    next.ease = Math.max(MIN_EASE, progress.ease - 0.2);
    // 10분 후 다시
    next.nextReviewAt = now + 10 * 60 * 1000;
    return next;
  }

  next.correctReps = progress.correctReps + 1;

  if (progress.status === "new" || progress.status === "learning") {
    // 학습 단계 졸업 조건
    if (rating === "easy") {
      next.intervalDays = 4;
      next.status = "review";
    } else if (rating === "normal") {
      next.intervalDays = 1;
      next.status = "review";
    } else {
      // hard
      next.intervalDays = 0;
      next.status = "learning";
      next.nextReviewAt = now + 30 * 60 * 1000; // 30분 후
      return next;
    }
  } else {
    // 복습 단계 — 간격 늘리기
    const baseInterval = Math.max(1, progress.intervalDays);
    if (rating === "easy") {
      next.intervalDays = Math.round(baseInterval * progress.ease * 1.3);
      next.ease = Math.min(3.0, progress.ease + 0.15);
    } else if (rating === "normal") {
      next.intervalDays = Math.round(baseInterval * progress.ease);
    } else {
      // hard
      next.intervalDays = Math.round(baseInterval * 1.2);
      next.ease = Math.max(MIN_EASE, progress.ease - 0.15);
    }
  }

  // 마스터 조건: 30일 이상 + 5회 이상 정답
  if (next.intervalDays >= 30 && next.correctReps >= 5) {
    next.status = "mastered";
  }

  next.nextReviewAt = now + next.intervalDays * MS_PER_DAY;
  return next;
}

/**
 * 오늘 복습할 카드인지 판정.
 * - 신규(new) — 항상 후보
 * - 학습/복습 단계 — nextReviewAt이 지났으면 후보
 */
export function isDueToday(progress: CardProgress, now: number = Date.now()): boolean {
  if (progress.status === "mastered") {
    // 마스터 카드는 nextReview 초과 시에만
    return progress.nextReviewAt <= now;
  }
  if (progress.status === "new") return true;
  return progress.nextReviewAt <= now;
}

/** 마스터리 색상 (시각화용) */
export const STATUS_COLOR: Record<CardStatus, { bg: string; ring: string; label: string }> = {
  new: { bg: "bg-zinc-200", ring: "ring-zinc-300", label: "미학습" },
  learning: { bg: "bg-amber-400", ring: "ring-amber-500", label: "학습중" },
  review: { bg: "bg-blue-500", ring: "ring-blue-600", label: "복습중" },
  mastered: { bg: "bg-emerald-500", ring: "ring-emerald-600", label: "마스터" },
};

/** 다음 복습까지 남은 시간 표기 */
export function formatNextReview(progress: CardProgress, now: number = Date.now()): string {
  if (progress.status === "new") return "처음 학습";
  const diff = progress.nextReviewAt - now;
  if (diff <= 0) return "복습 가능";
  const days = Math.ceil(diff / MS_PER_DAY);
  if (days === 1) return "내일";
  if (days < 7) return `${days}일 후`;
  if (days < 30) return `${Math.ceil(days / 7)}주 후`;
  return `${Math.ceil(days / 30)}개월 후`;
}
