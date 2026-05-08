import type { Subject } from "@/lib/cbt/types";

export type Simulator = {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  topic: string;
  status: "available" | "coming_soon";
  htmlPath?: string;
  emoji: string;
};

export const simulators: Simulator[] = [
  // 전기이론
  {
    id: "electric-field",
    title: "전기력선",
    description:
      "두 점전하에 의한 전기력선의 분포와 전기장의 세기를 마우스로 조작하며 시각적으로 익혀보세요.",
    subject: "전기이론",
    topic: "전자기 · 정전계",
    status: "available",
    htmlPath: "/samples/simulator-electric-field.html",
    emoji: "⚡",
  },
  {
    id: "parallel-wires",
    title: "평행도선의 자기력",
    description:
      "평행하게 놓인 두 도선에 흐르는 전류의 방향과 크기에 따라 변하는 자기력 작용을 확인합니다.",
    subject: "전기이론",
    topic: "전자기 · 자계",
    status: "available",
    htmlPath: "/samples/simulator-parallel-wires.html",
    emoji: "🧲",
  },
  {
    id: "rlc-resonance",
    title: "RLC 공진 회로",
    description:
      "주파수에 따른 임피던스 변화와 공진점에서의 전류·전압 응답을 그래프로 관찰합니다.",
    subject: "전기이론",
    topic: "교류회로 · 공진",
    status: "coming_soon",
    emoji: "📈",
  },
  {
    id: "series-parallel",
    title: "직병렬 회로",
    description:
      "저항을 직렬·병렬로 자유롭게 배치하고 전체 합성 저항과 전류 분배를 즉시 확인합니다.",
    subject: "전기이론",
    topic: "직류회로",
    status: "coming_soon",
    emoji: "🔀",
  },
  // 전기기기
  {
    id: "transformer-ratio",
    title: "변압기 권수비",
    description:
      "1차/2차 권수와 부하를 조절하면서 권수비, 변압비, 전류비의 관계를 직관적으로 학습합니다.",
    subject: "전기기기",
    topic: "변압기",
    status: "coming_soon",
    emoji: "🔁",
  },
  {
    id: "dc-machine",
    title: "직류기 동작 원리",
    description:
      "직류 발전기와 전동기의 회전 자장과 정류 동작을 애니메이션으로 따라가며 이해합니다.",
    subject: "전기기기",
    topic: "직류기",
    status: "coming_soon",
    emoji: "⚙️",
  },
  {
    id: "induction-motor",
    title: "유도전동기 회전 자계",
    description:
      "3상 권선이 만드는 회전 자계와 슬립의 변화에 따른 토크 곡선을 시각화합니다.",
    subject: "전기기기",
    topic: "유도전동기",
    status: "coming_soon",
    emoji: "🌀",
  },
  // 전기설비
  {
    id: "grounding",
    title: "접지 저항 측정",
    description:
      "전극 배치와 토양 저항률에 따른 접지 저항 값의 변화를 시뮬레이션으로 확인합니다.",
    subject: "전기설비",
    topic: "접지",
    status: "coming_soon",
    emoji: "🌍",
  },
  {
    id: "circuit-breaker",
    title: "차단기 동작",
    description:
      "과전류·단락 상황에서 차단기와 누전차단기가 어떻게 회로를 보호하는지 단계별로 살펴봅니다.",
    subject: "전기설비",
    topic: "보호장치",
    status: "coming_soon",
    emoji: "🛡️",
  },
];

export function getSimulator(id: string): Simulator | undefined {
  return simulators.find((s) => s.id === id);
}

export const SIMULATOR_SUBJECTS: Subject[] = [
  "전기이론",
  "전기기기",
  "전기설비",
];
