"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "textbook-banner-dismissed-at";
// 배너 닫아도 24시간 후 다시 표시
const RESHOW_AFTER_MS = 24 * 60 * 60 * 1000;

export default function TextbookBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissedAt = Number(localStorage.getItem(STORAGE_KEY) ?? "0");
      const elapsed = Date.now() - dismissedAt;
      setVisible(!dismissedAt || elapsed > RESHOW_AFTER_MS);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-2.5">
        <div className="flex flex-1 items-center gap-3 text-xs sm:text-sm">
          <span className="hidden text-base sm:inline">📘</span>
          <span className="font-semibold">
            <span className="hidden sm:inline">합격을 책임지는 단 하나의 교재 — </span>
            <strong className="font-bold">독끝 전기기능사 필기</strong>
          </span>
          <span className="hidden text-white/85 lg:inline">
            · 빅데이터 기반 고적중 기출문제 정리
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-md bg-white/20 px-3 py-1 text-xs font-bold text-white/85 sm:text-sm"
            title="구매 페이지 준비중"
          >
            구매하러 가기 (준비중)
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="배너 닫기"
            className="rounded-md p-1 text-white/80 hover:bg-white/15 hover:text-white"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
}
