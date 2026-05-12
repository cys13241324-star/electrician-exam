import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "이론 시뮬레이터",
  description:
    "전기력선·자기력·RLC 공진·회전 자계까지, 인터랙티브 시뮬레이터로 핵심 원리를 직접 체험합니다.",
};

import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BackgroundPattern from "@/components/BackgroundPattern";
import SimulatorList from "@/components/SimulatorList";
import { simulators, SIMULATOR_SUBJECTS } from "@/lib/simulators";

export default function SimulatorIndexPage() {
  const availableCount = simulators.filter((s) => s.status === "available").length;
  const withContentCount = simulators.filter(
    (s) => s.status === "coming_soon" && (s.formula || s.example)
  ).length;
  const totalCount = simulators.length;
  const placeholderCount = totalCount - availableCount - withContentCount;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-100 bg-gradient-to-br from-indigo-50 via-white to-rose-50">
        <BackgroundPattern variant="circuit" color="#4f46e5" opacity={0.07} />
        <BackgroundPattern variant="mesh-violet" />
        <div className="relative mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <p className="text-sm font-semibold tracking-wide text-indigo-600">
            이론 시뮬레이터
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            글로 읽지 말고, <span className="text-indigo-600">손으로 만져보세요.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
            전기력선, 자기력, 회로 응답까지 — 핵심 이론을 직접 조작하며
            체득하는 시뮬레이터 모음입니다. 변수를 바꾸면 결과가 즉시 보입니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              지금 이용 가능 {availableCount}
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
              공식·예제 {withContentCount}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              준비 중 {placeholderCount}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
              총 {totalCount}개
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <SimulatorList simulators={simulators} subjects={SIMULATOR_SUBJECTS} />

        {/* 학습 팁 */}
        <Reveal type="fade-up">
          <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8">
            <h2 className="text-lg font-bold text-zinc-900">
              🎯 시뮬레이터를 200% 활용하는 법
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-blue-50 p-5">
                <div className="text-2xl">🔄</div>
                <h3 className="mt-3 text-sm font-bold text-blue-900">
                  변수를 끝까지 밀어보세요
                </h3>
                <p className="mt-2 text-xs leading-5 text-blue-800">
                  슬라이더를 양 극단까지 움직이면 식의 한계와 의미가 보입니다. 0이
                  되는 지점, 발산하는 지점이 시험 함정 포인트입니다.
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-5">
                <div className="text-2xl">📐</div>
                <h3 className="mt-3 text-sm font-bold text-emerald-900">
                  공식과 그림을 연결하세요
                </h3>
                <p className="mt-2 text-xs leading-5 text-emerald-800">
                  공식 \(F = BIL\)을 외우는 대신 평행도선 시뮬에서 전류를 줄이면
                  힘이 줄어드는 것을 직접 확인하세요. 시각이 기억을 만듭니다.
                </p>
              </div>
              <div className="rounded-xl bg-rose-50 p-5">
                <div className="text-2xl">📝</div>
                <h3 className="mt-3 text-sm font-bold text-rose-900">
                  시뮬 → 기출 문제로 연결
                </h3>
                <p className="mt-2 text-xs leading-5 text-rose-800">
                  각 시뮬을 본 직후 같은 토픽의 CBT 문제를 풀어보세요. 시뮬에서 본
                  현상이 문제 보기에 그대로 녹아 있습니다.
                </p>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
