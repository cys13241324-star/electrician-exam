import Reveal from "./Reveal";
import BackgroundPattern from "./BackgroundPattern";

type Testimonial = {
  id: string;
  name: string;
  score: string;
  date: string;
  comment: string;
  highlight?: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "이*훈",
    score: "85점",
    date: "2026.04",
    comment:
      "CBT 모의고사를 5회까지 다 풀고 해설까지 보니 시험장이 낯설지가 않더라고요. 결국 한 번에 합격!",
    highlight: "CBT 모의고사",
    avatar: "👨‍🎓",
  },
  {
    id: "t2",
    name: "박*영",
    score: "78점",
    date: "2026.04",
    comment:
      "출퇴근길에 오디오북 듣고 점심엔 플립카드, 주말에 모의고사. 자투리 시간만으로 충분했어요.",
    highlight: "오디오북",
    avatar: "👩‍💼",
  },
  {
    id: "t3",
    name: "김*수",
    score: "92점",
    date: "2026.03",
    comment:
      "전기 비전공자라 막막했는데 시뮬레이터로 자기력선 보면서 이해되니까 문제 풀이가 훨씬 쉬워졌어요.",
    highlight: "이론 시뮬레이터",
    avatar: "🧑‍🔧",
  },
  {
    id: "t4",
    name: "최*경",
    score: "73점",
    date: "2026.03",
    comment:
      "취약 진단으로 부족한 부분 알려주니까 어디부터 봐야 할지 명확. 시간 낭비 없이 합격선을 넘었습니다.",
    highlight: "취약점 진단",
    avatar: "👩‍🎓",
  },
  {
    id: "t5",
    name: "정*우",
    score: "80점",
    date: "2026.02",
    comment:
      "기출 해설강의가 꼼꼼해서 따로 책 살 필요 없었어요. 오답이었던 문제도 해설 보면 머리에 박힙니다.",
    highlight: "기출 해설",
    avatar: "👨‍🏫",
  },
  {
    id: "t6",
    name: "장*은",
    score: "88점",
    date: "2026.02",
    comment:
      "플립카드 300장을 즐겨찾기 모으고 시험 전날 한 번 훑었더니 자신감이 다르더군요. 추천합니다!",
    highlight: "플립 암기카드",
    avatar: "🧑‍💻",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-white">
      <BackgroundPattern variant="mesh-amber" />
      <BackgroundPattern variant="dots" color="#f59e0b" opacity={0.05} />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-600">
              합격 후기
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              먼저 합격한 학습자들의 이야기
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              실제 합격생들이 어떤 학습 도구를 활용해 시험을 통과했는지 들어보세요.
            </p>
          </div>
          <span className="hidden items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 sm:flex">
            <span className="text-base">⭐</span>
            평균 만족도 4.8 / 5.0
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} type="fade-up" delay={i * 80}>
            <article
              className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6 shadow-sm transition hover:shadow-md"
            >
              <header className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
                  {t.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-zinc-900">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.date} 합격</p>
                </div>
                <span className="rounded-md bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                  {t.score}
                </span>
              </header>

              <p className="mt-4 flex-1 text-sm leading-6 text-zinc-700">
                “{t.comment}”
              </p>

              {t.highlight && (
                <div className="mt-4 inline-flex items-center gap-1 self-start rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                  <span className="text-amber-500">●</span>
                  {t.highlight} 활용
                </div>
              )}
            </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
