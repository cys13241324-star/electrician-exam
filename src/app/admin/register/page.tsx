"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ImageUploadField } from "./ImageUploadField";
import HtmlBlock from "@/components/HtmlContent";

/**
 * 문항 등록 빈 페이지
 *
 * v2 양식 + 통합템플릿 메타데이터를 합친 입력 폼.
 * 번호 컬럼은 제거 — 시험 페이지가 "문항코드" 순으로 정렬.
 *
 * 해설·학습포인트는 [텍스트 / 그림] 블록 시퀀스로 자유 배치.
 *   (해설 → 그림 → 해설 → 그림 같은 교차 구조 지원)
 */

type Block = { id: string; type: "text" | "image"; value: string };

type Question = {
  // ===== 메타 — 출처 =====
  과정: string;
  연도: string;
  회차: string;
  사용교재: string;
  교재구분: string;
  // ===== 메타 — 코드 =====
  문항코드: string;
  // ===== 메타 — 강의 =====
  강의주소: string;
  // ===== 메타 — 분류 =====
  과목ID: "theory" | "machinery" | "facility" | "";
  챕터: string;
  대유형: string;
  중유형: string;
  내용: string;
  // ===== 메타 — 속성 =====
  빈출도: number; // 1~5
  난이도: number; // 1~5
  문제유형: string;
  변형이력: string;
  비고: string;
  // ===== 콘텐츠 (v2) =====
  발문: string;
  조건: string;
  발문그림: string;
  보기1: string;
  보기1그림: string;
  보기2: string;
  보기2그림: string;
  보기3: string;
  보기3그림: string;
  보기4: string;
  보기4그림: string;
  "정답(1~4)": "1" | "2" | "3" | "4" | "";
  해설블록: Block[];
  오답분석: string;
  학습포인트블록: Block[];
};

let _idSeq = 0;
const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `b${Date.now()}_${++_idSeq}`;

const newTextBlock = (): Block => ({ id: makeId(), type: "text", value: "" });
const newImageBlock = (): Block => ({ id: makeId(), type: "image", value: "" });

const EMPTY: Question = {
  과정: "전기기능사",
  연도: "",
  회차: "",
  사용교재: "독끝 전기기능사 필기",
  교재구분: "A",
  문항코드: "",
  강의주소: "",
  과목ID: "",
  챕터: "",
  대유형: "",
  중유형: "",
  내용: "",
  빈출도: 0,
  난이도: 0,
  문제유형: "",
  변형이력: "",
  비고: "",
  발문: "",
  조건: "",
  발문그림: "",
  보기1: "",
  보기1그림: "",
  보기2: "",
  보기2그림: "",
  보기3: "",
  보기3그림: "",
  보기4: "",
  보기4그림: "",
  "정답(1~4)": "",
  해설블록: [newTextBlock()],
  오답분석: "",
  학습포인트블록: [],
};

const 문제유형옵션 = [
  "단답형",
  "계산형",
  "도식형",
  "조합형",
  "빈칸형",
  "완성형",
];

const C = {
  meta: "border-slate-500 bg-slate-50",
  code: "border-indigo-500 bg-indigo-50",
  video: "border-violet-500 bg-violet-50",
  classify: "border-cyan-500 bg-cyan-50",
  attr: "border-rose-500 bg-rose-50",
  stem: "border-pink-500 bg-pink-50",
  img: "border-amber-500 bg-amber-50",
  opt: "border-blue-500 bg-blue-50",
  ans: "border-teal-500 bg-teal-50",
  exp: "border-orange-500 bg-orange-50",
  wr: "border-purple-500 bg-purple-50",
  lp: "border-emerald-500 bg-emerald-50",
};

const LABEL_TONE: Record<string, string> = {
  meta: "text-slate-700",
  code: "text-indigo-700",
  video: "text-violet-700",
  classify: "text-cyan-700",
  attr: "text-rose-700",
  stem: "text-pink-700",
  img: "text-amber-700",
  opt: "text-blue-700",
  ans: "text-teal-700",
  exp: "text-orange-700",
  wr: "text-purple-700",
  lp: "text-emerald-700",
};

function Field({
  label,
  tone,
  hint,
  required,
  children,
}: {
  label: string;
  tone: keyof typeof C;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border-l-4 p-3 ${C[tone]}`}>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <label className={`text-sm font-semibold ${LABEL_TONE[tone]}`}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-pink-500"
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
  mono = true,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-pink-500 ${
        mono ? "font-mono" : ""
      }`}
    />
  );
}

function StarRating({
  value,
  onChange,
  color,
}: {
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? 0 : n)}
          className="text-xl leading-none transition-transform hover:scale-110"
          aria-label={`${n}점`}
          style={{ color: n <= value ? color : "#cbd5e1" }}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-slate-500">
        {value > 0 ? `${value} / 5` : "—"}
      </span>
    </div>
  );
}

/** 텍스트/그림 블록 시퀀스 에디터 */
function BlockSequenceEditor({
  blocks,
  onChange,
  accentBorder,
  accentText,
  textPlaceholder,
  imagePlaceholder,
  questionCode,
  slotPrefix,
}: {
  blocks: Block[];
  onChange: (next: Block[]) => void;
  accentBorder: string;
  accentText: string;
  textPlaceholder?: string;
  imagePlaceholder?: string;
  questionCode?: string;
  slotPrefix?: string;
}) {
  const update = (idx: number, value: string) => {
    const next = blocks.slice();
    next[idx] = { ...next[idx], value };
    onChange(next);
  };
  const remove = (idx: number) => {
    onChange(blocks.filter((_, i) => i !== idx));
  };
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = blocks.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };
  const addAt = (idx: number, type: "text" | "image") => {
    const b = type === "text" ? newTextBlock() : newImageBlock();
    onChange([...blocks.slice(0, idx + 1), b, ...blocks.slice(idx + 1)]);
  };

  return (
    <div className="space-y-2">
      {blocks.length === 0 && (
        <div className="rounded border-2 border-dashed border-slate-200 bg-white p-4 text-center text-xs text-slate-400">
          블록이 없습니다. 아래 버튼으로 추가하세요.
        </div>
      )}

      {blocks.map((b, idx) => (
        <div key={b.id} className={`rounded-lg border bg-white ${accentBorder}`}>
          <div className="flex items-center justify-between border-b border-slate-100 px-2 py-1">
            <div className="flex items-center gap-2">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  b.type === "text"
                    ? "bg-slate-100 text-slate-600"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {b.type === "text" ? "T 텍스트" : "🖼 그림"}
              </span>
              <span className="text-[10px] text-slate-400">#{idx + 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                aria-label="위로 이동"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(idx, 1)}
                disabled={idx === blocks.length - 1}
                className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                aria-label="아래로 이동"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="rounded px-1.5 py-0.5 text-xs text-red-500 hover:bg-red-50"
                aria-label="삭제"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-2">
            {b.type === "text" ? (
              <TextArea
                value={b.value}
                onChange={(v) => update(idx, v)}
                rows={3}
                placeholder={textPlaceholder ?? "본문 (HTML 허용)"}
              />
            ) : (
              <ImageUploadField
                value={b.value}
                onChange={(v) => update(idx, v)}
                questionCode={questionCode}
                slot={`${slotPrefix ?? "block"}_${idx + 1}`}
                placeholder={imagePlaceholder ?? "그림 파일 선택"}
              />
            )}
          </div>
          {/* 블록 사이에 끼워넣기 */}
          <div className="flex justify-center gap-2 border-t border-dashed border-slate-200 py-1">
            <button
              type="button"
              onClick={() => addAt(idx, "text")}
              className={`text-[11px] font-medium hover:underline ${accentText}`}
            >
              + 아래에 텍스트
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={() => addAt(idx, "image")}
              className="text-[11px] font-medium text-amber-700 hover:underline"
            >
              + 아래에 그림
            </button>
          </div>
        </div>
      ))}

      {/* 최하단 추가 버튼 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange([...blocks, newTextBlock()])}
          className={`flex-1 rounded border-2 border-dashed py-2 text-sm font-medium hover:bg-white ${accentBorder} ${accentText}`}
        >
          + 텍스트 블록 추가
        </button>
        <button
          type="button"
          onClick={() => onChange([...blocks, newImageBlock()])}
          className="flex-1 rounded border-2 border-dashed border-amber-400 py-2 text-sm font-medium text-amber-700 hover:bg-white"
        >
          + 그림 블록 추가
        </button>
      </div>
    </div>
  );
}

// HtmlBlock → 공용 컴포넌트(@/components/HtmlContent): HTML + KaTeX($…$/$$…$$) 렌더

function ImgPlaceholder({ value, label }: { value: string; label: string }) {
  if (!value?.trim()) return null;
  const needsManual = value.startsWith("[필요");
  if (!needsManual) {
    // 실제 업로드된 파일 — 미리보기 표시
    return (
      <figure className="my-2 rounded border border-slate-200 bg-white p-2">
        <img
          src={`/questions/${value}`}
          alt={label}
          className="mx-auto max-h-64 rounded"
          onError={(e) => {
            // 파일이 아직 없으면 라벨만
            const img = e.currentTarget as HTMLImageElement;
            img.style.display = "none";
            img.nextElementSibling?.classList.remove("hidden");
          }}
        />
        <figcaption className="hidden text-center text-xs text-slate-500">
          <span className="font-mono">{value}</span> (파일 없음)
        </figcaption>
      </figure>
    );
  }
  return (
    <div className="my-2 rounded border-2 border-dashed border-amber-400 bg-amber-50 p-3 text-center text-sm text-amber-700">
      <div className="text-xs font-semibold uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-1 font-mono text-xs">{value}</div>
    </div>
  );
}

/** 블록 시퀀스 미리보기 — 텍스트는 HTML로, 그림은 ImgPlaceholder로 */
function BlockSequencePreview({
  blocks,
  imageLabel,
}: {
  blocks: Block[];
  imageLabel: string;
}) {
  return (
    <>
      {blocks.map((b) =>
        b.type === "text" ? (
          <HtmlBlock
            key={b.id}
            html={b.value}
            className="text-sm text-slate-800"
          />
        ) : (
          <ImgPlaceholder key={b.id} value={b.value} label={imageLabel} />
        )
      )}
    </>
  );
}

export default function RegisterPage() {
  const [q, setQ] = useState<Question>(EMPTY);
  const [codeSeq, setCodeSeq] = useState<string>("");

  const update = <K extends keyof Question>(k: K, v: Question[K]) =>
    setQ((prev) => ({ ...prev, [k]: v }));

  const reset = () => {
    if (confirm("입력한 내용을 모두 지울까요?")) {
      setQ({ ...EMPTY, 해설블록: [newTextBlock()], 학습포인트블록: [] });
      setCodeSeq("");
    }
  };

  const generateCode = () => {
    const parts = [
      q.과정 === "전기기능사" ? "elec" : "",
      q.교재구분,
      q.연도,
      q.회차.padStart(2, "0"),
      codeSeq.padStart(2, "0"),
    ].filter(Boolean);
    if (parts.length < 4) {
      alert(
        "과정·교재구분·연도·회차·일련번호를 모두 채워야 코드가 만들어집니다."
      );
      return;
    }
    update("문항코드", parts.join("_"));
  };

  const json = useMemo(() => JSON.stringify(q, null, 2), [q]);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(json);
      alert("JSON 복사 완료");
    } catch {
      alert("복사 실패 — 텍스트 영역을 직접 선택하세요");
    }
  };

  const downloadJson = () => {
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${q.문항코드 || "new"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const correct = q["정답(1~4)"];
  const hasExplain = q.해설블록.some((b) => b.value.trim());
  const hasLP = q.학습포인트블록.some((b) => b.value.trim());

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              문항 등록 — 빈 페이지
            </h1>
            <p className="text-xs text-slate-500">
              문항코드 기준 정렬 · 해설·학습 POINT는 블록 시퀀스로 자유 배치
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              초기화
            </button>
            <button
              onClick={copyJson}
              className="rounded bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              JSON 복사
            </button>
            <button
              onClick={downloadJson}
              className="rounded bg-pink-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-pink-700"
            >
              JSON 다운로드
            </button>
            <Link
              href="/"
              className="ml-2 text-sm text-slate-500 hover:text-slate-700"
            >
              홈
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1fr_1fr]">
        {/* ============== 좌측: 입력 폼 ============== */}
        <section className="space-y-6">
          {/* === 출처 === */}
          <fieldset className="rounded-lg border border-slate-200 bg-white p-4">
            <legend className="px-2 text-sm font-bold text-slate-700">
              📌 출처 정보
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-5">
              <Field label="과정" tone="meta" required>
                <select
                  value={q.과정}
                  onChange={(e) => update("과정", e.target.value)}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm"
                >
                  <option value="전기기능사">전기기능사</option>
                  <option value="전기산업기사">전기산업기사</option>
                  <option value="전기기사">전기기사</option>
                </select>
              </Field>
              <Field label="연도" tone="meta" hint="4자리" required>
                <TextInput
                  value={q.연도}
                  onChange={(v) => update("연도", v)}
                  placeholder="2022"
                />
              </Field>
              <Field label="회차" tone="meta" hint="1~4" required>
                <TextInput
                  value={q.회차}
                  onChange={(v) => update("회차", v)}
                  placeholder="1"
                />
              </Field>
              <Field label="교재구분" tone="meta" hint="A / B / …">
                <TextInput
                  value={q.교재구분}
                  onChange={(v) => update("교재구분", v)}
                  placeholder="A"
                />
              </Field>
              <Field label="사용교재" tone="meta">
                <TextInput
                  value={q.사용교재}
                  onChange={(v) => update("사용교재", v)}
                  placeholder="독끝 전기기능사 필기"
                />
              </Field>
            </div>
          </fieldset>

          {/* === 코드 === */}
          <fieldset className="rounded-lg border border-indigo-200 bg-white p-4">
            <legend className="px-2 text-sm font-bold text-indigo-700">
              🔖 문항코드 (정렬 키)
            </legend>
            <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
              <Field
                label="문항코드"
                tone="code"
                hint="시험 페이지가 이 코드 순으로 정렬"
                required
              >
                <TextInput
                  value={q.문항코드}
                  onChange={(v) => update("문항코드", v)}
                  placeholder="elec_A_2022_01_01"
                />
              </Field>
              <Field label="일련번호" tone="code" hint="회차 내 1~60">
                <TextInput
                  value={codeSeq}
                  onChange={setCodeSeq}
                  placeholder="01"
                />
              </Field>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={generateCode}
                  className="h-9 rounded bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  코드 자동 생성
                </button>
              </div>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              규칙:{" "}
              <code className="font-mono">
                elec_&lt;교재&gt;_&lt;연도&gt;_&lt;회차&gt;_&lt;일련번호&gt;
              </code>
            </p>
          </fieldset>

          {/* === 강의 === */}
          <fieldset className="rounded-lg border border-violet-200 bg-white p-4">
            <legend className="px-2 text-sm font-bold text-violet-700">
              🎬 강의주소
            </legend>
            <div className="mt-2">
              <Field
                label="강의주소"
                tone="video"
                hint="시험 문제 풀이 화면 상단 강의 버튼이 연결할 URL (YouTube 등)"
              >
                <TextInput
                  value={q.강의주소}
                  onChange={(v) => update("강의주소", v)}
                  placeholder="https://youtu.be/..."
                />
              </Field>
              {q.강의주소 && (
                <a
                  href={q.강의주소}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 rounded bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
                >
                  🎬 강의 열기 (새 탭)
                </a>
              )}
            </div>
          </fieldset>

          {/* === 분류 === */}
          <fieldset className="rounded-lg border border-cyan-200 bg-white p-4">
            <legend className="px-2 text-sm font-bold text-cyan-700">
              🗂 분류 체계 (세로축)
            </legend>
            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="과목ID" tone="classify" required>
                  <select
                    value={q.과목ID}
                    onChange={(e) =>
                      update("과목ID", e.target.value as Question["과목ID"])
                    }
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm"
                  >
                    <option value="">— 선택 —</option>
                    <option value="theory">theory · 전기이론</option>
                    <option value="machinery">machinery · 전기기기</option>
                    <option value="facility">facility · 전기설비</option>
                  </select>
                </Field>
                <Field label="챕터" tone="classify" hint="예: 직류 회로">
                  <TextInput
                    value={q.챕터}
                    onChange={(v) => update("챕터", v)}
                    placeholder="정자계"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="대유형"
                  tone="classify"
                  hint="예: 자성체와 자기회로"
                >
                  <TextInput
                    value={q.대유형}
                    onChange={(v) => update("대유형", v)}
                    placeholder="자성체와 자기회로"
                  />
                </Field>
                <Field
                  label="중유형"
                  tone="classify"
                  hint="예: 투자율과 자성체의 분류"
                >
                  <TextInput
                    value={q.중유형}
                    onChange={(v) => update("중유형", v)}
                    placeholder="투자율과 자성체의 분류"
                  />
                </Field>
              </div>
              <Field label="내용" tone="classify" hint="가장 좁은 분류 (소유형)">
                <TextInput
                  value={q.내용}
                  onChange={(v) => update("내용", v)}
                  placeholder="자성체의 분류 (강·상·반자성)"
                />
              </Field>
            </div>
          </fieldset>

          {/* === 속성 === */}
          <fieldset className="rounded-lg border border-rose-200 bg-white p-4">
            <legend className="px-2 text-sm font-bold text-rose-700">
              🏷 문항 속성 (가로축)
            </legend>
            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="빈출도" tone="attr" hint="자주 나오는 정도">
                  <StarRating
                    value={q.빈출도}
                    onChange={(v) => update("빈출도", v)}
                    color="#e11d48"
                  />
                </Field>
                <Field label="난이도" tone="attr" hint="어려움 정도">
                  <StarRating
                    value={q.난이도}
                    onChange={(v) => update("난이도", v)}
                    color="#9333ea"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="문제유형" tone="attr">
                  <select
                    value={q.문제유형}
                    onChange={(e) => update("문제유형", e.target.value)}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm"
                  >
                    <option value="">— 선택 —</option>
                    {문제유형옵션.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="변형이력" tone="attr" hint="원본 0, 변형 1, 2, …">
                  <TextInput
                    value={q.변형이력}
                    onChange={(v) => update("변형이력", v)}
                    placeholder="0"
                  />
                </Field>
              </div>
              <Field label="비고" tone="attr" hint="자유 입력 (운영자 메모)">
                <TextArea
                  value={q.비고}
                  onChange={(v) => update("비고", v)}
                  rows={2}
                  mono={false}
                  placeholder="예: 변형문제, 출제오류 정정, 그림 보강 필요 등"
                />
              </Field>
            </div>
          </fieldset>

          {/* === 콘텐츠 === */}
          <fieldset className="rounded-lg border border-pink-200 bg-white p-4">
            <legend className="px-2 text-sm font-bold text-pink-700">
              ✍️ 콘텐츠
            </legend>
            <div className="mt-2 space-y-3">
              <Field
                label="발문"
                tone="stem"
                hint="HTML 허용: <i> <sub> <sup> <strong> <br>"
                required
              >
                <TextArea
                  value={q.발문}
                  onChange={(v) => update("발문", v)}
                  rows={3}
                  placeholder="콘덴서의 정전용량에 대한 설명으로 틀린 것은?"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="조건" tone="stem" hint="없으면 비움">
                  <TextInput
                    value={q.조건}
                    onChange={(v) => update("조건", v)}
                    placeholder="P = 100[Ω], Q = 10[Ω]"
                  />
                </Field>
                <Field
                  label="발문그림"
                  tone="img"
                  hint="파일 업로드 또는 [필요: …] 마커"
                >
                  <ImageUploadField
                    value={q.발문그림}
                    onChange={(v) => update("발문그림", v)}
                    questionCode={q.문항코드}
                    slot="stem"
                    placeholder="발문 그림 업로드"
                  />
                </Field>
              </div>

              {[1, 2, 3, 4].map((n) => {
                const key = `보기${n}` as keyof Question;
                const imgKey = `보기${n}그림` as keyof Question;
                return (
                  <div key={n} className="grid grid-cols-[1fr_auto] gap-3">
                    <Field
                      label={`보기 ${["①", "②", "③", "④"][n - 1]}`}
                      tone="opt"
                      hint="HTML 허용"
                      required={n === 1}
                    >
                      <TextArea
                        value={q[key] as string}
                        onChange={(v) => update(key, v as never)}
                        rows={1}
                        placeholder={`보기 ${n}`}
                      />
                    </Field>
                    <Field label={`그림 ${n}`} tone="img" hint="(선택)">
                      <ImageUploadField
                        value={q[imgKey] as string}
                        onChange={(v) => update(imgKey, v as never)}
                        questionCode={q.문항코드}
                        slot={`opt${n}`}
                        placeholder={`보기 ${n} 그림`}
                      />
                    </Field>
                  </div>
                );
              })}

              <Field label="정답 (1~4)" tone="ans" required>
                <div className="flex gap-2">
                  {(["1", "2", "3", "4"] as const).map((n) => (
                    <label
                      key={n}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded border-2 px-3 py-2 text-sm font-bold transition-colors ${
                        q["정답(1~4)"] === n
                          ? "border-teal-600 bg-teal-100 text-teal-800"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={n}
                        checked={q["정답(1~4)"] === n}
                        onChange={() =>
                          update("정답(1~4)", n as Question["정답(1~4)"])
                        }
                        className="sr-only"
                      />
                      {["①", "②", "③", "④"][parseInt(n) - 1]} {n}
                    </label>
                  ))}
                </div>
              </Field>

              {/* 해설 — 블록 시퀀스 */}
              <div className={`rounded-lg border-l-4 p-3 ${C.exp}`}>
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <label
                    className={`text-sm font-semibold ${LABEL_TONE.exp}`}
                  >
                    해설 <span className="ml-1 text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    텍스트 + 그림 블록을 자유롭게 배치 · HTML 허용 ·{" "}
                    <code className="font-mono">&lt;table&gt;</code> 가능
                  </span>
                </div>
                <BlockSequenceEditor
                  blocks={q.해설블록}
                  onChange={(next) => update("해설블록", next)}
                  accentBorder="border-orange-300"
                  accentText="text-orange-700"
                  textPlaceholder="해설 본문 (HTML 허용)"
                  imagePlaceholder="해설 그림 업로드"
                  questionCode={q.문항코드}
                  slotPrefix="explain"
                />
              </div>

              {/* 오답분석 (단일) */}
              <Field
                label="오답분석"
                tone="wr"
                hint="HTML 허용 · <ol><li>...</li></ol> 권장"
              >
                <TextArea
                  value={q.오답분석}
                  onChange={(v) => update("오답분석", v)}
                  rows={4}
                  placeholder={`<ol>
  <li><i>C</i> = <i>Q</i>/<i>V</i> 관계에 의해 전압에 반비례한다.</li>
</ol>`}
                />
              </Field>

              {/* 학습포인트 — 블록 시퀀스 */}
              <div className={`rounded-lg border-l-4 p-3 ${C.lp}`}>
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <label className={`text-sm font-semibold ${LABEL_TONE.lp}`}>
                    학습 POINT
                  </label>
                  <span className="text-[11px] text-slate-500">
                    텍스트 + 그림 자유 배치 · HTML 허용 ·{" "}
                    <code className="font-mono">&lt;table&gt;</code> 가능
                  </span>
                </div>
                <BlockSequenceEditor
                  blocks={q.학습포인트블록}
                  onChange={(next) => update("학습포인트블록", next)}
                  accentBorder="border-emerald-300"
                  accentText="text-emerald-700"
                  textPlaceholder="학습 POINT 본문 (HTML, <table> 가능)"
                  imagePlaceholder="학습포인트 그림 업로드"
                  questionCode={q.문항코드}
                  slotPrefix="lp"
                />
              </div>
            </div>
          </fieldset>
        </section>

        {/* ============== 우측: 미리보기 ============== */}
        <aside className="space-y-3 lg:sticky lg:top-[88px] lg:self-start">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-700">
                  실시간 미리보기
                </h2>
                <span className="text-xs text-slate-500">CBT 문항 렌더링</span>
              </div>
            </div>
            <div className="space-y-4 p-5">
              {/* 메타 배지 */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                {q.문항코드 && (
                  <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700">
                    {q.문항코드}
                  </span>
                )}
                {(q.연도 || q.회차) && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {q.연도}년 {q.회차}회
                  </span>
                )}
                {q.과목ID && (
                  <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-bold text-pink-700">
                    {q.과목ID}
                  </span>
                )}
                {q.문제유형 && (
                  <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-700">
                    {q.문제유형}
                  </span>
                )}
                {q.빈출도 > 0 && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">
                    빈출 {"★".repeat(q.빈출도)}
                  </span>
                )}
                {q.난이도 > 0 && (
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                    난이도 {"★".repeat(q.난이도)}
                  </span>
                )}
              </div>

              {(q.챕터 || q.대유형 || q.중유형 || q.내용) && (
                <div className="text-xs text-slate-500">
                  {[q.챕터, q.대유형, q.중유형, q.내용]
                    .filter(Boolean)
                    .join(" › ")}
                </div>
              )}

              {/* 강의 버튼 — 시험 페이지 상단에 들어갈 형태 시뮬레이션 */}
              {q.강의주소 && (
                <a
                  href={q.강의주소}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                >
                  🎬 이 문제 강의 보기
                </a>
              )}

              <div>
                <HtmlBlock
                  html={
                    q.발문 ||
                    "<em class='text-slate-400'>발문을 입력하세요</em>"
                  }
                  className="text-[15px] font-medium text-slate-900"
                />
                {q.조건 && (
                  <div className="mt-2 rounded bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <span className="text-xs font-bold text-slate-500">
                      조건 —{" "}
                    </span>
                    <HtmlBlock html={q.조건} className="inline" />
                  </div>
                )}
                <ImgPlaceholder value={q.발문그림} label="발문그림" />
              </div>

              <ol className="space-y-2">
                {[1, 2, 3, 4].map((n) => {
                  const text = q[`보기${n}` as keyof Question] as string;
                  const img = q[`보기${n}그림` as keyof Question] as string;
                  const isCorrect = correct === String(n);
                  return (
                    <li
                      key={n}
                      className={`flex items-start gap-2 rounded-lg border-2 p-3 transition-colors ${
                        isCorrect
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isCorrect
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {["①", "②", "③", "④"][n - 1]}
                      </span>
                      <div className="flex-1">
                        <HtmlBlock
                          html={
                            text ||
                            `<span class='text-slate-300'>보기 ${n}</span>`
                          }
                          className="text-sm text-slate-800"
                        />
                        <ImgPlaceholder value={img} label={`보기${n}그림`} />
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* 해설 — 블록 시퀀스 렌더링 */}
              {hasExplain && (
                <section className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-3">
                  <div className="mb-1 text-xs font-bold text-orange-700">
                    해설
                  </div>
                  <BlockSequencePreview
                    blocks={q.해설블록}
                    imageLabel="해설그림"
                  />
                </section>
              )}

              {q.오답분석 && (
                <section className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-3">
                  <div className="mb-1 text-xs font-bold text-purple-700">
                    오답분석
                  </div>
                  <HtmlBlock
                    html={q.오답분석}
                    className="text-sm text-slate-800"
                  />
                </section>
              )}

              {/* 학습 POINT — 블록 시퀀스 렌더링 */}
              {hasLP && (
                <section className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-3">
                  <div className="mb-1 text-xs font-bold text-emerald-700">
                    독끝 학습 POINT
                  </div>
                  <BlockSequencePreview
                    blocks={q.학습포인트블록}
                    imageLabel="학습포인트그림"
                  />
                </section>
              )}

              {q.비고 && (
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  📝 {q.비고}
                </div>
              )}
            </div>
          </div>

          <details className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <summary className="cursor-pointer border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
              JSON 출력 (펼치기)
            </summary>
            <pre className="max-h-96 overflow-auto p-4 font-mono text-xs text-slate-700">
              {json}
            </pre>
          </details>
        </aside>
      </div>
    </main>
  );
}
