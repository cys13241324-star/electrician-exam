"use client";

import { useEffect, useState } from "react";
import {
  formatNextReview,
  rateCard,
  STATUS_COLOR,
} from "@/lib/flashcards/srs";
import {
  getOrCreateProgress,
  loadProgress,
  saveProgress,
  setProgress,
  toggleFavorite,
} from "@/lib/flashcards/storage";
import type { Flashcard, Rating } from "@/lib/flashcards/types";

const SUBJECT_THEME: Record<
  string,
  { gradient: string; chip: string; border: string }
> = {
  전기이론: {
    gradient: "from-blue-500 via-indigo-500 to-violet-600",
    chip: "bg-blue-100 text-blue-800",
    border: "border-blue-300",
  },
  전기기기: {
    gradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    chip: "bg-violet-100 text-violet-800",
    border: "border-violet-300",
  },
  전기설비: {
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    chip: "bg-emerald-100 text-emerald-800",
    border: "border-emerald-300",
  },
};

export default function CardStudy({
  deck,
  onProgress,
}: {
  deck: Flashcard[];
  onProgress: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [favoriteVersion, setFavoriteVersion] = useState(0);
  const card = deck[index];

  // 카드 변경 시 뒤집기 초기화
  useEffect(() => {
    setFlipped(false);
  }, [index]);

  // 단축키
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((v) => !v);
      } else if (flipped) {
        if (e.key === "1") rate("again");
        else if (e.key === "2") rate("hard");
        else if (e.key === "3") rate("normal");
        else if (e.key === "4") rate("easy");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, index]);

  if (!card) return null;

  const map = loadProgress();
  const progress = getOrCreateProgress(map, card.id);
  const theme = SUBJECT_THEME[card.subject] ?? SUBJECT_THEME["전기이론"];
  const status = STATUS_COLOR[progress.status];

  function rate(rating: Rating) {
    const cur = loadProgress();
    const p = getOrCreateProgress(cur, card.id);
    const next = rateCard(p, rating);
    saveProgress(setProgress(cur, card.id, next));
    onProgress();
    // 다음 카드로
    if (index < deck.length - 1) {
      setIndex(index + 1);
    } else {
      // 마지막 카드 — 첫 번째로 돌아가거나 완료 모드
      setIndex(0);
    }
  }

  function fav() {
    const cur = loadProgress();
    saveProgress(toggleFavorite(cur, card.id));
    setFavoriteVersion((v) => v + 1);
    onProgress();
  }

  // favorite 다시 읽기
  void favoriteVersion;
  const isFav = !!loadProgress()[card.id]?.favorite;

  return (
    <div>
      {/* 진행률 + 컨트롤 */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-bold ${theme.chip}`}
          >
            {card.subject} · {card.topic}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-semibold text-white ${status.bg}`}
          >
            {status.label}
          </span>
          {card.source === "cbt-wrong" && (
            <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
              내 오답에서
            </span>
          )}
        </div>
        <div className="text-sm font-semibold text-zinc-700">
          {index + 1}{" "}
          <span className="text-zinc-400">/ {deck.length}</span>
        </div>
      </div>

      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all"
          style={{ width: `${((index + 1) / deck.length) * 100}%` }}
        />
      </div>

      {/* 카드 영역 */}
      <div
        className="perspective-1000 mx-auto mb-6 max-w-3xl"
        style={{ perspective: "1500px" }}
      >
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className="group relative block h-[420px] w-full cursor-pointer sm:h-[500px]"
          aria-label={flipped ? "질문 보기" : "정답 보기"}
        >
          <div
            className="relative h-full w-full transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* 앞면 — 질문 */}
            <CardFace
              variant="front"
              gradient={theme.gradient}
              border={theme.border}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wider text-white backdrop-blur">
                    QUESTION
                  </span>
                  <FavButton onToggle={fav} isFav={isFav} dark />
                </div>

                <div className="flex flex-1 items-center justify-center px-4 py-8 text-center">
                  <p className="text-2xl font-bold leading-relaxed text-white sm:text-3xl">
                    {card.front}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-white/85">
                  <span className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">
                    👇 탭하면 정답이 보여요
                  </span>
                </div>
              </div>
            </CardFace>

            {/* 뒷면 — 정답 */}
            <CardFace
              variant="back"
              gradient={theme.gradient}
              border={theme.border}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold tracking-wider text-white shadow-md">
                    ✓ ANSWER
                  </span>
                  <FavButton onToggle={fav} isFav={isFav} dark={false} />
                </div>

                <div className="flex flex-1 items-center justify-center px-4 py-6 text-center">
                  <p className="whitespace-pre-line text-xl font-semibold leading-relaxed text-zinc-900 sm:text-2xl">
                    {card.back}
                  </p>
                </div>

                <p className="text-center text-xs text-zinc-500">
                  다음 복습:{" "}
                  <strong className="text-zinc-700">
                    {formatNextReview(progress)}
                  </strong>
                </p>
              </div>
            </CardFace>
          </div>
        </button>
      </div>

      {/* 평가 버튼 또는 안내 */}
      {flipped ? (
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-center text-sm font-semibold text-zinc-700">
            맞췄나요? 정답을 보고 솔직하게 평가해주세요.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <RatingButton
              tone="rose"
              emoji="😣"
              label="다시"
              hint="모르겠음"
              kbd="1"
              onClick={() => rate("again")}
            />
            <RatingButton
              tone="amber"
              emoji="🤔"
              label="어려움"
              hint="간신히"
              kbd="2"
              onClick={() => rate("hard")}
            />
            <RatingButton
              tone="blue"
              emoji="🙂"
              label="보통"
              hint="맞췄음"
              kbd="3"
              onClick={() => rate("normal")}
            />
            <RatingButton
              tone="emerald"
              emoji="😄"
              label="쉬움"
              hint="잘 알아요"
              kbd="4"
              onClick={() => rate("easy")}
            />
          </div>
          <p className="mt-3 text-center text-[11px] text-zinc-500">
            평가에 따라 다음 복습 일정이 달라집니다 (간격 반복)
          </p>
        </div>
      ) : (
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
            className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-zinc-50"
          >
            ← 이전
          </button>
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="rounded-md bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-zinc-700"
          >
            정답 보기 (Space)
          </button>
          <button
            type="button"
            onClick={() => setIndex(Math.min(deck.length - 1, index + 1))}
            disabled={index >= deck.length - 1}
            className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-zinc-50"
          >
            다음 →
          </button>
        </div>
      )}
    </div>
  );
}

function CardFace({
  variant,
  gradient,
  border,
  children,
}: {
  variant: "front" | "back";
  gradient: string;
  border: string;
  children: React.ReactNode;
}) {
  const front = variant === "front";
  return (
    <div
      className={`absolute inset-0 overflow-hidden rounded-3xl border-2 shadow-2xl ${
        front
          ? `bg-gradient-to-br ${gradient}`
          : `bg-white ${border}`
      } p-6 sm:p-8`}
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: front ? "rotateY(0deg)" : "rotateY(180deg)",
      }}
    >
      {children}
    </div>
  );
}

function FavButton({
  onToggle,
  isFav,
  dark,
}: {
  onToggle: () => void;
  isFav: boolean;
  dark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label="즐겨찾기"
      className={`rounded-full p-2 transition ${
        dark
          ? "bg-white/20 text-white hover:bg-white/30"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      }`}
    >
      <span className={isFav ? "text-amber-400" : ""}>{isFav ? "★" : "☆"}</span>
    </button>
  );
}

function RatingButton({
  tone,
  emoji,
  label,
  hint,
  kbd,
  onClick,
}: {
  tone: "rose" | "amber" | "blue" | "emerald";
  emoji: string;
  label: string;
  hint: string;
  kbd: string;
  onClick: () => void;
}) {
  const toneMap = {
    rose: "border-rose-200 hover:border-rose-400 hover:bg-rose-50",
    amber: "border-amber-200 hover:border-amber-400 hover:bg-amber-50",
    blue: "border-blue-200 hover:border-blue-400 hover:bg-blue-50",
    emerald: "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
  };
  const labelTone = {
    rose: "text-rose-700",
    amber: "text-amber-700",
    blue: "text-blue-700",
    emerald: "text-emerald-700",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl border-2 bg-white px-4 py-4 transition ${toneMap[tone]}`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className={`text-base font-bold ${labelTone[tone]}`}>{label}</span>
      <span className="text-[11px] text-zinc-500">{hint}</span>
      <kbd className="mt-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
        {kbd}
      </kbd>
    </button>
  );
}
