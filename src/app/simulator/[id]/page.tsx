import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BackgroundPattern from "@/components/BackgroundPattern";
import { MathText } from "@/components/Math";
import { getSimulator, simulators } from "@/lib/simulators";

export async function generateStaticParams() {
  return simulators.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sim = getSimulator(id);
  if (!sim) return { title: "시뮬레이터" };
  return {
    title: `${sim.title} 시뮬레이터`,
    description: sim.description,
  };
}

export default async function SimulatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sim = getSimulator(id);
  if (!sim) notFound();
  if (sim.status !== "available" || !sim.htmlPath) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Header />
        <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
          <p className="text-4xl">⏳</p>
          <h1 className="mt-4 text-xl font-bold text-zinc-900">
            아직 준비 중입니다
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            {sim.title} 시뮬레이터는 곧 만나보실 수 있습니다.
          </p>
          <Link
            href="/simulator"
            className="mt-6 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            시뮬레이터 목록으로
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // 같은 과목의 다른 시뮬 추천
  const related = simulators
    .filter((s) => s.id !== sim.id && s.subject === sim.subject && s.status === "available")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      {/* 인트로 헤더 */}
      <section className="relative overflow-hidden border-b border-zinc-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <BackgroundPattern variant="circuit" color="#4f46e5" opacity={0.05} />
        <div className="relative mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-8">
          <div className="flex items-start gap-4">
            <Link
              href="/simulator"
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              ← 목록
            </Link>
            <div className="flex items-start gap-3">
              <span className="text-4xl leading-none">{sim.emoji}</span>
              <div>
                <p className="text-xs font-semibold tracking-wide text-indigo-600">
                  {sim.subject} · {sim.topic}
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
                  {sim.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                  {sim.description}
                </p>
              </div>
            </div>
          </div>
          <a
            href={sim.htmlPath}
            target="_blank"
            rel="noreferrer"
            className="hidden flex-shrink-0 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 sm:block"
          >
            새 창 ↗
          </a>
        </div>
      </section>

      {/* 시뮬레이터 iframe */}
      <section className="bg-zinc-100">
        <div className="mx-auto max-w-7xl">
          <iframe
            src={sim.htmlPath}
            title={sim.title}
            className="h-[80vh] w-full bg-white shadow-md"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        {/* 핵심 공식 */}
        {sim.formula && sim.formula.length > 0 && (
          <Reveal>
            <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-black tracking-wider text-white">
                  📐 핵심 공식
                </span>
                <h2 className="text-base font-bold text-zinc-900 sm:text-lg">
                  꼭 외워야 하는 공식
                </h2>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {sim.formula.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-zinc-200 bg-white p-5"
                  >
                    <p className="text-xs font-semibold tracking-wide text-blue-700">
                      {f.name}
                    </p>
                    <div className="mt-3 rounded-lg border-2 border-blue-200 bg-blue-50 px-4 py-3 text-base text-blue-900 sm:text-lg">
                      <MathText>{f.expression}</MathText>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-zinc-600">
                      <MathText>{f.meaning}</MathText>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* 핵심 예제 */}
        {sim.example && (
          <Reveal type="fade-up">
            <section className="mt-8 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
              <header className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-6 py-3">
                <span className="rounded-md bg-amber-500 px-2.5 py-1 text-[11px] font-black tracking-wider text-white">
                  ✏️ 핵심 예제
                </span>
                <h2 className="text-base font-bold text-zinc-900 sm:text-lg">
                  실제 시험에 나오는 풀이
                </h2>
              </header>

              <div className="px-6 py-6 sm:px-8 sm:py-8">
                {/* 문제 */}
                <div className="rounded-xl bg-zinc-50 p-5">
                  <p className="text-[11px] font-bold tracking-widest text-zinc-500">
                    문제
                  </p>
                  <p className="mt-2 text-sm leading-7 text-zinc-900 sm:text-base">
                    <MathText>{sim.example.question}</MathText>
                  </p>
                </div>

                {/* 주어진 값 */}
                <div className="mt-5">
                  <p className="text-[11px] font-bold tracking-widest text-zinc-500">
                    주어진 값
                  </p>
                  <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {sim.example.given.map((g, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs text-zinc-800 ring-1 ring-zinc-200"
                      >
                        <span className="text-zinc-400">▸</span>
                        <MathText>{g}</MathText>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 풀이 */}
                <div className="mt-5">
                  <p className="text-[11px] font-bold tracking-widest text-zinc-500">
                    풀이 과정
                  </p>
                  <ol className="mt-2 space-y-2">
                    {sim.example.solution.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-md border border-zinc-200 bg-white px-4 py-2.5"
                      >
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="text-sm leading-8 text-zinc-900 sm:text-base">
                          <MathText>{step}</MathText>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* 정답 */}
                <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 px-5 py-4">
                  <span className="rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-black tracking-wider text-white">
                    정답
                  </span>
                  <p className="text-base font-bold leading-8 text-emerald-900 sm:text-lg">
                    <MathText>{sim.example.answer}</MathText>
                  </p>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* 관련 시뮬 */}
        {related.length > 0 && (
          <Reveal type="fade-up">
            <section className="mt-12">
              <h2 className="text-lg font-bold text-zinc-900">
                같은 과목의 다른 시뮬레이터
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/simulator/${r.id}`}
                    className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="text-3xl">{r.emoji}</span>
                    <h3 className="mt-3 text-sm font-bold text-zinc-900 group-hover:text-indigo-700">
                      {r.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-zinc-500">{r.topic}</p>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </main>

      <Footer />
    </div>
  );
}
