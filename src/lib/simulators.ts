import type { Subject } from "@/lib/cbt/types";

export type SimulatorExample = {
  question: string;
  given: string[];
  solution: string[];
  answer: string;
};

export type SimulatorFormula = {
  name: string;
  expression: string;
  meaning: string;
};

export type Simulator = {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  topic: string;
  status: "available" | "coming_soon";
  htmlPath?: string;
  emoji: string;
  formula?: SimulatorFormula[];
  example?: SimulatorExample;
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
    formula: [
      {
        name: "쿨롱의 법칙",
        expression: "F = k · (Q₁·Q₂) / r²",
        meaning: "두 점전하 사이의 힘. k = 9×10⁹ [N·m²/C²]",
      },
      {
        name: "전기장의 세기",
        expression: "E = F / q = kQ / r²",
        meaning: "단위 양전하가 받는 힘. 단위 [V/m]",
      },
    ],
    example: {
      question:
        "거리가 0.1 m 떨어진 두 점전하 Q₁ = 2 μC, Q₂ = 3 μC 사이에 작용하는 정전기력은 몇 N인가?",
      given: [
        "Q₁ = 2 × 10⁻⁶ C",
        "Q₂ = 3 × 10⁻⁶ C",
        "r = 0.1 m",
        "k = 9 × 10⁹ N·m²/C²",
      ],
      solution: [
        "F = k · (Q₁·Q₂) / r²",
        "F = (9×10⁹) × (2×10⁻⁶ × 3×10⁻⁶) / (0.1)²",
        "F = (9×10⁹) × (6×10⁻¹²) / 0.01",
        "F = 5.4 N",
      ],
      answer: "5.4 N",
    },
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
    formula: [
      {
        name: "단위 길이당 힘",
        expression: "F/L = μ₀ · I₁ · I₂ / (2π · d)",
        meaning: "μ₀ = 4π×10⁻⁷ [H/m] · 같은 방향 전류 → 흡인, 반대 → 반발",
      },
    ],
    example: {
      question:
        "거리 0.5 m 떨어진 두 평행 도선에 각각 10 A씩 같은 방향으로 흐를 때, 단위 길이당 작용하는 힘은?",
      given: ["I₁ = I₂ = 10 A", "d = 0.5 m", "μ₀ = 4π × 10⁻⁷ H/m"],
      solution: [
        "F/L = μ₀·I₁·I₂ / (2π·d)",
        "F/L = (4π×10⁻⁷ × 10 × 10) / (2π × 0.5)",
        "F/L = (4×10⁻⁵) / 1",
        "F/L = 4 × 10⁻⁵ N/m (흡인)",
      ],
      answer: "4 × 10⁻⁵ N/m (흡인)",
    },
  },
  {
    id: "rlc-resonance",
    title: "RLC 공진 회로",
    description:
      "주파수에 따른 임피던스 변화와 공진점에서의 전류·전압 응답을 그래프로 관찰합니다.",
    subject: "전기이론",
    topic: "교류회로 · 공진",
    status: "available",
    htmlPath: "/samples/simulator-rlc-resonance.html",
    emoji: "📈",
    formula: [
      {
        name: "공진 주파수",
        expression: "f₀ = 1 / (2π · √(L·C))",
        meaning: "X_L = X_C 가 되는 주파수, 임피던스가 R로 최소",
      },
      {
        name: "Q 인자 (선택도)",
        expression: "Q = (1/R) · √(L/C)",
        meaning: "공진의 날카로움. Q가 클수록 좁고 뾰족한 공진",
      },
      {
        name: "임피던스",
        expression: "|Z| = √(R² + (X_L − X_C)²)",
        meaning: "X_L = ωL, X_C = 1/(ωC)",
      },
    ],
    example: {
      question:
        "L = 10 mH, C = 10 μF인 직렬 RLC 회로의 공진 주파수 f₀는 약 몇 Hz인가?",
      given: ["L = 10 × 10⁻³ H", "C = 10 × 10⁻⁶ F"],
      solution: [
        "f₀ = 1 / (2π · √(L·C))",
        "L·C = 10⁻² × 10⁻⁵ = 10⁻⁷",
        "√(L·C) = 3.16 × 10⁻⁴",
        "f₀ = 1 / (2π × 3.16×10⁻⁴) ≈ 503 Hz",
      ],
      answer: "약 503 Hz",
    },
  },
  {
    id: "series-parallel",
    title: "직병렬 회로",
    description:
      "저항을 직렬·병렬로 자유롭게 배치하고 전체 합성 저항과 전류 분배를 즉시 확인합니다.",
    subject: "전기이론",
    topic: "직류회로",
    status: "available",
    htmlPath: "/samples/simulator-series-parallel.html",
    emoji: "🔀",
    formula: [
      {
        name: "직렬 합성",
        expression: "R = R₁ + R₂ + R₃",
        meaning: "전류 동일, 전압 분배",
      },
      {
        name: "병렬 합성",
        expression: "1/R = 1/R₁ + 1/R₂ + 1/R₃",
        meaning: "전압 동일, 전류 분배",
      },
    ],
    example: {
      question:
        "10 Ω과 20 Ω의 저항이 병렬로 연결되어 12 V가 가해질 때 합성저항과 전체 전류는?",
      given: ["R₁ = 10 Ω", "R₂ = 20 Ω", "V = 12 V"],
      solution: [
        "R = (R₁·R₂) / (R₁+R₂) = (10·20)/(10+20)",
        "R = 200/30 ≈ 6.67 Ω",
        "I = V/R = 12 / 6.67 ≈ 1.8 A",
      ],
      answer: "R ≈ 6.67 Ω, I ≈ 1.8 A",
    },
  },
  {
    id: "ohms-law",
    title: "옴의 법칙",
    description:
      "전압·전류·저항 중 두 변수를 잡으면 나머지가 즉시 계산됩니다. 전류 흐름 애니메이션으로 직관 강화.",
    subject: "전기이론",
    topic: "직류회로",
    status: "available",
    htmlPath: "/samples/simulator-ohms-law.html",
    emoji: "⚡",
    formula: [
      {
        name: "옴의 법칙",
        expression: "V = I · R",
        meaning: "I = V/R, R = V/I 로 변형 가능",
      },
      {
        name: "전력 공식",
        expression: "P = V · I = I²·R = V²/R",
        meaning: "단위는 와트 [W]",
      },
    ],
    example: {
      question:
        "저항 8 Ω에 24 V의 전압을 가했을 때 흐르는 전류와 소비전력은?",
      given: ["V = 24 V", "R = 8 Ω"],
      solution: ["I = V / R = 24 / 8 = 3 A", "P = V·I = 24 × 3 = 72 W"],
      answer: "I = 3 A, P = 72 W",
    },
  },
  {
    id: "kirchhoff",
    title: "키르히호프 법칙 (KCL/KVL)",
    description:
      "병렬 회로의 분기점에서 KCL을, 폐회로 합으로 KVL을 동시에 검증합니다.",
    subject: "전기이론",
    topic: "직류회로",
    status: "available",
    htmlPath: "/samples/simulator-kirchhoff.html",
    emoji: "🔗",
    formula: [
      {
        name: "전류 법칙 (KCL)",
        expression: "Σ I_in = Σ I_out",
        meaning: "한 접점에서 들어가는 전류 = 나오는 전류",
      },
      {
        name: "전압 법칙 (KVL)",
        expression: "Σ V (폐회로) = 0",
        meaning: "폐회로 한 바퀴 전압 합은 0",
      },
    ],
    example: {
      question:
        "12 V 전압원에 R₁ = 4 Ω, R₂ = 6 Ω이 병렬로 연결되어 있다. 각 분기 전류와 전체 전류는?",
      given: ["V = 12 V", "R₁ = 4 Ω, R₂ = 6 Ω"],
      solution: [
        "병렬이므로 V_R1 = V_R2 = 12 V",
        "I₁ = V/R₁ = 12/4 = 3 A",
        "I₂ = V/R₂ = 12/6 = 2 A",
        "KCL → I = I₁ + I₂ = 5 A",
      ],
      answer: "I₁ = 3 A, I₂ = 2 A, I = 5 A",
    },
  },
  // 전기기기
  {
    id: "transformer-ratio",
    title: "변압기 권수비",
    description:
      "1차/2차 권수와 부하를 조절하면서 권수비, 변압비, 전류비의 관계를 직관적으로 학습합니다.",
    subject: "전기기기",
    topic: "변압기",
    status: "available",
    htmlPath: "/samples/simulator-transformer-ratio.html",
    emoji: "🔁",
    formula: [
      {
        name: "권수비 / 변압비",
        expression: "a = N₁ / N₂ = V₁ / V₂",
        meaning: "1차 권수와 2차 권수의 비",
      },
      {
        name: "전류비",
        expression: "I₂ / I₁ = N₁ / N₂ = a",
        meaning: "전류는 권수에 반비례",
      },
      {
        name: "임피던스비",
        expression: "Z₁ / Z₂ = a²",
        meaning: "1차에서 본 부하 임피던스",
      },
    ],
    example: {
      question:
        "1차 권수 N₁ = 200, 2차 권수 N₂ = 100인 변압기에 1차 220 V를 가했을 때 2차 단자전압은?",
      given: ["N₁ = 200", "N₂ = 100", "V₁ = 220 V"],
      solution: [
        "권수비 a = N₁/N₂ = 2",
        "V₂ = V₁ / a = 220 / 2 = 110 V",
        "(N₁ > N₂ → 강압)",
      ],
      answer: "V₂ = 110 V (강압)",
    },
  },
  {
    id: "transformer-connection",
    title: "변압기 결선 (Y/Δ)",
    description:
      "Y(성형)·Δ(삼각) 결선의 선간/상 전압·전류 관계를 그림과 함께 비교합니다.",
    subject: "전기기기",
    topic: "변압기",
    status: "available",
    htmlPath: "/samples/simulator-transformer-connection.html",
    emoji: "🔺",
    formula: [
      {
        name: "Y 결선 (성형)",
        expression: "V_L = √3 · V_p, I_L = I_p",
        meaning: "선간전압이 상전압의 √3 배",
      },
      {
        name: "Δ 결선 (삼각)",
        expression: "V_L = V_p, I_L = √3 · I_p",
        meaning: "선전류가 상전류의 √3 배",
      },
      {
        name: "3상 전력",
        expression: "P = √3 · V_L · I_L · cosφ",
        meaning: "결선 방식과 무관하게 동일",
      },
    ],
    example: {
      question:
        "Y 결선된 3상 변압기에서 상전압 V_p = 220 V일 때 선간전압 V_L은?",
      given: ["V_p = 220 V", "결선: Y"],
      solution: ["V_L = √3 × V_p", "V_L = 1.732 × 220 ≈ 381 V"],
      answer: "V_L ≈ 381 V",
    },
  },
  {
    id: "dc-machine",
    title: "직류기 동작 원리",
    description:
      "직류 발전기와 전동기의 회전 자장과 정류 동작을 애니메이션으로 따라가며 이해합니다.",
    subject: "전기기기",
    topic: "직류기",
    status: "available",
    htmlPath: "/samples/simulator-dc-machine.html",
    emoji: "⚙️",
    formula: [
      {
        name: "유도 기전력",
        expression: "e = B · L · v · sinθ",
        meaning: "회전 코일 한 변에 유기되는 전압",
      },
      {
        name: "직류 출력 (정류 후)",
        expression: "E_avg = (2/π) · E_max",
        meaning: "정류자가 매 반회전마다 극성을 뒤집어 직류로",
      },
    ],
    example: {
      question:
        "B = 1.2 T 자기장 속에서 길이 0.1 m 도체가 2 m/s 속도로 자기장과 수직으로 움직일 때 유도 기전력은?",
      given: ["B = 1.2 T", "L = 0.1 m", "v = 2 m/s", "θ = 90°"],
      solution: [
        "e = B · L · v · sinθ",
        "e = 1.2 × 0.1 × 2 × sin90°",
        "e = 0.24 × 1 = 0.24 V",
      ],
      answer: "e = 0.24 V",
    },
  },
  {
    id: "induction-motor",
    title: "유도전동기 회전 자계",
    description:
      "3상 권선이 만드는 회전 자계와 슬립의 변화에 따른 토크 곡선을 시각화합니다.",
    subject: "전기기기",
    topic: "유도전동기",
    status: "available",
    htmlPath: "/samples/simulator-induction-motor.html",
    emoji: "🌀",
    formula: [
      {
        name: "동기 속도",
        expression: "N_s = 120 · f / P",
        meaning: "f [Hz], P 극수, 단위 [rpm]",
      },
      {
        name: "회전자 속도",
        expression: "N = N_s · (1 − s)",
        meaning: "s = 슬립 (0 < s < 1)",
      },
      {
        name: "슬립",
        expression: "s = (N_s − N) / N_s",
        meaning: "동기와 실제 회전속도의 차이 비율",
      },
    ],
    example: {
      question:
        "전원 주파수 60 Hz, 4극 유도전동기의 동기속도와 슬립 4%일 때 회전자 속도는?",
      given: ["f = 60 Hz", "P = 4극", "s = 0.04"],
      solution: [
        "N_s = 120·f/P = 120×60/4 = 1800 rpm",
        "N = N_s(1−s) = 1800 × 0.96 = 1728 rpm",
      ],
      answer: "N_s = 1800 rpm, N = 1728 rpm",
    },
  },
  {
    id: "synchronous",
    title: "동기기 위상 (P-δ 곡선)",
    description:
      "동기 발전기의 부하각 변화에 따른 출력 전력과 동기 한계를 시각화합니다.",
    subject: "전기기기",
    topic: "동기기",
    status: "available",
    htmlPath: "/samples/simulator-synchronous.html",
    emoji: "⚙️",
    formula: [
      {
        name: "출력 전력",
        expression: "P = (E · V / X_s) · sinδ",
        meaning: "δ = 부하각 (E와 V 사이의 위상차)",
      },
      {
        name: "최대 출력",
        expression: "P_max = E · V / X_s",
        meaning: "δ = 90°에서 발생, 동기 한계",
      },
    ],
    example: {
      question:
        "유기 기전력 E = 220 V, 단자 전압 V = 200 V, 동기 임피던스 X_s = 5 Ω, 부하각 δ = 30°일 때 출력 전력은?",
      given: ["E = 220 V", "V = 200 V", "X_s = 5 Ω", "δ = 30°"],
      solution: [
        "P = (E·V/X_s)·sinδ",
        "P = (220×200/5) × sin30°",
        "P = 8800 × 0.5 = 4400 W = 4.4 kW",
      ],
      answer: "P ≈ 4.4 kW",
    },
  },
  // 전기설비
  {
    id: "grounding",
    title: "접지 저항 측정",
    description:
      "전극 배치와 토양 저항률에 따른 접지 저항 값의 변화를 시뮬레이션으로 확인합니다.",
    subject: "전기설비",
    topic: "접지",
    status: "available",
    htmlPath: "/samples/simulator-grounding.html",
    emoji: "🌍",
    formula: [
      {
        name: "봉형 접지 저항",
        expression: "R = (ρ / 2π·L) · ln(4L / d)",
        meaning: "ρ [Ω·m] 토양 저항률, L 길이, d 직경",
      },
      {
        name: "판형 접지 저항",
        expression: "R = ρ / (4·√(A/π))",
        meaning: "A 판 면적 [m²]",
      },
    ],
    example: {
      question:
        "토양 저항률 ρ = 100 Ω·m, 길이 2 m, 직경 14 mm 봉형 접지 전극의 접지 저항은? (자연로그 ln 사용)",
      given: ["ρ = 100 Ω·m", "L = 2 m", "d = 0.014 m"],
      solution: [
        "R = (ρ/2π·L) · ln(4L/d)",
        "R = (100 / (2π·2)) · ln(8/0.014)",
        "R = (100/12.57) × ln(571)",
        "R ≈ 7.96 × 6.35 ≈ 50.5 Ω",
      ],
      answer: "R ≈ 50.5 Ω",
    },
  },
  {
    id: "circuit-breaker",
    title: "차단기 동작",
    description:
      "과전류·단락 상황에서 차단기와 누전차단기가 어떻게 회로를 보호하는지 단계별로 살펴봅니다.",
    subject: "전기설비",
    topic: "보호장치",
    status: "available",
    htmlPath: "/samples/simulator-circuit-breaker.html",
    emoji: "🛡️",
    formula: [
      {
        name: "역시간 특성",
        expression: "t = K / ((I/I_n)² − 1)",
        meaning: "I 측정 전류, I_n 정격, K 차단기 종류별 상수",
      },
      {
        name: "단락 즉시 차단",
        expression: "t ≤ 0.02 s (I/I_n ≥ 8)",
        meaning: "정격의 8배 이상 단락 전류 시 즉시 트립",
      },
    ],
    example: {
      question:
        "정격 전류 20 A인 MCCB에 60 A (3배)의 과전류가 흐를 때 트립 예상 시간은? (K = 60)",
      given: ["I_n = 20 A", "I = 60 A → I/I_n = 3", "K = 60"],
      solution: [
        "t = K / ((I/I_n)² − 1)",
        "t = 60 / (3² − 1) = 60 / 8",
        "t = 7.5 초",
      ],
      answer: "t = 7.5 초",
    },
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
