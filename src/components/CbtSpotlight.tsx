import Link from "next/link";

type Feature = {
  emoji: string;
  title: string;
  caption: string;
  description: string;
};

const features: Feature[] = [
  {
    emoji: "🪟",
    title: "가로·세로 유형별 문제풀이",
    caption: "1단 / 2단 / 1문제 모드",
    description:
      "본인의 학습 스타일에 맞춰 화면 배치를 자유롭게 전환. 한 화면에 한 문제만 크게 보거나, 두 문제를 나란히 비교하며 풀 수 있습니다.",
  },
  {
    emoji: "📝",
    title: "상세한 해설",
    caption: "전 문항 풀이 가이드",
    description:
      "단순 정답 표기가 아닌, 왜 이 답인지 단계별로 설명. 오답 보기까지 분석해 시험 함정을 잡아냅니다.",
  },
  {
    emoji: "🎬",
    title: "모든 문항 강의 제공",
    caption: "영상으로 한 번 더",
    description:
      "글로 부족한 부분은 영상으로. 모든 기출 문항에 영상 해설이 연결되어 있어 어려운 문제도 끝까지 함께합니다.",
  },
];

export default function CbtSpotlight() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-black tracking-wide text-amber-950 shadow-lg shadow-amber-500/30">
            ⚡ 잠깐!
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-amber-300">교재 구매자</span>에게는,
            <br className="sm:hidden" />
            <span className="ml-1 sm:ml-2">
              독끝 CBT 모의고사만의
            </span>
            <br />
            <span className="text-white">
              강력한 기능을{" "}
              <span className="relative inline-block">
                <span className="relative z-10">무료</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-amber-400/60"
                />
              </span>
              로 제공합니다.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            『독끝 전기기능사 필기』 교재 한 권을 사면, 단순한 책이 끝이 아닙니다.
            <br className="hidden sm:block" />
            아래 세 가지 강력한 기능이 추가 비용 없이 함께 따라옵니다.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
            >
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-blue-400/10 blur-2xl transition group-hover:bg-amber-400/20" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="text-4xl leading-none">{f.emoji}</span>
                  <span className="rounded-full border border-white/20 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-blue-100">
                    {f.caption}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-blue-100/90">
                  {f.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-1 text-xs font-bold tracking-wide text-amber-300">
                  <span>✓ 무료 제공</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:flex-row sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold text-amber-300">
              📘 독끝 전기기능사 필기
            </p>
            <p className="mt-1 text-base font-bold text-white sm:text-lg">
              교재 한 권으로 CBT 모의고사 + 해설강의까지, 한 번에.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/cbt/exams"
              className="rounded-md bg-white px-5 py-2.5 text-sm font-bold text-blue-900 shadow-md transition hover:bg-amber-100"
            >
              CBT 무료 응시 →
            </Link>
            <span
              className="cursor-not-allowed rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/70"
              title="구매 페이지 준비중"
            >
              교재 구매 (준비중)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
