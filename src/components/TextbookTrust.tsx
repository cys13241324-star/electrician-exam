import Reveal from "./Reveal";
import BackgroundPattern from "./BackgroundPattern";

const stats = [
  { label: "누적 판매 부수", value: "12,400+", caption: "전기기능사 단권 기준" },
  { label: "독자 합격률", value: "87%", caption: "최근 시즌 자가 응답" },
  { label: "재판 횟수", value: "5쇄", caption: "출간 후 12개월" },
  { label: "평균 평점", value: "4.8 / 5.0", caption: "온라인 서점 통합" },
];

const reasons = [
  {
    emoji: "📊",
    title: "빅데이터 기반 출제 분석",
    description:
      "지난 8년간 출제된 모든 문제를 카테고리·난도·빈도별로 정리. 자주 나오는 함정과 패턴을 미리 익힙니다.",
  },
  {
    emoji: "🎯",
    title: "합격 임계점 설계",
    description:
      "60점 합격선을 안정적으로 넘기는 데 필요한 최소 학습량을 역산해, 우선순위가 명확합니다.",
  },
  {
    emoji: "🔄",
    title: "시뮬·CBT·해설과 완전 연동",
    description:
      "교재의 모든 단원이 사이트의 시뮬레이터·CBT 모의고사·해설강의로 자연스럽게 이어집니다.",
  },
  {
    emoji: "✍️",
    title: "현장 실무자 검수",
    description:
      "전기 산업 현장 종사자와 자격증 강사진의 공동 검수로, 시험과 실무의 간극을 줄였습니다.",
  },
];

export default function TextbookTrust() {
  return (
    <section className="relative overflow-hidden bg-zinc-900 text-white">
      <BackgroundPattern variant="circuit" color="#fbbf24" opacity={0.07} />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="text-center">
            <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-bold tracking-wide text-amber-950">
              📘 독끝 시리즈
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              왜 <span className="text-amber-300">독끝 전기기능사 필기</span>인가요?
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base">
              교재 한 권으로 시작해 합격까지 책임지는 통합 학습 시스템.
              <br className="hidden sm:block" />
              숫자와 구조로 입증된 신뢰의 이유를 확인해 보세요.
            </p>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal type="fade-up" delay={100}>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <p className="text-xs font-semibold tracking-wider text-amber-300">
                  {s.label}
                </p>
                <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] text-zinc-400">{s.caption}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Reasons */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {reasons.map((r, i) => (
            <Reveal key={i} type="fade-up" delay={i * 100}>
              <article className="group flex h-full gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-amber-400/40 hover:bg-white/10">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-2xl">
                  {r.emoji}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white">{r.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {r.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Footer note */}
        <Reveal type="fade-up">
          <div className="mt-12 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 p-6 text-center backdrop-blur-sm">
            <p className="text-sm text-zinc-300 sm:text-base">
              <strong className="text-amber-300">안내</strong> · 위 수치는
              출간 1주년 자료 기준의 자체 집계 mock 값입니다. 정식 통계는
              출시 후 실시간으로 업데이트됩니다.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
