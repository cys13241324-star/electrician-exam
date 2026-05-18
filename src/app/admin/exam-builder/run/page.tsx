"use client";

/**
 * 시험 응시 → 결과 (/admin/exam-builder/run)
 *
 * 빌더에서 sessionStorage('cbt_exam_run')로 넘긴 시험 세트를 응시.
 * 결과는 점수 없이: "N문항 중 M정답" + 취약점(과목·유형·빈출도·연도회차별)
 * + 문항별 해설(해설/오답분석/학습포인트, HTML+LaTeX) 제공.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import HtmlContent from "@/components/HtmlContent";

type Block = { type: "text" | "image"; value: string };
type Q = {
  문항코드?: string;
  연도?: string | number;
  회차?: string | number;
  과목ID?: string;
  챕터?: string;
  빈출도?: number;
  난이도?: number;
  문제유형?: string;
  발문?: string;
  조건?: string;
  발문그림?: string;
  보기1?: string;
  보기2?: string;
  보기3?: string;
  보기4?: string;
  "정답(1~4)"?: string | number;
  오답분석?: string;
  해설블록?: Block[];
  학습포인트블록?: Block[];
};
type Exam = { title: string; durationMinutes: number; questions: Q[] };

const 과목명: Record<string, string> = {
  theory: "전기이론",
  machinery: "전기기기",
  facility: "전기설비",
};

function ImgBlock({ v }: { v: string }) {
  if (!v) return null;
  if (v.startsWith("[필요")) {
    return (
      <div className="my-2 rounded border-2 border-dashed border-amber-400 bg-amber-50 p-3 text-center text-xs text-amber-700">
        그림 필요 — {v}
      </div>
    );
  }
  return (
    <img
      src={`/questions/${v}`}
      alt=""
      className="my-2 mx-auto max-h-72 rounded border"
      onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
    />
  );
}

function Blocks({ blocks }: { blocks?: Block[] }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((b, i) =>
        b.type === "image" ? (
          <ImgBlock key={i} v={b.value} />
        ) : (
          <HtmlContent key={i} html={b.value} className="text-sm" />
        )
      )}
    </>
  );
}

export default function ExamRunPage() {
  const [exam, setExam] = useState<Exam | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cbt_exam_run");
      if (raw) {
        const e: Exam = JSON.parse(raw);
        setExam(e);
        setAnswers(new Array(e.questions.length).fill(null));
      }
    } catch {
      /* noop */
    }
  }, []);

  const result = useMemo(() => {
    if (!exam) return null;
    const groups: Record<string, Record<string, { ok: number; total: number }>> = {
      과목: {},
      문제유형: {},
      빈출도: {},
      "연도·회차": {},
    };
    let ok = 0;
    exam.questions.forEach((q, i) => {
      const correct = Number(q["정답(1~4)"]);
      const isOk = answers[i] === correct;
      if (isOk) ok++;
      const keys: [string, string][] = [
        ["과목", 과목명[q.과목ID || ""] || q.과목ID || "기타"],
        ["문제유형", q.문제유형 || "기타"],
        ["빈출도", `빈출도 ${q.빈출도 ?? "-"}`],
        ["연도·회차", `${q.연도 ?? "-"} ${q.회차 ?? "-"}회`],
      ];
      for (const [g, k] of keys) {
        groups[g][k] = groups[g][k] || { ok: 0, total: 0 };
        groups[g][k].total++;
        if (isOk) groups[g][k].ok++;
      }
    });
    return { ok, total: exam.questions.length, groups };
  }, [exam, answers, done]);

  if (!exam) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-2xl rounded-lg border bg-white p-8 text-center">
          <p className="text-zinc-600">진행 중인 시험이 없습니다.</p>
          <Link
            href="/admin/exam-builder"
            className="mt-3 inline-block text-sm text-blue-600 hover:underline"
          >
            ← 시험 생성으로
          </Link>
        </div>
      </div>
    );
  }

  // ===== 결과 =====
  if (done && result) {
    const rate = Math.round((result.ok / result.total) * 100);
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-xl font-bold text-zinc-900">{exam.title} — 결과</h1>
            <Link href="/admin/exam-builder" className="text-sm text-blue-600 hover:underline">
              ← 시험 생성
            </Link>
          </div>

          {/* 대시보드 (점수 X) */}
          <div className="mb-5 rounded-xl border border-zinc-200 bg-white p-6 text-center">
            <p className="text-sm text-zinc-500">총 {result.total}문항 중</p>
            <p className="my-1 text-4xl font-extrabold text-indigo-600">
              {result.ok}
              <span className="text-2xl text-zinc-400"> 정답</span>
            </p>
            <p className="text-sm text-zinc-500">정답률 {rate}% (합/불 판정 없음)</p>
          </div>

          {/* 취약점 표 */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(result.groups).map(([g, rows]) => (
              <div key={g} className="rounded-lg border border-zinc-200 bg-white p-4">
                <h2 className="mb-2 text-sm font-bold text-zinc-700">{g}별 정답률</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(rows)
                      .sort((a, b) => a[1].ok / a[1].total - b[1].ok / b[1].total)
                      .map(([k, v]) => {
                        const r = Math.round((v.ok / v.total) * 100);
                        const weak = r < 60;
                        return (
                          <tr key={k} className="border-b last:border-0">
                            <td className="py-1 text-zinc-700">{k}</td>
                            <td className="py-1 text-right text-zinc-600">
                              {v.ok}/{v.total}
                            </td>
                            <td
                              className={`py-1 pl-3 text-right font-semibold ${
                                weak ? "text-red-600" : "text-emerald-600"
                              }`}
                            >
                              {r}%{weak ? " ⚠" : ""}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* 문항별 해설 */}
          <div className="space-y-4">
            {exam.questions.map((q, i) => {
              const correct = Number(q["정답(1~4)"]);
              const mine = answers[i];
              const isOk = mine === correct;
              return (
                <div
                  key={q.문항코드 || i}
                  className="rounded-lg border border-zinc-200 bg-white p-4"
                >
                  <div className="mb-2 flex items-center gap-2 text-sm">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold text-white ${
                        isOk ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    >
                      {i + 1}. {isOk ? "정답" : "오답"}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      {q.문항코드}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {과목명[q.과목ID || ""] || q.과목ID} · {q.문제유형}
                    </span>
                  </div>
                  {q.발문 && <HtmlContent html={q.발문} className="text-sm font-medium" />}
                  {q.조건 && (
                    <HtmlContent
                      html={q.조건}
                      className="my-1 rounded bg-zinc-50 p-2 text-sm"
                    />
                  )}
                  {q.발문그림 && <ImgBlock v={q.발문그림} />}
                  <ol className="my-2 space-y-1 text-sm">
                    {[q.보기1, q.보기2, q.보기3, q.보기4].map((c, ci) => {
                      const n = ci + 1;
                      const isAns = n === correct;
                      const isMine = n === mine;
                      return (
                        <li
                          key={ci}
                          className={`flex items-start gap-2 rounded px-2 py-1 ${
                            isAns
                              ? "bg-emerald-50"
                              : isMine
                                ? "bg-red-50"
                                : ""
                          }`}
                        >
                          <span className="shrink-0 font-bold">
                            {["①", "②", "③", "④"][ci]}
                          </span>
                          <HtmlContent html={c || ""} className="flex-1" />
                          {isAns && (
                            <span className="shrink-0 text-xs font-bold text-emerald-600">
                              정답
                            </span>
                          )}
                          {isMine && !isAns && (
                            <span className="shrink-0 text-xs font-bold text-red-600">
                              내 답
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                  {(q.해설블록?.length ||
                    q.오답분석 ||
                    q.학습포인트블록?.length) && (
                    <details className="mt-2 rounded border border-zinc-200">
                      <summary className="cursor-pointer bg-zinc-50 px-3 py-1.5 text-sm font-semibold text-zinc-700">
                        해설 보기
                      </summary>
                      <div className="space-y-3 p-3">
                        {q.해설블록?.length ? (
                          <div>
                            <p className="mb-1 text-xs font-bold text-orange-600">
                              해설
                            </p>
                            <Blocks blocks={q.해설블록} />
                          </div>
                        ) : null}
                        {q.오답분석 ? (
                          <div>
                            <p className="mb-1 text-xs font-bold text-purple-600">
                              오답분석
                            </p>
                            <HtmlContent html={q.오답분석} className="text-sm" />
                          </div>
                        ) : null}
                        {q.학습포인트블록?.length ? (
                          <div>
                            <p className="mb-1 text-xs font-bold text-emerald-600">
                              학습 POINT
                            </p>
                            <Blocks blocks={q.학습포인트블록} />
                          </div>
                        ) : null}
                      </div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ===== 응시 =====
  const q = exam.questions[idx];
  const answered = answers.filter((a) => a !== null).length;
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-zinc-700">
            {exam.title} · {idx + 1}/{exam.questions.length}
          </span>
          <span className="text-zinc-500">응답 {answered}/{exam.questions.length}</span>
        </div>
        <div className="h-1.5 w-full rounded bg-zinc-200">
          <div
            className="h-1.5 rounded bg-indigo-500 transition-all"
            style={{ width: `${((idx + 1) / exam.questions.length) * 100}%` }}
          />
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-5">
          <p className="mb-1 text-xs text-zinc-400">
            {q.문항코드} · {과목명[q.과목ID || ""] || q.과목ID}
          </p>
          {q.발문 && (
            <HtmlContent html={q.발문} className="text-base font-medium" />
          )}
          {q.조건 && (
            <HtmlContent
              html={q.조건}
              className="my-2 rounded bg-zinc-50 p-2 text-sm"
            />
          )}
          {q.발문그림 && <ImgBlock v={q.발문그림} />}
          <div className="mt-3 space-y-2">
            {[q.보기1, q.보기2, q.보기3, q.보기4].map((c, ci) => {
              const n = ci + 1;
              const sel = answers[idx] === n;
              return (
                <button
                  key={ci}
                  onClick={() =>
                    setAnswers((a) => {
                      const x = [...a];
                      x[idx] = n;
                      return x;
                    })
                  }
                  className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                    sel
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <span className="shrink-0 font-bold">
                    {["①", "②", "③", "④"][ci]}
                  </span>
                  <HtmlContent html={c || ""} className="flex-1" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="rounded border border-zinc-300 px-4 py-2 text-sm text-zinc-700 disabled:opacity-40"
          >
            ← 이전
          </button>
          {idx < exam.questions.length - 1 ? (
            <button
              onClick={() => setIdx((i) => i + 1)}
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              다음 →
            </button>
          ) : (
            <button
              onClick={() => setDone(true)}
              className="rounded bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700"
            >
              제출하고 결과 보기
            </button>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-zinc-400">
          미응답 문항이 있어도 제출 가능합니다 (결과는 점수 없이 정답 수·취약점·해설).
        </p>
      </div>
    </div>
  );
}
