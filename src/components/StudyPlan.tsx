"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import BackgroundPattern from "./BackgroundPattern";

type Phase = {
  range: string;
  title: string;
  tasks: string[];
  bonus: string;
};

type Plan = {
  id: string;
  duration: string;
  type: string;
  catchphrase: string;
  description: string;
  for: string[];
  emoji: string;
  bgClass: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  phases: Phase[];
  strategy: string[];
};

const plans: Plan[] = [
  {
    id: "type1",
    duration: "14일",
    type: "단기완성형",
    catchphrase: "2주, 핵심만 잡고 끝낸다.",
    description:
      "시간이 없는 직장인·재시험자에게. 핵심이론은 빠르게, 기출 8개년은 깊게 가는 압축 과정입니다.",
    for: [
      "이미 한 번 응시 경험이 있는 분",
      "출제 빈도 위주로 짧게 끝내고 싶은 분",
      "시험까지 2주 남은 분",
    ],
    emoji: "⚡",
    bgClass: "from-rose-500 via-pink-500 to-rose-600",
    accentText: "text-rose-600",
    accentBg: "bg-rose-600",
    accentBorder: "border-rose-300",
    phases: [
      {
        range: "Day 1~3",
        title: "핵심이론 빠른 1회독",
        tasks: [
          "[B] 전기이론 핵심정리",
          "[B] 전기기기 핵심정리",
          "[B] 전기설비 핵심정리",
        ],
        bonus: "🎧 오디오북으로 출퇴근길 보강 + ⚡ 시뮬레이터로 헷갈리는 개념 시각화",
      },
      {
        range: "Day 4~10",
        title: "8개년 기출 정복 (1회독)",
        tasks: [
          "[C] 2026 + 2025 1~2회",
          "[C] 2025 3~4회 + 2024 1~2회",
          "[C] 2024 3~4회 ~ 2022 전회",
          "[C] 2021 + 2020 + 2019 전회",
        ],
        bonus: "🃏 풀고 틀린 문제는 즉시 플립카드로 즐겨찾기 → 매일 자기 전 5분 복습",
      },
      {
        range: "Day 11~12",
        title: "약점 보강 + 핵심회차 2회독",
        tasks: [
          "[C] 1회독 오답 정리",
          "[C] 2회독 — 2026~2024 핵심회차",
          "[C] 2회독 — 2023~2019 핵심회차",
        ],
        bonus: "📝 오답 노트에서 취약 토픽 확인 → 시뮬레이터로 원리 다시 짚기",
      },
      {
        range: "Day 13~14",
        title: "CBT 모의고사로 실전 마무리",
        tasks: [
          "[C] CBT 모의 1~3회",
          "[C] CBT 모의 4~5회 + 최종 점검",
          "시험 당일 컨디션 조절",
        ],
        bonus: "🎯 5회차 평균 60점 이상 = 합격 안전권",
      },
    ],
    strategy: [
      "핵심이론은 ★★ 이상 토픽만 깊게",
      "기출은 1회독 시 모르는 문제만 해설 정독",
      "마지막 2일은 CBT 환경 그대로 시간 재며 풀이",
    ],
  },
  {
    id: "type2",
    duration: "28일",
    type: "표준형",
    catchphrase: "4주, 한 번에 합격하는 정공법.",
    description:
      "기초수학부터 차근차근. 3회독으로 안정적인 합격선을 노립니다. 가장 추천하는 표준 코스.",
    for: [
      "전기 비전공·처음 도전하는 분",
      "기초부터 탄탄히 가고 싶은 분",
      "시험까지 한 달 정도 여유 있는 분",
    ],
    emoji: "🎯",
    bgClass: "from-blue-500 via-indigo-500 to-violet-600",
    accentText: "text-blue-600",
    accentBg: "bg-blue-600",
    accentBorder: "border-blue-300",
    phases: [
      {
        range: "Week 1 · Day 1~8",
        title: "기초수학 + 핵심이론",
        tasks: [
          "[A] 기초수학 Ch.01~03",
          "[B] 전기이론 Ch.01~09",
          "[B] 전기기기 Ch.01~05",
          "[B] 전기설비 Ch.01~08",
        ],
        bonus: "⚡ 헷갈리는 단원마다 시뮬레이터로 이해 → 🃏 끝나면 플립카드 30장씩 누적",
      },
      {
        range: "Week 2 · Day 9~14",
        title: "8개년 기출 1회독",
        tasks: [
          "[C] 2026 + 2025 1~2회",
          "[C] 2025 3~4회 + 2024",
          "[C] 2023 + 2022 + 2021 전회",
          "[C] 2020 + 2019 전회",
        ],
        bonus: "📝 매 회차 풀이 후 오답 노트 자동 적립 → 다음 날 시작 전 5분 복습",
      },
      {
        range: "Week 3 · Day 15~21",
        title: "2회독 + 오답 집중",
        tasks: [
          "[C] 1회독 오답 정리",
          "[C] 2회독 — 전 회차",
          "[C] 2회독 오답 정리",
        ],
        bonus: "🎧 오디오북으로 이론 1.5x 배속 1회독 추가 — 2회독과 시너지",
      },
      {
        range: "Week 4 · Day 22~28",
        title: "3회독 + CBT 모의고사",
        tasks: [
          "[C] 3회독 — 핵심 회차만",
          "[C] 누적 오답 최종 정리",
          "[C] CBT 모의 1~5회",
          "최종 점검",
        ],
        bonus: "🏆 모의 5회 평균 70점 이상 = 합격 거의 확정",
      },
    ],
    strategy: [
      "1주차에 무리하지 말고 이해 위주",
      "기출은 같은 회차를 3번 반복하는 것이 핵심",
      "마지막 주 모의고사는 시험 시간과 동일하게",
    ],
  },
  {
    id: "type3",
    duration: "90일",
    type: "학습몰두형",
    catchphrase: "3개월, 내 페이스로 완벽하게.",
    description:
      "자가 기록형 빈 플래너. 매일 학습 내용을 직접 적으며 자신만의 합격 루트를 설계합니다.",
    for: [
      "여유 있게 한 자격증을 깊이 있게 잡고 싶은 분",
      "다른 자격증 시험과 병행하는 분",
      "학생·취준생으로 시간 여유가 있는 분",
    ],
    emoji: "📅",
    bgClass: "from-emerald-500 via-teal-500 to-cyan-600",
    accentText: "text-emerald-600",
    accentBg: "bg-emerald-600",
    accentBorder: "border-emerald-300",
    phases: [
      {
        range: "Phase 1 · Day 1~30",
        title: "기초 + 이해 단계",
        tasks: [
          "기초수학·핵심이론 깊이 있게 1회독",
          "단원마다 시뮬레이터로 원리 체득",
          "매일 한 챕터씩 정리 노트 작성",
        ],
        bonus: "🃏 단원 끝날 때마다 플립카드로 핵심 키워드 정리",
      },
      {
        range: "Phase 2 · Day 31~60",
        title: "기출 분석 단계",
        tasks: [
          "8개년 기출 2회독",
          "오답 패턴 분석",
          "시뮬레이터로 약점 토픽 반복 학습",
        ],
        bonus: "🎧 오디오북으로 이동 중에도 복습 누적",
      },
      {
        range: "Phase 3 · Day 61~90",
        title: "실전 마무리",
        tasks: [
          "기출 3회독 + 누적 오답",
          "CBT 모의고사 반복",
          "취약 토픽 최종 정리",
        ],
        bonus: "📊 학습 곡선 차트로 점수 추이 확인 → 70점 이상 안정화",
      },
    ],
    strategy: [
      "매일 학습할 범위를 직접 적으며 페이스 자율 조정",
      "7일마다 누적 복습일 1회 권장",
      "체크 칸에 √ 표시로 성취감 누적",
    ],
  },
];

export default function StudyPlan() {
  const [active, setActive] = useState(0);
  const plan = plans[active];

  return (
    <section className="relative overflow-hidden bg-white">
      <BackgroundPattern variant="diagonal" color="#3b82f6" opacity={0.04} />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* 헤더 */}
        <Reveal>
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold tracking-widest text-amber-300">
              📅 STUDY PLANNER
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              전략적 학습 기간으로,
              <br />
              <span className="bg-gradient-to-r from-rose-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                효율적으로 한 방에 합격
              </span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
              『독끝 전기기능사 필기』 교재에 수록된 3가지 플래너에 부가 학습
              도구까지 통합한 합격 로드맵.
              <br className="hidden sm:block" />
              본인 일정에 맞는 코스를 선택하면 무엇을 언제 해야 하는지가 명확해집니다.
            </p>
          </div>
        </Reveal>

        {/* 3개 배너 (선택 탭) */}
        <Reveal type="fade-up">
          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((p, i) => {
              const isActive = i === active;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`group relative overflow-hidden rounded-2xl text-left transition ${
                    isActive
                      ? "ring-2 ring-offset-2 ring-zinc-900 shadow-2xl"
                      : "hover:-translate-y-0.5 hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`relative bg-gradient-to-br ${p.bgClass} p-6 text-white`}
                  >
                    <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-[11px] font-bold tracking-widest text-white/85">
                          TYPE 0{i + 1}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-white/85">
                          {p.type}
                        </p>
                        <p className="mt-2 flex items-baseline gap-1">
                          <span className="text-4xl font-black leading-none">
                            {p.duration.replace(/[^\d]/g, "")}
                          </span>
                          <span className="text-sm font-bold">
                            {p.duration.replace(/\d/g, "")}
                          </span>
                        </p>
                      </div>
                      <span className="text-3xl">{p.emoji}</span>
                    </div>
                    <p className="relative mt-4 text-sm font-bold leading-tight">
                      {p.catchphrase}
                    </p>
                    {isActive && (
                      <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                        선택됨
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* 선택된 플랜 디테일 */}
        <Reveal type="fade-up">
          <div
            className={`overflow-hidden rounded-2xl border-2 ${plan.accentBorder} bg-white shadow-lg`}
          >
            {/* 상단 인트로 */}
            <div className={`bg-gradient-to-br ${plan.bgClass} px-8 py-8 text-white`}>
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-white/85">
                    PASS FORMULA · {plan.duration} {plan.type}
                  </p>
                  <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                    {plan.catchphrase}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90">
                    {plan.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                    {plan.duration} 완성
                  </span>
                  {plan.id !== "type3" && (
                    <span className="text-[11px] text-white/80">
                      교재 + 사이트 콘텐츠 연동
                    </span>
                  )}
                </div>
              </div>

              {/* 추천 대상 */}
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {plan.for.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg bg-white/15 p-3 backdrop-blur-sm"
                  >
                    <span className="text-sm">✓</span>
                    <span className="text-xs leading-5">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 단계별 일정 */}
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_280px]">
              {/* 좌측 phases */}
              <div className="space-y-4 p-8">
                <div className="mb-4 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${plan.accentBg}`} />
                  <h4 className="text-sm font-bold tracking-wide text-zinc-900">
                    단계별 학습 일정
                  </h4>
                  <span className="text-[11px] text-zinc-400">
                    [A] 기초수학  [B] 핵심이론  [C] 8개년 기출
                  </span>
                </div>

                <ol className="relative space-y-4">
                  {plan.phases.map((ph, i) => (
                    <li
                      key={i}
                      className="relative rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 transition hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${plan.accentBg} text-sm font-bold text-white`}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <p className={`text-xs font-bold ${plan.accentText}`}>
                              {ph.range}
                            </p>
                            <h5 className="text-base font-bold text-zinc-900">
                              {ph.title}
                            </h5>
                          </div>
                          <ul className="mt-3 space-y-1 text-sm text-zinc-700">
                            {ph.tasks.map((t, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-zinc-400" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-900">
                            <strong className="font-bold">+ 부가 학습</strong> ·{" "}
                            {ph.bonus}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 우측 전략/CTA */}
              <aside className="border-t border-zinc-200 bg-zinc-900 p-8 text-white lg:border-l lg:border-t-0">
                <p className="text-[11px] font-bold tracking-widest text-amber-300">
                  STRATEGY
                </p>
                <h4 className="mt-2 text-base font-bold">
                  이 코스의 핵심 포인트
                </h4>
                <ul className="mt-4 space-y-3">
                  {plan.strategy.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-6">
                      <span className="text-amber-300">★</span>
                      <span className="text-zinc-200">{s}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-2">
                  <Link
                    href="/cbt/exams"
                    className="block w-full rounded-md bg-amber-400 px-4 py-2.5 text-center text-sm font-bold text-amber-950 transition hover:bg-amber-300"
                  >
                    CBT 응시로 시작 →
                  </Link>
                  <Link
                    href="/cbt/study"
                    className="block w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    과목별 학습 시작
                  </Link>
                </div>

                <p className="mt-6 rounded-md bg-white/5 p-3 text-[11px] leading-5 text-zinc-300">
                  💡 교재의 학습 플래너에 부가 학습 콘텐츠(시뮬·플립카드·오디오북·CBT)를 단계별로 매칭한 합격 로드맵입니다.
                </p>
              </aside>
            </div>
          </div>
        </Reveal>

        {/* 하단 안내 */}
        <Reveal type="fade-up">
          <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white/60 p-5 text-center text-xs text-zinc-600">
            🎯 어떤 코스든 <strong>교재 한 권</strong>이면 충분합니다. 사이트의
            모든 부가 학습 도구는 <strong>무료</strong>로 제공됩니다.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
