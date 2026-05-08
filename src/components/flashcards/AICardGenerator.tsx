"use client";

import { useState } from "react";
import { MathText } from "@/components/Math";
import { addUserCards, type UserCardInput } from "@/lib/flashcards/userCards";
import { checkAndIncrement, getRemaining } from "@/lib/ai/rateLimit";

type GeneratedCard = {
  front: string;
  back: string;
  topic: string;
  subject: "전기이론" | "전기기기" | "전기설비";
  difficulty: "easy" | "medium" | "hard";
  memorizingTip?: string;
};

type GenResponse = {
  cards: GeneratedCard[];
};

const SAMPLE_TEXT = `옴의 법칙은 전압(V)과 전류(I), 저항(R)의 관계를 나타내는 식으로, V = I × R이다.
변압기는 1차 코일과 2차 코일의 권수비에 따라 전압을 변환한다. 권수비 a = N1/N2 = V1/V2 이며,
이상변압기에서는 1차측 입력전력과 2차측 출력전력이 같다.`;

export default function AICardGenerator({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedCard[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  if (!open) return null;

  async function handleGenerate() {
    setError(null);
    if (text.trim().length < 30) {
      setError("최소 30자 이상의 텍스트를 입력해주세요");
      return;
    }
    const check = checkAndIncrement();
    if (!check.ok) {
      setError("오늘 AI 호출 한도(50회)를 모두 사용했어요");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceText: text }),
      });
      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: "응답 파싱 실패" }));
        throw new Error(err.error || "생성 실패");
      }
      const data = (await res.json()) as GenResponse;
      setResult(data.cards);
      setSelected(new Set(data.cards.map((_, i) => i)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!result) return;
    const picked = result.filter((_, i) => selected.has(i));
    if (picked.length === 0) {
      setError("최소 1장 이상 선택해주세요");
      return;
    }
    const inputs: UserCardInput[] = picked.map((c) => ({
      front: c.front,
      back: c.back,
      subject: c.subject,
      topic: c.topic,
      memorizingTip: c.memorizingTip,
    }));
    addUserCards(inputs);
    onSaved();
    handleClose();
  }

  function handleClose() {
    setText("");
    setResult(null);
    setSelected(new Set());
    setError(null);
    onClose();
  }

  function toggle(i: number) {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelected(next);
  }

  const remaining = getRemaining();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/60 px-4 py-8 backdrop-blur-sm sm:items-center">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "calc(100vh - 4rem)" }}>
        {/* 헤더 */}
        <header className="flex items-center justify-between border-b border-zinc-100 bg-gradient-to-br from-violet-600 to-pink-500 px-5 py-4 text-white">
          <div>
            <p className="text-xs font-semibold tracking-wide text-violet-100">
              ✨ AI · Gemini 2.5 Flash
            </p>
            <h2 className="text-lg font-bold">AI로 카드 만들기</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="닫기"
            className="rounded-lg bg-white/20 px-2.5 py-1 text-sm hover:bg-white/30"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-zinc-50 px-5 py-5">
          {!result ? (
            // 입력 단계
            <div className="space-y-4">
              <div className="rounded-xl border border-violet-100 bg-white p-4 shadow-sm">
                <p className="text-sm leading-6 text-zinc-700">
                  교재 한 페이지, 강의 요약, 학습 노트 등을 붙여넣으세요. AI가
                  핵심을 뽑아 <strong>3~7장의 카드</strong>로 만들어드립니다.
                </p>
                <p className="mt-1.5 text-xs text-zinc-500">
                  최대 6,000자 · 한국어/영어 모두 가능 · 수식은 LaTeX로 자동 변환
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700">
                    원본 텍스트
                  </label>
                  <button
                    type="button"
                    onClick={() => setText(SAMPLE_TEXT)}
                    className="text-xs text-violet-600 hover:underline"
                  >
                    예시 텍스트 채우기
                  </button>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="여기에 텍스트를 붙여넣어주세요…"
                  rows={10}
                  maxLength={6000}
                  className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm leading-6 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
                <p className="mt-1.5 text-right text-[11px] text-zinc-500">
                  {text.length} / 6,000자 · 오늘 {remaining}회 남음
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  ⚠ {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || text.trim().length < 30}
                className="w-full rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    생성 중...
                  </span>
                ) : (
                  "✨ 카드 생성하기"
                )}
              </button>
            </div>
          ) : (
            // 결과 미리보기 단계
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-zinc-900">
                  {result.length}장 생성됨 · {selected.size}장 선택
                </p>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-xs text-zinc-600 hover:underline"
                >
                  ← 다시 생성
                </button>
              </div>

              {result.map((card, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  className={`block w-full rounded-xl border-2 p-4 text-left transition ${
                    selected.has(i)
                      ? "border-violet-400 bg-violet-50 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                        selected.has(i)
                          ? "bg-violet-600 text-white"
                          : "border border-zinc-300 bg-white text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                          {card.subject}
                        </span>
                        <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                          {card.topic}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            card.difficulty === "easy"
                              ? "bg-emerald-100 text-emerald-700"
                              : card.difficulty === "hard"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {card.difficulty === "easy"
                            ? "쉬움"
                            : card.difficulty === "hard"
                              ? "어려움"
                              : "보통"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold leading-6 text-zinc-900">
                        Q. <MathText>{card.front}</MathText>
                      </p>
                      <p className="mt-1.5 text-xs leading-6 text-zinc-700">
                        A. <MathText>{card.back}</MathText>
                      </p>
                      {card.memorizingTip && (
                        <p className="mt-1.5 rounded-md bg-amber-50 px-2 py-1 text-[11px] text-amber-800">
                          💡 {card.memorizingTip}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  ⚠ {error}
                </div>
              )}
            </div>
          )}
        </div>

        {result && (
          <footer className="border-t border-zinc-100 bg-white px-5 py-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={selected.size === 0}
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-40"
            >
              선택한 {selected.size}장 저장
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
