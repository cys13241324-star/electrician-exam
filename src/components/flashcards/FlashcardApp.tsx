"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAllCards } from "@/lib/flashcards/data";
import { isDueToday, STATUS_COLOR } from "@/lib/flashcards/srs";
import { getOrCreateProgress, loadProgress } from "@/lib/flashcards/storage";
import type { Flashcard, CardStatus } from "@/lib/flashcards/types";
import CardStudy from "./CardStudy";
import CardIndex from "./CardIndex";
import BackgroundPattern from "@/components/BackgroundPattern";

type Mode = "today" | "index" | "stats";

export default function FlashcardApp() {
  const [mode, setMode] = useState<Mode>("today");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [progressVersion, setProgressVersion] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCards(getAllCards());
    setHydrated(true);
  }, []);

  // 진행 정보가 바뀌면 재로드 트리거
  function bumpProgress() {
    setProgressVersion((v) => v + 1);
  }

  const progressMap = useMemo(() => {
    if (!hydrated) return {};
    return loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, progressVersion]);

  // 통계
  const stats = useMemo(() => {
    const counts: Record<CardStatus, number> = {
      new: 0,
      learning: 0,
      review: 0,
      mastered: 0,
    };
    let dueCount = 0;
    let favCount = 0;
    for (const c of cards) {
      const p = getOrCreateProgress(progressMap, c.id);
      counts[p.status] += 1;
      if (isDueToday(p)) dueCount += 1;
      if (p.favorite) favCount += 1;
    }
    return { counts, dueCount, favCount, total: cards.length };
  }, [cards, progressMap]);

  // 오늘 복습할 카드 (due 포함, 마스터 제외 우선)
  const todayDeck = useMemo(() => {
    if (cards.length === 0) return [];
    return cards
      .map((c) => ({ card: c, prog: getOrCreateProgress(progressMap, c.id) }))
      .filter(({ prog }) => isDueToday(prog) && prog.status !== "mastered")
      .sort((a, b) => {
        // 오답 먼저, 그 다음 학습중, 마지막 신규
        const orderMap = { learning: 0, review: 1, new: 2, mastered: 3 };
        return orderMap[a.prog.status] - orderMap[b.prog.status];
      })
      .map(({ card }) => card);
  }, [cards, progressMap]);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20 text-center text-sm text-zinc-500">
        카드를 준비하는 중...
      </main>
    );
  }

  return (
    <>
      {/* 헤더 + 통계 + 탭 */}
      <section className="relative overflow-hidden border-b border-zinc-100 bg-gradient-to-br from-violet-50 via-white to-pink-50">
        <BackgroundPattern variant="dots" color="#8b5cf6" opacity={0.07} />
        <BackgroundPattern variant="mesh-violet" />
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold tracking-wide text-violet-700">
                🃏 플립 암기카드
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
                간격 반복으로
                <br />
                <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                  뇌에 박히는 학습
                </span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-7 text-zinc-700">
                자가 평가를 기반으로 어려운 카드는 자주, 쉬운 카드는 드물게.
                같은 시간 학습으로 정답률이 더 빠르게 오릅니다.
              </p>
            </div>

            {/* 통계 카드 */}
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto">
              <StatBox
                label="오늘 복습"
                value={stats.dueCount}
                accent="bg-rose-500"
              />
              <StatBox
                label="마스터"
                value={stats.counts.mastered}
                accent="bg-emerald-500"
              />
              <StatBox
                label="복습중"
                value={stats.counts.review}
                accent="bg-blue-500"
              />
              <StatBox
                label="총 카드"
                value={stats.total}
                accent="bg-zinc-700"
              />
            </div>
          </div>

          {/* 탭 */}
          <div className="mt-8 flex gap-1 rounded-lg bg-white/70 p-1 shadow-sm backdrop-blur sm:gap-2 sm:p-1.5">
            <TabButton active={mode === "today"} onClick={() => setMode("today")}>
              📚 오늘 학습
              {stats.dueCount > 0 && (
                <span className="ml-1.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {stats.dueCount}
                </span>
              )}
            </TabButton>
            <TabButton active={mode === "index"} onClick={() => setMode("index")}>
              🗂 전체 인덱스
            </TabButton>
            <TabButton active={mode === "stats"} onClick={() => setMode("stats")}>
              📊 학습 현황
            </TabButton>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {mode === "today" && (
          <TodayMode deck={todayDeck} onProgress={bumpProgress} />
        )}
        {mode === "index" && (
          <CardIndex
            cards={cards}
            progressMap={progressMap}
            onProgress={bumpProgress}
          />
        )}
        {mode === "stats" && <StatsMode stats={stats} cards={cards} />}
      </main>
    </>
  );
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${accent}`} />
        <p className="text-[11px] font-semibold text-zinc-600">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-black text-zinc-900">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1 rounded-md px-4 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-zinc-900 text-white shadow-md"
          : "text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {children}
    </button>
  );
}

function TodayMode({
  deck,
  onProgress,
}: {
  deck: Flashcard[];
  onProgress: () => void;
}) {
  if (deck.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
        <p className="text-5xl">🎉</p>
        <h2 className="mt-4 text-xl font-bold text-emerald-900">
          오늘 학습할 카드가 없어요
        </h2>
        <p className="mt-3 text-sm leading-6 text-emerald-800">
          모든 카드를 마스터했거나, 아직 복습 시기가 아닙니다.
          <br />
          새 카드를 추가하려면 CBT 모의고사를 풀어보세요.
        </p>
        <Link
          href="/cbt/exams"
          className="mt-5 inline-block rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          CBT 응시하기 →
        </Link>
      </div>
    );
  }

  return <CardStudy deck={deck} onProgress={onProgress} />;
}

function StatsMode({
  stats,
  cards,
}: {
  stats: { counts: Record<CardStatus, number>; total: number; favCount: number };
  cards: Flashcard[];
}) {
  const subjects = ["전기이론", "전기기기", "전기설비"] as const;
  return (
    <div className="space-y-6">
      {/* 마스터리 진행률 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-zinc-900">전체 마스터리</h2>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-zinc-100">
          {(["mastered", "review", "learning", "new"] as CardStatus[]).map(
            (s) => {
              const ratio = stats.total > 0 ? stats.counts[s] / stats.total : 0;
              if (ratio === 0) return null;
              return (
                <div
                  key={s}
                  className={`${STATUS_COLOR[s].bg} transition-all`}
                  style={{ width: `${ratio * 100}%` }}
                  title={`${STATUS_COLOR[s].label}: ${stats.counts[s]}장`}
                />
              );
            },
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          {(["mastered", "review", "learning", "new"] as CardStatus[]).map(
            (s) => (
              <div
                key={s}
                className="flex items-center gap-2 rounded-md bg-zinc-50 px-3 py-2"
              >
                <span className={`h-2 w-2 rounded-full ${STATUS_COLOR[s].bg}`} />
                <span className="font-medium text-zinc-700">
                  {STATUS_COLOR[s].label}
                </span>
                <span className="ml-auto font-bold text-zinc-900">
                  {stats.counts[s]}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* 과목별 진도 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {subjects.map((s) => {
          const inSubject = cards.filter((c) => c.subject === s);
          return (
            <div
              key={s}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold text-zinc-500">과목별 카드</p>
              <h3 className="mt-1 text-lg font-bold text-zinc-900">{s}</h3>
              <p className="mt-3 text-3xl font-black text-violet-600">
                {inSubject.length}
                <span className="ml-1 text-sm font-medium text-zinc-500">장</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* 즐겨찾기 안내 */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-bold text-amber-900">
          ⭐ 즐겨찾기 {stats.favCount}장
        </p>
        <p className="mt-1 text-xs leading-5 text-amber-800">
          헷갈리거나 자주 까먹는 카드는 ⭐ 표시해서 시험 전날 한 번 더 훑어보세요.
        </p>
      </div>
    </div>
  );
}
