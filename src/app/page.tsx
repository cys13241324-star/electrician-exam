"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import Reveal from "@/components/Reveal";
import HowItWorks from "@/components/HowItWorks";
import FeatureDetails from "@/components/FeatureDetails";
import CbtSpotlight from "@/components/CbtSpotlight";
import ElectricExtras from "@/components/ElectricExtras";
import Testimonials from "@/components/Testimonials";
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
    tagline: "핵심 키워드 300선",
    description:
      "전기기능사 합격을 위한 핵심 키워드를 카드 형태로 정리. 짧은 자투리 시간을 활용해 암기하고 즐겨찾기로 모아 다시 학습하세요.",
    highlights: [
      "과목별 핵심 키워드 300장",
      "카드 뒤집기 방식의 인터랙션",
      "즐겨찾기 + 오답노트 자동 생성",
    ],
    status: "coming_soon",
    cta: { label: "카드 학습하기", href: "#" },
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
  { value: "1,000+", label: "엄선된 CBT 문제" },
  { value: "9", label: "인터랙티브 시뮬레이터" },
  { value: "300+", label: "핵심 암기카드" },
];

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = features.find((f) => f.id === activeId);

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
        badge: "플립 암기카드 · 출시 준비 중",
        badgeTone: "soon",
        title: "300장의 핵심 키워드,",
        highlight: "카드로 마스터.",
        description:
          "과목별 100장씩, 자투리 시간을 합격으로 바꾸는 가장 빠른 방법.",
        bgClass: "from-violet-600 via-fuchsia-500 to-pink-500",
        decoColor: "#f0abfc",
        primary: {
          label: "샘플 카드 체험하기",
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

      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            전체 기능
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            전기기능사 합격을 위한 5가지 학습 도구
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            카드를 클릭하면 미리보기를 확인할 수 있습니다.
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

        <div className="mt-10 flex justify-center">
          <Link
            href="#feature-details"
            className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-blue-400 hover:text-blue-700"
          >
            각 도구의 특장점 자세히 보기
            <span className="transition group-hover:translate-y-0.5">↓</span>
          </Link>
        </div>
      </section>

      <FeatureDetails />

      <CbtSpotlight />

      <TextbookTrust />

      <StudyPlan />

      <ElectricExtras />

      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-12 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} type="fade-up" delay={i * 100}>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-zinc-600">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <FreeResources />

      <Testimonials />

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
