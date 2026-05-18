"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import HtmlBlock from "@/components/HtmlContent";

/**
 * 일괄 등록 페이지 — v3 양식 xlsx 업로드 → 여러 문항 한 번에 검수·등록.
 *
 * 흐름:
 *   1) 엑셀 드롭/선택 → /api/bulk-parse 호출
 *   2) 파싱 결과 표로 표시 (문항코드, 발문, 정답, 강의주소, 그림 마커, 상태)
 *   3) 행 클릭 → 우측 미리보기 (등록 페이지와 동일 렌더링)
 *   4) [전체 등록] (백엔드 미정 — 현재는 JSON 다운로드)
 */

type Block = { type: "text" | "image"; value: string };

type Question = {
  문항코드?: string;
  과목ID?: string;
  과정?: string;
  연도?: string | number;
  회차?: string | number;
  강의주소?: string;
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
  [k: string]: unknown;
};

// HtmlBlock → 공용 컴포넌트(@/components/HtmlContent): HTML + KaTeX($…$/$$…$$) 렌더

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

function BlockPreview({ blocks, label }: { blocks: Block[]; label: string }) {
  return (
    <>
      {blocks.map((b, i) =>
        b.type === "text" ? (
          <HtmlBlock key={i} html={b.value} className="text-sm text-slate-800" />
        ) : (
          <ImgPlaceholder key={i} value={b.value} label={label} />
        )
      )}
    </>
  );
}

export default function BatchRegisterPage() {
  const [items, setItems] = useState<Question[]>([]);
  const [summary, setSummary] = useState<{
    count: number;
    withVideo: number;
    withImageMarker: number;
  } | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    setFilename(file.name);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/bulk-parse", { method: "POST", body: fd });
      const data = (await res.json()) as
        | { ok: true; items: Question[]; summary: typeof summary }
        | { ok: false; error: string };
      if (!data.ok) throw new Error(data.error);
      setItems(data.items);
      setSummary(data.summary);
      setSelected(0);
    } catch (e) {
      setError(String((e as Error).message || e));
    } finally {
      setUploading(false);
    }
  };

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    upload(files[0]);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch_${filename.replace(/\.xlsx$/, "")}_${items.length}items.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cur = items[selected];
  const correct = String(cur?.["정답(1~4)"] || "");

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              일괄 등록 — 엑셀 업로드
            </h1>
            <p className="text-xs text-slate-500">
              v3 양식 .xlsx → 여러 문항 한 번에 검수 · 강의주소 포함 그대로 임포트
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/register"
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              ← 단일 등록
            </Link>
            {items.length > 0 && (
              <>
                <button
                  onClick={downloadJson}
                  className="rounded border border-pink-300 bg-white px-3 py-1.5 text-sm font-medium text-pink-700 hover:bg-pink-50"
                >
                  JSON 다운로드
                </button>
                <button
                  onClick={() => alert("백엔드 미정 — JSON 다운로드 후 임포터 연결 예정")}
                  className="rounded bg-pink-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-pink-700"
                >
                  전체 등록 ({items.length})
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-6 py-6">
        {/* === 업로드 영역 === */}
        {items.length === 0 && (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              onFiles(e.dataTransfer.files);
            }}
            className={`cursor-pointer rounded-2xl border-4 border-dashed p-16 text-center transition-colors ${
              isDragOver
                ? "border-pink-500 bg-pink-50"
                : "border-slate-300 bg-white hover:border-pink-400 hover:bg-pink-50"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => {
                onFiles(e.target.files);
                if (fileRef.current) fileRef.current.value = "";
              }}
            />
            {uploading ? (
              <div className="text-lg text-pink-700">
                ⏳ 분석 중… ({filename})
              </div>
            ) : (
              <>
                <div className="mb-3 text-5xl">📥</div>
                <div className="text-xl font-bold text-slate-700">
                  v3 양식 엑셀 파일을 드롭하거나 클릭
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  .xlsx · 시트 "문항등록" 필요 · 1행 그룹헤더 / 2행 컬럼헤더 / 3행~ 데이터
                </div>
                <div className="mt-4 inline-block rounded bg-pink-100 px-3 py-1 text-xs text-pink-700">
                  💡 샘플:{" "}
                  <a
                    href="/api/sample-batch"
                    className="underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    sample_batch_5문항.xlsx
                  </a>
                </div>
              </>
            )}
            {error && (
              <div className="mt-4 rounded bg-red-50 px-4 py-2 text-sm text-red-700">
                ⚠ {error}
              </div>
            )}
          </div>
        )}

        {/* === 파일 갱신 트리거 (결과 있을 때) === */}
        {items.length > 0 && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
            <span className="text-2xl">📄</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">{filename}</div>
              {summary && (
                <div className="flex gap-3 text-xs text-slate-500">
                  <span>총 {summary.count}문항</span>
                  <span className="text-violet-700">
                    🎬 강의주소 {summary.withVideo}건
                  </span>
                  <span className="text-amber-700">
                    ⚠ 그림 마커 {summary.withImageMarker}건
                  </span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              다른 파일
            </button>
          </div>
        )}

        {/* === 결과 영역: 좌측 표 / 우측 미리보기 === */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
            {/* 좌측: 문항 리스트 표 */}
            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
                <h2 className="text-sm font-bold text-slate-700">
                  파싱 결과 — {items.length}개 문항
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-2 py-2 text-left">#</th>
                      <th className="px-2 py-2 text-left">문항코드</th>
                      <th className="px-2 py-2 text-left">과목</th>
                      <th className="px-2 py-2 text-left">발문 (요약)</th>
                      <th className="px-2 py-2 text-center">정답</th>
                      <th className="px-2 py-2 text-center">🎬</th>
                      <th className="px-2 py-2 text-center">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => {
                      const hasVideo = !!String(it.강의주소 || "").trim();
                      const hasMarker = [
                        it.발문그림,
                        it.보기1그림,
                        it.보기2그림,
                        it.보기3그림,
                        it.보기4그림,
                      ].some((v) => String(v || "").startsWith("[필요"));
                      return (
                        <tr
                          key={i}
                          onClick={() => setSelected(i)}
                          className={`cursor-pointer border-t border-slate-100 hover:bg-pink-50 ${
                            selected === i ? "bg-pink-100" : ""
                          }`}
                        >
                          <td className="px-2 py-2 text-slate-400">{i + 1}</td>
                          <td className="px-2 py-2 font-mono text-indigo-700">
                            {it.문항코드}
                          </td>
                          <td className="px-2 py-2">
                            <span className="rounded-full bg-pink-100 px-2 py-0.5 text-pink-700">
                              {it.과목ID}
                            </span>
                          </td>
                          <td className="max-w-[20em] truncate px-2 py-2">
                            {String(it.발문 || "").replace(/<[^>]+>/g, "")}
                          </td>
                          <td className="px-2 py-2 text-center font-bold text-teal-700">
                            {it["정답(1~4)"]}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {hasVideo ? "✓" : "—"}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {hasMarker ? (
                              <span className="text-amber-600" title="그림 마커">
                                ⚠
                              </span>
                            ) : (
                              <span className="text-emerald-600">✓</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 우측: 선택한 문항 미리보기 */}
            <aside className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                미리보기 — #{selected + 1}
              </div>
              {cur && (
                <div className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                    {cur.문항코드 && (
                      <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700">
                        {cur.문항코드}
                      </span>
                    )}
                    {(cur.연도 || cur.회차) && (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {cur.연도}년 {cur.회차}회
                      </span>
                    )}
                    {cur.과목ID && (
                      <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-bold text-pink-700">
                        {cur.과목ID}
                      </span>
                    )}
                    {cur.문제유형 && (
                      <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-700">
                        {cur.문제유형}
                      </span>
                    )}
                  </div>

                  {cur.강의주소 && (
                    <a
                      href={String(cur.강의주소)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                    >
                      🎬 이 문제 강의 보기
                    </a>
                  )}

                  <HtmlBlock
                    html={String(cur.발문 || "")}
                    className="text-[15px] font-medium text-slate-900"
                  />
                  <ImgPlaceholder value={String(cur.발문그림 || "")} label="발문그림" />

                  <ol className="space-y-2">
                    {[1, 2, 3, 4].map((n) => {
                      const text = String(cur[`보기${n}` as keyof Question] || "");
                      const img = String(cur[`보기${n}그림` as keyof Question] || "");
                      const isCorrect = correct === String(n);
                      return (
                        <li
                          key={n}
                          className={`flex items-start gap-2 rounded-lg border-2 p-2 ${
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
                          <div className="flex-1">
                            <HtmlBlock html={text} className="text-sm text-slate-800" />
                            <ImgPlaceholder value={img} label={`보기${n}그림`} />
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  {cur.해설블록 && cur.해설블록.length > 0 && (
                    <section className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-3">
                      <div className="mb-1 text-xs font-bold text-orange-700">해설</div>
                      <BlockPreview blocks={cur.해설블록} label="해설그림" />
                    </section>
                  )}

                  {cur.오답분석 && (
                    <section className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-3">
                      <div className="mb-1 text-xs font-bold text-purple-700">
                        오답분석
                      </div>
                      <HtmlBlock html={String(cur.오답분석)} className="text-sm" />
                    </section>
                  )}

                  {cur.학습포인트블록 && cur.학습포인트블록.length > 0 && (
                    <section className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-3">
                      <div className="mb-1 text-xs font-bold text-emerald-700">
                        독끝 학습 POINT
                      </div>
                      <BlockPreview
                        blocks={cur.학습포인트블록}
                        label="학습포인트그림"
                      />
                    </section>
                  )}
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
