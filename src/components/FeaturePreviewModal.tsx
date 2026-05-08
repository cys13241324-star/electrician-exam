"use client";

import Link from "next/link";
import { useEffect } from "react";

export type PreviewType =
  | { kind: "iframe"; src: string }
  | { kind: "audio"; src: string }
  | { kind: "info" };

export type FeaturePreview = {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  highlights: string[];
  status: "available" | "coming_soon";
  cta?: { label: string; href: string };
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl leading-none">{feature.emoji}</div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900">
                  {feature.title}
                </h2>
                {isComingSoon ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold tracking-wide text-amber-800">
                    Coming Soon
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold tracking-wide text-emerald-800">
                    이용 가능
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-600">{feature.tagline}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex-shrink-0 rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr]">
            {/* Description column */}
            <aside className="border-b border-zinc-200 bg-zinc-50 p-6 lg:border-b-0 lg:border-r">
              <p className="text-sm leading-6 text-zinc-700">
                {feature.description}
              </p>
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

            {/* Preview column */}
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
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-end gap-2 border-t border-zinc-200 bg-zinc-50 px-6 py-3">
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
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
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
