"use client";

import { useMemo, useState } from "react";
import {
  formatNextReview,
  STATUS_COLOR,
} from "@/lib/flashcards/srs";
import {
  getOrCreateProgress,
  loadProgress,
  saveProgress,
  toggleFavorite,
} from "@/lib/flashcards/storage";
import type {
  CardStatus,
  Flashcard,
} from "@/lib/flashcards/types";
import { MathText } from "@/components/Math";

type ProgressMap = Record<string, ReturnType<typeof getOrCreateProgress>>;

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "new", label: "미학습" },
  { value: "learning", label: "학습중" },
  { value: "review", label: "복습중" },
  { value: "mastered", label: "마스터" },
  { value: "favorite", label: "⭐ 즐겨찾기" },
  { value: "wrong", label: "내 오답" },
];

const SUBJECT_OPTIONS = ["all", "전기이론", "전기기기", "전기설비"] as const;

export default function CardIndex({
  cards,
  progressMap,
  onProgress,
}: {
  cards: Flashcard[];
  progressMap: ProgressMap;
  onProgress: () => void;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [subject, setSubject] = useState<(typeof SUBJECT_OPTIONS)[number]>("all");
  const [status, setStatus] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (subject !== "all" && c.subject !== subject) return false;
      const p = getOrCreateProgress(progressMap, c.id);
      if (status === "favorite" && !p.favorite) return false;
      else if (status === "wrong" && c.source !== "cbt-wrong") return false;
      else if (
        status !== "all" &&
        status !== "favorite" &&
        status !== "wrong" &&
        p.status !== status
      )
        return false;
      if (q) {
        const txt = (c.front + " " + c.back + " " + c.topic).toLowerCase();
        if (!txt.includes(q)) return false;
      }
      return true;
    });
  }, [cards, progressMap, subject, status, query]);

  function fav(cardId: string) {
    const cur = loadProgress();
    saveProgress(toggleFavorite(cur, cardId));
    onProgress();
  }

  return (
    <div>
      {/* 검색 + 필터 */}
      <div className="mb-6 space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="카드 텍스트로 검색..."
              className="w-full rounded-md border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <div className="flex gap-1 rounded-md bg-zinc-100 p-1">
            <ViewBtn active={view === "grid"} onClick={() => setView("grid")}>
              ▦ 그리드
            </ViewBtn>
            <ViewBtn active={view === "list"} onClick={() => setView("list")}>
              ☰ 목록
            </ViewBtn>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div>
            <p className="mb-1.5 text-[11px] font-bold tracking-wide text-zinc-500">
              과목
            </p>
            <div className="flex flex-wrap gap-1">
              {SUBJECT_OPTIONS.map((s) => (
                <Chip
                  key={s}
                  active={subject === s}
                  onClick={() => setSubject(s)}
                >
                  {s === "all" ? "전체" : s}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-bold tracking-wide text-zinc-500">
              상태
            </p>
            <div className="flex flex-wrap gap-1">
              {STATUS_OPTIONS.map((s) => (
                <Chip
                  key={s.value}
                  active={status === s.value}
                  onClick={() => setStatus(s.value)}
                >
                  {s.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          {filtered.length}장 표시 · 전체 {cards.length}장
        </p>
      </div>

      {/* 카드 목록 */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center text-sm text-zinc-500">
          조건에 맞는 카드가 없습니다.
        </div>
      ) : view === "grid" ? (
        <GridView
          cards={filtered}
          progressMap={progressMap}
          onSelect={setSelectedCard}
          onFav={fav}
        />
      ) : (
        <ListView
          cards={filtered}
          progressMap={progressMap}
          onSelect={setSelectedCard}
          onFav={fav}
        />
      )}

      {/* 카드 자세히 모달 */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          progress={getOrCreateProgress(progressMap, selectedCard.id)}
          onClose={() => setSelectedCard(null)}
          onFav={() => fav(selectedCard.id)}
        />
      )}
    </div>
  );
}

function ViewBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
        active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        active
          ? "bg-violet-600 text-white"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

function GridView({
  cards,
  progressMap,
  onSelect,
  onFav,
}: {
  cards: Flashcard[];
  progressMap: ProgressMap;
  onSelect: (c: Flashcard) => void;
  onFav: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10">
      {cards.map((c, i) => {
        const p = getOrCreateProgress(progressMap, c.id);
        const tone = STATUS_COLOR[p.status];
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c)}
            title={c.front}
            className={`group relative flex aspect-square items-center justify-center rounded-lg ${tone.bg} text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:ring-2 ${tone.ring}`}
          >
            <span className="opacity-90">{i + 1}</span>
            {p.favorite && (
              <span className="absolute right-0.5 top-0 text-[10px] text-amber-300">
                ★
              </span>
            )}
            {c.source === "cbt-wrong" && (
              <span className="absolute left-0.5 bottom-0 text-[8px] text-rose-200">
                W
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ListView({
  cards,
  progressMap,
  onSelect,
  onFav,
}: {
  cards: Flashcard[];
  progressMap: ProgressMap;
  onSelect: (c: Flashcard) => void;
  onFav: (id: string) => void;
}) {
  return (
    <ul className="space-y-2">
      {cards.map((c) => {
        const p = getOrCreateProgress(progressMap, c.id);
        const tone = STATUS_COLOR[p.status];
        return (
          <li
            key={c.id}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-violet-300 hover:shadow-md"
          >
            <span
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${tone.bg} text-xs font-bold text-white`}
            >
              {tone.label.charAt(0)}
            </span>
            <button
              type="button"
              onClick={() => onSelect(c)}
              className="min-w-0 flex-1 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700">
                  {c.subject} · {c.topic}
                </span>
                {c.source === "cbt-wrong" && (
                  <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                    내 오답
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-1 text-sm font-semibold text-zinc-900">
                {c.front}
              </p>
              <p className="text-[11px] text-zinc-500">
                {tone.label} · 다음 복습 {formatNextReview(p)}
              </p>
            </button>
            <button
              type="button"
              onClick={() => onFav(c.id)}
              aria-label="즐겨찾기"
              className="text-2xl text-amber-400 hover:scale-110"
            >
              {p.favorite ? "★" : "☆"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function CardDetailModal({
  card,
  progress,
  onClose,
  onFav,
}: {
  card: Flashcard;
  progress: ReturnType<typeof getOrCreateProgress>;
  onClose: () => void;
  onFav: () => void;
}) {
  const tone = STATUS_COLOR[progress.status];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
            {card.subject} · {card.topic}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onFav}
              className="text-2xl text-amber-400"
            >
              {progress.favorite ? "★" : "☆"}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="rounded p-1 text-zinc-500 hover:text-zinc-900"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="text-[11px] font-bold tracking-widest text-zinc-500">
            QUESTION
          </p>
          <p className="mt-2 text-base font-bold leading-7 text-zinc-900 sm:text-lg">
            <MathText>{card.front}</MathText>
          </p>

          <hr className="my-5 border-zinc-200" />

          <p className="text-[11px] font-bold tracking-widest text-emerald-600">
            ANSWER
          </p>
          <p className="mt-2 text-sm leading-7 text-zinc-800">
            <MathText>{card.back}</MathText>
          </p>

          {card.example && (
            <>
              <hr className="my-5 border-zinc-200" />
              <p className="text-[11px] font-bold tracking-widest text-amber-600">
                ✏️ 관련 예제
              </p>
              <div className="mt-2 rounded-lg bg-amber-50 p-3">
                <p className="text-xs font-bold text-amber-900">문제</p>
                <p className="mt-1 text-sm leading-6 text-zinc-800">
                  <MathText>{card.example.question}</MathText>
                </p>
                <p className="mt-3 text-xs font-bold text-amber-900">풀이</p>
                <ol className="mt-1 space-y-1">
                  {card.example.solution.map((step, i) => (
                    <li
                      key={i}
                      className="rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs leading-6 text-zinc-900"
                    >
                      <span className="mr-1 font-bold text-amber-600">
                        {i + 1}.
                      </span>
                      <MathText>{step}</MathText>
                    </li>
                  ))}
                </ol>
                <p className="mt-3 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900">
                  정답: <MathText>{card.example.answer}</MathText>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-4 text-xs">
          <div>
            <p className="text-zinc-500">상태</p>
            <p className={`mt-1 font-bold ${tone.bg.replace("bg-", "text-")}`}>
              <span className={`inline-block h-2 w-2 rounded-full ${tone.bg}`} />{" "}
              {tone.label}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">복습 횟수</p>
            <p className="mt-1 font-bold text-zinc-800">
              {progress.reps}회 · 정답 {progress.correctReps}회
            </p>
          </div>
          <div>
            <p className="text-zinc-500">다음 복습</p>
            <p className="mt-1 font-bold text-zinc-800">
              {formatNextReview(progress)}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">출처</p>
            <p className="mt-1 font-bold text-zinc-800">
              {card.source === "cbt-wrong"
                ? "CBT 오답"
                : card.source === "user"
                  ? "내가 추가"
                  : "기본 카드"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
