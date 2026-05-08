import Link from "next/link";
import Reveal from "./Reveal";
import BackgroundPattern from "./BackgroundPattern";

type Step = {
  n: number;
  label: string;
  emoji: string;
  title: string;
  highlight?: string;
  description: string;
  bullets: string[];
  cta?: { label: string; href?: string; disabled?: boolean };
  accentBg: string;
  accentText: string;
};

const steps: Step[] = [
  {
    n: 1,
    label: "기본 학습",
    emoji: "📘",
    title: "교재로 탄탄한 기초",
    highlight: "독끝 전기기능사 필기",
    description:
      "빅데이터 기반 고적중 기출문제 정리로 출제 비중에 맞춘 효율적인 학습. 합격을 책임지는 단 하나의 교재로 시작합니다.",
    bullets: [
      "최근 출제 경향 빅데이터 분석",
      "출제 빈도순 핵심 이론 정리",
      "기출 문제 풀이 가이드",
    ],
    cta: { label: "교재 구매하러 가기 (준비중)", disabled: true },
    accentBg: "bg-amber-100",
    accentText: "text-amber-700",
  },
  {
    n: 2,
    label: "실전 콘텐츠",
    emoji: "🖥️",
    title: "CBT 모의고사로 실력 점검",
    description:
      "실제 시험과 동일한 환경에서 60문항을 60분 안에. 응시 후 자동 채점과 과목별 약점 진단까지, 시험장 가기 전에 모든 것을 검증합니다.",
    bullets: [
      "실제 CBT 환경 그대로 (글자크기/화면배치/계산기)",
      "응시 후 자동 채점 + PASS/FAIL 즉시 확인",
      "과목별 정답률 + 취약 토픽 자동 진단",
    ],
    cta: { label: "CBT 모의고사 응시하기 →", href: "/cbt/exams" },
    accentBg: "bg-blue-100",
    accentText: "text-blue-700",
  },
  {
    n: 3,
    label: "부가 서비스",
    emoji: "✨",
    title: "합격까지 책임지는 학습 도구",
    description:
      "교재만으로 부족한 부분은 다양한 부가 서비스로 채웁니다. 자투리 시간을 합격으로 바꾸는 가장 빠른 방법.",
    bullets: [
      "🃏 플립 암기카드 — 핵심 키워드 300선",
      "🎧 오디오북 — 출퇴근길 듣기 학습",
      "⚡ 이론 시뮬레이터 — 직접 만지며 이해",
    ],
    cta: { label: "시뮬레이터 둘러보기 →", href: "/simulator" },
    accentBg: "bg-violet-100",
    accentText: "text-violet-700",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-zinc-50">
      <BackgroundPattern variant="mesh-blue" />
      <BackgroundPattern variant="grid" color="#1e3a8a" opacity={0.04} />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            합격 로드맵
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            합격까지, 단 3단계
          </h2>
          <p className="mt-3 text-sm text-zinc-600">
            교재로 기초를 다지고, 모의고사로 실력을 검증하고, 부가 서비스로 마무리합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.n} type="fade-up" delay={i * 150}>
            <div className="relative h-full">
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-blue-300 to-transparent md:block" />
              )}
              <article className="relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${
                        step.n === 1
                          ? "bg-amber-500"
                          : step.n === 2
                            ? "bg-blue-600"
                            : "bg-violet-600"
                      }`}
                    >
                      {step.n}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${step.accentBg} ${step.accentText}`}
                    >
                      {step.label}
                    </span>
                  </div>
                  <span className="text-3xl leading-none">{step.emoji}</span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-zinc-900">
                  {step.title}
                </h3>
                {step.highlight && (
                  <p className="mt-1 text-base font-bold text-amber-600">
                    📘 {step.highlight}
                  </p>
                )}
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {step.description}
                </p>

                <ul className="mt-4 space-y-2">
                  {step.bullets.map((b, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-zinc-700"
                    >
                      <span
                        className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                          step.n === 1
                            ? "bg-amber-500"
                            : step.n === 2
                              ? "bg-blue-600"
                              : "bg-violet-600"
                        }`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {step.cta && (
                  <div className="mt-auto pt-5">
                    {step.cta.disabled ? (
                      <span className="block w-full cursor-not-allowed rounded-md bg-zinc-100 px-4 py-2 text-center text-sm font-semibold text-zinc-400">
                        {step.cta.label}
                      </span>
                    ) : step.cta.href ? (
                      <Link
                        href={step.cta.href}
                        className={`block w-full rounded-md px-4 py-2 text-center text-sm font-semibold text-white transition ${
                          step.n === 2
                            ? "bg-blue-600 hover:bg-blue-700"
                            : step.n === 3
                              ? "bg-violet-600 hover:bg-violet-700"
                              : "bg-amber-500 hover:bg-amber-600"
                        }`}
                      >
                        {step.cta.label}
                      </Link>
                    ) : null}
                  </div>
                )}
              </article>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
