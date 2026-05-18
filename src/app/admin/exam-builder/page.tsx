"use client";

/**
 * 시험 생성 페이지 (/admin/exam-builder)
 *
 * questions.json(문항은행)에서 필터 → 수동 선택 또는 랜덤 자동 구성 →
 * 시험 세트(제목·제한시간·문항 목록) 생성 → JSON 다운로드 + localStorage 저장.
 *
 * 백엔드 불필요(자립형). 라이브 시험 목록 연동은 개발자 작업(요청 메일 참조).
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import questionsData from "@/data/questions.json";

type Question = {
  문항코드?: string;
  연도?: string | number;
  회차?: string | number;
  과목ID?: string;
  챕터?: string;
  빈출도?: number;
  난이도?: number;
  문제유형?: string;
  발문?: string;
  "정답(1~4)"?: string | number;
};

const ALL: Question[] = questionsData as unknown as Question[];

const 과목명: Record<string, string> = {
  theory: "전기이론",
  machinery: "전기기기",
  facility: "전기설비",
};

function plain(s: string | undefined, n = 60): string {
  if (!s) return "";
  const t = s
    .replace(/<[^>]+>/g, " ")
    .replace(/\$\$?([^$]*)\$\$?/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

function uniq(vals: (string | number | undefined)[]): string[] {
  return Array.from(new Set(vals.map((v) => String(v ?? "")).filter(Boolean))).sort();
}

export default function ExamBuilderPage() {
  const [title, setTitle] = useState("전기기능사 CBT 모의고사");
  const [duration, setDuration] = useState(60);

  const [fSubject, setFSubject] = useState("");
  const [fYear, setFYear] = useState("");
  const [fRound, setFRound] = useState("");
  const [fType, setFType] = useState("");
  const [minFreq, setMinFreq] = useState(0);
  const [minDiff, setMinDiff] = useState(0);
  const [search, setSearch] = useState("");
  const [randomN, setRandomN] = useState(60);

  // 선택된 문항코드 (순서 유지)
  const [picked, setPicked] = useState<string[]>([]);

  const years = useMemo(() => uniq(ALL.map((q) => q.연도)), []);
  const rounds = useMemo(() => uniq(ALL.map((q) => q.회차)), []);
  const types = useMemo(() => uniq(ALL.map((q) => q.문제유형)), []);

  const filtered = useMemo(() => {
    return ALL.filter((q) => {
      if (fSubject && q.과목ID !== fSubject) return false;
      if (fYear && String(q.연도 ?? "") !== fYear) return false;
      if (fRound && String(q.회차 ?? "") !== fRound) return false;
      if (fType && q.문제유형 !== fType) return false;
      if (minFreq && (q.빈출도 ?? 0) < minFreq) return false;
      if (minDiff && (q.난이도 ?? 0) < minDiff) return false;
      if (search) {
        const hay = `${q.문항코드 ?? ""} ${q.발문 ?? ""} ${q.챕터 ?? ""}`;
        if (!hay.includes(search)) return false;
      }
      return true;
    });
  }, [fSubject, fYear, fRound, fType, minFreq, minDiff, search]);

  const byCode = useMemo(() => {
    const m = new Map<string, Question>();
    for (const q of ALL) if (q.문항코드) m.set(q.문항코드, q);
    return m;
  }, []);

  const pickedSet = new Set(picked);

  function toggle(code: string) {
    setPicked((p) => (p.includes(code) ? p.filter((c) => c !== code) : [...p, code]));
  }
  function addFiltered() {
    setPicked((p) => {
      const s = new Set(p);
      for (const q of filtered) if (q.문항코드) s.add(q.문항코드);
      return Array.from(s);
    });
  }
  function randomPick() {
    const pool = filtered.map((q) => q.문항코드!).filter(Boolean);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    setPicked(pool.slice(0, Math.max(0, randomN)));
  }
  function move(idx: number, dir: -1 | 1) {
    setPicked((p) => {
      const n = [...p];
      const j = idx + dir;
      if (j < 0 || j >= n.length) return p;
      [n[idx], n[j]] = [n[j], n[idx]];
      return n;
    });
  }

  const dist = useMemo(() => {
    const d: Record<string, number> = {};
    for (const c of picked) {
      const s = byCode.get(c)?.과목ID || "?";
      d[s] = (d[s] || 0) + 1;
    }
    return d;
  }, [picked, byCode]);

  function buildExam() {
    const questions = picked.map((c, i) => {
      const q = byCode.get(c) || {};
      return { 순번: i + 1, ...q };
    });
    return {
      id: `custom_${Date.now()}`,
      title,
      durationMinutes: duration,
      totalQuestions: picked.length,
      createdAt: new Date().toISOString(),
      questionCodes: picked,
      questions,
    };
  }

  function download() {
    const blob = new Blob([JSON.stringify(buildExam(), null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `exam_${title}_${picked.length}문항.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function saveLocal() {
    try {
      const key = "cbt_custom_exams";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push(buildExam());
      localStorage.setItem(key, JSON.stringify(prev));
      alert(`저장됨 (브라우저 localStorage '${key}'). 총 ${prev.length}개 시험.`);
    } catch (e) {
      alert("저장 실패: " + (e as Error).message);
    }
  }

  const inputCls =
    "rounded border border-zinc-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none";

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">CBT 관리자</p>
            <h1 className="text-2xl font-bold text-zinc-900">시험 생성</h1>
            <p className="mt-1 text-sm text-zinc-600">
              문항은행({ALL.length}문항)에서 필터·선택해 시험 세트를 만듭니다.
            </p>
          </div>
          <Link
            href="/admin/register"
            className="text-sm text-blue-600 hover:underline"
          >
            ← 문항 등록
          </Link>
        </div>

        {/* 시험 정보 */}
        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-zinc-700">시험 제목</span>
            <input
              className={`${inputCls} w-72`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-zinc-700">제한시간(분)</span>
            <input
              type="number"
              className={`${inputCls} w-24`}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </label>
          <div className="text-sm">
            <span className="mb-1 block font-medium text-zinc-700">선택 문항</span>
            <span className="text-lg font-bold text-blue-600">{picked.length}</span>
            <span className="ml-2 text-xs text-zinc-500">
              {Object.entries(dist)
                .map(([s, n]) => `${과목명[s] || s} ${n}`)
                .join(" · ")}
            </span>
          </div>
        </div>

        {/* 필터 */}
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 text-sm">
          <select className={inputCls} value={fSubject} onChange={(e) => setFSubject(e.target.value)}>
            <option value="">과목 전체</option>
            {Object.entries(과목명).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select className={inputCls} value={fYear} onChange={(e) => setFYear(e.target.value)}>
            <option value="">연도 전체</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className={inputCls} value={fRound} onChange={(e) => setFRound(e.target.value)}>
            <option value="">회차 전체</option>
            {rounds.map((r) => <option key={r} value={r}>{r}회</option>)}
          </select>
          <select className={inputCls} value={fType} onChange={(e) => setFType(e.target.value)}>
            <option value="">유형 전체</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className={inputCls} value={minFreq} onChange={(e) => setMinFreq(Number(e.target.value))}>
            <option value={0}>빈출도 전체</option>
            {[1, 2, 3].map((n) => <option key={n} value={n}>빈출도 ≥ {n}</option>)}
          </select>
          <select className={inputCls} value={minDiff} onChange={(e) => setMinDiff(Number(e.target.value))}>
            <option value={0}>난이도 전체</option>
            {[1, 2, 3].map((n) => <option key={n} value={n}>난이도 ≥ {n}</option>)}
          </select>
          <input
            className={`${inputCls} w-44`}
            placeholder="검색(발문/코드/챕터)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-zinc-500">결과 {filtered.length}</span>
          <button
            onClick={addFiltered}
            className="rounded bg-zinc-700 px-3 py-1 text-white hover:bg-zinc-800"
          >
            결과 전체 추가
          </button>
          <input
            type="number"
            className={`${inputCls} w-20`}
            value={randomN}
            onChange={(e) => setRandomN(Number(e.target.value))}
          />
          <button
            onClick={randomPick}
            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
          >
            랜덤 {randomN}문항 자동 구성
          </button>
          {picked.length > 0 && (
            <button
              onClick={() => setPicked([])}
              className="rounded border border-zinc-300 px-3 py-1 text-zinc-600 hover:bg-zinc-100"
            >
              선택 초기화
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 후보 목록 */}
          <div className="rounded-lg border border-zinc-200 bg-white">
            <div className="border-b px-3 py-2 text-sm font-semibold text-zinc-700">
              문항 후보 ({filtered.length})
            </div>
            <div className="max-h-[60vh] overflow-auto">
              {filtered.map((q) => {
                const code = q.문항코드 || "";
                const on = pickedSet.has(code);
                return (
                  <label
                    key={code}
                    className={`flex cursor-pointer items-start gap-2 border-b px-3 py-2 text-sm hover:bg-zinc-50 ${
                      on ? "bg-blue-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(code)}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-mono text-xs text-zinc-500">{code}</span>
                      <span className="ml-2 rounded bg-zinc-100 px-1 text-xs text-zinc-600">
                        {과목명[q.과목ID || ""] || q.과목ID}
                      </span>
                      <span className="ml-1 text-xs text-zinc-400">
                        빈{q.빈출도 ?? "-"}·난{q.난이도 ?? "-"}·{q.문제유형 || "-"}
                      </span>
                      <span className="block text-zinc-800">{plain(q.발문)}</span>
                    </span>
                  </label>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-zinc-400">
                  조건에 맞는 문항이 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* 선택된 시험 구성 */}
          <div className="rounded-lg border border-zinc-200 bg-white">
            <div className="flex items-center justify-between border-b px-3 py-2 text-sm font-semibold text-zinc-700">
              <span>시험 구성 ({picked.length})</span>
              <span className="flex gap-2">
                <button
                  onClick={saveLocal}
                  disabled={picked.length === 0}
                  className="rounded bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700 disabled:opacity-40"
                >
                  localStorage 저장
                </button>
                <button
                  onClick={download}
                  disabled={picked.length === 0}
                  className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-40"
                >
                  JSON 다운로드
                </button>
              </span>
            </div>
            <div className="max-h-[60vh] overflow-auto">
              {picked.map((code, i) => {
                const q = byCode.get(code);
                return (
                  <div
                    key={code}
                    className="flex items-start gap-2 border-b px-3 py-2 text-sm"
                  >
                    <span className="w-6 shrink-0 text-right font-mono text-xs text-zinc-400">
                      {i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="font-mono text-xs text-zinc-500">{code}</span>
                      <span className="block text-zinc-800">{plain(q?.발문, 50)}</span>
                    </span>
                    <span className="flex shrink-0 flex-col gap-0.5 text-xs">
                      <button onClick={() => move(i, -1)} className="text-zinc-400 hover:text-zinc-700">▲</button>
                      <button onClick={() => move(i, 1)} className="text-zinc-400 hover:text-zinc-700">▼</button>
                    </span>
                    <button
                      onClick={() => toggle(code)}
                      className="shrink-0 text-zinc-300 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
              {picked.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-zinc-400">
                  후보에서 문항을 선택하거나 “랜덤 자동 구성”을 누르세요.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          ※ 생성된 시험은 JSON으로 내보내거나 브라우저에 저장됩니다. 라이브 시험
          목록(/cbt/exams) 연동·DB 저장은 개발 작업 항목입니다.
        </p>
      </div>
    </div>
  );
}
