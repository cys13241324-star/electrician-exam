"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Simulator } from "@/lib/simulators";
import type { Subject } from "@/lib/cbt/types";

const SUBJECT_THEME: Record<
  Subject,
  { headerBg: string; chip: string; tag: string }
> = {
  전기이론: {
    headerBg: "from-blue-500/10 to-blue-500/0",
    chip: "bg-blue-50 text-blue-700",
    tag: "bg-blue-600",
  },
  전기기기: {
    headerBg: "from-violet-500/10 to-violet-500/0",
    chip: "bg-violet-50 text-violet-700",
    tag: "bg-violet-600",
  },
  전기설비: {
    headerBg: "from-emerald-500/10 to-emerald-500/0",
    chip: "bg-emerald-50 text-emerald-700",
    tag: "bg-emerald-600",
  },
};

type Props = {
  simulators: Simulator[];
  subjects: Subject[];
};

export default function SimulatorList({ simulators, subjects }: Props) {
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<Subject | "전체">("전체");
  const [statusFilter, setStatusFilter] = useState<"전체" | "available" | "coming_soon">(
    "전체"
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return simulators.filter((s) => {
      if (subjectFilter !== "전체" && s.subject !== subjectFilter) return false;
      if (statusFilter !== "전체" && s.status !== statusFilter) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q)
      );
    });
  }, [simulators, query, subjectFilter, statusFilter]);

  const groupedSubjects = subjectFilter === "전체" ? subjects : [subjectFilter];

  return (
    <>
      {/* 검색 & 필터 */}
      <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
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

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <FilterChip
              label="전체"
              active={subjectFilter === "전체"}
              onClick={() => setSubjectFilter("전체")}
            />
            {subjects.map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={subjectFilter === s}
                onClick={() => setSubjectFilter(s)}
              />
            ))}
            <span className="mx-1 h-4 w-px bg-zinc-300" />
            <FilterChip
              label="전체상태"
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

        <div className="mt-2 text-[11px] text-zinc-500">
          {filtered.length === simulators.length ? (
            <>총 {simulators.length}개 시뮬레이터</>
          ) : (
            <>
              <span className="font-semibold text-zinc-700">{filtered.length}</span> /{" "}
              {simulators.length}개 표시 중
            </>
          )}
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
              setSubjectFilter("전체");
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
        const items = filtered.filter((s) => s.subject === subject);
        if (items.length === 0) return null;
        const theme = SUBJECT_THEME[subject];
        return (
          <section key={subject} className="mb-10">
            <div
              className={`mb-4 rounded-lg bg-gradient-to-r ${theme.headerBg} px-4 py-2.5`}
            >
              <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                <span className={`h-2 w-2 rounded-full ${theme.tag}`} />
                {subject}
                <span className="text-xs font-normal text-zinc-500">
                  {items.length}개
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((sim, idx) => {
                const isAvailable = sim.status === "available";
                const cardContent = (
                  <article className="group flex h-full flex-col rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
                    <div className="flex items-start justify-between gap-1">
                      <div className="text-xl leading-none">{sim.emoji}</div>
                      {isAvailable ? (
                        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                          이용가능
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
                    <p
                      className={`mt-1.5 text-[10px] font-medium ${theme.chip} inline-block w-fit rounded px-1.5 py-0.5`}
                    >
                      {sim.topic}
                    </p>
                    <p className="mt-2 line-clamp-2 flex-1 text-[11px] leading-5 text-zinc-500">
                      {sim.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2">
                      <span className="text-[10px] text-zinc-400">
                        {isAvailable && sim.htmlPath ? "체험" : "출시 예정"}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-600 group-hover:translate-x-0.5 transition">
                        →
                      </span>
                    </div>
                  </article>
                );

                return (
                  <Reveal key={sim.id} type="fade-up" delay={Math.min(idx, 8) * 40}>
                    {isAvailable ? (
                      <Link href={`/simulator/${sim.id}`} className="block h-full">
                        {cardContent}
                      </Link>
                    ) : (
                      <Link href={`/simulator/${sim.id}`} className="block h-full">
                        {cardContent}
                      </Link>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
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
        active
          ? toneClass
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}
