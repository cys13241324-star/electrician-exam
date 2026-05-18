"use client";

/**
 * CBT 풀이 진행 화면 (Agent 1)
 *
 * 학습자가 단일 문항을 풀고 제출하는 화면.
 *  - questions.json 정적 import (5문항)
 *  - 라우트 파라미터 code 가 문항코드와 매칭
 *  - 헤더(sticky) · 강의 버튼 · 발문 · 보기 4개 · 액션 바
 *  - 제출 시 SolveResult (Agent 2 컴포넌트) 렌더링
 *
 * Next.js 16 — params 는 Promise. 클라이언트 컴포넌트이므로 React 19 `use()` 로 unwrap.
 */

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import questionsData from "@/data/questions.json";
import type { Question, AnswerNum } from "./types";
import SolveResult from "./SolveResult";

const ALL: Question[] = questionsData as Question[];

const 과목명: Record<string, string> = {
  theory: "전기이론",
  machinery: "전기기기",
  facility: "전기설비",
};

/** 발문·보기·조건 등의 HTML(<i>, <sub>, <sup>, <strong>, <br>, <table>…)을 안전한 톤으로 렌더 */
function HtmlBlock({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  if (!html?.trim()) return null;
  return (
    <div
      className={`prose prose-sm max-w-none [&_table]:my-2 [&_table]:border-collapse [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-slate-300 [&_td]:px-2 [&_td]:py-1 ${
        className ?? ""
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** 그림 — 실제 파일이면 /questions/<filename>, "[필요: …]" 마커면 노란 점선 박스 */
function ImgPlaceholder({ value, label }: { value: string; label: string }) {
  if (!value?.trim()) return null;
  const needsManual = value.startsWith("[필요");
  if (!needsManual) {
    return (
      <figure className="my-3 rounded border border-slate-200 bg-white p-2">
        <img
          src={`/questions/${value}`}
          alt={label}
          className="mx-auto max-h-72 rounded"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            img.style.display = "none";
            img.nextElementSibling?.classList.remove("hidden");
          }}
        />
        <figcaption className="hidden text-center text-xs text-slate-500">
          <span className="font-mono">{value}</span> (파일 없음)
        </figcaption>
      </figure>
    );
  }
  return (
    <div className="my-3 rounded border-2 border-dashed border-amber-400 bg-amber-50 p-3 text-center text-sm text-amber-700">
      <div className="text-xs font-semibold uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-1 font-mono text-xs">{value}</div>
    </div>
  );
}

/** mm:ss 포맷 (ms → "mm:ss"). 60분 넘으면 hh:mm:ss로 확장 */
function fmtTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export default function SolvePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  // Next.js 16: params 는 Promise — 클라이언트에서 use() 로 unwrap
  const { code } = use(params);
  const router = useRouter();

  // 현재 문항 + 이전/다음 인덱스 (questions.json 배열 순서 기준)
  const { question, prev, next, idx } = useMemo(() => {
    const i = ALL.findIndex((q) => q.문항코드 === code);
    return {
      question: i >= 0 ? ALL[i] : null,
      prev: i > 0 ? ALL[i - 1] : null,
      next: i >= 0 && i < ALL.length - 1 ? ALL[i + 1] : null,
      idx: i,
    };
  }, [code]);

  // 풀이 상태
  const [selected, setSelected] = useState<AnswerNum | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  // 타이머 — 100ms 간격 카운트업, 제출 시 정지
  const startRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    startRef.current = Date.now() - elapsedMs;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 100);
  }, [elapsedMs]);

  // 문항 변경 시 풀이 상태 초기화 + 타이머 재시작
  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
    setElapsedMs(0);
    startRef.current = Date.now();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [code]);

  const handleSubmit = useCallback(() => {
    if (selected == null) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSubmitted(true);
  }, [selected]);

  const handleRetry = useCallback(() => {
    setSelected(null);
    setSubmitted(false);
    setElapsedMs(0);
    startRef.current = Date.now();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 100);
  }, []);

  const goPrev = useCallback(() => {
    if (prev?.문항코드) router.push(`/cbt/solve/${prev.문항코드}`);
  }, [prev, router]);

  const goNext = useCallback(() => {
    if (next?.문항코드) router.push(`/cbt/solve/${next.문항코드}`);
  }, [next, router]);

  // === 문항을 못 찾는 경우 ===
  if (!question) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="mb-4 text-5xl">🔍</div>
            <h1 className="mb-2 text-xl font-bold text-slate-900">
              문항을 찾을 수 없습니다
            </h1>
            <p className="mb-6 text-sm text-slate-500">
              <span className="font-mono">{code}</span> 에 해당하는 문항이
              없어요. 라이브러리에서 다시 골라주세요.
            </p>
            <Link
              href="/cbt/library"
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-700"
            >
              ← 라이브러리로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const 출처 =
    question.연도 && question.회차
      ? `${question.연도}년 ${question.회차}회`
      : "";
  const 과목 = question.과목ID ? 과목명[question.과목ID] ?? question.과목ID : "";
  const 빈출도 = question.빈출도 ?? 0;
  const 난이도 = question.난이도 ?? 0;

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      {/* ============== 헤더 (sticky) ============== */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3">
          {/* 좌: 메타 */}
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700">
              {question.문항코드}
            </span>
            {출처 && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {출처}
              </span>
            )}
            {과목 && (
              <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-bold text-pink-700">
                {과목}
              </span>
            )}
            {빈출도 > 0 && (
              <span
                className="text-xs text-rose-600"
                title={`빈출도 ${빈출도}/5`}
              >
                빈출 {"★".repeat(빈출도)}
              </span>
            )}
            {난이도 > 0 && (
              <span
                className="text-xs text-purple-600"
                title={`난이도 ${난이도}/5`}
              >
                난이도 {"★".repeat(난이도)}
              </span>
            )}
          </div>

          {/* 우: 타이머 + 라이브러리 링크 */}
          <div className="flex shrink-0 items-center gap-3">
            <div
              className={`rounded-full px-3 py-1 font-mono text-sm tabular-nums ${
                submitted
                  ? "bg-slate-100 text-slate-500"
                  : "bg-pink-50 text-pink-700"
              }`}
              aria-label="풀이 시간"
            >
              ⏱ {fmtTime(elapsedMs)}
            </div>
            <Link
              href="/cbt/library"
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              ← 라이브러리
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-6">
        {/* ============== 강의 버튼 ============== */}
        {question.강의주소 && (
          <div className="mb-5">
            <a
              href={question.강의주소}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
            >
              🎬 이 문제 강의 보기
            </a>
          </div>
        )}

        {/* ============== 발문 ============== */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 font-mono text-2xl font-bold text-pink-600">
            {question.문항코드}
          </div>
          <HtmlBlock
            html={question.발문 ?? ""}
            className="text-[17px] font-medium leading-relaxed text-slate-900"
          />
          {question.조건 && (
            <div className="mt-3 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
              <span className="mr-1 text-xs font-bold uppercase text-slate-500">
                조건
              </span>
              <HtmlBlock html={question.조건} className="inline" />
            </div>
          )}
          <ImgPlaceholder
            value={question.발문그림 ?? ""}
            label="발문그림"
          />
        </section>

        {/* ============== 보기 4개 ============== */}
        <section className="mb-6 space-y-3">
          {[1, 2, 3, 4].map((n) => {
            const num = n as AnswerNum;
            const text = (question[`보기${n}` as keyof Question] as string) ?? "";
            const img = (question[`보기${n}그림` as keyof Question] as string) ?? "";
            const isSelected = selected === num;
            const locked = submitted;

            return (
              <button
                key={n}
                type="button"
                onClick={() => !locked && setSelected(num)}
                disabled={locked}
                aria-pressed={isSelected}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? "border-pink-500 bg-pink-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-pink-300 hover:bg-pink-50/30"
                } ${
                  locked
                    ? "cursor-not-allowed opacity-80"
                    : "cursor-pointer"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                    isSelected
                      ? "bg-pink-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {["①", "②", "③", "④"][n - 1]}
                </span>
                <div className="min-w-0 flex-1">
                  <HtmlBlock
                    html={text || `<span class="text-slate-300">보기 ${n}</span>`}
                    className="text-[15px] text-slate-800"
                  />
                  <ImgPlaceholder value={img} label={`보기${n}그림`} />
                </div>
              </button>
            );
          })}
        </section>

        {/* ============== 결과 (제출 후) ============== */}
        {submitted && selected != null && (
          <section className="mb-6">
            <SolveResult
              question={question}
              userAnswer={selected}
              elapsedMs={elapsedMs}
              onNext={next ? goNext : undefined}
              onRetry={handleRetry}
            />
          </section>
        )}
      </div>

      {/* ============== 하단 액션 바 (제출 전에만) ============== */}
      {!submitted && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={!prev}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← 이전 문항
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={selected == null}
              className="flex-1 rounded-full bg-pink-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              제출하기
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={!next}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음 문항 →
            </button>
          </div>
          {idx >= 0 && (
            <div className="pb-2 text-center text-[11px] text-slate-400">
              {idx + 1} / {ALL.length}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
