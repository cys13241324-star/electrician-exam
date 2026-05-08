import Reveal from "./Reveal";
import BackgroundPattern from "./BackgroundPattern";

type Resource = {
  emoji: string;
  type: string;
  title: string;
  description: string;
  size: string;
  format: string;
  highlight?: boolean;
};

const items: Resource[] = [
  {
    emoji: "📋",
    type: "체크리스트",
    title: "전기기능사 합격 체크리스트",
    description:
      "시험 전 반드시 점검해야 할 28개 항목. 인쇄해서 책상에 붙여두세요.",
    size: "1.2 MB",
    format: "PDF",
    highlight: true,
  },
  {
    emoji: "📊",
    type: "출제 분석",
    title: "최근 8년 출제 빈도 분석표",
    description:
      "단원별·토픽별 출제 빈도. 어디부터 공부해야 할지 한눈에 들어옵니다.",
    size: "2.4 MB",
    format: "PDF",
  },
  {
    emoji: "🧠",
    type: "핵심 요약",
    title: "한 장 요약 — 전기이론·기기·설비",
    description:
      "시험장 가기 전 마지막으로 훑어볼 한 장짜리 핵심 요약본.",
    size: "0.8 MB",
    format: "PDF",
  },
  {
    emoji: "🗓️",
    type: "학습 캘린더",
    title: "4주 학습 플래너 (인쇄용)",
    description:
      "주차별 목표·일별 체크리스트가 들어간 인쇄용 플래너.",
    size: "1.5 MB",
    format: "PDF",
  },
];

export default function FreeResources() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <BackgroundPattern variant="dots" color="#f59e0b" opacity={0.08} />
      <BackgroundPattern variant="mesh-amber" />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="mb-10 text-center">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-amber-800">
              🎁 무료 자료
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              무료 자료 묶음, 부담 없이 받아가세요
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              회원가입 전이라도 다운로드 가능. 시험 준비에 바로 쓸 수 있는 PDF로 정리했습니다.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.title} type="fade-up" delay={i * 80}>
              <article
                className={`flex h-full items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                  it.highlight
                    ? "border-amber-300 bg-gradient-to-br from-amber-50/40 to-white"
                    : "border-zinc-200"
                }`}
              >
                <div
                  className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${
                    it.highlight ? "bg-amber-100" : "bg-zinc-100"
                  }`}
                >
                  {it.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        it.highlight
                          ? "bg-amber-500 text-white"
                          : "bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {it.type}
                    </span>
                    {it.highlight && (
                      <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        🔥 인기
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-zinc-900">
                    {it.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    {it.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[11px] text-zinc-500">
                      {it.format} · {it.size}
                    </p>
                    <button
                      type="button"
                      disabled
                      title="자료 준비중"
                      className="cursor-not-allowed rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-400"
                    >
                      다운로드 (준비중)
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal type="fade-up">
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-5 text-center">
            <p className="text-xs text-zinc-600">
              💡 회원가입 시 자료팩을 한 번에 압축해서 보내드릴 예정입니다.
              <br className="sm:hidden" /> (현재는 베타 — 다운로드 버튼 준비중)
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
