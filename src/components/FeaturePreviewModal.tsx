"use client";

import Link from "next/link";
import { useEffect } from "react";

export type PreviewType =
  | { kind: "iframe"; src: string }
  | { kind: "audio"; src: string }
  | { kind: "info" }
  | { kind: "rich-flashcards"; iframeSrc: string };

export type FeatureCta = { label: string; href: string };

export type FeaturePreview = {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  highlights: string[];
  status: "available" | "coming_soon";
  cta?: FeatureCta;
  extraCta?: FeatureCta;
  preview: PreviewType;
};

export default function FeaturePreviewModal({
  feature,
  onClose,
}: {
  feature: FeaturePreview;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const isComingSoon = feature.status === "coming_soon";
  const isRichFlashcards = feature.preview.kind === "rich-flashcards";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isRichFlashcards ? (
          <FlashcardsHeader
            feature={feature}
            isComingSoon={isComingSoon}
            onClose={onClose}
          />
        ) : (
          <DefaultHeader
            feature={feature}
            isComingSoon={isComingSoon}
            onClose={onClose}
          />
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isRichFlashcards ? (
            <FlashcardsBody
              iframeSrc={
                (feature.preview as { kind: "rich-flashcards"; iframeSrc: string })
                  .iframeSrc
              }
              highlights={feature.highlights}
            />
          ) : (
            <DefaultBody feature={feature} isComingSoon={isComingSoon} />
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-end gap-2 border-t border-zinc-200 bg-zinc-50 px-6 py-3">
          {feature.extraCta && (
            <Link
              href={feature.extraCta.href}
              className="mr-auto rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              {feature.extraCta.label}
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            닫기
          </button>
          {feature.cta &&
            (isComingSoon ? (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-md bg-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-500"
              >
                {feature.cta.label} (준비중)
              </button>
            ) : (
              <Link
                href={feature.cta.href}
                className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                {feature.cta.label} →
              </Link>
            ))}
        </footer>
      </div>
    </div>
  );
}

function StatusBadge({ isComingSoon }: { isComingSoon: boolean }) {
  if (isComingSoon)
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold tracking-wide text-amber-800">
        Coming Soon
      </span>
    );
  return (
    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold tracking-wide text-emerald-800">
      이용 가능
    </span>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="닫기"
      className="flex-shrink-0 rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
    >
      ✕
    </button>
  );
}

function DefaultHeader({
  feature,
  isComingSoon,
  onClose,
}: {
  feature: FeaturePreview;
  isComingSoon: boolean;
  onClose: () => void;
}) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-4">
      <div className="flex items-start gap-3">
        <div className="text-3xl leading-none">{feature.emoji}</div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-900">{feature.title}</h2>
            <StatusBadge isComingSoon={isComingSoon} />
          </div>
          <p className="mt-1 text-sm text-zinc-600">{feature.tagline}</p>
        </div>
      </div>
      <CloseButton onClose={onClose} />
    </header>
  );
}

function DefaultBody({
  feature,
  isComingSoon,
}: {
  feature: FeaturePreview;
  isComingSoon: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-zinc-200 bg-zinc-50 p-6 lg:border-b-0 lg:border-r">
        <p className="text-sm leading-6 text-zinc-700">{feature.description}</p>
        <ul className="mt-4 space-y-2">
          {feature.highlights.map((h, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-zinc-700"
            >
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {isComingSoon && (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <strong className="font-semibold">출시 준비 중입니다.</strong>
            <br />
            실제 샘플 콘텐츠를 미리보기로 제공하니 둘러보세요.
          </div>
        )}
      </aside>

      <div className="bg-white">
        <div className="border-b border-zinc-200 px-6 py-3">
          <p className="text-xs font-semibold tracking-wider text-zinc-500">
            샘플 미리보기
          </p>
        </div>
        <div className="p-4 sm:p-6">
          <PreviewBody preview={feature.preview} title={feature.title} />
        </div>
      </div>
    </div>
  );
}

function PreviewBody({
  preview,
  title,
}: {
  preview: PreviewType;
  title: string;
}) {
  if (preview.kind === "iframe") {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <iframe
          src={preview.src}
          title={`${title} 샘플`}
          className="h-[60vh] w-full"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    );
  }
  if (preview.kind === "audio") {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
        <p className="mb-3 text-sm text-zinc-700">
          이론 정리 오디오북 샘플 트랙을 들어보세요.
        </p>
        <audio controls src={preview.src} className="w-full">
          오디오를 재생할 수 없습니다.
        </audio>
        <p className="mt-3 text-xs text-zinc-500">
          출퇴근길, 운동하면서, 자기 전 — 귀로 듣는 전기기능사 이론.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center text-sm text-zinc-500">
      샘플이 곧 공개됩니다.
    </div>
  );
}

function FlashcardsHeader({
  feature,
  isComingSoon,
  onClose,
}: {
  feature: FeaturePreview;
  isComingSoon: boolean;
  onClose: () => void;
}) {
  return (
    <header className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 px-6 py-7 text-white">
      <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute right-20 top-12 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl shadow-inner">
            🃏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight">
                {feature.title}
              </h2>
              <StatusBadge isComingSoon={isComingSoon} />
            </div>
            <p className="mt-1 text-sm text-white/85">{feature.tagline}</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black leading-none">300+</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                Core Cards
              </span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white">
                과목별 100장 × 3
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex-shrink-0 rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>
    </header>
  );
}

const FLASHCARD_CATEGORIES: {
  name: string;
  count: number;
  emoji: string;
  bg: string;
}[] = [
  { name: "전기이론", count: 100, emoji: "⚡", bg: "from-blue-500 to-indigo-500" },
  { name: "전기기기", count: 100, emoji: "⚙️", bg: "from-violet-500 to-purple-500" },
  { name: "전기설비", count: 100, emoji: "🔌", bg: "from-amber-500 to-orange-500" },
];

function FlashcardsBody({
  iframeSrc,
  highlights,
}: {
  iframeSrc: string;
  highlights: string[];
}) {
  return (
    <div className="bg-white">
      {/* Stack illustration + categories */}
      <div className="border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white px-6 py-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[260px_1fr]">
          <div className="relative mx-auto h-44 w-56">
            {/* Layered card stack */}
            {[
              {
                rotate: "-rotate-6",
                bg: "from-amber-400 to-orange-500",
                z: "z-0",
                offset: "translate-x-3 translate-y-2",
              },
              {
                rotate: "rotate-3",
                bg: "from-violet-500 to-purple-500",
                z: "z-10",
                offset: "-translate-x-2 -translate-y-1",
              },
              {
                rotate: "-rotate-2",
                bg: "from-blue-500 to-indigo-600",
                z: "z-20",
                offset: "translate-x-0 translate-y-0",
              },
            ].map((c, i) => (
              <div
                key={i}
                className={`absolute inset-0 ${c.z} ${c.rotate} ${c.offset} transition`}
              >
                <div
                  className={`flex h-full w-full flex-col justify-between rounded-2xl bg-gradient-to-br ${c.bg} p-4 text-white shadow-lg`}
                >
                  <div className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                    Card {i + 1}
                  </div>
                  <div className="text-lg font-bold">
                    {i === 2 ? "옴의 법칙" : i === 1 ? "권수비" : "접지"}
                  </div>
                  <div className="text-[11px] opacity-90">탭해서 뒤집기 →</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {FLASHCARD_CATEGORIES.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.bg} text-xl text-white shadow-sm`}
                  >
                    {c.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{c.name}</p>
                    <p className="text-[11px] text-zinc-500">
                      {c.count}장의 핵심 키워드
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                  {c.count}장
                </span>
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {highlights.map((h, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-lg bg-white/80 p-3 text-sm text-zinc-700 shadow-sm"
            >
              <span className="mt-0.5 text-violet-600">✦</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Live sample iframe */}
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wider text-zinc-500">
            라이브 샘플 — 직접 카드를 뒤집어 보세요
          </p>
          <a
            href={iframeSrc}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-violet-600 hover:text-violet-800"
          >
            새 창에서 열기 ↗
          </a>
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-inner">
          <iframe
            src={iframeSrc}
            title="플립 암기카드 샘플"
            className="h-[55vh] w-full"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
