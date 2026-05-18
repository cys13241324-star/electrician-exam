"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import questionsData from "@/data/questions.json";

/**
 * 시험 페이지 — 문항 카탈로그 / 라이브러리.
 *
 * 좌측 세로축: 분류 트리 (과목ID > 챕터)
 * 상단 가로축: 속성 필터 (연도·회차·빈출도·난이도·문제유형)
 * 메인: 문항 표 — 정렬 가능한 컬럼들
 * 우측: 선택한 문항 풀이 미리보기 (상단 강의 버튼 포함)
 */

type Block = { type: "text" | "image"; value: string };

type Question = {
  문항코드?: string;
  과목ID?: string;
  과정?: string;
  연도?: string | number;
  회차?: string | number;
  강의주소?: string;
  사용교재?: string;
  교재구분?: string;
  챕터?: string;
  대유형?: string;
  중유형?: string;
  내용?: string;
  빈출도?: number;
  난이도?: number;
  문제유형?: string;
  발문?: string;
  조건?: string;
  발문그림?: string;
  보기1?: string;
  보기1그림?: string;
  보기2?: string;
  보기2그림?: string;
  보기3?: string;
  보기3그림?: string;
  보기4?: string;
  보기4그림?: string;
  "정답(1~4)"?: string | number;
  오답분석?: string;
  해설블록?: Block[];
  학습포인트블록?: Block[];
};

const ALL: Question[] = questionsData as Question[];

const 과목명 = {
  theory: "전기이론",
  machinery: "전기기기",
  facility: "전기설비",
} as const;

type SortKey = "문항코드" | "과목" | "출처" | "빈출도" | "난이도";

function HtmlBlock({ html, className }: { html: string; className?: string }) {
  if (!html?.trim()) return null;
  return (
    <div
      className={`prose prose-sm max-w-none [&_table]:my-2 [&_table]:border-collapse [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-slate-300 [&_td]:px-2 [&_td]:py-1 ${
        className ?? ""
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function ImgPlaceholder({ value, label }: { value: string; label: string }) {
  if (!value?.trim()) return null;
  const needsManual = value.startsWith("[필요");
  if (!needsManual) {
    return (
      <figure className="my-2 rounded border border-slate-200 bg-white p-2">
        <img
          src={`/questions/${value}`}
          alt={label}
          className="mx-auto max-h-48 rounded"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </figure>
    );
  }
  return (
    <div className="my-2 rounded border-2 border-dashed border-amber-400 bg-amber-50 p-3 text-center text-sm text-amber-700">
      <div className="text-xs font-semibold uppercase tracking-wide">{label}</div>
      <div className="mt-1 font-mono text-xs">{value}</div>
    </div>
  );
}

export default function LibraryPage() {
  // 필터 상태
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [filterChapter, setFilterChapter] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterRound, setFilterRound] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [minFreq, setMinFreq] = useState<number>(0);
  const [minDiff, setMinDiff] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  // 정렬 상태
  const [sortKey, setSortKey] = useState<SortKey>("문항코드");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // 선택된 문항
  const [selectedCode, setSelectedCode] = useState<string | null>(
    ALL[0]?.문항코드 || null
  );

  // ===== 분류 트리 (좌측 세로축) =====
  const tree = useMemo(() => {
    const m = new Map<string, Map<string, number>>();
    for (const q of ALL) {
      const subj = q.과목ID || "?";
      if (!m.has(subj)) m.set(subj, new Map());
      const chap = q.챕터 || "(미분류)";
      m.get(subj)!.set(chap, (m.get(subj)!.get(chap) || 0) + 1);
    }
    return Array.from(m.entries()).map(([subj, chaps]) => ({
      subject: subj,
      total: Array.from(chaps.values()).reduce((a, b) => a + b, 0),
      chapters: Array.from(chaps.entries()),
    }));
  }, []);

  // ===== 고유값 추출 (필터 옵션) =====
  const years = useMemo(
    () =>
      Array.from(new Set(ALL.map((q) => String(q.연도 || "")).filter(Boolean))).sort(),
    []
  );
  const rounds = useMemo(
    () =>
      Array.from(new Set(ALL.map((q) => String(q.회차 || "")).filter(Boolean))).sort(),
    []
  );
  const types = useMemo(
    () =>
      Array.from(
        new Set(ALL.map((q) => String(q.문제유형 || "")).filter(Boolean))
      ).sort(),
    []
  );

  // ===== 필터 + 정렬 =====
  const filtered = useMemo(() => {
    let arr = ALL.filter((q) => {
      if (filterSubject && q.과목ID !== filterSubject) return false;
      if (filterChapter && q.챕터 !== filterChapter) return false;
      if (filterYear && String(q.연도) !== filterYear) return false;
      if (filterRound && String(q.회차) !== filterRound) return false;
      if (filterType && q.문제유형 !== filterType) return false;
      if (minFreq > 0 && (q.빈출도 || 0) < minFreq) return false;
      if (minDiff > 0 && (q.난이도 || 0) < minDiff) return false;
      if (search) {
        const s = search.toLowerCase();
        const hay = [
          q.문항코드, q.발문, q.챕터, q.대유형, q.중유형, q.내용,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });

    arr = arr.slice().sort((a, b) => {
      const cmp = (() => {
        switch (sortKey) {
          case "문항코드":
            return (a.문항코드 || "").localeCompare(b.문항코드 || "");
          case "과목":
            return (a.과목ID || "").localeCompare(b.과목ID || "");
          case "출처":
            return (
              (String(a.연도) + String(a.회차)).localeCompare(
                String(b.연도) + String(b.회차)
              )
            );
          case "빈출도":
            return (a.빈출도 || 0) - (b.빈출도 || 0);
          case "난이도":
            return (a.난이도 || 0) - (b.난이도 || 0);
        }
      })();
      return sortAsc ? cmp : -cmp;
    });

    return arr;
  }, [filterSubject, filterChapter, filterYear, filterRound, filterType,
      minFreq, minDiff, search, sortKey, sortAsc]);

  const cur = filtered.find((q) => q.문항코드 === selectedCode) || filtered[0];
  const correct = String(cur?.["정답(1~4)"] || "");

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc(!sortAsc);
    else {
      setSortKey(k);
      setSortAsc(true);
    }
  };

  const resetFilters = () => {
    setFilterSubject("");
    setFilterChapter("");
    setFilterYear("");
    setFilterRound("");
    setFilterType("");
    setMinFreq(0);
    setMinDiff(0);
    setSearch("");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              시험 문항 라이브러리
            </h1>
            <p className="text-xs text-slate-500">
              문항코드 정렬 · 분류(세로축) · 속성(가로축) 필터링
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/admin/register"
              className="rounded border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
            >
              단일 등록
            </Link>
            <Link
              href="/admin/register-batch"
              className="rounded border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
            >
              일괄 등록
            </Link>
          </div>
        </div>
      </header>

      {/* === 가로축 속성 필터 바 === */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-2 px-6 py-3 text-sm">
          <span className="text-xs font-bold text-rose-700">🏷 속성 필터</span>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
          >
            <option value="">연도 전체</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={filterRound}
            onChange={(e) => setFilterRound(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
          >
            <option value="">회차 전체</option>
            {rounds.map((r) => (
              <option key={r} value={r}>
                {r}회
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
          >
            <option value="">유형 전체</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <span className="text-xs text-rose-700">빈출 ≥</span>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMinFreq(n)}
                className={`px-1 text-sm ${
                  n <= minFreq ? "text-rose-600" : "text-slate-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-purple-700">난이 ≥</span>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMinDiff(n)}
                className={`px-1 text-sm ${
                  n <= minDiff ? "text-purple-600" : "text-slate-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 발문/분류 검색"
            className="ml-auto rounded border border-slate-300 bg-white px-2 py-1 text-xs"
          />
          <button
            onClick={resetFilters}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
          >
            초기화
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1500px] gap-4 px-6 py-4">
        {/* === 좌측 분류 트리 (세로축) === */}
        <aside className="w-56 shrink-0">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="mb-2 text-xs font-bold text-cyan-700">
              🗂 분류 (세로축)
            </div>
            <button
              onClick={() => {
                setFilterSubject("");
                setFilterChapter("");
              }}
              className={`w-full rounded px-2 py-1 text-left text-xs ${
                !filterSubject ? "bg-cyan-100 font-bold text-cyan-800" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              전체 ({ALL.length})
            </button>
            {tree.map((node) => (
              <div key={node.subject} className="mt-1">
                <button
                  onClick={() => {
                    setFilterSubject(node.subject);
                    setFilterChapter("");
                  }}
                  className={`w-full rounded px-2 py-1 text-left text-xs ${
                    filterSubject === node.subject
                      ? "bg-cyan-100 font-bold text-cyan-800"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {과목명[node.subject as keyof typeof 과목명] ?? node.subject} ({node.total})
                </button>
                {filterSubject === node.subject &&
                  node.chapters.map(([ch, count]) => (
                    <button
                      key={ch}
                      onClick={() => setFilterChapter(ch)}
                      className={`ml-3 mt-1 block w-[calc(100%-0.75rem)] rounded px-2 py-1 text-left text-[11px] ${
                        filterChapter === ch
                          ? "bg-cyan-50 font-bold text-cyan-700"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      ▸ {ch} ({count})
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </aside>

        {/* === 메인: 문항 표 === */}
        <section className="flex-1 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
            <h2 className="text-sm font-bold text-slate-700">
              결과 — {filtered.length}문항 (전체 {ALL.length})
            </h2>
            <div className="text-xs text-slate-500">
              정렬: <strong>{sortKey}</strong> {sortAsc ? "↑" : "↓"}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-100">
                <tr>
                  {(["문항코드", "과목", "출처", "빈출도", "난이도"] as SortKey[]).map(
                    (k) => (
                      <th
                        key={k}
                        onClick={() => toggleSort(k)}
                        className="cursor-pointer px-2 py-2 text-left hover:bg-slate-200"
                      >
                        {k} {sortKey === k && (sortAsc ? "↑" : "↓")}
                      </th>
                    )
                  )}
                  <th className="px-2 py-2 text-left">발문 (요약)</th>
                  <th className="px-2 py-2 text-center">🎬</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => {
                  const sel = q.문항코드 === cur?.문항코드;
                  return (
                    <tr
                      key={q.문항코드}
                      onClick={() => setSelectedCode(q.문항코드 || null)}
                      className={`cursor-pointer border-t border-slate-100 hover:bg-pink-50 ${
                        sel ? "bg-pink-100" : ""
                      }`}
                    >
                      <td className="px-2 py-2 font-mono text-indigo-700">
                        {q.문항코드}
                      </td>
                      <td className="px-2 py-2">
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-pink-700">
                          {q.과목ID}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-slate-600">
                        {q.연도}·{q.회차}회
                      </td>
                      <td className="px-2 py-2 text-rose-600">
                        {"★".repeat(q.빈출도 || 0)}
                      </td>
                      <td className="px-2 py-2 text-purple-600">
                        {"★".repeat(q.난이도 || 0)}
                      </td>
                      <td className="max-w-[18em] truncate px-2 py-2 text-slate-700">
                        {String(q.발문 || "").replace(/<[^>]+>/g, "")}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {q.강의주소 ? "✓" : "—"}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                      조건에 맞는 문항이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* === 우측: 풀이 미리보기 === */}
        <aside className="w-[28rem] shrink-0">
          <div className="sticky top-4 rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
              풀이 미리보기
            </div>
            {cur ? (
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2">
                  <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-700">
                    {cur.문항코드}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    {cur.연도}·{cur.회차}회
                  </span>
                  <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
                    {cur.과목ID}
                  </span>
                  {cur.문제유형 && (
                    <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] text-cyan-700">
                      {cur.문제유형}
                    </span>
                  )}
                </div>

                {cur.강의주소 && (
                  <a
                    href={String(cur.강의주소)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-lg border-2 border-violet-300 bg-violet-50 px-3 py-2 text-center text-xs font-bold text-violet-700 hover:bg-violet-100"
                  >
                    🎬 이 문제 강의 보기
                  </a>
                )}

                <HtmlBlock
                  html={String(cur.발문 || "")}
                  className="text-sm font-medium text-slate-900"
                />
                <ImgPlaceholder value={String(cur.발문그림 || "")} label="발문그림" />

                <ol className="space-y-1.5">
                  {[1, 2, 3, 4].map((n) => {
                    const text = String(cur[`보기${n}` as keyof Question] || "");
                    const isCorrect = correct === String(n);
                    return (
                      <li
                        key={n}
                        className={`flex items-start gap-2 rounded border p-2 ${
                          isCorrect
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isCorrect
                              ? "bg-teal-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {["①", "②", "③", "④"][n - 1]}
                        </span>
                        <HtmlBlock html={text} className="text-xs text-slate-800" />
                      </li>
                    );
                  })}
                </ol>

                {cur.해설블록 && cur.해설블록.length > 0 && (
                  <section className="rounded border-l-4 border-orange-500 bg-orange-50 p-2">
                    <div className="mb-1 text-[10px] font-bold text-orange-700">
                      해설
                    </div>
                    {cur.해설블록.map((b, i) =>
                      b.type === "text" ? (
                        <HtmlBlock key={i} html={b.value} className="text-xs text-slate-800" />
                      ) : (
                        <ImgPlaceholder key={i} value={b.value} label="해설그림" />
                      )
                    )}
                  </section>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-slate-400">
                좌측에서 문항을 선택하세요.
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
