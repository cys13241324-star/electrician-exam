import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { getSimulator } from "@/lib/simulators";

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
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-100">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Link
              href="/simulator"
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              ← 목록
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">{sim.emoji}</span>
              <div>
                <h1 className="text-sm font-bold text-zinc-900">
                  {sim.title}
                </h1>
                <p className="text-[11px] text-zinc-500">
                  {sim.subject} · {sim.topic}
                </p>
              </div>
            </div>
          </div>
          <a
            href={sim.htmlPath}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-900"
          >
            새 창에서 열기 ↗
          </a>
        </div>
      </div>

      <iframe
        src={sim.htmlPath}
        title={sim.title}
        className="flex-1 w-full bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
