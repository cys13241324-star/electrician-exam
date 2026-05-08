import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const features = [
  {
    title: "CBT 모의고사",
    description: "실제 시험 환경 그대로. 타이머와 자동 채점으로 실전 감각을 익혀보세요.",
    badge: "실전",
    href: "/cbt",
  },
  {
    title: "기출 해설강의",
    description: "모든 기출 문제 무료 해설. 왜 이 답인지 끝까지 알려드립니다.",
    badge: "무료",
    href: "#",
  },
  {
    title: "플립 암기카드",
    description: "핵심 이론과 공식을 카드로. 짧은 자투리 시간을 효율적으로.",
    badge: "암기",
    href: "#",
  },
  {
    title: "오디오북",
    description: "출퇴근길, 운동하면서. 귀로 듣는 전기기능사 이론 정리.",
    badge: "오디오",
    href: "#",
  },
  {
    title: "이론 시뮬레이터",
    description: "회로와 원리를 직접 만져보며 이해하세요. 글로만 읽던 이론이 손에 잡힙니다.",
    badge: "체험",
    href: "#",
  },
];

const stats = [
  { value: "100%", label: "기출 해설 무료 공개" },
  { value: "1,000+", label: "엄선된 CBT 문제" },
  { value: "5", label: "차별화 학습 도구" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="border-b border-zinc-100 bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
              전기기능사 필기 시험 대비
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
              합격까지, <span className="text-blue-600">한 곳에서.</span>
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg">
              CBT 모의고사, 무료 해설강의, 플립 암기카드, 오디오북, 이론 시뮬레이터.
              <br className="hidden sm:block" />
              전기기능사 필기 합격을 위한 모든 것을 담았습니다.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/cbt"
                className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                CBT 모의고사 풀기
              </Link>
              <Link
                href="#"
                className="rounded-md border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                해설강의 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            전기기능사 인기 콘텐츠
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            합격생이 가장 많이 사용한 학습 도구를 만나보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="inline-block rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 group-hover:bg-blue-50 group-hover:text-blue-700">
                {feature.badge}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {feature.description}
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600 opacity-0 transition group-hover:opacity-100">
                바로가기 →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-blue-600 sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-zinc-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl bg-zinc-900 px-8 py-12 sm:px-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              지금 시작하세요. 시작은 무료입니다.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
              회원가입 없이도 기출 해설강의와 일부 콘텐츠를 무료로 이용할 수 있습니다.
            </p>
            <button
              type="button"
              className="mt-6 rounded-md bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              학습 시작하기
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
