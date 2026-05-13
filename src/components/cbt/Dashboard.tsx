"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  computeLearningStats,
  formatHours,
  type LearningStats,
  type SubjectAggregate,
} from "@/lib/cbt/stats";
import type { BoardPost, Notice } from "@/lib/cbt/mockBoard";
import DDayWidget from "./DDayWidget";
import RecentAttempts from "./RecentAttempts";
import DailyChallenge from "./DailyChallenge";
import LearningCurve from "./LearningCurve";
import BackgroundPattern from "@/components/BackgroundPattern";
import PageGuide from "@/components/PageGuide";

const COMMUNITY_BASELINE = {
  recentMonthMinutes: 156,
  totalStudyMinutes: 438,
  attempts: 21,
};

export default function Dashboard({
  notices,
  boardPosts,
}: {
  notices: Notice[];
  boardPosts: BoardPost[];
}) {
  const [stats, setStats] = useState<LearningStats | null>(null);

  useEffect(() => {
    setStats(computeLearningStats());
    const handleFocus = () => setStats(computeLearningStats());
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      {/* Top banner */}
      <section className="relative mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-6 py-5 sm:px-8 sm:py-6">
        <BackgroundPattern variant="circuit" color="#1e40af" opacity={0.05} />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-600">
              addto 온라인 · 전기기능사
            </p>
            <h2 className="mt-1 text-lg font-bold text-zinc-900 sm:text-xl">
              오늘도 합격에 한 걸음 더, 학습을 시작해 볼까요?
            </h2>
          </div>
          <DDayWidget />
        </div>
        <div className="relative mt-5 flex flex-wrap gap-2 border-t border-blue-100/70 pt-4">
          <Link
            href="/cbt/study"
            className="rounded-md border border-blue-300 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            과목별 학습
          </Link>
          <Link
            href="/cbt/exams"
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            CBT 응시하기
          </Link>
          <Link
            href="/simulator"
            className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            이론 시뮬레이터
          </Link>
        </div>
      </section>

      {/* 사용 가이드 */}
      <div className="mb-8">
        <PageGuide
          storageKey="cbt-dashboard"
          tone="blue"
          title="대시보드 둘러보기 — 학습 흐름 한눈에"
          subtitle="이 화면 하나로 무엇을 더 공부할지, 어디가 약한지를 즉시 파악할 수 있습니다."
          items={[
            {
              icon: "📊",
              title: "학습 현황 (과목별 정답률)",
              body: "삼각형 그래프로 전기이론·기기·설비 세 과목의 누적 정답률을 비교합니다. 가장 좁은 변이 가장 약한 과목.",
            },
            {
              icon: "📈",
              title: "학습량 카운트 — 이용자 평균과 비교",
              body: "이번 달과 누적 학습 시간이 이용자 평균과 함께 표시됩니다. 평균보다 적다면 일일 도전부터 시작하세요.",
            },
            {
              icon: "🎯",
              title: "오늘의 일일 도전",
              body: "매일 새 미션이 주어집니다. 짧지만 누적되면 합격선까지 가장 빠르게 도달하는 루트입니다.",
            },
            {
              icon: "📝",
              title: "최근 응시 기록",
              body: "최근에 푼 CBT 회차와 점수가 표시됩니다. 같은 회차를 다시 풀거나, 해설 보기로 바로 이동할 수 있습니다.",
            },
            {
              icon: "🗂",
              title: "상단 탭 — 학습 / 응시 / 오답노트",
              body: "'과목별 학습', 'CBT 응시', '오답노트'는 상단 탭과 배너 버튼에서 접근하세요. 오답노트는 응시 후 자동 누적됩니다.",
            },
            {
              icon: "📅",
              title: "D-Day 위젯",
              body: "다음 시험일까지 남은 일수가 상단에 표시됩니다. 시험일 설정은 D-Day 위젯을 클릭해서 변경할 수 있습니다.",
            },
          ]}
          footer={
            <>
              💡 처음이라면 → <strong>CBT 응시하기</strong>로 1회차를 한 번 풀어보세요. 결과 화면에서 약점 과목이 자동 진단되고, 보완 학습이 추천됩니다.
            </>
          }
        />
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-7">
        <SectionCard
          title="학습 현황"
          subtitle="과목별 누적 정답률"
          className="lg:col-span-2"
        >
          <SubjectStatsTriangle stats={stats} />
        </SectionCard>

        <SectionCard
          title="전기기능사 학습량 카운트"
          subtitle="이용자 평균과 비교"
          legend={
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
                학습자
              </span>
              <span className="flex items-center gap-1 text-zinc-500">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-200" />
                이용자 평균
              </span>
            </div>
          }
          className="lg:col-span-3"
        >
          <StudyVolumeChart stats={stats} />
        </SectionCard>

        <div className="lg:col-span-2">
          <DailyChallenge />
        </div>
      </div>

      {/* 취약 진단 + 학습 곡선 + 최근 응시 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard
          title="취약점 진단"
          subtitle="가장 취약한 토픽을 우선 학습해 보세요"
          className="lg:col-span-2"
        >
          <WeakPointDiagnosis stats={stats} />
        </SectionCard>

        <SectionCard
          title="최근 응시 기록"
          subtitle="최근 5회"
          action={
            <Link
              href="/cbt/exams"
              className="text-xs text-zinc-500 hover:text-zinc-900"
            >
              전체 →
            </Link>
          }
        >
          <RecentAttempts />
        </SectionCard>
      </div>

      <div className="mb-6">
        <SectionCard
          title="학습 곡선"
          subtitle="응시별 점수 변화"
          action={
            <Link
              href="/cbt/wrong-notes"
              className="text-xs text-zinc-500 hover:text-zinc-900"
            >
              오답 노트 →
            </Link>
          }
        >
          <LearningCurve />
        </SectionCard>
      </div>

      {/* 공지사항 + 학습 게시판 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          title="공지사항"
          action={
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900">
              더보기 →
            </Link>
          }
        >
          <NoticeList notices={notices} />
        </SectionCard>

        <SectionCard
          title="학습 게시판"
          action={
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900">
              더보기 →
            </Link>
          }
        >
          <BoardList posts={boardPosts} />
        </SectionCard>
      </div>
    </main>
  );
}

function SectionCard({
  title,
  subtitle,
  legend,
  action,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  legend?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-zinc-900">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {legend}
          {action}
        </div>
      </div>
      {children}
    </section>
  );
}

function SubjectStatsTriangle({ stats }: { stats: LearningStats | null }) {
  const subjects: SubjectAggregate[] = stats?.subjects ?? [
    { subject: "전기이론", correct: 0, total: 0 },
    { subject: "전기기기", correct: 0, total: 0 },
    { subject: "전기설비", correct: 0, total: 0 },
  ];

  const cx = 150;
  const cy = 145;
  const radius = 100;
  const angles = subjects.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / 3);

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

  const overallAccuracy = stats?.averageAccuracy ?? 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 300 300" className="h-56 w-56">
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
        <polygon
          points={innerPoints.map((p) => p.join(",")).join(" ")}
          fill="rgba(37, 99, 235, 0.18)"
          stroke="#2563eb"
          strokeWidth="2"
        />
        {innerPoints.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#2563eb" />
        ))}
        {subjects.map((s, i) => {
          const a = angles[i];
          const lx = cx + (radius + 28) * Math.cos(a);
          const ly = cy + (radius + 28) * Math.sin(a);
          const ratio = s.total > 0 ? s.correct / s.total : 0;
          return (
            <g key={s.subject}>
              <text
                x={lx}
                y={ly - 4}
                textAnchor="middle"
                className="fill-zinc-800 text-[11px] font-semibold"
              >
                {s.subject}
              </text>
              <text
                x={lx}
                y={ly + 10}
                textAnchor="middle"
                className="fill-zinc-500 text-[10px]"
              >
                {Math.round(ratio * 100)}%
              </text>
            </g>
          );
        })}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          className="fill-zinc-400 text-[10px]"
        >
          평균
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          className="fill-zinc-900 text-sm font-bold"
        >
          {Math.round(overallAccuracy * 100)}%
        </text>
      </svg>
      {!stats?.hasAnyAttempt && (
        <p className="rounded-md bg-zinc-50 px-3 py-2 text-center text-xs text-zinc-500">
          모의고사를 응시하면 학습 현황이 표시됩니다.
        </p>
      )}
    </div>
  );
}

function StudyVolumeChart({ stats }: { stats: LearningStats | null }) {
  const userRecent = stats?.recentMonthStudyMinutes ?? 0;
  const userTotal = stats?.totalStudyMinutes ?? 0;
  const userAttempts = stats?.totalAttempts ?? 0;

  const rows = [
    {
      label: "최근 한달",
      user: userRecent,
      avg: COMMUNITY_BASELINE.recentMonthMinutes,
      formatter: formatHours,
    },
    {
      label: "총 학습시간",
      user: userTotal,
      avg: COMMUNITY_BASELINE.totalStudyMinutes,
      formatter: formatHours,
    },
    {
      label: "학습 회차",
      user: userAttempts,
      avg: COMMUNITY_BASELINE.attempts,
      formatter: (v: number) => `${v}회`,
    },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const max = Math.max(row.user, row.avg, 1);
        const userWidth = Math.max(2, (row.user / max) * 100);
        const avgWidth = Math.max(2, (row.avg / max) * 100);
        return (
          <div key={row.label} className="grid grid-cols-[80px_1fr] items-center gap-3">
            <div className="text-sm text-zinc-700">{row.label}</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="relative h-5 flex-1 overflow-hidden rounded bg-zinc-100">
                  <div
                    className="h-full rounded bg-blue-600 transition-all"
                    style={{ width: `${userWidth}%` }}
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-white">
                    {row.formatter(row.user)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative h-3 flex-1 overflow-hidden rounded bg-zinc-100">
                  <div
                    className="h-full rounded bg-blue-200 transition-all"
                    style={{ width: `${avgWidth}%` }}
                  />
                </div>
                <span className="w-16 text-right text-[11px] text-zinc-500">
                  평균 {row.formatter(row.avg)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeakPointDiagnosis({ stats }: { stats: LearningStats | null }) {
  if (!stats?.hasAnyAttempt) {
    return (
      <p className="rounded-md bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
        모의고사를 풀고 나면 학습자님이 약한 토픽을 알려드릴게요.
      </p>
    );
  }

  if (stats.weakestTopics.length === 0) {
    return (
      <p className="rounded-md bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
        아직 충분한 데이터가 모이지 않았습니다.
      </p>
    );
  }

  const top = stats.weakestTopics[0];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 lg:col-span-2">
        <p className="text-xs font-semibold tracking-wide text-rose-700">
          가장 취약한 토픽
        </p>
        <p className="mt-2 text-base font-bold text-zinc-900">
          [{top.subject}] · {top.topic}
        </p>
        <p className="mt-1 text-sm text-zinc-700">
          정답률{" "}
          <strong className="text-rose-700">
            {Math.round(top.accuracy * 100)}%
          </strong>{" "}
          ({top.correct} / {top.total})
        </p>
        <p className="mt-3 text-xs text-zinc-600">
          이 토픽을 우선 학습하면 점수 향상 효과가 가장 큽니다.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 p-4">
        <p className="text-xs font-semibold text-zinc-700">취약 토픽 TOP 3</p>
        <ol className="mt-3 space-y-2 text-sm">
          {stats.weakestTopics.map((t, i) => (
            <li
              key={`${t.subject}-${t.topic}`}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-600">
                  {i + 1}
                </span>
                <span className="truncate text-zinc-800">
                  {t.subject} · {t.topic}
                </span>
              </span>
              <span className="text-xs font-semibold text-rose-600">
                {Math.round(t.accuracy * 100)}%
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function NoticeList({ notices }: { notices: Notice[] }) {
  return (
    <ul className="divide-y divide-zinc-100">
      {notices.map((n) => (
        <li key={n.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            {n.pinned && <span className="text-xs">📌</span>}
            {n.badge && (
              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                {n.badge}
              </span>
            )}
            <a
              href="#"
              className="truncate text-sm text-zinc-800 hover:text-blue-600"
            >
              {n.title}
            </a>
          </div>
          <time className="flex-shrink-0 text-xs text-zinc-500">{n.date}</time>
        </li>
      ))}
    </ul>
  );
}

function BoardList({ posts }: { posts: BoardPost[] }) {
  return (
    <ul className="divide-y divide-zinc-100">
      {posts.map((p) => (
        <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <a
              href="#"
              className="truncate text-sm text-zinc-800 hover:text-blue-600"
            >
              {p.title}
            </a>
            {p.replies > 0 && (
              <span className="flex-shrink-0 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                {p.replies}
              </span>
            )}
          </div>
          <span className="flex-shrink-0 text-xs text-zinc-500">
            {p.author} · {p.date}
          </span>
        </li>
      ))}
    </ul>
  );
}
