"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Attempt,
  Choice,
  Exam,
  FontScale,
  LayoutMode,
} from "@/lib/cbt/types";
import CalculatorDialog from "./CalculatorDialog";
import QuestionMapDialog from "./QuestionMapDialog";

type FilterMode = "all" | "remaining" | "checked";

const FONT_SCALES: FontScale[] = [100, 130, 150];
const LAYOUT_MODES: { value: LayoutMode; label: string }[] = [
  { value: "single", label: "1단" },
  { value: "double", label: "2단" },
  { value: "one", label: "1문제" },
];

export default function ExamTaker({ exam }: { exam: Exam }) {
  const router = useRouter();
  const storageKey = `cbt-attempt-${exam.id}`;
  const examineeName = "홍길동";

  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<(Choice | null)[]>(() =>
    Array(exam.totalQuestions).fill(null),
  );
  const [checked, setChecked] = useState<boolean[]>(() =>
    Array(exam.totalQuestions).fill(false),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startedAt] = useState<number>(() => Date.now());
  const [endsAt, setEndsAt] = useState<number>(
    () => Date.now() + exam.durationMinutes * 60 * 1000,
  );
  const [now, setNow] = useState<number>(() => Date.now());

  const [fontScale, setFontScale] = useState<FontScale>(100);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("single");
  const [showCalculator, setShowCalculator] = useState(false);
  const [showQuestionMap, setShowQuestionMap] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const [confirmStage, setConfirmStage] = useState<
    "none" | "warn-unanswered" | "final"
  >("none");

  const submittingRef = useRef(false);

  // Hydrate from localStorage once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data: Attempt = JSON.parse(saved);
        if (data.submittedAt) {
          router.replace(`/cbt/${exam.id}/result`);
          return;
        }
        setAnswers(data.answers);
        setChecked(data.checked);
        setEndsAt(data.endsAt);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [storageKey, exam.id, router]);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    const attempt: Attempt = {
      examId: exam.id,
      examineeName,
      startedAt,
      endsAt,
      answers,
      checked,
      submittedAt: null,
    };
    localStorage.setItem(storageKey, JSON.stringify(attempt));
  }, [
    hydrated,
    exam.id,
    examineeName,
    startedAt,
    endsAt,
    answers,
    checked,
    storageKey,
  ]);

  // Tick clock
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const remainingMs = Math.max(0, endsAt - now);
  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
  const remainingDisplay = `${String(remainingMinutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

  const submitNow = useCallback(() => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    const attempt: Attempt = {
      examId: exam.id,
      examineeName,
      startedAt,
      endsAt,
      answers,
      checked,
      submittedAt: Date.now(),
    };
    localStorage.setItem(storageKey, JSON.stringify(attempt));
    router.push(`/cbt/${exam.id}/result`);
  }, [
    exam.id,
    examineeName,
    startedAt,
    endsAt,
    answers,
    checked,
    storageKey,
    router,
  ]);

  // Auto-submit on timer end
  useEffect(() => {
    if (hydrated && remainingMs === 0 && !submittingRef.current) {
      submitNow();
    }
  }, [hydrated, remainingMs, submitNow]);

  const answeredCount = answers.filter((a) => a !== null).length;
  const remainingCount = exam.totalQuestions - answeredCount;
  const checkedCount = checked.filter(Boolean).length;

  const visibleIndices = useMemo(() => {
    if (filterMode === "remaining")
      return answers.map((a, i) => (a === null ? i : -1)).filter((i) => i >= 0);
    if (filterMode === "checked")
      return checked.map((c, i) => (c ? i : -1)).filter((i) => i >= 0);
    return answers.map((_, i) => i);
  }, [filterMode, answers, checked]);

  function selectAnswer(qIdx: number, choice: Choice) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = next[qIdx] === choice ? null : choice;
      return next;
    });
  }

  function toggleCheck(qIdx: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[qIdx] = !next[qIdx];
      return next;
    });
  }

  function goTo(idx: number) {
    setCurrentIndex(Math.max(0, Math.min(exam.totalQuestions - 1, idx)));
  }

  function goPrev() {
    const step = layoutMode === "double" ? 2 : 1;
    goTo(currentIndex - step);
  }

  function goNext() {
    const step = layoutMode === "double" ? 2 : 1;
    goTo(currentIndex + step);
  }

  function handleSubmitClick() {
    if (answeredCount < exam.totalQuestions) {
      setConfirmStage("warn-unanswered");
    } else {
      setConfirmStage("final");
    }
  }

  const fontSizeClass =
    fontScale === 150
      ? "text-xl leading-9"
      : fontScale === 130
        ? "text-lg leading-8"
        : "text-base leading-7";

  const visibleQuestions =
    layoutMode === "double"
      ? [exam.questions[currentIndex], exam.questions[currentIndex + 1]].filter(
          Boolean,
        )
      : [exam.questions[currentIndex]];

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-sm text-zinc-500">
        시험을 준비하고 있습니다...
      </div>
    );
  }

  const positionLabel = `${currentIndex + 1}/${exam.totalQuestions}`;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      {/* Top bar: title + timer + examinee */}
      <div className="border-b border-zinc-300 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <h1 className="text-lg font-bold text-zinc-900">
            전기기능사 CBT 문제풀이
          </h1>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">제한시간</span>
              <span className="font-semibold text-zinc-900">
                {exam.durationMinutes}분
              </span>
              <span
                className={`rounded-md px-3 py-1 font-mono font-bold ${
                  remainingMs < 60000
                    ? "bg-red-100 text-red-700"
                    : "bg-zinc-100 text-zinc-900"
                }`}
              >
                {remainingDisplay}
              </span>
            </div>
            <div className="text-zinc-700">
              <span className="text-zinc-500">수험자명: </span>
              <span className="font-semibold">{examineeName}</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-2 text-sm">
            <ToolGroup label="글자크기">
              {FONT_SCALES.map((scale) => (
                <ToolButton
                  key={scale}
                  active={fontScale === scale}
                  onClick={() => setFontScale(scale)}
                >
                  {scale}%
                </ToolButton>
              ))}
            </ToolGroup>

            <ToolGroup label="화면배치">
              {LAYOUT_MODES.map((mode) => (
                <ToolButton
                  key={mode.value}
                  active={layoutMode === mode.value}
                  onClick={() => setLayoutMode(mode.value)}
                >
                  {mode.label}
                </ToolButton>
              ))}
            </ToolGroup>

            <ToolButton onClick={() => setShowCalculator(true)}>
              계산기
            </ToolButton>

            <div className="ml-auto flex items-center gap-1">
              <FilterButton
                active={filterMode === "all"}
                onClick={() => {
                  setFilterMode("all");
                  setShowQuestionMap(true);
                }}
              >
                전체문제 ({exam.totalQuestions})
              </FilterButton>
              <FilterButton
                active={filterMode === "remaining"}
                onClick={() => {
                  setFilterMode("remaining");
                  setShowQuestionMap(true);
                }}
              >
                남은문제 ({remainingCount})
              </FilterButton>
              <FilterButton
                active={filterMode === "checked"}
                onClick={() => {
                  setFilterMode("checked");
                  setShowQuestionMap(true);
                }}
              >
                체크 문제 ({checkedCount})
              </FilterButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-6 py-6">
        {/* Question area */}
        <div className="flex flex-1 flex-col gap-4">
          <div
            className={`grid gap-4 ${
              layoutMode === "double" && visibleQuestions.length > 1
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {visibleQuestions.map((q) => {
              const qIdx = q.number - 1;
              return (
                <article
                  key={q.number}
                  className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <header className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-blue-600">
                        {String(q.number).padStart(2, "0")}
                      </span>
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                        {q.subject}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCheck(qIdx)}
                      className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                        checked[qIdx]
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {checked[qIdx] ? "★ 체크됨" : "☆ 체크"}
                    </button>
                  </header>

                  <p className={`text-zinc-900 ${fontSizeClass}`}>
                    {q.questionText}
                  </p>

                  <ul className={`mt-6 space-y-3 ${fontSizeClass}`}>
                    {q.choices.map((choice, i) => {
                      const value = (i + 1) as Choice;
                      const isSelected = answers[qIdx] === value;
                      return (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => selectAnswer(qIdx, value)}
                            className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
                              isSelected
                                ? "border-blue-600 bg-blue-50"
                                : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                                isSelected
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-zinc-400 text-zinc-600"
                              }`}
                            >
                              {value}
                            </span>
                            <span className="flex-1 text-zinc-800">
                              {choice}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>

        {/* Answer sheet sidebar */}
        {layoutMode !== "one" && (
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-4 rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-200 px-4 py-3">
                <h2 className="text-sm font-bold text-zinc-900">답안 표기란</h2>
              </div>
              <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
                {visibleIndices.map((qIdx) => {
                  const isCurrent = qIdx === currentIndex;
                  const isChecked = checked[qIdx];
                  return (
                    <div
                      key={qIdx}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                        isCurrent ? "bg-blue-50" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => goTo(qIdx)}
                        className={`w-7 text-left text-xs font-mono font-semibold ${
                          isCurrent ? "text-blue-600" : "text-zinc-500"
                        }`}
                      >
                        {String(qIdx + 1).padStart(2, "0")}
                      </button>
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((c) => {
                          const sel = answers[qIdx] === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => selectAnswer(qIdx, c as Choice)}
                              className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold transition ${
                                sel
                                  ? "border-zinc-900 bg-zinc-900 text-white"
                                  : "border-zinc-300 text-zinc-500 hover:border-zinc-500"
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                      {isChecked && (
                        <span className="text-amber-500" title="체크됨">
                          ★
                        </span>
                      )}
                    </div>
                  );
                })}
                {visibleIndices.length === 0 && (
                  <p className="px-2 py-6 text-center text-xs text-zinc-500">
                    표시할 문항이 없습니다.
                  </p>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 border-t border-zinc-300 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="rounded-md border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← 이전
          </button>

          <div className="text-sm text-zinc-600">
            <span className="font-semibold text-zinc-900">{positionLabel}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex >= exam.totalQuestions - 1}
              className="rounded-md border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음 →
            </button>
            <button
              type="button"
              onClick={handleSubmitClick}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              답안 제출
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showCalculator && (
        <CalculatorDialog onClose={() => setShowCalculator(false)} />
      )}

      {showQuestionMap && (
        <QuestionMapDialog
          total={exam.totalQuestions}
          answers={answers}
          checked={checked}
          currentIndex={currentIndex}
          filterMode={filterMode}
          onJump={(idx) => {
            goTo(idx);
            setShowQuestionMap(false);
          }}
          onClose={() => setShowQuestionMap(false)}
        />
      )}

      {confirmStage === "warn-unanswered" && (
        <ConfirmDialog
          title="답안 제출"
          message={`아직 풀지 않은 문제가 ${remainingCount}개 남아있습니다. 그래도 제출하시겠습니까?`}
          confirmLabel="확인"
          cancelLabel="더 풀기"
          onConfirm={() => setConfirmStage("final")}
          onCancel={() => setConfirmStage("none")}
        />
      )}

      {confirmStage === "final" && (
        <ConfirmDialog
          title="답안 제출"
          message="정말 답안을 제출하시겠습니까? 최종 제출 후에는 수정할 수 없습니다."
          confirmLabel="제출"
          cancelLabel="취소"
          onConfirm={submitNow}
          onCancel={() => setConfirmStage("none")}
        />
      )}
    </div>
  );
}

function ToolGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1">
      <span className="text-xs text-zinc-500">{label}</span>
      <div className="flex gap-0.5">{children}</div>
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-zinc-600 hover:bg-zinc-100"
      }`}
    >
      {children}
    </button>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-blue-600 bg-blue-50 text-blue-700"
          : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
        </div>
        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-zinc-700">{message}</p>
        </div>
        <div className="flex justify-end gap-2 border-t border-zinc-200 px-6 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
