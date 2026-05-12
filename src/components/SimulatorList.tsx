"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Simulator } from "@/lib/simulators";
import type { Subject } from "@/lib/cbt/types";

const SUBJECT_THEME: Record<
  Subject,
  {
    headerBg: string;
    chip: string;
    tag: string;
    tabActiveText: string;
    tabActiveBorder: string;
    tabActiveBg: string;
  }
> = {
  전기이론: {
    headerBg: "from-blue-500/10 to-blue-500/0",
    chip: "bg-blue-50 text-blue-700",
    tag: "bg-blue-600",
    tabActiveText: "text-blue-700",
    tabActiveBorder: "border-blue-600",
    tabActiveBg: "bg-blue-50/60",
  },
  전기기기: {
    headerBg: "from-violet-500/10 to-violet-500/0",
    chip: "bg-violet-50 text-violet-700",
    tag: "bg-violet-600",
    tabActiveText: "text-violet-700",
    tabActiveBorder: "border-violet-600",
    tabActiveBg: "bg-violet-50/60",
  },
  전기설비: {
    headerBg: "from-emerald-500/10 to-emerald-500/0",
    chip: "bg-emerald-50 text-emerald-700",
    tag: "bg-emerald-600",
    tabActiveText: "text-emerald-700",
    tabActiveBorder: "border-emerald-600",
    tabActiveBg: "bg-emerald-50/60",
  },
};

type Props = {
  simulators: Simulator[];
  subjects: Subject[];
};

type Tab = "전체" | Subject;

export default function SimulatorList({ simulators, subjects }: Props) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("전체");
  const [statusFilter, setStatusFilter] = useState<"전체" | "available" | "coming_soon">(
    "전체"
  );
  const [openTopics, setOpenTopics] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    subjects.forEach((subj) => {
      const first = simulators.find((s) => s.subject === subj);
      if (first) initial.add(`${subj}::${first.topic}`);
    });
    return initial;
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return simulators.filter((s) => {
      if (activeTab !== "전체" && s.subject !== activeTab) return false;
      if (statusFilter !== "전체" && s.status !== statusFilter) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q)
      );
    });
  }, [simulators, query, activeTab, statusFilter]);

  const subjectCounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const counts: Record<string, number> = { 전체: 0 };
    subjects.forEach((s) => (counts[s] = 0));
    simulators.forEach((s) => {
      if (statusFilter !== "전체" && s.status !== statusFilter) return;
      if (q) {
        const matches =
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.topic.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q);
        if (!matches) return;
      }
      counts["전체"] += 1;
      counts[s.subject] += 1;
    });
    return counts;
  }, [simulators, subjects, query, statusFilter]);

  const isSearching = query.trim().length > 0;

  const isTopicOpen = (subject: Subject, topic: string) => {
    if (isSearching) return true;
    return openTopics.has(`${subject}::${topic}`);
  };

  const toggleTopic = (subject: Subject, topic: string) => {
    if (isSearching) return;
    const key = `${subject}::${topic}`;
    setOpenTopics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = (subject: Subject) => {
    const topics = new Set(
      filtered.filter((s) => s.subject === subject).map((s) => s.topic)
    );
    setOpenTopics((prev) => {
      const next = new Set(prev);
      topics.forEach((t) => next.add(`${subject}::${t}`));
      return next;
    });
  };

  const collapseAll = (subject: Subject) => {
    const topics = new Set(
      filtered.filter((s) => s.subject === subject).map((s) => s.topic)
    );
    setOpenTopics((prev) => {
      const next = new Set(prev);
      topics.forEach((t) => next.delete(`${subject}::${t}`));
      return next;
    });
  };

  const groupBySubjectAndTopic = (subject: Subject) => {
    const items = filtered.filter((s) => s.subject === subject);
    const topicOrder: string[] = [];
    const topicMap = new Map<string, Simulator[]>();
    items.forEach((it) => {
      if (!topicMap.has(it.topic)) {
        topicOrder.push(it.topic);
        topicMap.set(it.topic, []);
      }
      topicMap.get(it.topic)!.push(it);
    });
    return { topicOrder, topicMap };
  };

  const groupedSubjects = activeTab === "전체" ? subjects : [activeTab];

  return (
    <>
      {/* 검색 */}
      <div className="mb-3">
        <div className="relative max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="시뮬레이터 검색 (제목·주제·설명)"
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-xs text-zinc-400 hover:text-zinc-700"
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 과목 탭 + 상태 필터 (sticky) */}
      <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-zinc-200 bg-white/95 px-6 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 탭 */}
          <div className="flex items-center overflow-x-auto">
            <TabButton
              label="전체"
              count={subjectCounts["전체"] ?? 0}
              active={activeTab === "전체"}
              onClick={() => setActiveTab("전체")}
              theme={null}
            />
            {subjects.map((s) => (
              <TabButton
                key={s}
                label={s}
                count={subjectCounts[s] ?? 0}
                active={activeTab === s}
                onClick={() => setActiveTab(s)}
                theme={SUBJECT_THEME[s]}
              />
            ))}
          </div>

          {/* 상태 필터 */}
          <div className="flex items-center gap-1.5 pb-2 text-xs">
            <FilterChip
              label="전체"
              active={statusFilter === "전체"}
              onClick={() => setStatusFilter("전체")}
            />
            <FilterChip
              label="이용가능"
              active={statusFilter === "available"}
              onClick={() => setStatusFilter("available")}
              tone="emerald"
            />
            <FilterChip
              label="준비중"
              active={statusFilter === "coming_soon"}
              onClick={() => setStatusFilter("coming_soon")}
              tone="amber"
            />
          </div>
        </div>
      </div>

      {/* 결과 없음 */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <p className="text-3xl">🔎</p>
          <p className="mt-3 text-sm font-semibold text-zinc-700">
            검색 결과가 없습니다
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            다른 키워드로 다시 시도하거나 필터를 초기화해 주세요.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setActiveTab("전체");
              setStatusFilter("전체");
            }}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            필터 초기화
          </button>
        </div>
      )}

      {/* 과목별 그룹 */}
      {groupedSubjects.map((subject) => {
        const { topicOrder, topicMap } = groupBySubjectAndTopic(subject);
        if (topicOrder.length === 0) return null;
        const theme = SUBJECT_THEME[subject];
        const totalCount = topicOrder.reduce(
          (sum, t) => sum + (topicMap.get(t)?.length ?? 0),
          0
        );

        return (
          <section key={subject} className="mb-8">
            {/* 과목 헤더 */}
            <div className="mb-3 flex items-center justify-between gap-3">
              {activeTab === "전체" ? (
                <div
                  className={`flex-1 rounded-lg bg-gradient-to-r ${theme.headerBg} px-4 py-2`}
                >
                  <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                    <span className={`h-2 w-2 rounded-full ${theme.tag}`} />
                    {subject}
                    <span className="text-xs font-normal text-zinc-500">
                      {totalCount}개 · 토픽 {topicOrder.length}
                    </span>
                  </h2>
                </div>
              ) : (
                <div className="flex-1 text-xs text-zinc-500">
                  {totalCount}개 시뮬레이터 · {topicOrder.length}개 토픽
                </div>
              )}
              {!isSearching && (
                <div className="flex gap-1 text-[11px]">
                  <button
                    onClick={() => expandAll(subject)}
                    className="rounded px-2 py-1 text-zinc-500 hover:bg-zinc-100"
                  >
                    모두 펼치기
                  </button>
                  <button
                    onClick={() => collapseAll(subject)}
                    className="rounded px-2 py-1 text-zinc-500 hover:bg-zinc-100"
                  >
                    모두 접기
                  </button>
                </div>
              )}
            </div>

            {/* 토픽 아코디언 */}
            <div className="space-y-2">
              {topicOrder.map((topic) => {
                const items = topicMap.get(topic) ?? [];
                const open = isTopicOpen(subject, topic);
                const availableCount = items.filter(
                  (i) => i.status === "available"
                ).length;
                return (
                  <div
                    key={topic}
                    className="overflow-hidden rounded-lg border border-zinc-200 bg-white"
                  >
                    <button
                      onClick={() => toggleTopic(subject, topic)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition hover:bg-zinc-50"
                      aria-expanded={open}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`inline-block text-[10px] text-zinc-400 transition-transform ${
                            open ? "rotate-90" : ""
                          }`}
                        >
                          ▶
                        </span>
                        <h3 className="text-sm font-bold text-zinc-900">
                          {topic}
                        </h3>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${theme.chip}`}
                        >
                          {items.length}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        <span className="text-emerald-600">{availableCount}</span>
                        <span className="mx-0.5">/</span>
                        {items.length} 이용가능
                      </span>
                    </button>
                    {open && (
                      <div className="border-t border-zinc-100 bg-zinc-50/40 p-3">
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                          {items.map((sim, idx) => (
                            <SimulatorCard key={sim.id} sim={sim} idx={idx} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}

function SimulatorCard({ sim, idx }: { sim: Simulator; idx: number }) {
  const isAvailable = sim.status === "available";
  const hasContent = isAvailable || sim.formula || sim.example;
  return (
    <Reveal type="fade-up" delay={Math.min(idx, 6) * 40}>
      <Link href={`/simulator/${sim.id}`} className="block h-full">
        <article className="group flex h-full flex-col rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
          <div className="flex items-start justify-between gap-1">
            <div className="text-xl leading-none">{sim.emoji}</div>
            {isAvailable ? (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                이용가능
              </span>
            ) : hasContent ? (
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-800">
                공식·예제
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                준비중
              </span>
            )}
          </div>
          <h3 className="mt-2 line-clamp-2 text-[13px] font-bold leading-snug text-zinc-900 group-hover:text-indigo-700">
            {sim.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-[11px] leading-5 text-zinc-500">
            {sim.description}
          </p>
          <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2">
            <span className="text-[10px] text-zinc-400">
              {isAvailable
                ? "체험"
                : hasContent
                  ? "공식 보기"
                  : "출시 예정"}
            </span>
            <span className="text-[10px] font-semibold text-indigo-600 transition group-hover:translate-x-0.5">
              →
            </span>
          </div>
        </article>
      </Link>
    </Reveal>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
  theme,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  theme: {
    tabActiveText: string;
    tabActiveBorder: string;
    tabActiveBg: string;
  } | null;
}) {
  const activeClass = theme
    ? `${theme.tabActiveText} ${theme.tabActiveBorder} ${theme.tabActiveBg}`
    : "text-indigo-700 border-indigo-600 bg-indigo-50/60";
  return (
    <button
      onClick={onClick}
      className={`relative whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? activeClass
          : "border-transparent text-zinc-500 hover:text-zinc-800"
      }`}
    >
      {label}
      <span
        className={`ml-1.5 text-[11px] ${
          active ? "opacity-70" : "text-zinc-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  tone = "indigo",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: "indigo" | "emerald" | "amber";
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-600 text-white"
      : tone === "amber"
        ? "bg-amber-500 text-white"
        : "bg-indigo-600 text-white";
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
        active ? toneClass : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}
