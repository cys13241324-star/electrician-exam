"use client";

/**
 * CBT 풀이 페이지 — 결과 대시보드 + 해설 토글
 *
 * 흐름:
 *   1. 제출 직후: 결과 대시보드만 보임 (정답/오답 + 점수 + 응시정보 + 보기 채점)
 *   2. "해설 바로가기" 클릭 → 해설 / 오답분석 / 학습 POINT 펼침
 *
 * 기존 src/components/cbt/ResultView 톤 차용 + 분홍 톤 통일.
 */

import { useRef, useState, useEffect } from "react";
import type { Question, AnswerNum, SolveResultProps, Block } from "./types";
import HtmlBlock from "@/components/HtmlContent";

const CIRCLED = ["①", "②", "③", "④"] as const;

/* ------------------------------------------------------------------ */
/* 헬퍼: HTML / 이미지 / 블록 시퀀스                                    */
/* ------------------------------------------------------------------ */
// HtmlBlock → 공용 컴포넌트(@/components/HtmlContent): HTML + KaTeX($…$/$$…$$) 렌더

function ImgPlaceholder({ value, label }: { value: string; label: string }) {
  if (!value?.trim()) return null;
  if (value.startsWith("[필요")) {
    return (
      <div className="my-2 rounded border-2 border-dashed border-amber-400 bg-amber-50 p-3 text-center text-sm text-amber-700">
        <div className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </div>
        <div className="mt-1 font-mono text-xs">{value}</div>
      </div>
    );
  }
  return (
    <figure className="my-2 rounded border border-slate-200 bg-white p-2">
      <img
        src={`/questions/${value}`}
        alt={label}
        className="mx-auto max-h-72 rounded"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </figure>
  );
}

function BlockSequenceRenderer({
  blocks,
  imageLabel,
}: {
  blocks: Block[] | undefined;
  imageLabel: string;
}) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <>
      {blocks.map((b, i) =>
        b.type === "text" ? (
          <HtmlBlock
            key={b.id ?? `t-${i}`}
            html={b.value}
            className="text-sm leading-relaxed text-slate-800"
          />
        ) : (
          <ImgPlaceholder
            key={b.id ?? `i-${i}`}
            value={b.value}
            label={imageLabel}
          />
        )
      )}
    </>
  );
}

function formatElapsed(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}분 ${String(s).padStart(2, "0")}초`;
}

function getChoice(q: Question, n: AnswerNum) {
  return {
    text: (q[`보기${n}` as keyof Question] as string | undefined) ?? "",
    img: (q[`보기${n}그림` as keyof Question] as string | undefined) ?? "",
  };
}

/* ================================================================== */
/* 메인 컴포넌트                                                        */
/* ================================================================== */
export default function SolveResult({
  question,
  userAnswer,
  elapsedMs,
  onNext,
  onRetry,
}: SolveResultProps) {
  const [showExplain, setShowExplain] = useState(false);
  const explainRef = useRef<HTMLDivElement>(null);

  const rawCorrect = question["정답(1~4)"];
  const correctNum = (
    typeof rawCorrect === "number"
      ? rawCorrect
      : parseInt(String(rawCorrect ?? ""), 10)
  ) as AnswerNum;
  const isCorrect = userAnswer === correctNum;

  const hasExplain =
    Array.isArray(question.해설블록) &&
    question.해설블록.some((b) => b?.value?.trim());
  const hasWrong = !!question.오답분석?.trim();
  const hasLP =
    Array.isArray(question.학습포인트블록) &&
    question.학습포인트블록.some((b) => b?.value?.trim());
  const anyExplainContent = hasExplain || hasWrong || hasLP;

  // 해설 펼친 직후 자동 스크롤
  useEffect(() => {
    if (showExplain && explainRef.current) {
      explainRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showExplain]);

  // 응시 정보 표시용
  const meta = [
    {
      label: "문항코드",
      value: <span className="font-mono">{question.문항코드 ?? "—"}</span>,
    },
    {
      label: "출처",
      value: `${question.연도 ?? "—"}년 ${question.회차 ?? "—"}회`,
    },
    {
      label: "과목 / 챕터",
      value: `${question.과목ID ?? "—"} · ${question.챕터 ?? "—"}`,
    },
    { label: "문제유형", value: question.문제유형 ?? "—" },
    {
      label: "빈출도 / 난이도",
      value: (
        <span>
          <span className="text-rose-600">{"★".repeat(question.빈출도 ?? 0)}</span>
          <span className="mx-1 text-slate-300">·</span>
          <span className="text-purple-600">{"★".repeat(question.난이도 ?? 0)}</span>
        </span>
      ),
    },
    { label: "소요시간", value: formatElapsed(elapsedMs) },
  ];

  return (
    <div className="space-y-6">
      {/* ============== 1. 큰 결과 배너 (기존 ResultView 스타일) ============== */}
      <section
        className={`overflow-hidden rounded-2xl border-2 ${
          isCorrect
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
            : "border-rose-200 bg-gradient-to-br from-rose-50 to-white"
        }`}
      >
        <div className="flex flex-col items-center gap-4 px-8 py-8 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-zinc-600">채점 결과</p>
            <p
              className={`mt-1 text-5xl font-bold tracking-tight ${
                isCorrect ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {isCorrect ? "정답" : "오답"}
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              {isCorrect ? (
                <>잘하셨어요. 해설로 한 번 더 다지면 완벽해집니다.</>
              ) : (
                <>
                  정답은{" "}
                  <span className="font-bold text-rose-700">
                    {CIRCLED[correctNum - 1]} {correctNum}번
                  </span>
                  입니다.
                </>
              )}
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm font-medium text-zinc-600">100점 환산</p>
            <p className="mt-1 text-5xl font-bold text-zinc-900">
              {isCorrect ? 100 : 0}
              <span className="ml-1 text-2xl font-medium text-zinc-500">
                점
              </span>
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              소요 {formatElapsed(elapsedMs)}
            </p>
          </div>
        </div>
      </section>

      {/* ============== 2. 응시 정보 + 보기 채점 (2열) ============== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr]">
        {/* 응시 정보 */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-zinc-900">응시 정보</h2>
          <div className="space-y-2 text-sm">
            {meta.map((m) => (
              <div
                key={m.label}
                className="flex items-baseline gap-3 border-b border-slate-100 pb-1.5 last:border-0"
              >
                <span className="w-24 shrink-0 text-zinc-500">{m.label}</span>
                <span className="flex-1 font-medium text-zinc-900">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 보기 4개 채점 결과 */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-zinc-900">보기 채점</h2>
          <ol className="space-y-2">
            {([1, 2, 3, 4] as AnswerNum[]).map((n) => {
              const { text, img } = getChoice(question, n);
              const isThisCorrect = n === correctNum;
              const isThisUser = n === userAnswer;

              let containerCls = "border-slate-200 bg-white";
              let badgeCls = "bg-slate-100 text-slate-600";
              let marker: { icon: string; label: string; cls: string } | null =
                null;

              if (isThisCorrect && isThisUser) {
                containerCls = "border-emerald-500 bg-emerald-50";
                badgeCls = "bg-emerald-600 text-white";
                marker = {
                  icon: "✓",
                  label: "정답!",
                  cls: "bg-emerald-600 text-white",
                };
              } else if (isThisCorrect) {
                containerCls = "border-emerald-500 bg-emerald-50";
                badgeCls = "bg-emerald-600 text-white";
                marker = {
                  icon: "✓",
                  label: "정답",
                  cls: "bg-emerald-600 text-white",
                };
              } else if (isThisUser) {
                containerCls = "border-rose-500 bg-rose-50";
                badgeCls = "bg-rose-600 text-white";
                marker = {
                  icon: "✕",
                  label: "내 선택",
                  cls: "bg-rose-600 text-white",
                };
              }

              return (
                <li
                  key={n}
                  className={`flex items-start gap-3 rounded-lg border-2 p-2.5 transition-colors ${containerCls}`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badgeCls}`}
                    aria-hidden
                  >
                    {CIRCLED[n - 1]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <HtmlBlock
                      html={
                        text ||
                        `<span class='text-slate-300'>보기 ${n}</span>`
                      }
                      className="text-sm text-slate-800"
                    />
                    <ImgPlaceholder value={img} label={`보기${n}그림`} />
                  </div>
                  {marker && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${marker.cls}`}
                    >
                      {marker.icon} {marker.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      {/* ============== 3. 해설 바로가기 / 접기 ============== */}
      {anyExplainContent && (
        <div className="flex flex-col items-center gap-2 pt-1">
          {!showExplain ? (
            <button
              type="button"
              onClick={() => setShowExplain(true)}
              className="rounded-lg bg-pink-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-pink-700"
            >
              📖 해설 바로가기
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowExplain(false)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              ▲ 해설 접기
            </button>
          )}
          {!showExplain && (
            <p className="text-xs text-slate-500">
              해설 · 오답분석 · 독끝 학습 POINT를 한 번에 펼칩니다
            </p>
          )}
        </div>
      )}

      {/* ============== 4. 해설 영역 (showExplain일 때만) ============== */}
      {showExplain && (
        <div ref={explainRef} className="space-y-4 pt-2">
          {hasExplain && (
            <section className="rounded-xl border-l-4 border-orange-600 bg-orange-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-base" aria-hidden>
                  📖
                </span>
                <h3 className="text-sm font-bold text-orange-700">해설</h3>
              </div>
              <BlockSequenceRenderer
                blocks={question.해설블록}
                imageLabel="해설그림"
              />
            </section>
          )}

          {hasWrong && (
            <section className="rounded-xl border-l-4 border-purple-600 bg-purple-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-base" aria-hidden>
                  🔍
                </span>
                <h3 className="text-sm font-bold text-purple-700">오답분석</h3>
              </div>
              <HtmlBlock
                html={question.오답분석!}
                className="text-sm leading-relaxed text-slate-800"
              />
            </section>
          )}

          {hasLP && (
            <section className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-base" aria-hidden>
                  🎯
                </span>
                <h3 className="text-sm font-bold text-emerald-700">
                  독끝 학습 POINT
                </h3>
              </div>
              <BlockSequenceRenderer
                blocks={question.학습포인트블록}
                imageLabel="학습포인트그림"
              />
            </section>
          )}
        </div>
      )}

      {/* ============== 5. 하단 액션 ============== */}
      {(onRetry || onNext) && (
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              다시 풀기
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-pink-700"
            >
              다음 문항 →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
