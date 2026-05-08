"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroSlide = {
  id: string;
  badge: string;
  badgeTone: "available" | "soon";
  title: string;
  highlight: string;
  description: string;
  bgClass: string;
  primary: { label: string; href?: string; onClick?: () => void };
  secondary?: { label: string; href?: string; onClick?: () => void };
  emoji: string;
  decoColor: string;
};

const ROTATE_MS = 5500;

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length),
    [slides.length],
  );
  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, ROTATE_MS);
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [paused, slides.length]);

  return (
    <section
      className="relative overflow-hidden border-b border-zinc-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide) => (
          <SlideCard key={slide.id} slide={slide} />
        ))}
      </div>

      {/* Side controls */}
      <button
        type="button"
        onClick={prev}
        aria-label="이전 슬라이드"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2.5 shadow-md backdrop-blur transition hover:bg-white sm:block"
      >
        <span className="block h-5 w-5 leading-none">‹</span>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="다음 슬라이드"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2.5 shadow-md backdrop-blur transition hover:bg-white sm:block"
      >
        <span className="block h-5 w-5 leading-none">›</span>
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${i + 1}번 슬라이드로 이동`}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Progress bar (subtle) */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/15">
        <div
          key={`${index}-${paused}`}
          className="h-full bg-white"
          style={{
            animation: paused
              ? "none"
              : `heroProgress ${ROTATE_MS}ms linear forwards`,
          }}
        />
      </div>
      <style jsx>{`
        @keyframes heroProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}

function SlideCard({ slide }: { slide: HeroSlide }) {
  return (
    <div
      className={`relative flex w-full flex-shrink-0 bg-gradient-to-br ${slide.bgClass}`}
    >
      {/* Decorative orbs */}
      <div
        className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: slide.decoColor }}
      />
      <div
        className="pointer-events-none absolute right-32 bottom-0 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: slide.decoColor }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 py-20 sm:py-24 lg:flex-row lg:items-center">
        <div className="flex-1 text-white">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
              slide.badgeTone === "available"
                ? "bg-emerald-400/90 text-emerald-950"
                : "bg-amber-300/90 text-amber-950"
            }`}
          >
            {slide.badge}
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {slide.title}
            <br />
            <span className="opacity-95">{slide.highlight}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
            {slide.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CtaButton tone="primary" cta={slide.primary} />
            {slide.secondary && (
              <CtaButton tone="secondary" cta={slide.secondary} />
            )}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="flex h-40 w-40 flex-shrink-0 items-center justify-center self-center rounded-3xl bg-white/15 text-7xl shadow-inner backdrop-blur-sm sm:h-56 sm:w-56 sm:text-8xl lg:h-64 lg:w-64"
        >
          {slide.emoji}
        </div>
      </div>
    </div>
  );
}

function CtaButton({
  tone,
  cta,
}: {
  tone: "primary" | "secondary";
  cta: HeroSlide["primary"];
}) {
  const className =
    tone === "primary"
      ? "rounded-md bg-white px-6 py-3 text-sm font-bold text-zinc-900 shadow-md transition hover:bg-zinc-100 sm:text-base"
      : "rounded-md border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:text-base";

  if (cta.href) {
    return (
      <Link href={cta.href} className={className}>
        {cta.label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={cta.onClick} className={className}>
      {cta.label}
    </button>
  );
}
