"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { MathText } from "@/components/Math";
import AIExplainPanel from "@/components/AIExplainPanel";
import { simulators } from "@/lib/simulators";

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

  function goPrev() {
    if (index > 0) setIndex(index - 1);
  }
  function goNext() {
    if (index < deck.length - 1) setIndex(index + 1);
  }

  // 단축키 — Space 뒤집기, 1~4 평가, ←/→ 이전·다음
  // 입력창(텍스트/textarea/contenteditable)에 포커스 있으면 무시
  useEffect(() => {
    function isTypingTarget(t: EventTarget | null): boolean {
      if (!(t instanceof HTMLElement)) return false;
      const tag = t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (t.isContentEditable) return true;
      return false;
    }
    function onKey(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((v) => !v);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
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

  // 관련 시뮬레이터 필터링 (useMemo로 최적화)
  const relatedSimulators = useMemo(() => {
    return simulators.filter(
      (s) =>
        s.status === "available" &&
        s.subject === card.subject &&
        s.topic === card.topic
    );
  }, [card.subject, card.topic]);

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

      {/* 카드 영역 + 좌우 nav 버튼 */}
      <div className="mx-auto mb-6 flex max-w-5xl items-center gap-2 sm:gap-4">
        {/* 좌측 nav */}
        <SideNav
          dir="prev"
          onClick={goPrev}
          disabled={index === 0}
        />

        <div
          className="perspective-1000 flex-1"
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
                    <MathText>{card.front}</MathText>
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

                <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-6 text-center">
                  <p className="text-xl font-semibold leading-relaxed text-zinc-900 sm:text-2xl">
                    <MathText>{card.back}</MathText>
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

        {/* 우측 nav */}
        <SideNav
          dir="next"
          onClick={goNext}
          disabled={index >= deck.length - 1}
        />
      </div>

      {/* 관련 예제 (뒤집은 후에만 노출) */}
      {flipped && card.example && (
        <div
          className="mx-auto mb-6 max-w-3xl overflow-hidden rounded-2xl border-2 border-amber-200 bg-white shadow-md"
          style={{ animation: "flashUp 350ms ease-out 280ms backwards" }}
        >
          <header className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-5 py-2.5">
            <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-black tracking-wider text-white">
              ✏️ 관련 예제
            </span>
            <p className="text-xs font-semibold text-amber-900">
              실제 시험에서는 이렇게 출제됩니다
            </p>
          </header>
          <div className="px-5 py-4 sm:px-6 sm:py-5">
            <p className="text-[10px] font-bold tracking-widest text-zinc-500">
              문제
            </p>
            <p className="mt-1.5 text-sm leading-7 text-zinc-900 sm:text-base">
              <MathText>{card.example.question}</MathText>
            </p>

            <div className="mt-4">
              <p className="text-[10px] font-bold tracking-widest text-zinc-500">
                풀이 과정
              </p>
              <ol className="mt-2 space-y-1.5">
                {card.example.solution.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2"
                  >
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-7 text-zinc-900 sm:text-base">
                      <MathText>{step}</MathText>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border-2 border-emerald-300 bg-emerald-50 px-4 py-2.5">
              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-black tracking-wider text-white">
                정답
              </span>
              <p className="text-sm font-bold leading-7 text-emerald-900 sm:text-base">
                <MathText>{card.example.answer}</MathText>
              </p>
            </div>

            <div className="mt-4">
              <AIExplainPanel
                key={`explain-${card.id}`}
                context={{
                  kind: "card",
                  cardFront: card.front,
                  cardBack: card.back,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 예제 없는 카드도 AI 해설 버튼 노출 */}
      {flipped && !card.example && (
        <div
          className="mx-auto mb-6 max-w-3xl"
          style={{ animation: "flashUp 350ms ease-out 220ms backwards" }}
        >
          <AIExplainPanel
            key={`explain-${card.id}`}
            context={{
              kind: "card",
              cardFront: card.front,
              cardBack: card.back,
            }}
          />
        </div>
      )}

      {/* 새로운 섹션: 관련 시뮬레이터 */}
      {flipped && relatedSimulators.length > 0 && (
        <div
          className="mx-auto mb-6 max-w-3xl overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white shadow-md"
          style={{ animation: "flashUp 350ms ease-out 500ms backwards" }}
        >
          <header className="flex items-center gap-2 border-b border-indigo-200 bg-indigo-50 px-5 py-2.5">
            <span className="rounded-md bg-indigo-500 px-2 py-0.5 text-[10px] font-black tracking-wider text-white">
              💡 관련 시뮬레이터
            </span>
            <p className="text-xs font-semibold text-indigo-900">
              이론을 시각적으로 깊이 학습해 보세요
            </p>
          </header>
          <div className="px-5 py-4 space-y-3 sm:px-6 sm:py-5">
            {relatedSimulators.map((s) => (
              <Link
                key={s.id}
                href={`/simulator/${s.id}`}
                className="group flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition hover:border-indigo-400 hover:bg-indigo-50"
              >
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-zinc-900 group-hover:text-indigo-800">
                    {s.title}
                  </p>
                  <p className="text-xs text-zinc-600 group-hover:text-indigo-700">
                    {s.description}
                  </p>
                </div>
                <span className="ml-auto text-zinc-400 group-hover:text-indigo-600">
                  ›
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 평가 버튼 또는 안내 */}
      {flipped ? (
        <div
          className="mx-auto max-w-3xl"
          style={{
            animation: `flashUp 350ms ease-out ${card.example ? "440ms" : "280ms"} backwards`,
          }}
        >
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
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 text-xs text-zinc-500">
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="rounded-md bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-zinc-700"
          >
            정답 보기
          </button>
          <span className="ml-2 hidden sm:inline">
            <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px]">
              Space
            </kbd>
            <span className="mx-1.5">·</span>
            <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px]">
              ←
            </kbd>
            <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px]">
              →
            </kbd>
            <span className="ml-1">로 이동</span>
          </span>
        </div>
      )}
    </div>
  );
}

function SideNav({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "이전 카드" : "다음 카드"}
      className={`group flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 bg-white text-2xl shadow-md transition sm:h-14 sm:w-14 ${
        disabled
          ? "cursor-not-allowed border-zinc-200 text-zinc-300"
          : "border-zinc-300 text-zinc-700 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 hover:shadow-lg"
      }`}
    >
      <span className="leading-none transition group-hover:scale-110">
        {dir === "prev" ? "‹" : "›"}
      </span>
    </button>
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
