"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import Reveal from "@/components/Reveal";
import BackgroundPattern from "@/components/BackgroundPattern";
import HowItWorks from "@/components/HowItWorks";
import FeatureDetails from "@/components/FeatureDetails";
import Faq from "@/components/Faq";
import TextbookFloatingPopup from "@/components/TextbookFloatingPopup";
import StudyPlan from "@/components/StudyPlan";
import TextbookTrust from "@/components/TextbookTrust";
import FreeResources from "@/components/FreeResources";
import FeaturePreviewModal, {
  type FeaturePreview,
} from "@/components/FeaturePreviewModal";

const features: FeaturePreview[] = [
  {
    id: "cbt",
    title: "CBT 모의고사",
    emoji: "🖥️",
    tagline: "실제 시험 환경 그대로",
    description:
      "타이머와 자동 채점이 있는 CBT 환경에서 60문항을 60분 안에 풀어보세요. 화면배치, 글자크기, 계산기까지 실제 시험과 동일합니다.",
    highlights: [
      "5회차 모의고사 + 과목별/주제별 연습",
      "화면배치 (1단/2단/1문제 모드)",
      "응시 후 PASS/FAIL과 과목별 분석 제공",
      "전체 60문항 무료 해설",
    ],
    status: "available",
    cta: { label: "지금 시작하기", href: "/cbt" },
    preview: { kind: "info" },
  },
  {
    id: "lecture",
    title: "기출 해설강의",
    emoji: "🎬",
    tagline: "모든 기출 문제 무료 해설",
    description:
      "왜 이 답인지, 어떻게 풀어야 하는지 끝까지 알려드립니다. 2009~2016년 기출 전 회차를 영상으로 제공할 예정입니다.",
    highlights: [
      "기출 전 회차 영상 해설 (무료)",
      "문제별 핵심 풀이 포인트",
      "모바일/PC 어디서나 시청 가능",
    ],
    status: "coming_soon",
    cta: { label: "영상 보러가기", href: "#" },
    preview: { kind: "info" },
  },
  {
    id: "flashcards",
    title: "플립 암기카드",
    emoji: "🃏",
    tagline: "간격 반복 + 자동 오답카드",
    description:
      "어려운 카드는 자주, 쉬운 카드는 가끔. 자가 평가 기반 간격 반복으로 같은 시간 학습해도 더 빨리 외워집니다. 모의고사에서 틀린 문제는 자동으로 카드가 됩니다.",
    highlights: [
      "Anki식 간격 반복 알고리즘 (SM-2 lite)",
      "자가 평가 4단계 (다시 / 어려움 / 보통 / 쉬움)",
      "CBT 오답 자동 카드 변환",
      "스마트 인덱스 — 그리드 + 검색 + 필터",
      "마스터리 시각화 (미학습/학습중/복습중/마스터)",
    ],
    status: "available",
    cta: { label: "카드 학습 시작", href: "/flashcards" },
    preview: { kind: "rich-flashcards", iframeSrc: "/samples/flashcards.html" },
  },
  {
    id: "audiobook",
    title: "오디오북",
    emoji: "🎧",
    tagline: "귀로 듣는 전기기능사 이론",
    description:
      "출퇴근길, 운동하면서, 자기 전 들으면 좋은 이론 정리 오디오북. 핵심 개념을 듣기만 해도 자연스럽게 익혀집니다.",
    highlights: [
      "과목별 이론 정리 오디오",
      "1.0x ~ 2.0x 배속 재생",
      "구간 반복 + 북마크 기능",
    ],
    status: "coming_soon",
    cta: { label: "오디오북 듣기", href: "#" },
    preview: { kind: "audio", src: "/samples/audiobook-sample.mp3" },
  },
  {
    id: "simulator",
    title: "이론 시뮬레이터",
    emoji: "⚡",
    tagline: "회로와 원리를 직접 체험",
    description:
      "글로만 읽던 이론을 직접 만지며 이해하세요. 전기력선부터 변압기, 회전 자계까지 9개 인터랙티브 시뮬레이터를 만나보세요.",
    highlights: [
      "전기장 / 자기장 / 회로 시각화",
      "변수 조절로 즉각 결과 확인",
      "카테고리별 시뮬레이터 9종",
    ],
    status: "available",
    cta: { label: "시뮬레이터 사이트로", href: "/simulator" },
    preview: { kind: "iframe", src: "/samples/simulator-electric-field.html" },
  },
];

const stats = [
  { value: "100%", label: "기출 해설 무료 공개" },
  { value: "1,600+", label: "엄선된 CBT 문제" },
  { value: "9", label: "인터랙티브 시뮬레이터" },
  { value: "300+", label: "핵심 암기카드" },
];

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = features.find((f) => f.id === activeId);

  // 홈 진입 시 항상 최상단부터 보이도록 (브라우저 scroll restoration 우회)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // 해시가 없을 때만 강제로 top
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  const slides: HeroSlide[] = useMemo(
    () => [
      {
        id: "textbook",
        badge: "독끝 전기기능사 필기 · 합격을 책임지는 단 하나의 교재",
        badgeTone: "available",
        title: "독끝 전기기능사 필기!",
        highlight: "빅데이터 기반 고적중 기출문제.",
        description:
          "최근 출제 경향을 빅데이터로 분석해 적중률을 끌어올린 교재. 합격까지 가장 빠른 길은, 가장 잘 정리된 책에서 시작합니다.",
        bgClass: "from-zinc-900 via-zinc-800 to-amber-900",
        decoColor: "#f59e0b",
        primary: {
          label: "교재 구매하러 가기 (준비중)",
          onClick: () => {
            /* 비활성 — 출시 후 연결 */
          },
        },
        secondary: { label: "학습 로드맵 보기", href: "#how" },
        emoji: "📘",
      },
      {
        id: "cbt",
        badge: "CBT 모의고사 · 이용 가능",
        badgeTone: "available",
        title: "합격까지,",
        highlight: "한 곳에서.",
        description:
          "60문항 60분, 실전 환경 그대로. 응시 후 과목별 약점 진단까지 자동으로.",
        bgClass: "from-blue-600 via-blue-500 to-indigo-600",
        decoColor: "#60a5fa",
        primary: { label: "CBT 모의고사 풀기 →", href: "/cbt" },
        secondary: { label: "기능 둘러보기", href: "#features" },
        emoji: "🖥️",
      },
      {
        id: "lecture",
        badge: "기출 해설강의 · 무료 공개 예정",
        badgeTone: "soon",
        title: "왜 이 답인지,",
        highlight: "끝까지 알려드립니다.",
        description:
          "2009~2016년 기출 전 회차 영상 해설. 회원가입 없이 무료로 시청하세요.",
        bgClass: "from-emerald-600 via-emerald-500 to-teal-600",
        decoColor: "#6ee7b7",
        primary: {
          label: "해설강의 자세히 보기",
          onClick: () => setActiveId("lecture"),
        },
        emoji: "🎬",
      },
      {
        id: "flashcards",
        badge: "플립 암기카드 · 이용 가능",
        badgeTone: "available",
        title: "간격 반복으로",
        highlight: "뇌에 박히는 학습.",
        description:
          "어려운 카드는 자주, 쉬운 카드는 가끔. 자가 평가 기반 SRS로 같은 시간 학습해도 더 빨리 외워집니다.",
        bgClass: "from-violet-600 via-fuchsia-500 to-pink-500",
        decoColor: "#f0abfc",
        primary: { label: "카드 학습 시작 →", href: "/flashcards" },
        secondary: {
          label: "샘플 미리보기",
          onClick: () => setActiveId("flashcards"),
        },
        emoji: "🃏",
      },
      {
        id: "audiobook",
        badge: "오디오북 · 출시 준비 중",
        badgeTone: "soon",
        title: "출퇴근길에도",
        highlight: "합격이 가까워집니다.",
        description:
          "전기기능사 핵심 이론을 귀로 듣는 오디오북. 1.0x~2.0x 배속, 구간 반복.",
        bgClass: "from-amber-500 via-orange-500 to-rose-500",
        decoColor: "#fdba74",
        primary: {
          label: "샘플 트랙 들어보기",
          onClick: () => setActiveId("audiobook"),
        },
        emoji: "🎧",
      },
      {
        id: "simulator",
        badge: "이론 시뮬레이터 · 이용 가능",
        badgeTone: "available",
        title: "글로 읽지 말고,",
        highlight: "손으로 만져보세요.",
        description:
          "전기력선·변압기·RLC·회전 자계까지, 9개 인터랙티브 시뮬레이터.",
        bgClass: "from-indigo-600 via-violet-600 to-purple-600",
        decoColor: "#a5b4fc",
        primary: { label: "시뮬레이터 사이트로 →", href: "/simulator" },
        secondary: {
          label: "전기력선 미리보기",
          onClick: () => setActiveId("simulator"),
        },
        emoji: "⚡",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSlider slides={slides} />

      <HowItWorks />

      <section
        id="features"
        className="relative overflow-hidden border-y border-zinc-100 bg-white"
      >
        <BackgroundPattern variant="dots" color="#2563eb" opacity={0.06} />
        {/* 거대 워터마크 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-12 select-none text-center text-[140px] font-black leading-none tracking-tight text-blue-600/[0.04] sm:text-[200px]"
        >
          FEATURES
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-bold tracking-widest text-white shadow-lg">
              <span className="text-amber-300">⚡</span>
              전체 기능
              <span className="text-amber-300">⚡</span>
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl">
              전기기능사 합격을 위한
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                5가지 학습 도구
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-700 sm:text-base">
              교재만으로 부족한 모든 부분, 사이트가 채웁니다.
              <br className="hidden sm:block" />
              카드를 클릭하면 실제 동작하는 미리보기를 볼 수 있어요.
            </p>
          </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const isComingSoon = feature.status === "coming_soon";
            const hasModal = feature.preview.kind !== "info";
            const goesToPage = feature.id === "cbt";

            const cardInner = (
              <>
                {isComingSoon ? (
                  <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-800">
                    Coming Soon
                  </span>
                ) : (
                  <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-800">
                    이용 가능
                  </span>
                )}
                <div className="text-3xl leading-none">{feature.emoji}</div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {feature.tagline}
                </p>
                {(hasModal || goesToPage) && (
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 transition group-hover:opacity-100">
                    {goesToPage ? "바로가기 →" : "미리보기 →"}
                  </div>
                )}
              </>
            );

            const baseClass =
              "group relative rounded-xl border border-zinc-200 bg-white p-6 text-left transition duration-200";
            const interactiveClass =
              " hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg";

            const card =
              goesToPage && feature.cta ? (
                <Link
                  href={feature.cta.href}
                  className={`${baseClass}${interactiveClass} block h-full`}
                >
                  {cardInner}
                </Link>
              ) : hasModal ? (
                <button
                  type="button"
                  onClick={() => setActiveId(feature.id)}
                  className={`${baseClass}${interactiveClass} h-full w-full`}
                >
                  {cardInner}
                </button>
              ) : (
                <div className={`${baseClass} h-full cursor-default opacity-80`}>
                  {cardInner}
                </div>
              );

            return (
              <Reveal key={feature.id} type="fade-up" delay={idx * 80}>
                {card}
              </Reveal>
            );
          })}
        </div>

        </div>
      </section>

      <FeatureDetails />

      <TextbookTrust />

      <StudyPlan />

      <section className="relative overflow-hidden border-y border-zinc-100 bg-zinc-50">
        <BackgroundPattern variant="circuit" color="#3b82f6" opacity={0.08} />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-14 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} type="fade-up" delay={i * 100}>
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-zinc-600">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <FreeResources />

      {/* /extras 진입 카드 — 별의 콘텐츠 */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Reveal type="fade-up">
          <Link
            href="/extras"
            className="group relative block overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-amber-50 to-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg sm:p-8"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 text-[140px] leading-none opacity-10 select-none sm:text-[180px]">
              💬
            </div>
            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold tracking-wide text-rose-700">
                  🎁 별의 콘텐츠
                </span>
                <h3 className="mt-3 text-lg font-bold text-zinc-900 sm:text-xl">
                  카톡방 · 신문 · 만화로 만나는 전기 이론
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-zinc-600">
                  교재·CBT 외에도 재미있게 학습할 수 있는 콘텐츠를 매주 추가하고 있어요.
                </p>
              </div>
              <span className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition group-hover:bg-rose-700">
                보러가기
                <span className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      <Faq />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal type="scale">
        <div className="rounded-2xl bg-zinc-900 px-8 py-12 sm:px-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              지금 시작하세요. 시작은 무료입니다.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
              회원가입 없이도 CBT 모의고사와 시뮬레이터를 무료로 이용할 수 있습니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/cbt"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                CBT 모의고사 풀기
              </Link>
              <Link
                href="/simulator"
                className="rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                시뮬레이터 둘러보기
              </Link>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      <Footer />

      {active && (
        <FeaturePreviewModal feature={active} onClose={() => setActiveId(null)} />
      )}

      <TextbookFloatingPopup />
    </div>
  );
}
