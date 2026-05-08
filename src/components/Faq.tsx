"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const items = [
  {
    q: "전기기능사 필기 시험은 어떻게 진행되나요?",
    a: "60문항을 60분 안에 풀고, 100점 만점에 60점 이상 획득하면 합격입니다. 저희 CBT 모의고사는 실제 시험과 동일한 환경으로 구성되어 있어요.",
  },
  {
    q: "회원가입 없이 무료로 이용할 수 있나요?",
    a: "예. CBT 모의고사 일부 회차와 기출 해설강의, 시뮬레이터는 회원가입 없이도 이용할 수 있습니다. 학습 진도와 즐겨찾기를 저장하려면 가입을 추천드려요.",
  },
  {
    q: "결제는 어떻게 진행되나요?",
    a: "프리미엄 콘텐츠는 토스페이먼츠/카드 결제를 지원할 예정입니다 (출시 준비 중). 출시 후 안내 메일로 알려드리겠습니다.",
  },
  {
    q: "환불 규정은 어떻게 되나요?",
    a: "결제일로부터 7일 이내, 콘텐츠 진도율 10% 미만이면 전액 환불 가능합니다. 자세한 내용은 이용약관을 확인해 주세요.",
  },
  {
    q: "PC와 모바일 모두 사용할 수 있나요?",
    a: "예, 반응형으로 제작되어 PC·태블릿·모바일에서 모두 이용 가능합니다. 시뮬레이터는 PC 환경에 최적화되어 있습니다.",
  },
  {
    q: "기출 문제는 몇 년치까지 제공되나요?",
    a: "2009년부터 2016년까지 출제된 전기기능사 필기 기출 전 회차를 제공합니다. 새 시즌에 맞춰 추가될 예정입니다.",
  },
  {
    q: "오답 노트나 즐겨찾기 같은 기능이 있나요?",
    a: "예. CBT 응시 중 체크 표시한 문항은 해설에서 별도로 모아볼 수 있고, 플립 암기카드는 즐겨찾기 카드 모음을 자동 생성합니다.",
  },
  {
    q: "단체 수강 / 기업 교육은 가능한가요?",
    a: "5인 이상 단체나 기업 교육은 별도 제휴가 가능합니다. 1:1 문의로 회사명·인원·일정과 함께 문의 주세요.",
  },
  {
    q: "이론 시뮬레이터는 오프라인에서도 동작하나요?",
    a: "현재는 온라인에서만 이용 가능합니다. 데이터 없이 동작하므로 모바일 데이터가 제한적인 환경에서도 무리 없이 실행됩니다.",
  },
  {
    q: "다른 자격증도 같이 준비할 수 있나요?",
    a: "현재는 전기기능사 필기 위주이며, 향후 컴퓨터활용능력·전산회계 등 자격증 카테고리 확장을 준비 중입니다.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-wide text-blue-600">FAQ</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            자주 묻는 질문
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            궁금한 점이 있다면 먼저 자주 묻는 질문을 확인해 보세요.
          </p>
        </div>

        <Reveal type="fade-up">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={i > 0 ? "border-t border-zinc-100" : ""}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-zinc-50"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      Q
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 sm:text-base">
                      {it.q}
                    </span>
                  </span>
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm text-zinc-600 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ⌄
                  </span>
                </button>
                {isOpen && (
                  <div className="bg-zinc-50/60 px-6 pb-5 pt-1">
                    <div className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        A
                      </span>
                      <p className="text-sm leading-6 text-zinc-700">{it.a}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </Reveal>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm text-zinc-600 sm:flex-row sm:justify-center">
          <span>원하는 답변을 찾지 못하셨나요?</span>
          <a
            href="#"
            className="font-semibold text-blue-600 hover:text-blue-800"
          >
            1:1 문의하기 →
          </a>
        </div>
      </div>
    </section>
  );
}
