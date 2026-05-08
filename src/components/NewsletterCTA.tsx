"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const PERKS = [
  { emoji: "📘", text: "교재 출시 시 가장 먼저 알림" },
  { emoji: "🎁", text: "사전 예약자 한정 무료 자료팩" },
  { emoji: "🎬", text: "기출 해설강의 우선 시청권" },
];

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }
    // mock 성공 처리
    setError("");
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-bold tracking-wide text-amber-950">
                ⏰ 출시 알림
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                출시 소식을
                <br />
                <span className="text-amber-300">가장 먼저</span> 받아보세요.
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/90 sm:text-base">
                교재 발매·해설강의 오픈·플립카드 출시 등 새 콘텐츠가 준비되는 즉시
                알려드립니다. 광고는 보내지 않아요.
              </p>

              <ul className="mt-6 space-y-2.5">
                {PERKS.map((p, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-base">
                      {p.emoji}
                    </span>
                    <span>{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                {submitted ? (
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/20 text-3xl">
                      ✅
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">
                      신청 완료!
                    </h3>
                    <p className="mt-2 text-sm text-white/85">
                      <strong className="text-amber-300">{email}</strong>
                      <br />
                      위 주소로 출시 소식이 도착할 예정입니다.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setEmail("");
                      }}
                      className="mt-5 text-xs text-white/70 underline hover:text-white"
                    >
                      다른 이메일로 다시 신청
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit}>
                    <label
                      htmlFor="newsletter-email"
                      className="block text-xs font-semibold text-white/85"
                    >
                      이메일 주소
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="example@email.com"
                      className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/40"
                    />
                    {error && (
                      <p className="mt-2 text-xs font-medium text-amber-200">
                        ⚠ {error}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="mt-3 w-full rounded-md bg-amber-400 px-4 py-2.5 text-sm font-bold text-amber-950 shadow-md transition hover:bg-amber-300"
                    >
                      알림 신청하기 →
                    </button>
                    <p className="mt-3 text-[11px] leading-5 text-white/65">
                      ※ 입력하신 이메일은 출시 알림 외에는 사용되지 않으며, 언제든
                      구독 해제 가능합니다.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
