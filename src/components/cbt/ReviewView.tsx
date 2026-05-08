"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AIExplainPanel from "@/components/AIExplainPanel";
import type { Attempt, Choice, Exam } from "@/lib/cbt/types";

const PAGE_SIZE = 10;

type FilterMode = "all" | "correct" | "wrong" | "checked";

export default function ReviewView({ exam }: { exam: Exam }) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const questionRefs = useRef<Record<number, HTMLElement | null>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cbt-attempt-${exam.id}`);
      if (saved) {
        setAttempt(JSON.parse(saved));
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [exam.id]);

  const visibleIndices = useMemo(() => {
    if (!attempt) return exam.questions.map((_, i) => i);
    return exam.questions
      .map((q, i) => i)
      .filter((i) => {
        const correct = attempt.answers[i] === exam.questions[i].answer;
        if (filterMode === "correct") return correct;
        if (filterMode === "wrong") return !correct;
        if (filterMode === "checked") return attempt.checked[i];
        return true;
      });
  }, [attempt, exam.questions, filterMode]);

  const totalPages = Math.max(1, Math.ceil(visibleIndices.length / PAGE_SIZE));

  useEffect(() => {
    if (pageIndex >= totalPages) setPageIndex(0);
  }, [totalPages, pageIndex]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        해설을 불러오는 중입니다...
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-bold text-zinc-900">응시 기록이 없습니다</h1>
        <p className="mt-3 text-sm text-zinc-600">
          응시 후에 해설을 볼 수 있습니다.
        </p>
        <Link
          href="/cbt"
          className="mt-6 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          모의고사 목록으로
        </Link>
      </div>
    );
  }

  const correctCount = exam.questions.filter(
    (q, i) => attempt.answers[i] === q.answer,
  ).length;
  const wrongCount = exam.totalQuestions - correctCount;
  const checkedCount = attempt.checked.filter(Boolean).length;

  const start = pageIndex * PAGE_SIZE;
  const pageIndices = visibleIndices.slice(start, start + PAGE_SIZE);

  function jumpToQuestion(qIdx: number) {
    const pos = visibleIndices.indexOf(qIdx);
    if (pos < 0) {
      // change filter to all and try again
      setFilterMode("all");
      const target = Math.floor(qIdx / PAGE_SIZE);
      setPageIndex(target);
      setTimeout(() => {
        questionRefs.current[qIdx]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
      return;
    }
    const target = Math.floor(pos / PAGE_SIZE);
    setPageIndex(target);
    setTimeout(() => {
      questionRefs.current[qIdx]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">해설</p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-900">
              {exam.title}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/cbt/${exam.id}/result`}
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              결과로 돌아가기
            </Link>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip
            active={filterMode === "all"}
            onClick={() => {
              setFilterMode("all");
              setPageIndex(0);
            }}
          >
            전체 ({exam.totalQuestions})
          </FilterChip>
          <FilterChip
            active={filterMode === "correct"}
            color="emerald"
            onClick={() => {
              setFilterMode("correct");
              setPageIndex(0);
            }}
          >
            맞힌 문항 ({correctCount})
          </FilterChip>
          <FilterChip
            active={filterMode === "wrong"}
            color="rose"
            onClick={() => {
              setFilterMode("wrong");
              setPageIndex(0);
            }}
          >
            틀린 문항 ({wrongCount})
          </FilterChip>
          <FilterChip
            active={filterMode === "checked"}
            color="amber"
            onClick={() => {
              setFilterMode("checked");
              setPageIndex(0);
            }}
          >
            체크 문항 ({checkedCount})
          </FilterChip>
        </div>

        {/* Question map */}
        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-4">
          <p className="mb-3 text-xs text-zinc-500">
            번호를 클릭하면 해당 해설로 이동합니다.
          </p>
          <div className="grid grid-cols-10 gap-1.5">
            {exam.questions.map((_, i) => {
              const correct = attempt.answers[i] === exam.questions[i].answer;
              const isChecked = attempt.checked[i];
              const baseColor = correct
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700";
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => jumpToQuestion(i)}
                  className={`relative rounded border py-2 text-xs font-semibold transition hover:opacity-80 ${baseColor}`}
                >
                  {String(i + 1).padStart(2, "0")}
                  {isChecked && (
                    <span className="absolute right-0.5 top-0 text-[10px] text-amber-500">
                      ★
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-600">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-sm border border-emerald-200 bg-emerald-50" />
              맞힘
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-sm border border-rose-200 bg-rose-50" />
              틀림
            </span>
            <span className="flex items-center gap-1">
              <span className="text-amber-500">★</span>
              체크
            </span>
          </div>
        </div>

        {/* Page heading */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-600">
            한 페이지 내 최대 {PAGE_SIZE}문항의 해설이 노출됩니다.
          </p>
          <p className="text-sm font-semibold text-zinc-900">
            {pageIndex + 1} / {totalPages} 페이지
          </p>
        </div>

        {/* Question explanations */}
        {pageIndices.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white py-12 text-center text-sm text-zinc-500">
            해당 항목이 없습니다.
          </div>
        ) : (
          <div className="space-y-5">
            {pageIndices.map((qIdx) => {
              const q = exam.questions[qIdx];
              const userAnswer = attempt.answers[qIdx];
              const isCorrect = userAnswer === q.answer;
              const isChecked = attempt.checked[qIdx];

              return (
                <article
                  key={qIdx}
                  ref={(el) => {
                    questionRefs.current[qIdx] = el;
                  }}
                  className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <header className="mb-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-zinc-900">
                        {String(q.number).padStart(2, "0")}
                      </span>
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                        [{q.subject}] {q.topic}
                      </span>
                      {isChecked && (
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          ★ 체크 문항
                        </span>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {isCorrect ? "정답" : "오답"}
                    </span>
                  </header>

                  <p className="text-base leading-7 text-zinc-900">
                    {q.questionText}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {q.choices.map((choice, i) => {
                      const value = (i + 1) as Choice;
                      const isAnswer = q.answer === value;
                      const isUserPick = userAnswer === value;
                      const wrongPick = isUserPick && !isAnswer;
                      return (
                        <li
                          key={i}
                          className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${
                            isAnswer
                              ? "border-emerald-300 bg-emerald-50"
                              : wrongPick
                                ? "border-rose-300 bg-rose-50"
                                : "border-zinc-200 bg-white"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                              isAnswer
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : wrongPick
                                  ? "border-rose-500 bg-rose-500 text-white"
                                  : "border-zinc-400 text-zinc-600"
                            }`}
                          >
                            {value}
                          </span>
                          <span className="flex-1 text-zinc-800">{choice}</span>
                          {isAnswer && (
                            <span className="text-xs font-semibold text-emerald-700">
                              정답
                            </span>
                          )}
                          {wrongPick && (
                            <span className="text-xs font-semibold text-rose-600">
                              내 선택
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-5 rounded-lg bg-zinc-50 p-4">
                    <p className="mb-2 text-xs font-semibold tracking-wide text-zinc-500">
                      해설
                    </p>
                    <p className="whitespace-pre-line text-sm leading-6 text-zinc-700">
                      {q.explanation}
                    </p>
                    <p className="mt-3 text-sm font-bold text-zinc-900">
                      정답: {q.answer}번
                    </p>
                    {userAnswer !== null && userAnswer !== q.answer && (
                      <p className="mt-1 text-xs text-rose-600">
                        선택한 답: {userAnswer}번
                      </p>
                    )}
                    {userAnswer === null && (
                      <p className="mt-1 text-xs text-zinc-500">미응답</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <AIExplainPanel
                      context={{
                        kind: "question",
                        question: `${q.questionText}\n선택지: ${q.choices
                          .map((c, i) => `${i + 1}) ${c}`)
                          .join(" / ")}`,
                        correctAnswer: `${q.answer}번 — ${q.choices[q.answer - 1]}`,
                        existingExplanation: q.explanation,
                        userWrongAnswer:
                          userAnswer !== null && userAnswer !== q.answer
                            ? `${userAnswer}번 — ${q.choices[userAnswer - 1]}`
                            : undefined,
                      }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
            disabled={pageIndex === 0}
            className="rounded-md border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← 이전 페이지
          </button>
          <span className="text-sm text-zinc-600">
            {pageIndex + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPageIndex(Math.min(totalPages - 1, pageIndex + 1))
            }
            disabled={pageIndex >= totalPages - 1}
            className="rounded-md border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음 페이지 →
          </button>
        </div>
      </main>
    </div>
  );
}

function FilterChip({
  active,
  color = "blue",
  onClick,
  children,
}: {
  active: boolean;
  color?: "blue" | "emerald" | "rose" | "amber";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const activeMap = {
    blue: "border-blue-600 bg-blue-50 text-blue-700",
    emerald: "border-emerald-500 bg-emerald-50 text-emerald-700",
    rose: "border-rose-500 bg-rose-50 text-rose-700",
    amber: "border-amber-500 bg-amber-50 text-amber-700",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
        active
          ? activeMap[color]
          : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}
