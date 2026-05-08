import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { simulators, SIMULATOR_SUBJECTS } from "@/lib/simulators";
import type { Subject } from "@/lib/cbt/types";

const SUBJECT_THEME: Record<
  Subject,
  { headerBg: string; chip: string; tag: string }
> = {
  전기이론: {
    headerBg: "from-blue-500/10 to-blue-500/0",
    chip: "bg-blue-50 text-blue-700",
    tag: "bg-blue-600",
  },
  전기기기: {
    headerBg: "from-violet-500/10 to-violet-500/0",
    chip: "bg-violet-50 text-violet-700",
    tag: "bg-violet-600",
  },
  전기설비: {
    headerBg: "from-emerald-500/10 to-emerald-500/0",
    chip: "bg-emerald-50 text-emerald-700",
    tag: "bg-emerald-600",
  },
};

export default function SimulatorIndexPage() {
  const availableCount = simulators.filter((s) => s.status === "available").length;
  const totalCount = simulators.length;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      {/* Hero */}
      <section className="border-b border-zinc-100 bg-gradient-to-br from-indigo-50 via-white to-rose-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold tracking-wide text-indigo-600">
            이론 시뮬레이터
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            글로 읽지 말고, <span className="text-indigo-600">손으로 만져보세요.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            전기력선, 자기력, 회로 응답까지 — 핵심 이론을 직접 조작하며
            체득하는 시뮬레이터 모음입니다. 변수를 바꾸면 결과가 즉시 보입니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              지금 이용 가능 {availableCount}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              준비 중 {totalCount - availableCount}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
              총 {totalCount}개
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {SIMULATOR_SUBJECTS.map((subject) => {
          const items = simulators.filter((s) => s.subject === subject);
          if (items.length === 0) return null;
          const theme = SUBJECT_THEME[subject];
          return (
            <section key={subject} className="mb-12">
              <div
                className={`mb-5 rounded-xl bg-gradient-to-r ${theme.headerBg} p-4`}
              >
                <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                  <span className={`h-2.5 w-2.5 rounded-full ${theme.tag}`} />
                  {subject}
                  <span className="text-sm font-normal text-zinc-500">
                    {items.length}개
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((sim) => {
                  const isAvailable = sim.status === "available";
                  return (
                    <article
                      key={sim.id}
                      className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-3xl leading-none">{sim.emoji}</div>
                        {isAvailable ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            이용 가능
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            준비중
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 text-base font-bold text-zinc-900">
                        {sim.title}
                      </h3>
                      <p
                        className={`mt-1 text-xs font-medium ${theme.chip} inline-block w-fit rounded-md px-2 py-0.5`}
                      >
                        {sim.topic}
                      </p>
                      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
                        {sim.description}
                      </p>
                      {isAvailable ? (
                        <Link
                          href={`/simulator/${sim.id}`}
                          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                          체험하기 →
                        </Link>
                      ) : (
                        <span className="mt-4 cursor-not-allowed rounded-md bg-zinc-100 px-4 py-2 text-center text-sm font-semibold text-zinc-400">
                          출시 예정
                        </span>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}
