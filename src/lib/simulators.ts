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

/**
 * 수식은 $...$로 감싸 LaTeX 문법 사용.
 * MathText/InlineMath 컴포넌트가 렌더 처리.
 */

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
        expression: "$F = k \\cdot \\dfrac{Q_1 \\cdot Q_2}{r^2}$",
        meaning: "두 점전하 사이의 힘. $k = 9 \\times 10^9$ [N·m²/C²]",
      },
      {
        name: "전기장의 세기",
        expression: "$E = \\dfrac{F}{q} = \\dfrac{kQ}{r^2}$",
        meaning: "단위 양전하가 받는 힘. 단위 [V/m]",
      },
    ],
    example: {
      question:
        "거리가 0.1 m 떨어진 두 점전하 $Q_1 = 2\\ \\mu\\text{C}$, $Q_2 = 3\\ \\mu\\text{C}$ 사이에 작용하는 정전기력은 몇 N인가?",
      given: [
        "$Q_1 = 2 \\times 10^{-6}$ C",
        "$Q_2 = 3 \\times 10^{-6}$ C",
        "$r = 0.1$ m",
        "$k = 9 \\times 10^9$ N·m²/C²",
      ],
      solution: [
        "$F = k \\cdot \\dfrac{Q_1 \\cdot Q_2}{r^2}$",
        "$F = (9 \\times 10^9) \\times \\dfrac{2 \\times 10^{-6} \\cdot 3 \\times 10^{-6}}{0.1^2}$",
        "$F = (9 \\times 10^9) \\times \\dfrac{6 \\times 10^{-12}}{0.01}$",
        "$F = 5.4$ N",
      ],
      answer: "$F = 5.4$ N",
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
        expression: "$\\dfrac{F}{L} = \\dfrac{\\mu_0 \\cdot I_1 \\cdot I_2}{2\\pi \\cdot d}$",
        meaning:
          "$\\mu_0 = 4\\pi \\times 10^{-7}$ H/m. 같은 방향 → 흡인, 반대 → 반발",
      },
    ],
    example: {
      question:
        "거리 0.5 m 떨어진 두 평행 도선에 각각 10 A씩 같은 방향으로 흐를 때, 단위 길이당 작용하는 힘은?",
      given: ["$I_1 = I_2 = 10$ A", "$d = 0.5$ m", "$\\mu_0 = 4\\pi \\times 10^{-7}$ H/m"],
      solution: [
        "$\\dfrac{F}{L} = \\dfrac{\\mu_0 I_1 I_2}{2\\pi d}$",
        "$\\dfrac{F}{L} = \\dfrac{4\\pi \\times 10^{-7} \\times 10 \\times 10}{2\\pi \\times 0.5}$",
        "$\\dfrac{F}{L} = \\dfrac{4 \\times 10^{-5}}{1}$",
        "$\\dfrac{F}{L} = 4 \\times 10^{-5}$ N/m (흡인)",
      ],
      answer: "$\\dfrac{F}{L} = 4 \\times 10^{-5}$ N/m (흡인)",
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
        expression: "$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}$",
        meaning: "$X_L = X_C$ 가 되는 주파수, 임피던스가 R로 최소",
      },
      {
        name: "Q 인자 (선택도)",
        expression: "$Q = \\dfrac{1}{R}\\sqrt{\\dfrac{L}{C}}$",
        meaning: "공진의 날카로움. Q가 클수록 좁고 뾰족한 공진",
      },
      {
        name: "임피던스",
        expression: "$|Z| = \\sqrt{R^2 + (X_L - X_C)^2}$",
        meaning: "$X_L = \\omega L$, $X_C = \\dfrac{1}{\\omega C}$",
      },
    ],
    example: {
      question:
        "$L = 10$ mH, $C = 10\\ \\mu$F인 직렬 RLC 회로의 공진 주파수 $f_0$는 약 몇 Hz인가?",
      given: ["$L = 10 \\times 10^{-3}$ H", "$C = 10 \\times 10^{-6}$ F"],
      solution: [
        "$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}$",
        "$LC = 10^{-2} \\times 10^{-5} = 10^{-7}$",
        "$\\sqrt{LC} = 3.16 \\times 10^{-4}$",
        "$f_0 = \\dfrac{1}{2\\pi \\times 3.16 \\times 10^{-4}} \\approx 503$ Hz",
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
        expression: "$R = R_1 + R_2 + R_3$",
        meaning: "전류 동일, 전압 분배",
      },
      {
        name: "병렬 합성",
        expression: "$\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2} + \\dfrac{1}{R_3}$",
        meaning: "전압 동일, 전류 분배",
      },
    ],
    example: {
      question:
        "10 Ω과 20 Ω의 저항이 병렬로 연결되어 12 V가 가해질 때 합성저항과 전체 전류는?",
      given: ["$R_1 = 10\\ \\Omega$", "$R_2 = 20\\ \\Omega$", "$V = 12$ V"],
      solution: [
        "$R = \\dfrac{R_1 \\cdot R_2}{R_1 + R_2} = \\dfrac{10 \\times 20}{10 + 20}$",
        "$R = \\dfrac{200}{30} \\approx 6.67\\ \\Omega$",
        "$I = \\dfrac{V}{R} = \\dfrac{12}{6.67} \\approx 1.8$ A",
      ],
      answer: "$R \\approx 6.67\\ \\Omega$, $I \\approx 1.8$ A",
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
        expression: "$V = I \\cdot R$",
        meaning: "$I = V/R$, $R = V/I$ 로 변형 가능",
      },
      {
        name: "전력 공식",
        expression: "$P = V \\cdot I = I^2 R = \\dfrac{V^2}{R}$",
        meaning: "단위는 와트 [W]",
      },
    ],
    example: {
      question: "저항 8 Ω에 24 V의 전압을 가했을 때 흐르는 전류와 소비전력은?",
      given: ["$V = 24$ V", "$R = 8\\ \\Omega$"],
      solution: [
        "$I = \\dfrac{V}{R} = \\dfrac{24}{8} = 3$ A",
        "$P = V \\cdot I = 24 \\times 3 = 72$ W",
      ],
      answer: "$I = 3$ A, $P = 72$ W",
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
        expression: "$\\sum I_{in} = \\sum I_{out}$",
        meaning: "한 접점에서 들어가는 전류 = 나오는 전류",
      },
      {
        name: "전압 법칙 (KVL)",
        expression: "$\\sum V_{loop} = 0$",
        meaning: "폐회로 한 바퀴 전압 합은 0",
      },
    ],
    example: {
      question:
        "12 V 전압원에 $R_1 = 4\\ \\Omega$, $R_2 = 6\\ \\Omega$이 병렬로 연결되어 있다. 각 분기 전류와 전체 전류는?",
      given: ["$V = 12$ V", "$R_1 = 4\\ \\Omega$, $R_2 = 6\\ \\Omega$"],
      solution: [
        "병렬이므로 $V_{R_1} = V_{R_2} = 12$ V",
        "$I_1 = \\dfrac{V}{R_1} = \\dfrac{12}{4} = 3$ A",
        "$I_2 = \\dfrac{V}{R_2} = \\dfrac{12}{6} = 2$ A",
        "KCL → $I = I_1 + I_2 = 5$ A",
      ],
      answer: "$I_1 = 3$ A, $I_2 = 2$ A, $I = 5$ A",
    },
  },
  // 전기이론 — 추가 10종 (풀 메타데이터, 공식 + 예제 포함)
  {
    id: "voltage-divider",
    title: "전압분배 법칙",
    description:
      "직렬 저항회로에서 각 저항이 어떻게 전압을 나눠 가지는지 슬라이더로 직접 조작해 확인합니다.",
    subject: "전기이론",
    topic: "직류회로",
    status: "coming_soon",
    emoji: "📊",
    formula: [
      {
        name: "전압분배 공식",
        expression: "$V_n = V \\cdot \\dfrac{R_n}{R_1 + R_2 + \\cdots + R_k}$",
        meaning: "특정 저항에 걸리는 전압은 전체 저항 대비 비율만큼 분배",
      },
      {
        name: "두 저항 직렬",
        expression: "$V_1 = V \\cdot \\dfrac{R_1}{R_1 + R_2}$",
        meaning: "가장 자주 나오는 형태. $V_2$는 $R_2$로 치환",
      },
    ],
    example: {
      question:
        "12 V 전압원에 $R_1 = 4\\ \\Omega$과 $R_2 = 8\\ \\Omega$이 직렬로 연결되었을 때 $R_2$ 양단의 전압은?",
      given: ["$V = 12$ V", "$R_1 = 4\\ \\Omega$", "$R_2 = 8\\ \\Omega$"],
      solution: [
        "$V_2 = V \\cdot \\dfrac{R_2}{R_1 + R_2}$",
        "$V_2 = 12 \\times \\dfrac{8}{4 + 8}$",
        "$V_2 = 12 \\times \\dfrac{8}{12} = 8$ V",
      ],
      answer: "$V_2 = 8$ V",
    },
  },
  {
    id: "current-divider",
    title: "전류분배 법칙",
    description:
      "병렬회로에서 각 가지로 흐르는 전류 비율을 시각화. 저항이 작은 쪽에 더 많은 전류가 흐른다는 직관을 굳혀줍니다.",
    subject: "전기이론",
    topic: "직류회로",
    status: "coming_soon",
    emoji: "🔀",
    formula: [
      {
        name: "두 저항 병렬 분배",
        expression: "$I_1 = I \\cdot \\dfrac{R_2}{R_1 + R_2}$",
        meaning: "주의: 분자에 자신이 아닌 상대 저항이 옴 (반비례 관계)",
      },
      {
        name: "$N$개 병렬 일반식",
        expression: "$I_n = I \\cdot \\dfrac{1/R_n}{\\sum 1/R_k}$",
        meaning: "컨덕턴스 $G = 1/R$에 비례",
      },
    ],
    example: {
      question:
        "전체 전류 6 A가 흐르는 회로에 $R_1 = 2\\ \\Omega$, $R_2 = 4\\ \\Omega$이 병렬일 때 $R_1$에 흐르는 전류는?",
      given: ["$I = 6$ A", "$R_1 = 2\\ \\Omega$", "$R_2 = 4\\ \\Omega$"],
      solution: [
        "$I_1 = I \\cdot \\dfrac{R_2}{R_1 + R_2}$",
        "$I_1 = 6 \\times \\dfrac{4}{2 + 4}$",
        "$I_1 = 6 \\times \\dfrac{4}{6} = 4$ A",
      ],
      answer: "$I_1 = 4$ A",
    },
  },
  {
    id: "capacitor",
    title: "정전용량 (커패시터)",
    description:
      "극판 면적·간격·유전체에 따른 정전용량 변화와 충전된 전하·에너지를 함께 학습합니다.",
    subject: "전기이론",
    topic: "정전계",
    status: "coming_soon",
    emoji: "🔋",
    formula: [
      {
        name: "정전용량",
        expression: "$C = \\dfrac{Q}{V} = \\dfrac{\\varepsilon A}{d}$",
        meaning: "$\\varepsilon$ 유전율, $A$ 극판 면적, $d$ 극판 간격",
      },
      {
        name: "축적 에너지",
        expression: "$W = \\dfrac{1}{2} C V^2 = \\dfrac{Q^2}{2C}$",
        meaning: "전기장 안에 저장되는 에너지 [J]",
      },
    ],
    example: {
      question:
        "정전용량 $C = 100\\ \\mu$F의 커패시터에 50 V를 인가했을 때 축적되는 전하량과 에너지는?",
      given: ["$C = 100 \\times 10^{-6}$ F", "$V = 50$ V"],
      solution: [
        "$Q = CV = 100 \\times 10^{-6} \\times 50 = 5 \\times 10^{-3}$ C",
        "$W = \\dfrac{1}{2}CV^2 = \\dfrac{1}{2} \\times 10^{-4} \\times 2500$",
        "$W = 0.125$ J",
      ],
      answer: "$Q = 5$ mC, $W = 0.125$ J",
    },
  },
  {
    id: "inductor",
    title: "인덕턴스",
    description:
      "코일에 흐르는 전류 변화가 만들어내는 유도 기전력과 코일에 저장되는 자기 에너지를 시각화합니다.",
    subject: "전기이론",
    topic: "자계",
    status: "coming_soon",
    emoji: "🌀",
    formula: [
      {
        name: "자기 인덕턴스",
        expression: "$L = \\dfrac{N \\Phi}{I}$",
        meaning: "$N$ 권수, $\\Phi$ 자속, 단위 [H]",
      },
      {
        name: "유도 기전력",
        expression: "$e = -L \\dfrac{dI}{dt}$",
        meaning: "전류 변화율에 비례, 부호는 변화에 대항(렌츠)",
      },
      {
        name: "축적 에너지",
        expression: "$W = \\dfrac{1}{2} L I^2$",
        meaning: "자기장 안에 저장 [J]",
      },
    ],
    example: {
      question:
        "$L = 0.5$ H 코일에 흐르는 전류가 0.01초 동안 2 A에서 6 A로 변할 때 유도 기전력 크기는?",
      given: ["$L = 0.5$ H", "$dI = 4$ A", "$dt = 0.01$ s"],
      solution: [
        "$|e| = L \\dfrac{dI}{dt} = 0.5 \\times \\dfrac{4}{0.01}$",
        "$|e| = 0.5 \\times 400 = 200$ V",
      ],
      answer: "$|e| = 200$ V",
    },
  },
  {
    id: "rc-transient",
    title: "RC 과도현상 (시정수)",
    description:
      "저항과 커패시터가 직렬일 때 충전·방전 곡선과 시정수 $\\tau = RC$의 의미를 그래프로 익힙니다.",
    subject: "전기이론",
    topic: "과도현상",
    status: "coming_soon",
    emoji: "📉",
    formula: [
      {
        name: "시정수",
        expression: "$\\tau = R \\cdot C$",
        meaning: "$\\tau$ 시간이 지나면 최종값의 63.2% 도달",
      },
      {
        name: "충전 전압",
        expression: "$v_C(t) = V \\left(1 - e^{-t/\\tau}\\right)$",
        meaning: "$5\\tau$ 시점에 약 99% 도달 (실용적 정상상태)",
      },
      {
        name: "방전 전압",
        expression: "$v_C(t) = V_0 \\cdot e^{-t/\\tau}$",
        meaning: "초기 전압 $V_0$에서 지수 감쇠",
      },
    ],
    example: {
      question:
        "$R = 1\\ k\\Omega$, $C = 100\\ \\mu$F의 RC 회로에 10 V를 인가한 직후 시정수와 1 시정수 후의 전압은?",
      given: ["$R = 10^3\\ \\Omega$", "$C = 10^{-4}$ F", "$V = 10$ V"],
      solution: [
        "$\\tau = RC = 10^3 \\times 10^{-4} = 0.1$ s",
        "$v_C(\\tau) = V(1 - e^{-1}) = 10 \\times (1 - 0.368)$",
        "$v_C(\\tau) \\approx 6.32$ V",
      ],
      answer: "$\\tau = 0.1$ s, $v_C(\\tau) \\approx 6.32$ V",
    },
  },
  {
    id: "rl-transient",
    title: "RL 과도현상",
    description:
      "저항과 인덕터가 직렬일 때 전류가 0에서 정상값까지 도달하는 과정을 시정수와 함께 시각화합니다.",
    subject: "전기이론",
    topic: "과도현상",
    status: "coming_soon",
    emoji: "📈",
    formula: [
      {
        name: "시정수",
        expression: "$\\tau = \\dfrac{L}{R}$",
        meaning: "RL 회로의 시정수. 단위 [s]",
      },
      {
        name: "전류 상승",
        expression: "$i(t) = \\dfrac{V}{R}\\left(1 - e^{-t/\\tau}\\right)$",
        meaning: "정상값 $V/R$로 수렴",
      },
    ],
    example: {
      question:
        "$L = 2$ H, $R = 100\\ \\Omega$, $V = 20$ V인 RL 회로에서 1 시정수 후의 전류값은?",
      given: ["$L = 2$ H", "$R = 100\\ \\Omega$", "$V = 20$ V"],
      solution: [
        "$\\tau = L/R = 2/100 = 0.02$ s",
        "$I_{max} = V/R = 20/100 = 0.2$ A",
        "$i(\\tau) = 0.2 \\times (1 - 0.368) = 0.2 \\times 0.632$",
        "$i(\\tau) \\approx 0.126$ A",
      ],
      answer: "$i(\\tau) \\approx 0.126$ A",
    },
  },
  {
    id: "rms-average",
    title: "실효값과 평균값",
    description:
      "정현파 교류의 최댓값·평균값·실효값의 관계를 파형 위에서 동시에 확인합니다.",
    subject: "전기이론",
    topic: "교류회로",
    status: "coming_soon",
    emoji: "〰️",
    formula: [
      {
        name: "실효값 (RMS)",
        expression: "$V_{rms} = \\dfrac{V_m}{\\sqrt{2}}$",
        meaning: "발열 효과 기준. 단상 220 V는 실효값",
      },
      {
        name: "평균값",
        expression: "$V_{avg} = \\dfrac{2 V_m}{\\pi}$",
        meaning: "반파 평균 기준 (전파정류 후 값)",
      },
      {
        name: "파형률 · 파고율",
        expression: "$\\text{파형률} = \\dfrac{V_{rms}}{V_{avg}}, \\ \\text{파고율} = \\dfrac{V_m}{V_{rms}}$",
        meaning: "정현파: 파형률 1.11, 파고율 1.414",
      },
    ],
    example: {
      question:
        "최댓값 311 V의 정현파 전압의 실효값과 평균값을 구하시오.",
      given: ["$V_m = 311$ V (정현파)"],
      solution: [
        "$V_{rms} = \\dfrac{V_m}{\\sqrt{2}} = \\dfrac{311}{1.414}$",
        "$V_{rms} \\approx 220$ V",
        "$V_{avg} = \\dfrac{2 V_m}{\\pi} = \\dfrac{622}{3.14}$",
        "$V_{avg} \\approx 198$ V",
      ],
      answer: "$V_{rms} \\approx 220$ V, $V_{avg} \\approx 198$ V",
    },
  },
  {
    id: "impedance-vector",
    title: "임피던스 벡터",
    description:
      "$R$, $X_L$, $X_C$를 벡터로 합성해 임피던스의 크기와 위상각을 직관적으로 이해합니다.",
    subject: "전기이론",
    topic: "교류회로",
    status: "coming_soon",
    emoji: "📐",
    formula: [
      {
        name: "임피던스 크기",
        expression: "$|Z| = \\sqrt{R^2 + (X_L - X_C)^2}$",
        meaning: "직각삼각형의 빗변과 동일한 구조",
      },
      {
        name: "위상각",
        expression: "$\\theta = \\tan^{-1}\\!\\dfrac{X_L - X_C}{R}$",
        meaning: "+면 유도성(전류 지상), −면 용량성(전류 진상)",
      },
      {
        name: "역률",
        expression: "$\\cos\\theta = \\dfrac{R}{|Z|}$",
        meaning: "유효전력 비율. 1에 가까울수록 효율적",
      },
    ],
    example: {
      question:
        "$R = 8\\ \\Omega$, $X_L = 12\\ \\Omega$, $X_C = 6\\ \\Omega$인 직렬 회로의 임피던스와 역률은?",
      given: ["$R = 8\\ \\Omega$", "$X_L = 12\\ \\Omega$", "$X_C = 6\\ \\Omega$"],
      solution: [
        "$X = X_L - X_C = 6\\ \\Omega$ (유도성)",
        "$|Z| = \\sqrt{8^2 + 6^2} = \\sqrt{100} = 10\\ \\Omega$",
        "$\\cos\\theta = 8/10 = 0.8$",
      ],
      answer: "$|Z| = 10\\ \\Omega$, 역률 0.8 (유도성)",
    },
  },
  {
    id: "faraday-law",
    title: "패러데이 전자유도 법칙",
    description:
      "코일 안의 자속 변화가 만들어내는 유도 기전력의 방향과 크기를 시각적으로 확인합니다.",
    subject: "전기이론",
    topic: "전자유도",
    status: "coming_soon",
    emoji: "🧲",
    formula: [
      {
        name: "유도 기전력",
        expression: "$e = -N \\dfrac{d\\Phi}{dt}$",
        meaning: "$N$ 권수, 자속 변화율에 비례. 부호는 렌츠 법칙",
      },
      {
        name: "운동 기전력",
        expression: "$e = B L v$",
        meaning: "자장 $B$ 내 길이 $L$ 도체가 속도 $v$로 운동",
      },
    ],
    example: {
      question:
        "100회 감긴 코일을 통과하는 자속이 0.05초 동안 0.02 Wb에서 0.06 Wb로 증가했을 때 유도 기전력의 크기는?",
      given: ["$N = 100$", "$d\\Phi = 0.04$ Wb", "$dt = 0.05$ s"],
      solution: [
        "$|e| = N \\dfrac{d\\Phi}{dt}$",
        "$|e| = 100 \\times \\dfrac{0.04}{0.05}$",
        "$|e| = 100 \\times 0.8 = 80$ V",
      ],
      answer: "$|e| = 80$ V",
    },
  },
  {
    id: "three-phase-power",
    title: "3상 교류 전력",
    description:
      "Y/Δ 결선 모두에 통용되는 3상 전력 공식과 선간·상 전압·전류 관계를 실시간으로 비교합니다.",
    subject: "전기이론",
    topic: "교류회로",
    status: "coming_soon",
    emoji: "⚡",
    formula: [
      {
        name: "3상 유효전력",
        expression: "$P = \\sqrt{3}\\, V_L I_L \\cos\\theta$",
        meaning: "결선 방식과 무관 (선간·선전류 기준)",
      },
      {
        name: "3상 무효전력",
        expression: "$Q = \\sqrt{3}\\, V_L I_L \\sin\\theta$",
        meaning: "단위 [var]",
      },
      {
        name: "3상 피상전력",
        expression: "$S = \\sqrt{3}\\, V_L I_L$",
        meaning: "단위 [VA]. $S^2 = P^2 + Q^2$",
      },
    ],
    example: {
      question:
        "3상 380 V 평형 부하에 선전류 20 A, 역률 0.8 (지상)이 흐를 때 유효전력은?",
      given: ["$V_L = 380$ V", "$I_L = 20$ A", "$\\cos\\theta = 0.8$"],
      solution: [
        "$P = \\sqrt{3}\\, V_L I_L \\cos\\theta$",
        "$P = 1.732 \\times 380 \\times 20 \\times 0.8$",
        "$P \\approx 10{,}530$ W $\\approx 10.5$ kW",
      ],
      answer: "$P \\approx 10.5$ kW",
    },
  },
  // 전기이론 — 추가 10종 (템플릿, coming_soon)
  {
    id: "thevenin",
    title: "테브난 정리",
    description:
      "복잡한 회로를 등가 전압원과 등가 저항으로 단순화하는 테브난의 정리를 시각화합니다.",
    subject: "전기이론",
    topic: "회로해석",
    status: "coming_soon",
    emoji: "🧩",
  },
  {
    id: "norton",
    title: "노턴 정리",
    description:
      "테브난의 쌍대 정리. 등가 전류원과 병렬 저항으로 회로를 단순화합니다.",
    subject: "전기이론",
    topic: "회로해석",
    status: "coming_soon",
    emoji: "🔁",
  },
  {
    id: "superposition",
    title: "중첩의 원리",
    description:
      "전원이 여러 개인 선형 회로에서 각 전원이 단독으로 만드는 전류·전압의 합을 시각화합니다.",
    subject: "전기이론",
    topic: "회로해석",
    status: "coming_soon",
    emoji: "🪞",
  },
  {
    id: "capacitor-series-parallel",
    title: "콘덴서 직병렬 합성",
    description:
      "여러 콘덴서를 직렬·병렬로 배치할 때 합성 용량과 전하 분배를 직관적으로 익힙니다.",
    subject: "전기이론",
    topic: "정전계",
    status: "coming_soon",
    emoji: "🔋",
  },
  {
    id: "inductor-series-parallel",
    title: "인덕터 직병렬 합성",
    description:
      "코일을 직렬·병렬로 연결할 때의 합성 인덕턴스를 슬라이더로 비교 학습합니다.",
    subject: "전기이론",
    topic: "자계",
    status: "coming_soon",
    emoji: "🌀",
  },
  {
    id: "solenoid-field",
    title: "솔레노이드 자기장",
    description:
      "솔레노이드 내부에 만들어지는 균일 자기장과 권선·전류·길이의 관계를 시각화합니다.",
    subject: "전기이론",
    topic: "자계",
    status: "coming_soon",
    emoji: "🧲",
  },
  {
    id: "toroidal-field",
    title: "환상자계",
    description:
      "도넛 모양 코어에 권선을 감았을 때 만들어지는 자기장 분포를 색상으로 확인합니다.",
    subject: "전기이론",
    topic: "자계",
    status: "coming_soon",
    emoji: "🍩",
  },
  {
    id: "lenz-law",
    title: "렌츠의 법칙",
    description:
      "유도 전류의 방향이 자속 변화에 어떻게 대항하는지 자석 운동과 함께 시각화합니다.",
    subject: "전기이론",
    topic: "전자유도",
    status: "coming_soon",
    emoji: "↩️",
  },
  {
    id: "eddy-current",
    title: "와전류 현상",
    description:
      "도체 내부에 흐르는 와전류와 그로 인한 발열·제동 효과를 동영상 슬라이더로 살펴봅니다.",
    subject: "전기이론",
    topic: "전자유도",
    status: "coming_soon",
    emoji: "🌪️",
  },
  {
    id: "hysteresis",
    title: "자기 히스테리시스",
    description:
      "자성 물질의 B-H 곡선과 잔류자기·보자력의 의미를 그래프로 학습합니다.",
    subject: "전기이론",
    topic: "자성체",
    status: "coming_soon",
    emoji: "🔄",
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
        expression: "$a = \\dfrac{N_1}{N_2} = \\dfrac{V_1}{V_2}$",
        meaning: "1차 권수와 2차 권수의 비",
      },
      {
        name: "전류비",
        expression: "$\\dfrac{I_2}{I_1} = \\dfrac{N_1}{N_2} = a$",
        meaning: "전류는 권수에 반비례",
      },
      {
        name: "임피던스비",
        expression: "$\\dfrac{Z_1}{Z_2} = a^2$",
        meaning: "1차에서 본 부하 임피던스",
      },
    ],
    example: {
      question:
        "1차 권수 $N_1 = 200$, 2차 권수 $N_2 = 100$인 변압기에 1차 220 V를 가했을 때 2차 단자전압은?",
      given: ["$N_1 = 200$", "$N_2 = 100$", "$V_1 = 220$ V"],
      solution: [
        "$a = \\dfrac{N_1}{N_2} = 2$",
        "$V_2 = \\dfrac{V_1}{a} = \\dfrac{220}{2} = 110$ V",
        "($N_1 > N_2$ → 강압)",
      ],
      answer: "$V_2 = 110$ V (강압)",
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
        expression: "$V_L = \\sqrt{3} \\cdot V_p$, $I_L = I_p$",
        meaning: "선간전압이 상전압의 $\\sqrt{3}$ 배",
      },
      {
        name: "Δ 결선 (삼각)",
        expression: "$V_L = V_p$, $I_L = \\sqrt{3} \\cdot I_p$",
        meaning: "선전류가 상전류의 $\\sqrt{3}$ 배",
      },
      {
        name: "3상 전력",
        expression: "$P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos\\varphi$",
        meaning: "결선 방식과 무관하게 동일",
      },
    ],
    example: {
      question:
        "Y 결선된 3상 변압기에서 상전압 $V_p = 220$ V일 때 선간전압 $V_L$은?",
      given: ["$V_p = 220$ V", "결선: Y"],
      solution: [
        "$V_L = \\sqrt{3} \\times V_p$",
        "$V_L = 1.732 \\times 220 \\approx 381$ V",
      ],
      answer: "$V_L \\approx 381$ V",
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
        expression: "$e = B \\cdot L \\cdot v \\cdot \\sin\\theta$",
        meaning: "회전 코일 한 변에 유기되는 전압",
      },
      {
        name: "직류 출력 (정류 후)",
        expression: "$E_{avg} = \\dfrac{2}{\\pi} \\cdot E_{max}$",
        meaning: "정류자가 매 반회전마다 극성을 뒤집어 직류로",
      },
    ],
    example: {
      question:
        "$B = 1.2$ T 자기장 속에서 길이 0.1 m 도체가 2 m/s 속도로 자기장과 수직으로 움직일 때 유도 기전력은?",
      given: ["$B = 1.2$ T", "$L = 0.1$ m", "$v = 2$ m/s", "$\\theta = 90°$"],
      solution: [
        "$e = B \\cdot L \\cdot v \\cdot \\sin\\theta$",
        "$e = 1.2 \\times 0.1 \\times 2 \\times \\sin 90°$",
        "$e = 0.24 \\times 1 = 0.24$ V",
      ],
      answer: "$e = 0.24$ V",
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
        expression: "$N_s = \\dfrac{120 \\cdot f}{P}$",
        meaning: "$f$ [Hz], $P$ 극수, 단위 [rpm]",
      },
      {
        name: "회전자 속도",
        expression: "$N = N_s \\cdot (1 - s)$",
        meaning: "$s$ = 슬립 ($0 < s < 1$)",
      },
      {
        name: "슬립",
        expression: "$s = \\dfrac{N_s - N}{N_s}$",
        meaning: "동기와 실제 회전속도의 차이 비율",
      },
    ],
    example: {
      question:
        "전원 주파수 60 Hz, 4극 유도전동기의 동기속도와 슬립 4%일 때 회전자 속도는?",
      given: ["$f = 60$ Hz", "$P = 4$ 극", "$s = 0.04$"],
      solution: [
        "$N_s = \\dfrac{120 \\times 60}{4} = 1800$ rpm",
        "$N = N_s(1 - s) = 1800 \\times 0.96 = 1728$ rpm",
      ],
      answer: "$N_s = 1800$ rpm, $N = 1728$ rpm",
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
        expression: "$P = \\dfrac{E \\cdot V}{X_s} \\cdot \\sin\\delta$",
        meaning: "$\\delta$ = 부하각 ($E$와 $V$ 사이의 위상차)",
      },
      {
        name: "최대 출력",
        expression: "$P_{max} = \\dfrac{E \\cdot V}{X_s}$",
        meaning: "$\\delta = 90°$에서 발생, 동기 한계",
      },
    ],
    example: {
      question:
        "유기 기전력 $E = 220$ V, 단자 전압 $V = 200$ V, 동기 임피던스 $X_s = 5\\ \\Omega$, 부하각 $\\delta = 30°$일 때 출력 전력은?",
      given: ["$E = 220$ V", "$V = 200$ V", "$X_s = 5\\ \\Omega$", "$\\delta = 30°$"],
      solution: [
        "$P = \\dfrac{E \\cdot V}{X_s} \\cdot \\sin\\delta$",
        "$P = \\dfrac{220 \\times 200}{5} \\times \\sin 30°$",
        "$P = 8800 \\times 0.5 = 4400$ W $= 4.4$ kW",
      ],
      answer: "$P \\approx 4.4$ kW",
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
        expression: "$R = \\dfrac{\\rho}{2\\pi L} \\cdot \\ln\\dfrac{4L}{d}$",
        meaning: "$\\rho$ [Ω·m] 토양 저항률, $L$ 길이, $d$ 직경",
      },
      {
        name: "판형 접지 저항",
        expression: "$R = \\dfrac{\\rho}{4\\sqrt{A/\\pi}}$",
        meaning: "$A$ 판 면적 [m²]",
      },
    ],
    example: {
      question:
        "토양 저항률 $\\rho = 100\\ \\Omega \\cdot$m, 길이 2 m, 직경 14 mm 봉형 접지 전극의 접지 저항은? (자연로그 ln 사용)",
      given: ["$\\rho = 100\\ \\Omega \\cdot$m", "$L = 2$ m", "$d = 0.014$ m"],
      solution: [
        "$R = \\dfrac{\\rho}{2\\pi L} \\cdot \\ln\\dfrac{4L}{d}$",
        "$R = \\dfrac{100}{12.57} \\times \\ln\\dfrac{8}{0.014}$",
        "$R \\approx 7.96 \\times \\ln(571)$",
        "$R \\approx 7.96 \\times 6.35 \\approx 50.5\\ \\Omega$",
      ],
      answer: "$R \\approx 50.5\\ \\Omega$",
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
        expression: "$t = \\dfrac{K}{(I/I_n)^2 - 1}$",
        meaning: "$I$ 측정 전류, $I_n$ 정격, $K$ 차단기 종류별 상수",
      },
      {
        name: "단락 즉시 차단",
        expression: "$t \\leq 0.02$ s ($I/I_n \\geq 8$)",
        meaning: "정격의 8배 이상 단락 전류 시 즉시 트립",
      },
    ],
    example: {
      question:
        "정격 전류 20 A인 MCCB에 60 A (3배)의 과전류가 흐를 때 트립 예상 시간은? ($K = 60$)",
      given: ["$I_n = 20$ A", "$I = 60$ A → $I/I_n = 3$", "$K = 60$"],
      solution: [
        "$t = \\dfrac{K}{(I/I_n)^2 - 1}$",
        "$t = \\dfrac{60}{3^2 - 1} = \\dfrac{60}{8}$",
        "$t = 7.5$ 초",
      ],
      answer: "$t = 7.5$ 초",
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
