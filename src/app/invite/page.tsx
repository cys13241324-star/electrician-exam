"use client";

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BackgroundPattern from "@/components/BackgroundPattern";
import { useState } from "react";

const PERKS = [
  {
    emoji: "🎁",
    title: "양쪽 모두 무료 자료팩",
    description: "친구 가입 시, 두 분 모두에게 합격 체크리스트 + 출제 분석 자료 제공",
  },
  {
    emoji: "🃏",
    title: "플립카드 50장 추가",
    description: "초대 1명당 즐겨찾기 카드 슬롯 50장 추가 부여",
  },
  {
    emoji: "🎬",
    title: "해설강의 우선 시청권",
    description: "출시 시 가장 먼저 시청 가능. 친구가 가입하면 1주씩 더",
  },
];

export default function InvitePage() {
  const [code] = useState("ADDTO-EE-2026");
  const [copied, setCopied] = useState(false);
  const [link] = useState(
    typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${code}`
      : `https://electrician-exam.vercel.app/?ref=${code}`,
  );

  function copy(text: string) {
    if (typeof navigator === "undefined") return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        /* ignore */
      });
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <section className="relative overflow-hidden border-b border-zinc-100 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 text-white">
        <BackgroundPattern variant="grid" color="#ffffff" opacity={0.07} />
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950">
            🎁 친구 초대
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            함께 합격하면 더 빨라집니다
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:mx-auto sm:text-base">
            친구를 초대하면 양쪽 모두에게 학습 부스터를 드립니다. 합격은
            혼자보다 함께가 더 즐겁습니다.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* 코드 / 링크 */}
        <Reveal>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-bold text-zinc-900">내 초대 코드</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <div className="rounded-lg border border-dashed border-rose-300 bg-rose-50 px-4 py-3">
                <p className="text-[11px] font-semibold text-rose-700">
                  CODE
                </p>
                <p className="mt-1 font-mono text-2xl font-black text-zinc-900">
                  {code}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copy(code)}
                className="rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-700"
              >
                {copied ? "✓ 복사됨" : "코드 복사"}
              </button>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold text-zinc-500">초대 링크</p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  readOnly
                  value={link}
                  className="flex-1 rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => copy(link)}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  {copied ? "✓ 복사" : "복사"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-md bg-yellow-300/70 py-2 text-xs font-bold text-yellow-900"
              >
                💬 카카오 (준비중)
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-md bg-green-300/70 py-2 text-xs font-bold text-green-900"
              >
                💚 네이버 밴드 (준비중)
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-md bg-zinc-200 py-2 text-xs font-bold text-zinc-500"
              >
                ✉ 이메일 (준비중)
              </button>
            </div>
          </div>
        </Reveal>

        {/* 혜택 */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} type="fade-up" delay={i * 100}>
              <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="text-3xl">{p.emoji}</div>
                <h3 className="mt-3 text-base font-bold text-zinc-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-zinc-600">
                  {p.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 안내 */}
        <Reveal type="fade-up">
          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            <strong className="text-amber-700">⚠️ 안내</strong> · 현재 친구
            초대 시스템은 베타 단계로, 실제 적립은 회원가입 시스템 출시 시점부터
            반영됩니다. 코드는 미리 받아두실 수 있습니다.
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
