"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
      "글로만 읽던 이론을 직접 만지며 이해하세요. 전기력선, 평행도선 자기력 등 핵심 원리를 시뮬레이터로 익힐 수 있습니다. 전기이론 / 전기기기 / 전기설비 카테고리에서 더 많은 시뮬을 만나보세요.",
    highlights: [
      "전기장 / 자기장 / 회로 시각화",
      "변수 조절로 즉각 결과 확인",
      "카테고리별 시뮬레이터 모음",
    ],
    status: "available",
    cta: { label: "시뮬레이터 사이트로", href: "/simulator" },
    preview: { kind: "iframe", src: "/samples/simulator-electric-field.html" },
  },
];

const stats = [
  { value: "100%", label: "기출 해설 무료 공개" },
  { value: "1,000+", label: "엄선된 CBT 문제" },
  { value: "5", label: "차별화 학습 도구" },
];

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = features.find((f) => f.id === activeId);

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
              <span
                className="cursor-not-allowed rounded-md border border-zinc-200 bg-zinc-50 px-6 py-3 text-sm font-semibold text-zinc-400"
                title="준비중"
              >
                해설강의 (Coming Soon)
              </span>
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
            카드를 클릭하면 미리보기를 확인할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
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
              "group relative rounded-xl border border-zinc-200 bg-white p-6 text-left transition";
            const interactiveClass = " hover:border-blue-300 hover:shadow-md";

            if (goesToPage && feature.cta) {
              return (
                <Link
                  key={feature.id}
                  href={feature.cta.href}
                  className={`${baseClass}${interactiveClass} block`}
                >
                  {cardInner}
                </Link>
              );
            }

            if (hasModal) {
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => setActiveId(feature.id)}
                  className={`${baseClass}${interactiveClass}`}
                >
                  {cardInner}
                </button>
              );
            }

            return (
              <div
                key={feature.id}
                className={`${baseClass} cursor-default opacity-80`}
              >
                {cardInner}
              </div>
            );
          })}
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
            <Link
              href="/cbt"
              className="mt-6 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              학습 시작하기
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {active && (
        <FeaturePreviewModal feature={active} onClose={() => setActiveId(null)} />
      )}
    </div>
  );
}
