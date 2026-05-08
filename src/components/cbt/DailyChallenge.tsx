"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readAttempts } from "@/lib/cbt/stats";
import { mockExams } from "@/lib/cbt/mockData";

const TARGET_DAILY_QUESTIONS = 30;

function startOfTodayMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function DailyChallenge() {
  const [todayAnswered, setTodayAnswered] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const attempts = readAttempts();
    const today = startOfTodayMs();
    let count = 0;
    for (const a of attempts) {
      const ts = a.submittedAt ?? 0;
      if (ts >= today) {
        const exam = mockExams.find((e) => e.id === a.examId);
        if (exam) {
          count += a.answers.filter((v) => v !== null).length;
        }
      }
    }
    setTodayAnswered(count);

    // 연속 학습 일수 계산 (간단 버전)
    const days = new Set<string>();
    for (const a of attempts) {
      const ts = a.submittedAt ?? 0;
      if (ts > 0) {
        const d = new Date(ts);
        days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      }
    }
    let s = 0;
    const cur = new Date();
    for (let i = 0; i < 30; i++) {
      const key = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`;
      if (days.has(key)) {
        s += 1;
      } else if (i > 0) {
        break;
      }
      cur.setDate(cur.getDate() - 1);
    }
    setStreak(s);
  }, []);

  if (todayAnswered === null) {
    return null;
  }

  const ratio = Math.min(1, todayAnswered / TARGET_DAILY_QUESTIONS);
  const completed = todayAnswered >= TARGET_DAILY_QUESTIONS;

  return (
    <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <h3 className="text-sm font-bold text-zinc-900">오늘의 도전</h3>
        </div>
        {streak > 0 && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
            🔥 {streak}일 연속
          </span>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-zinc-700">
        매일 <strong className="text-rose-700">{TARGET_DAILY_QUESTIONS}문항</strong>씩
        풀면 합격이 가까워집니다.
      </p>

      <div className="mt-4">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-zinc-500">오늘 푼 문제</span>
          <span>
            <strong className="text-base font-bold text-zinc-900">
              {todayAnswered}
            </strong>
            <span className="text-zinc-500"> / {TARGET_DAILY_QUESTIONS}</span>
          </span>
        </div>
        <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-700"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
        {completed ? (
          <p className="mt-2 text-center text-xs font-semibold text-emerald-700">
            ✓ 오늘 목표 달성! 좋은 페이스입니다.
          </p>
        ) : (
          <p className="mt-2 text-xs text-zinc-600">
            {TARGET_DAILY_QUESTIONS - todayAnswered}문항 남음 — 한 회차 풀면
            절반은 거뜬!
          </p>
        )}
      </div>

      <Link
        href="/cbt/exams"
        className="mt-4 block rounded-md bg-zinc-900 px-4 py-2 text-center text-xs font-semibold text-white transition hover:bg-zinc-700"
      >
        지금 도전하기 →
      </Link>
    </div>
  );
}
