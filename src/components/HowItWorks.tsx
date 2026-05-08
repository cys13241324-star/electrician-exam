import Link from "next/link";

const steps = [
  {
    n: 1,
    emoji: "🎯",
    title: "실력 진단",
    description:
      "CBT 모의고사 1회차로 시작. 60문항을 60분 안에 풀고 PASS/FAIL과 과목별 점수를 확인합니다.",
    cta: { label: "1회차 응시하기", href: "/cbt/exams" },
  },
  {
    n: 2,
    emoji: "🔍",
    title: "취약점 보강",
    description:
      "응시 후 자동 분석된 취약 토픽을 확인하고, 과목별 학습에서 그 범위만 골라 다시 풀어봅니다.",
    cta: { label: "과목별 학습", href: "/cbt/study" },
  },
  {
    n: 3,
    emoji: "⚡",
    title: "이론 시각화",
    description:
      "헷갈리는 개념은 시뮬레이터로. 직접 만지며 원리를 이해하면 같은 문제를 다시 틀리지 않습니다.",
    cta: { label: "시뮬레이터 사이트", href: "/simulator" },
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            합격까지, 단 3단계
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            막막한 첫 시험 준비, 이렇게 시작하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.n} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-blue-300 to-transparent md:block" />
              )}
              <div className="relative h-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {step.n}
                </div>
                <div className="mt-3 text-3xl">{step.emoji}</div>
                <h3 className="mt-3 text-lg font-bold text-zinc-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {step.description}
                </p>
                <Link
                  href={step.cta.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  {step.cta.label} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
