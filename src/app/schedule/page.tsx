import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BackgroundPattern from "@/components/BackgroundPattern";

export const metadata: Metadata = {
  title: "시험 일정",
  description:
    "전기기능사 정기 필기 시험 일정과 원서 접수 기간, D-day까지 한눈에.",
};

type Sched = {
  round: string;
  apply: string;
  exam: string;
  result: string;
  status: "open" | "closed" | "upcoming";
  isMine?: boolean;
};

const TODAY = new Date("2026-05-08");

function daysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  const utcA = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const utcB = Date.UTC(
    TODAY.getFullYear(),
    TODAY.getMonth(),
    TODAY.getDate(),
  );
  return Math.round((utcA - utcB) / (1000 * 60 * 60 * 24));
}

const schedules: Sched[] = [
  {
    round: "2026년 정기 1회",
    apply: "2026.05.10 ~ 2026.05.16",
    exam: "2026-06-01",
    result: "2026.06.10",
    status: "upcoming",
    isMine: true,
  },
  {
    round: "2026년 정기 2회",
    apply: "2026.07.05 ~ 2026.07.11",
    exam: "2026-08-03",
    result: "2026.08.12",
    status: "upcoming",
  },
  {
    round: "2026년 정기 3회",
    apply: "2026.09.06 ~ 2026.09.12",
    exam: "2026-10-05",
    result: "2026.10.14",
    status: "upcoming",
  },
  {
    round: "2026년 정기 4회",
    apply: "2026.11.01 ~ 2026.11.07",
    exam: "2026-11-30",
    result: "2026.12.09",
    status: "upcoming",
  },
];

const STATUS_CHIP = {
  open: "bg-emerald-100 text-emerald-700",
  closed: "bg-zinc-100 text-zinc-500",
  upcoming: "bg-blue-100 text-blue-700",
};

const STATUS_LABEL = {
  open: "접수 중",
  closed: "마감",
  upcoming: "예정",
};

const PROCESS_STEPS = [
  { emoji: "📝", title: "원서 접수", description: "큐넷에서 정해진 기간에 응시 신청" },
  { emoji: "💳", title: "응시료 결제", description: "약 14,500원 (전기기능사 필기)" },
  { emoji: "🖥️", title: "시험 응시", description: "지정 CBT 시험장 방문, 60문항 60분" },
  { emoji: "🎉", title: "합격 발표", description: "큐넷에서 합격자 발표 확인" },
];

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <section className="relative overflow-hidden border-b border-zinc-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <BackgroundPattern variant="grid" color="#1e40af" opacity={0.05} />
        <BackgroundPattern variant="mesh-blue" />
        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            시험 일정
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            언제 응시할지, <span className="text-blue-600">미리 정하세요.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600">
            큐넷(Q-Net) 기준 전기기능사 정기 시험 일정입니다. 원서 접수 기간을 놓치지 않도록 D-day와 함께 정리했습니다.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Schedule list */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {schedules.map((s, idx) => {
            const dDay = daysUntil(s.exam);
            const dDayLabel =
              dDay > 0 ? `D-${dDay}` : dDay === 0 ? "D-DAY" : `D+${Math.abs(dDay)}`;
            const dDayTone =
              dDay <= 0
                ? "text-zinc-400"
                : dDay <= 7
                  ? "text-rose-600"
                  : dDay <= 30
                    ? "text-amber-600"
                    : "text-blue-600";
            return (
              <Reveal key={s.round} type="fade-up" delay={idx * 80}>
                <article
                  className={`relative h-full overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    s.isMine ? "border-blue-300" : "border-zinc-200"
                  }`}
                >
                  {s.isMine && (
                    <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-amber-950">
                      🎯 내 시험
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_CHIP[s.status]}`}>
                      {STATUS_LABEL[s.status]}
                    </span>
                    <h3 className="text-base font-bold text-zinc-900">
                      {s.round}
                    </h3>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <Field label="원서 접수" value={s.apply} />
                    <Field label="시험일" value={s.exam.replace(/-/g, ".")} highlight />
                    <Field label="합격 발표" value={s.result} />
                    <Field label="시험까지" value={dDayLabel} valueClass={`font-black text-lg ${dDayTone}`} />
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <a
                      href="https://www.q-net.or.kr"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      큐넷 바로가기 ↗
                    </a>
                    <Link
                      href="/cbt/exams"
                      className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      모의고사 응시
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Process */}
        <section className="mt-16">
          <Reveal>
            <h2 className="text-xl font-bold text-zinc-900">
              응시 절차 한눈에 보기
            </h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={i} type="fade-up" delay={i * 100}>
                <div className="relative h-full rounded-xl border border-zinc-200 bg-white p-5">
                  <span className="absolute -top-3 left-5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="mt-2 text-3xl">{step.emoji}</div>
                  <h3 className="mt-3 text-sm font-bold text-zinc-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <strong className="text-amber-700">⚠️ 안내</strong> · 위 일정은
          mock 데이터입니다. 실제 일정은 반드시{" "}
          <a
            href="https://www.q-net.or.kr"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline hover:text-amber-700"
          >
            큐넷(Q-Net)
          </a>
          에서 최신 정보를 확인해 주세요.
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  highlight,
  valueClass,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  valueClass?: string;
}) {
  return (
    <div className={`rounded-md ${highlight ? "bg-blue-50" : "bg-zinc-50"} px-3 py-2`}>
      <p className="text-[10px] text-zinc-500">{label}</p>
      <p
        className={`mt-0.5 ${valueClass ?? "text-sm font-semibold text-zinc-900"}`}
      >
        {value}
      </p>
    </div>
  );
}
