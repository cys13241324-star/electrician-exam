"use client";

import { useEffect, useState } from "react";

type Extra = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  emoji: string;
  bg: string;
  iframeSrc: string;
  description: string;
};

const extras: Extra[] = [
  {
    id: "kakao",
    type: "단톡방 시리즈",
    title: "옴의 법칙과 전력",
    subtitle: "직급별 단톡방으로 보는 전기이론",
    emoji: "💬",
    bg: "from-yellow-300 via-amber-300 to-orange-300",
    iframeSrc: "/extras/kakao-ohms-power.html",
    description:
      "신입사원부터 부장님까지, 카톡방에서 풀어지는 옴의 법칙과 전력 이야기. 회사원의 일상에 녹아든 전기 개념을 만나보세요.",
  },
  {
    id: "newspaper",
    type: "전기 일보",
    title: "환형자계 / 키르히호프 / 급구",
    subtitle: "신문 형식으로 풀어보는 시험 단골 토픽",
    emoji: "📰",
    bg: "from-zinc-200 via-zinc-300 to-zinc-400",
    iframeSrc: "/extras/newspaper-electric-news.html",
    description:
      "신문 1면 헤드라인처럼 풀어낸 전기기능사 핵심 이론. 시험에 자주 나오는 개념을 흥미로운 기사 스타일로 정리했습니다.",
  },
];

export default function ElectricExtras() {
  const [active, setActive] = useState<Extra | null>(null);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 py-20">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold tracking-wide text-rose-700">
            ⏸ 잠깐!
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            이것만 있는 게 아닙니다.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            교재·CBT·플립카드 외에도 <strong className="text-rose-600">재미있게 학습할 수 있는 콘텐츠</strong>를 계속 만들고 있습니다.
            <br className="hidden sm:block" />
            전기 이론, 이렇게 친근할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {extras.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => setActive(ex)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:shadow-xl"
            >
              <div
                className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${ex.bg}`}
              >
                <div className="text-7xl drop-shadow-md transition group-hover:scale-110">
                  {ex.emoji}
                </div>
                <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-zinc-800 backdrop-blur">
                  {ex.type}
                </div>
                <div className="absolute right-4 top-4 rounded-full bg-amber-500/95 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white">
                  무료 콘텐츠
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-zinc-900">{ex.title}</h3>
                <p className="mt-1 text-xs font-semibold text-zinc-500">
                  {ex.subtitle}
                </p>
                <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
                  {ex.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rose-600 group-hover:text-rose-800">
                  지금 읽어보기 →
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center">
          <p className="text-sm font-semibold text-zinc-800">
            🎁 매주 새로운 콘셉트 콘텐츠가 추가됩니다.
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            카톡방 / 신문 / 일기 / 만화 / 짧은 드라마 등 다양한 형식으로 전기 이론을 만나보세요.
          </p>
        </div>
      </div>

      {active && (
        <ExtraModal extra={active} onClose={() => setActive(null)} />
      )}
    </section>
  );
}

function ExtraModal({
  extra,
  onClose,
}: {
  extra: Extra;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{extra.emoji}</span>
            <div>
              <p className="text-xs font-semibold text-zinc-500">{extra.type}</p>
              <h2 className="text-base font-bold text-zinc-900">{extra.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={extra.iframeSrc}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-900"
            >
              새 창에서 열기 ↗
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            >
              ✕
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-hidden bg-zinc-100">
          <iframe
            src={extra.iframeSrc}
            title={extra.title}
            className="h-[75vh] w-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
