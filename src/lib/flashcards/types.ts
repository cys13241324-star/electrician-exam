import type { Subject } from "@/lib/cbt/types";

export type CardSource = "preset" | "cbt-wrong" | "user";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  subject: Subject;
  topic: string;
  source: CardSource;
  hint?: string;
};

export type Rating = "again" | "hard" | "normal" | "easy";

export type CardStatus = "new" | "learning" | "review" | "mastered";

export type CardProgress = {
  cardId: string;
  ease: number;
  intervalDays: number;
  reps: number;
  correctReps: number;
  lapses: number;
  nextReviewAt: number;
  lastReviewAt: number;
  status: CardStatus;
  favorite?: boolean;
};

export type CollectionFilter = {
  subject?: Subject | "all";
  status?: CardStatus | "all" | "favorite" | "wrong";
  query?: string;
  source?: CardSource | "all";
};
