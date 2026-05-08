import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BackgroundPattern from "@/components/BackgroundPattern";

export const metadata: Metadata = {
  title: "합격 인증 갤러리",
  description:
    "독끝 전기기능사 필기로 합격한 학습자들의 인증샷과 짧은 후기 모음.",
};

type Cert = {
  id: string;
  name: string;
  score: string;
  date: string;
  story: string;
  toolHighlights: string[];
  emoji: string;
  bg: string;
};

const certs: Cert[] = [
  {
    id: "c1",
    name: "이*훈",
    score: "85점",
    date: "2026.04",
    story: "5회차 전부 풀고 해설까지 보니 시험장이 익숙하더라고요.",
    toolHighlights: ["CBT 모의고사", "기출 해설"],
    emoji: "🎉",
    bg: "from-blue-400 to-indigo-500",
  },
  {
    id: "c2",
    name: "박*영",
    score: "78점",
    date: "2026.04",
    story: "출퇴근 오디오북 + 점심 플립카드, 자투리 시간으로 해냈습니다.",
    toolHighlights: ["오디오북", "플립카드"],
    emoji: "🏆",
    bg: "from-amber-400 to-orange-500",
  },
  {
    id: "c3",
    name: "김*수",
    score: "92점",
    date: "2026.03",
    story: "전기 비전공인데 시뮬레이터 덕분에 자기력선이 머리에 박혔어요.",
    toolHighlights: ["시뮬레이터"],
    emoji: "🌟",
    bg: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "c4",
    name: "최*경",
    score: "73점",
    date: "2026.03",
    story: "취약 진단으로 어디 볼지 명확해졌습니다. 시간 낭비 없음.",
    toolHighlights: ["취약 진단", "CBT"],
    emoji: "📈",
    bg: "from-emerald-500 to-teal-500",
  },
  {
    id: "c5",
    name: "정*우",
    score: "80점",
    date: "2026.02",
    story: "기출 해설강의가 책 한 권 사는 것보다 도움이 됐습니다.",
    toolHighlights: ["기출 해설"],
    emoji: "🚀",
    bg: "from-rose-500 to-pink-500",
  },
  {
    id: "c6",
    name: "장*은",
    score: "88점",
    date: "2026.02",
    story: "플립카드 즐겨찾기 모음 + 시험 전날 한 바퀴, 이거면 충분.",
    toolHighlights: ["플립카드"],
    emoji: "💪",
    bg: "from-cyan-500 to-blue-500",
  },
  {
    id: "c7",
    name: "윤*지",
    score: "70점",
    date: "2026.01",
    story: "과목별로 끊어 풀 수 있어서 약한 부분만 골라 학습했어요.",
    toolHighlights: ["과목별 학습"],
    emoji: "✨",
    bg: "from-indigo-500 to-purple-500",
  },
  {
    id: "c8",
    name: "한*민",
    score: "82점",
    date: "2026.01",
    story: "변압기 시뮬 보고 권수비가 직관적으로 이해됐습니다.",
    toolHighlights: ["시뮬레이터"],
    emoji: "🎯",
    bg: "from-orange-500 to-red-500",
  },
  {
    id: "c9",
    name: "조*나",
    score: "85점",
    date: "2025.12",
    story: "두 번째 도전. 첫 시험에 떨어진 부분을 취약 토픽으로 잡았어요.",
    toolHighlights: ["취약 진단", "CBT"],
    emoji: "🔥",
    bg: "from-pink-500 to-rose-500",
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <section className="relative overflow-hidden border-b border-zinc-100 bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <BackgroundPattern variant="dots" color="#f59e0b" opacity={0.08} />
        <BackgroundPattern variant="mesh-amber" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 text-center">
          <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950">
            🏆 합격 인증
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            먼저 합격한 사람들이 남긴 자국
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            짧은 한마디와 함께, 어떤 학습 도구가 결정적이었는지 직접 들어보세요.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c, i) => (
            <Reveal key={c.id} type="fade-up" delay={i * 60}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div
                  className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${c.bg} text-6xl transition group-hover:scale-105`}
                >
                  <span className="drop-shadow-md">{c.emoji}</span>
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-zinc-900 backdrop-blur">
                    {c.score}
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-zinc-900/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                    {c.date} 합격
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm font-bold text-zinc-900">{c.name}</p>
                  <p className="mt-2 flex-1 text-sm leading-6 text-zinc-700">
                    "{c.story}"
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.toolHighlights.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700"
                      >
                        # {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal type="fade-up">
          <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-8 text-center">
            <p className="text-2xl">📸</p>
            <h3 className="mt-2 text-base font-bold text-zinc-900">
              합격하셨나요? 인증을 남겨주세요.
            </h3>
            <p className="mt-2 text-xs text-zinc-600">
              다음 합격생에게 가장 큰 동기 부여가 됩니다.
            </p>
            <button
              type="button"
              disabled
              className="mt-4 cursor-not-allowed rounded-md bg-zinc-200 px-5 py-2 text-xs font-semibold text-zinc-500"
            >
              인증샷 등록 (준비중)
            </button>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
