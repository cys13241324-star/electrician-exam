import Link from "next/link";
import Reveal from "./Reveal";
import SectionDivider from "./SectionDivider";
import BackgroundPattern from "./BackgroundPattern";

type Theme = {
  badgeBg: string;
  badgeText: string;
  stepBg: string;
  visualBg: string;
  accent: string;
  ctaBg: string;
  ctaHover: string;
  checkBg: string;
};

type FeatureDetail = {
  id: string;
  step: string;
  emoji: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  features: { title: string; description: string }[];
  cta: { label: string; href?: string };
  status: "available" | "coming_soon";
  theme: Theme;
};

const items: FeatureDetail[] = [
  {
    id: "cbt",
    step: "01",
    emoji: "🖥️",
    category: "실전 시험 대비",
    title: "CBT 모의고사",
    tagline: "실제 시험장 그대로, 손에 익을 때까지",
    description:
      "글자 크기, 화면 배치, 계산기 팝업까지 — 실제 시험과 똑같은 환경에서 60문항을 60분 안에 풀어봅니다. 응시 후엔 자동 채점으로 합격 여부와 약점을 한눈에.",
    features: [
      {
        title: "5회차 모의고사 + 범위별 연습",
        description: "정규 5회차 외에 과목별 / 주제별 / 하위 범위까지 골라 응시.",
      },
      {
        title: "1단·2단·1문제 화면 배치",
        description: "한 화면에 한 문제만 크게, 또는 두 문제를 나란히 비교.",
      },
      {
        title: "글자 크기 조절 + 계산기",
        description: "100% / 130% / 150% 글자 크기, 팝업 계산기 내장.",
      },
      {
        title: "PASS/FAIL + 100점 환산 점수",
        description: "응시 즉시 합격 여부 + 환산 점수 + 소요 시간 자동 계산.",
      },
      {
        title: "과목별 약점 자동 진단",
        description: "취약 토픽 TOP 3 + 과목별 삼각형 그래프로 시각화.",
      },
    ],
    cta: { label: "지금 응시하기 →", href: "/cbt/exams" },
    status: "available",
    theme: {
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-700",
      stepBg: "bg-blue-600",
      visualBg: "from-blue-500 via-blue-600 to-indigo-700",
      accent: "text-blue-600",
      ctaBg: "bg-blue-600",
      ctaHover: "hover:bg-blue-700",
      checkBg: "bg-blue-500",
    },
  },
  {
    id: "lecture",
    step: "02",
    emoji: "🎬",
    category: "무료 영상 해설",
    title: "기출 해설강의",
    tagline: "왜 이 답인지, 끝까지 알려드립니다",
    description:
      "2009~2016년 기출 전 회차에 대한 영상 해설. 단순한 정답 표기가 아닌 단계별 풀이와 함정 포인트까지 짚어드립니다. 회원가입 없이도 모두 무료.",
    features: [
      {
        title: "기출 전 회차 영상 해설",
        description: "2009~2016 출제된 모든 문제를 영상으로 풀이.",
      },
      {
        title: "문제별 풀이 단계 + 함정 포인트",
        description: "오답 보기까지 분석해 시험에 자주 나오는 함정을 짚어줌.",
      },
      {
        title: "과목별 출제 빈도 분석",
        description: "어디서 자주 나오는지, 무엇부터 봐야 할지 명확히.",
      },
      {
        title: "모바일·PC·태블릿 모두 지원",
        description: "출퇴근길엔 모바일, 집에선 큰 화면으로.",
      },
      {
        title: "회원가입 없이 무료 시청",
        description: "장벽 없이 바로 시청. 진도/즐겨찾기는 가입 시 저장.",
      },
    ],
    cta: { label: "출시 알림 받기 (준비중)" },
    status: "coming_soon",
    theme: {
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
      stepBg: "bg-emerald-600",
      visualBg: "from-emerald-500 via-emerald-600 to-teal-700",
      accent: "text-emerald-600",
      ctaBg: "bg-emerald-600",
      ctaHover: "hover:bg-emerald-700",
      checkBg: "bg-emerald-500",
    },
  },
  {
    id: "flashcards",
    step: "03",
    emoji: "🃏",
    category: "암기 도구",
    title: "플립 암기카드",
    tagline: "300장의 핵심 키워드, 자투리 시간을 합격으로",
    description:
      "전기기능사 합격에 필요한 핵심 키워드 300장을 카드로 정리. 손가락 한 번이면 카드를 뒤집어 정답 확인. 즐겨찾기는 자동으로 모이고, 오답은 따로 모아 다시 학습합니다.",
    features: [
      {
        title: "과목별 핵심 키워드 300장",
        description: "전기이론·전기기기·전기설비 각 100장씩.",
      },
      {
        title: "카드 뒤집기 인터랙션",
        description: "탭 한 번에 정답·해설 확인, 매끄러운 3D 회전.",
      },
      {
        title: "즐겨찾기 자동 모음",
        description: "어려웠던 카드는 즐겨찾기 → 시험 전날 한 번 더.",
      },
      {
        title: "오답노트 자동 생성",
        description: "틀린 카드만 모아 보는 오답 컬렉션.",
      },
      {
        title: "출퇴근길 5분 학습",
        description: "한 번에 한 카드, 짧은 시간에도 누적 효과.",
      },
    ],
    cta: { label: "샘플 카드 체험하기 (준비중)" },
    status: "coming_soon",
    theme: {
      badgeBg: "bg-violet-100",
      badgeText: "text-violet-700",
      stepBg: "bg-violet-600",
      visualBg: "from-violet-500 via-fuchsia-500 to-pink-500",
      accent: "text-violet-600",
      ctaBg: "bg-violet-600",
      ctaHover: "hover:bg-violet-700",
      checkBg: "bg-violet-500",
    },
  },
  {
    id: "audiobook",
    step: "04",
    emoji: "🎧",
    category: "듣기 학습",
    title: "오디오북",
    tagline: "출퇴근길에도 합격이 가까워집니다",
    description:
      "전기기능사 핵심 이론을 귀로 듣는 오디오북. 운전 중에도, 산책할 때도, 자기 전에도 자연스럽게 학습이 누적됩니다. 배속과 구간 반복 기능으로 효율을 더합니다.",
    features: [
      {
        title: "과목별 이론 정리 오디오",
        description: "교재 핵심 내용을 자연스러운 음성으로 녹음.",
      },
      {
        title: "0.8x ~ 2.0x 배속 재생",
        description: "이해가 필요한 곳은 천천히, 익숙한 곳은 빠르게.",
      },
      {
        title: "구간 반복 + 북마크",
        description: "헷갈리는 부분만 반복 재생, 중요 시점 북마크.",
      },
      {
        title: "백그라운드 재생",
        description: "다른 앱 사용 중에도 끊김 없이 듣기.",
      },
      {
        title: "오프라인 다운로드",
        description: "데이터 걱정 없이 출퇴근 지하철에서도.",
      },
    ],
    cta: { label: "샘플 트랙 듣기 (준비중)" },
    status: "coming_soon",
    theme: {
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-700",
      stepBg: "bg-amber-500",
      visualBg: "from-amber-400 via-orange-500 to-rose-500",
      accent: "text-amber-600",
      ctaBg: "bg-amber-500",
      ctaHover: "hover:bg-amber-600",
      checkBg: "bg-amber-500",
    },
  },
  {
    id: "simulator",
    step: "05",
    emoji: "⚡",
    category: "이론 시각화",
    title: "이론 시뮬레이터",
    tagline: "글로 읽지 말고, 손으로 만져보세요",
    description:
      "전기력선·자기력·RLC 공진·회전 자계까지, 전기기능사 핵심 원리 9개를 인터랙티브 시뮬레이터로 직접 조작. 변수를 바꾸면 결과가 즉시 보이니, 식의 의미가 손에 잡힙니다.",
    features: [
      {
        title: "9개 인터랙티브 시뮬레이터",
        description: "전기력선·평행도선·RLC·변압기·직류기·유도전동기·접지·차단기·직병렬.",
      },
      {
        title: "변수 조절로 즉각 결과 확인",
        description: "슬라이더 한 번에 그래프와 그림이 즉시 변화.",
      },
      {
        title: "공식과 시각을 동시에",
        description: "수식 옆에 시각화가 나란히, 의미와 형식을 함께 학습.",
      },
      {
        title: "카테고리별 정리",
        description: "전기이론 / 전기기기 / 전기설비별로 깔끔하게 분류.",
      },
      {
        title: "기출 문제와 연계",
        description: "각 시뮬에서 본 현상이 시험 보기에 그대로 등장.",
      },
    ],
    cta: { label: "시뮬레이터 사이트로 →", href: "/simulator" },
    status: "available",
    theme: {
      badgeBg: "bg-indigo-100",
      badgeText: "text-indigo-700",
      stepBg: "bg-indigo-600",
      visualBg: "from-indigo-500 via-violet-600 to-purple-700",
      accent: "text-indigo-600",
      ctaBg: "bg-indigo-600",
      ctaHover: "hover:bg-indigo-700",
      checkBg: "bg-indigo-500",
    },
  },
];

export default function FeatureDetails() {
  return (
    <section
      id="feature-details"
      className="relative scroll-mt-24 overflow-hidden bg-zinc-50"
    >
      <BackgroundPattern variant="dots" color="#3b82f6" opacity={0.07} />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold tracking-wide text-blue-600">
              특장점 자세히 보기
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              5가지 학습 도구, 한 가지씩 들여다보기
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              각 도구가 왜 합격에 효과적인지, 어떤 기능을 제공하는지 자세히 살펴보세요.
            </p>
          </div>
        </Reveal>

        <div className="space-y-16">
          {items.map((it, i) => {
            const reverse = i % 2 === 1;
            const isComingSoon = it.status === "coming_soon";
            return (
              <div key={it.id}>
                {i > 0 && <SectionDivider variant="spark" label={`STEP ${it.step}`} />}
                <article className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
                  {/* Visual */}
                  <Reveal
                    type={reverse ? "slide-right" : "slide-left"}
                    className={reverse ? "lg:order-2" : ""}
                  >
                    <Visual item={it} />
                  </Reveal>

                  {/* Content */}
                  <Reveal
                    type={reverse ? "slide-left" : "slide-right"}
                    delay={120}
                    className={reverse ? "lg:order-1" : ""}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${it.theme.stepBg} text-sm font-bold text-white`}
                      >
                        {it.step}
                      </span>
                      <span
                        className={`rounded-full ${it.theme.badgeBg} px-3 py-1 text-xs font-bold ${it.theme.badgeText}`}
                      >
                        {it.category}
                      </span>
                      {isComingSoon ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-800">
                          Coming Soon
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-800">
                          이용 가능
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                      {it.title}
                    </h3>
                    <p className={`mt-1 text-base font-semibold ${it.theme.accent}`}>
                      {it.tagline}
                    </p>

                    <p className="mt-4 text-sm leading-7 text-zinc-700 sm:text-base">
                      {it.description}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {it.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${it.theme.checkBg} text-[10px] font-bold text-white`}
                          >
                            ✓
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-900">
                              {f.title}
                            </p>
                            <p className="mt-0.5 text-xs leading-5 text-zinc-600">
                              {f.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7">
                      {isComingSoon ? (
                        <span
                          className="inline-block cursor-not-allowed rounded-md bg-zinc-200 px-6 py-3 text-sm font-bold text-zinc-500"
                          title="준비중"
                        >
                          {it.cta.label}
                        </span>
                      ) : (
                        it.cta.href && (
                          <Link
                            href={it.cta.href}
                            className={`inline-block rounded-md ${it.theme.ctaBg} px-6 py-3 text-sm font-bold text-white shadow-sm transition ${it.theme.ctaHover}`}
                          >
                            {it.cta.label}
                          </Link>
                        )
                      )}
                    </div>
                  </Reveal>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Visual({ item }: { item: FeatureDetail }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.theme.visualBg} aspect-[4/3] shadow-xl`}
    >
      {/* decorative circles */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-0 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute right-12 top-12 h-24 w-24 rounded-full bg-white/10 blur-xl" />

      {/* watermark step number */}
      <span className="absolute right-6 top-4 select-none text-[120px] font-black leading-none text-white/10">
        {item.step}
      </span>

      {/* main emoji */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-44 w-44 items-center justify-center rounded-3xl bg-white/15 text-8xl shadow-inner backdrop-blur-sm">
          {item.emoji}
        </div>
      </div>

      {/* footer chip */}
      <div className="absolute bottom-5 left-5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wider text-white backdrop-blur-sm">
        STEP {item.step} · {item.category}
      </div>
    </div>
  );
}
