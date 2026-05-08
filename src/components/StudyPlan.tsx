"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import BackgroundPattern from "./BackgroundPattern";

type Day = {
  day: string;
  task: string;
  duration: string;
};

type Week = {
  n: number;
  title: string;
  goal: string;
  color: string;
  emoji: string;
  hours: string;
  days: Day[];
};

const weeks: Week[] = [
  {
    n: 1,
    title: "기초 다지기",
    goal: "전기이론 큰 그림 잡기",
    color: "blue",
    emoji: "📐",
    hours: "주 8시간",
    days: [
      { day: "Day 1~2", task: "교재 1단원 정독 + 핵심 키워드 노트", duration: "2h" },
      { day: "Day 3~4", task: "직류회로 + 옴의 법칙 완벽 이해", duration: "2h" },
      { day: "Day 5", task: "교류회로 입문 + 사인파 개념 정리", duration: "1.5h" },
      { day: "Day 6", task: "전기력선 시뮬레이터 체험", duration: "1h" },
      { day: "Day 7", task: "주간 복습 + 플립카드 50장", duration: "1.5h" },
    ],
  },
  {
    n: 2,
    title: "전기기기 마스터",
    goal: "변압기·회전기·정류기 정복",
    color: "violet",
    emoji: "⚙️",
    hours: "주 9시간",
    days: [
      { day: "Day 1~2", task: "변압기 원리 + 권수비 시뮬", duration: "2.5h" },
      { day: "Day 3", task: "직류기 동작 시뮬 + 발전기/전동기", duration: "1.5h" },
      { day: "Day 4~5", task: "유도전동기 회전 자계 + 슬립", duration: "2.5h" },
      { day: "Day 6", task: "정류기 + 다이오드 + 사이리스터", duration: "1h" },
      { day: "Day 7", task: "1·2주차 키워드 종합 + 오디오북", duration: "1.5h" },
    ],
  },
  {
    n: 3,
    title: "전기설비 + 첫 모의고사",
    goal: "현장 지식 + 실전 감각",
    color: "emerald",
    emoji: "🔌",
    hours: "주 10시간",
    days: [
      { day: "Day 1", task: "전선/케이블 종류와 굵기 선정", duration: "1.5h" },
      { day: "Day 2", task: "배선공사 (금속관/합성수지관)", duration: "1.5h" },
      { day: "Day 3", task: "접지 시뮬 + 접지 저항 계산", duration: "1.5h" },
      { day: "Day 4", task: "차단기 동작 시뮬 + 보호장치", duration: "1.5h" },
      { day: "Day 5", task: "🎯 CBT 모의고사 1회차 응시", duration: "1h" },
      { day: "Day 6", task: "결과 분석 + 취약 토픽 보강", duration: "2h" },
      { day: "Day 7", task: "CBT 2회차 + 해설 정독", duration: "1h" },
    ],
  },
  {
    n: 4,
    title: "약점 보강 + 실전",
    goal: "안정적 합격선 돌파",
    color: "rose",
    emoji: "🔥",
    hours: "주 12시간",
    days: [
      { day: "Day 1", task: "🎯 CBT 3회차 + 약점 토픽 진단", duration: "2h" },
      { day: "Day 2~3", task: "취약 토픽 집중 학습 (시뮬+카드)", duration: "3h" },
      { day: "Day 4", task: "🎯 CBT 4회차 + 시간 단축 훈련", duration: "1.5h" },
      { day: "Day 5", task: "오디오북 1.5x 배속 전 단원 복습", duration: "2h" },
      { day: "Day 6", task: "🎯 CBT 5회차 + 모든 해설 영상 시청", duration: "2h" },
      { day: "Day 7", task: "전체 플립카드 한 바퀴 + 컨디션 조절", duration: "1.5h" },
    ],
  },
];

const COLOR_MAP: Record<
  string,
  { activeBg: string; activeText: string; chipBg: string; barBg: string }
> = {
  blue: {
    activeBg: "bg-blue-600",
    activeText: "text-blue-600",
    chipBg: "bg-blue-50 text-blue-700",
    barBg: "bg-blue-500",
  },
  violet: {
    activeBg: "bg-violet-600",
    activeText: "text-violet-600",
    chipBg: "bg-violet-50 text-violet-700",
    barBg: "bg-violet-500",
  },
  emerald: {
    activeBg: "bg-emerald-600",
    activeText: "text-emerald-600",
    chipBg: "bg-emerald-50 text-emerald-700",
    barBg: "bg-emerald-500",
  },
  rose: {
    activeBg: "bg-rose-600",
    activeText: "text-rose-600",
    chipBg: "bg-rose-50 text-rose-700",
    barBg: "bg-rose-500",
  },
};

export default function StudyPlan() {
  const [active, setActive] = useState(0);
  const week = weeks[active];
  const theme = COLOR_MAP[week.color];

  return (
    <section className="relative overflow-hidden bg-white">
      <BackgroundPattern variant="diagonal" color="#3b82f6" opacity={0.04} />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold tracking-wide text-blue-600">
              4주 합격 플랜
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              한 달이면 충분합니다
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              교재 · CBT · 시뮬레이터 · 오디오북을 어떻게 배치하면 효율적인지,
              합격생 학습 패턴을 분석해 정리한 추천 일정입니다.
            </p>
          </div>
        </Reveal>

        {/* Week tabs */}
        <Reveal type="fade-up">
          <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {weeks.map((w, i) => {
              const t = COLOR_MAP[w.color];
              const isActive = i === active;
              return (
                <button
                  key={w.n}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    isActive
                      ? `${t.activeBg} border-transparent text-white shadow-md`
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  <span className="text-2xl">{w.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-wider opacity-80">
                      WEEK {w.n}
                    </p>
                    <p className="truncate text-sm font-bold">{w.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Active week detail */}
        <Reveal type="fade-up" delay={120}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Summary */}
            <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 lg:col-span-1">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${theme.chipBg}`}
              >
                WEEK {week.n}
              </span>
              <h3 className="mt-3 text-2xl font-bold text-zinc-900">
                {week.title}
              </h3>
              <p className={`mt-1 text-base font-semibold ${theme.activeText}`}>
                {week.goal}
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
                  <span className="text-zinc-500">권장 학습 시간</span>
                  <span className="font-bold text-zinc-900">{week.hours}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
                  <span className="text-zinc-500">주요 학습 도구</span>
                  <span className="font-bold text-zinc-900">
                    {week.n === 1
                      ? "교재 + 시뮬"
                      : week.n === 2
                        ? "교재 + 시뮬 + 카드"
                        : week.n === 3
                          ? "CBT + 시뮬"
                          : "CBT + 오디오북"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
                  <span className="text-zinc-500">진행률</span>
                  <span className="font-bold text-zinc-900">
                    {((week.n / 4) * 100).toFixed(0)}% 지점
                  </span>
                </div>
              </div>
            </div>

            {/* Day-by-day */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 lg:col-span-2">
              <h4 className="mb-4 text-sm font-semibold text-zinc-700">
                7일 학습 체크리스트
              </h4>
              <ol className="space-y-3">
                {week.days.map((d, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50/60 p-3 transition hover:bg-white hover:shadow-sm"
                  >
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${theme.activeBg} text-xs font-bold text-white`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-zinc-500">
                          {d.day}
                        </p>
                        <span className="rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-zinc-600 shadow-sm">
                          {d.duration}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-800">{d.task}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
