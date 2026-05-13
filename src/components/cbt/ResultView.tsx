"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Attempt, Exam, Subject } from "@/lib/cbt/types";
import { getAllCards } from "@/lib/flashcards/data";
import { simulators } from "@/lib/simulators";
import { findSubjectByDisplayName, curriculum } from "@/lib/cbt/curriculum";
import { buildPracticeId } from "@/lib/cbt/mockData";

const PASS_THRESHOLD = 36;

type SubjectStat = {
  name: Subject;
  correct: number;
  total: number;
};

function computeStats(exam: Exam, attempt: Attempt) {
  const subjectMap = new Map<Subject, SubjectStat>();
  exam.questions.forEach((q) => {
    if (!subjectMap.has(q.subject)) {
      subjectMap.set(q.subject, { name: q.subject, correct: 0, total: 0 });
    }
    const stat = subjectMap.get(q.subject)!;
    stat.total += 1;
  });

  let totalCorrect = 0;
  exam.questions.forEach((q, idx) => {
    if (attempt.answers[idx] === q.answer) {
      const stat = subjectMap.get(q.subject)!;
      stat.correct += 1;
      totalCorrect += 1;
    }
  });

  const subjects = Array.from(subjectMap.values());
  const passed = totalCorrect >= PASS_THRESHOLD;
  const score100 = Math.round((totalCorrect / exam.totalQuestions) * 100 * 100) / 100;

  return { totalCorrect, passed, score100, subjects };
}

function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}분 ${String(s).padStart(2, "0")}초`;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

export default function ResultView({ exam }: { exam: Exam }) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        결과를 불러오는 중입니다...
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-bold text-zinc-900">응시 기록이 없습니다</h1>
        <p className="mt-3 text-sm text-zinc-600">
          해당 회차를 응시한 기록이 없습니다.
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

  const stats = computeStats(exam, attempt);
  const elapsedMs = (attempt.submittedAt ?? Date.now()) - attempt.startedAt;
  const submittedDisplay = formatDate(attempt.submittedAt ?? Date.now());

  // 취약 과목 찾기
  const weakSubjects = useMemo(() => {
    return stats.subjects
      .filter((s) => s.total > 0 && s.correct / s.total < 0.5) // 정답률 50% 미만인 과목
      .map((s) => s.name);
  }, [stats.subjects]);

  // 취약 과목 기반으로 관련 학습 자료 필터링
  const recommendedFlashcards = useMemo(() => {
    if (weakSubjects.length === 0) return [];
    return getAllCards().filter(
      (card) => weakSubjects.includes(card.subject)
    );
  }, [weakSubjects]);

  const recommendedSimulators = useMemo(() => {
    if (weakSubjects.length === 0) return [];
    return simulators.filter(
      (sim) => sim.status === "available" && weakSubjects.includes(sim.subject)
    );
  }, [weakSubjects]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Header strip */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">시험 결과</p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-900">
              {exam.title}
            </h1>
          </div>
          <Link
            href="/cbt"
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            ← 목록으로
          </Link>
        </div>

        {/* Pass/Fail banner */}
        <section
          className={`mb-6 overflow-hidden rounded-2xl border ${
            stats.passed
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
              : "border-rose-200 bg-gradient-to-br from-rose-50 to-white"
          }`}
        >
          <div className="flex flex-col items-center gap-4 px-8 py-10 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-zinc-600">합격 여부</p>
              <p
                className={`mt-1 text-5xl font-bold tracking-tight ${
                  stats.passed ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {stats.passed ? "PASS" : "FAIL"}
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                전 60문항 중 <strong>{PASS_THRESHOLD}문항</strong> 이상 정답 시
                합격 (과목별 과락 없음)
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm font-medium text-zinc-600">100점 환산</p>
              <p className="mt-1 text-5xl font-bold text-zinc-900">
                {stats.score100}
                <span className="ml-1 text-2xl font-medium text-zinc-500">
                  점
                </span>
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                정답 {stats.totalCorrect} / {exam.totalQuestions}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Examinee + Attempt info */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-zinc-900">응시 정보</h2>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-zinc-500">수험자명</dt>
              <dd className="font-medium text-zinc-900">{attempt.examineeName}</dd>
              <dt className="text-zinc-500">시험명</dt>
              <dd className="font-medium text-zinc-900">전기기능사 (필기)</dd>
              <dt className="text-zinc-500">회차</dt>
              <dd className="font-medium text-zinc-900">{exam.round}회</dd>
              <dt className="text-zinc-500">제출 시각</dt>
              <dd className="font-medium text-zinc-900">{submittedDisplay}</dd>
              <dt className="text-zinc-500">소요 시간</dt>
              <dd className="font-medium text-zinc-900">
                {formatDuration(elapsedMs)}
              </dd>
            </dl>
          </section>

          {/* Subject radar chart */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-zinc-900">
              과목별 분석
            </h2>
            <div className="flex items-center justify-center">
              <SubjectRadar subjects={stats.subjects} />
            </div>
          </section>
        </div>

        {/* Subject table */}
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-base font-bold text-zinc-900">과목별 점수</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500">
                <th className="py-2 font-medium">과목</th>
                <th className="py-2 text-right font-medium">정답</th>
                <th className="py-2 text-right font-medium">정답률</th>
                <th className="py-2 text-right font-medium">진단</th>
              </tr>
            </thead>
            <tbody>
              {stats.subjects.map((s) => {
                const ratio = s.total > 0 ? s.correct / s.total : 0;
                const pct = Math.round(ratio * 1000) / 10;
                const diagnosis =
                  ratio >= 0.8 ? "강점" : ratio >= 0.5 ? "보통" : "취약";
                const diagColor =
                  ratio >= 0.8
                    ? "text-emerald-600"
                    : ratio >= 0.5
                      ? "text-zinc-700"
                      : "text-rose-600";
                return (
                  <tr key={s.name} className="border-b border-zinc-100">
                    <td className="py-3 font-medium text-zinc-900">{s.name}</td>
                    <td className="py-3 text-right text-zinc-700">
                      {s.correct} / {s.total}
                    </td>
                    <td className="py-3 text-right text-zinc-700">{pct}%</td>
                    <td className={`py-3 text-right font-semibold ${diagColor}`}>
                      {diagnosis}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* 새로운 섹션: 취약점 보완 학습 */}
        {(recommendedFlashcards.length > 0 || recommendedSimulators.length > 0) && (
          <section className="mt-8 rounded-2xl border-2 border-rose-200 bg-rose-50 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-rose-900">
              🚨 취약점 보완 학습
            </h2>
            <p className="mt-2 text-sm leading-6 text-rose-800">
              틀린 문제들이 많았던 과목들을 보완할 수 있는 학습 자료를 추천합니다.
            </p>

            {recommendedFlashcards.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-bold text-rose-800">
                  플립 암기카드
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {recommendedFlashcards.slice(0, 4).map((card) => (
                    <Link
                      key={card.id}
                      href={`/flashcards?id=${card.id}`}
                      className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition hover:border-rose-400 hover:bg-rose-50"
                    >
                      <span className="text-xl">🃏</span>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 group-hover:text-rose-800">
                          {card.front}
                        </p>
                        <p className="text-xs text-zinc-600 group-hover:text-rose-700">
                          {card.subject} · {card.topic}
                        </p>
                      </div>
                      <span className="ml-auto text-zinc-400 group-hover:text-rose-600">
                        ›
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {recommendedSimulators.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-bold text-rose-800">
                  이론 시뮬레이터
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {recommendedSimulators.slice(0, 4).map((sim) => (
                    <Link
                      key={sim.id}
                      href={`/simulator/${sim.id}`}
                      className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition hover:border-rose-400 hover:bg-rose-50"
                    >
                      <span className="text-xl">{sim.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 group-hover:text-rose-800">
                          {sim.title}
                        </p>
                        <p className="text-xs text-zinc-600 group-hover:text-rose-700">
                          {sim.subject} · {sim.topic}
                        </p>
                      </div>
                      <span className="ml-auto text-zinc-400 group-hover:text-rose-600">
                        ›
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/cbt/${exam.id}/review`}
            className="rounded-md bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            해설 보기
          </Link>
          <Link
            href="/cbt"
            className="rounded-md border border-zinc-300 bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}

function SubjectRadar({ subjects }: { subjects: SubjectStat[] }) {
  const cx = 150;
  const cy = 150;
  const radius = 110;
  // Distribute vertices evenly: top first, then clockwise
  const angles = subjects.map((_, i) => {
    return (-Math.PI / 2) + (i * 2 * Math.PI) / subjects.length;
  });

  const outerPoints = angles.map(
    (a) => [cx + radius * Math.cos(a), cy + radius * Math.sin(a)] as const,
  );

  const innerPoints = angles.map((a, i) => {
    const ratio = subjects[i].total > 0 ? subjects[i].correct / subjects[i].total : 0;
    return [
      cx + radius * ratio * Math.cos(a),
      cy + radius * ratio * Math.sin(a),
    ] as const;
  });

  const outerPath = outerPoints.map((p) => p.join(",")).join(" ");
  const innerPath = innerPoints.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox="0 0 300 300" className="h-64 w-64">
      {/* concentric reference triangles */}
      {[0.33, 0.66, 1].map((scale) => (
        <polygon
          key={scale}
          points={angles
            .map(
              (a) =>
                `${cx + radius * scale * Math.cos(a)},${cy + radius * scale * Math.sin(a)}`,
            )
            .join(" ")}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth="1"
        />
      ))}
      {/* axes */}
      {outerPoints.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p[0]}
          y2={p[1]}
          stroke="#e4e4e7"
          strokeWidth="1"
        />
      ))}
      {/* score polygon */}
      <polygon
        points={innerPath}
        fill="rgba(37, 99, 235, 0.2)"
        stroke="#2563eb"
        strokeWidth="2"
      />
      {innerPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#2563eb" />
      ))}
      {/* labels */}
      {subjects.map((s, i) => {
        const a = angles[i];
        const lx = cx + (radius + 25) * Math.cos(a);
        const ly = cy + (radius + 25) * Math.sin(a);
        const ratio = s.total > 0 ? s.correct / s.total : 0;
        return (
          <g key={s.name}>
            <text
              x={lx}
              y={ly - 6}
              textAnchor="middle"
              className="fill-zinc-700 text-xs font-semibold"
            >
              {s.name}
            </text>
            <text
              x={lx}
              y={ly + 8}
              textAnchor="middle"
              className="fill-zinc-500 text-[10px]"
            >
              {s.correct}/{s.total} ({Math.round(ratio * 100)}%)
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export type { SubjectStat };
