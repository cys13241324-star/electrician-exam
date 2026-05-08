import type { Flashcard } from "./types";
import { mockExams } from "@/lib/cbt/mockData";
import { readAttempts } from "@/lib/cbt/stats";
import { loadUserCards } from "./userCards";

/**
 * 수식은 $...$로 감싸 LaTeX 문법 사용.
 * MathText 컴포넌트가 텍스트 + 수식을 자동 렌더.
 */

export const presetCards: Flashcard[] = [
  // 전기이론 — 직류회로
  {
    id: "p-ohm",
    front: "옴의 법칙은?",
    back: "$V = I \\times R$\n전압은 전류와 저항의 곱.\n변형: $I = \\dfrac{V}{R}$, $R = \\dfrac{V}{I}$",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    hint: "V·I·R 관계식",
    example: {
      question: "8 Ω의 저항에 24 V를 가했을 때 흐르는 전류와 소비전력은?",
      solution: [
        "$I = \\dfrac{V}{R} = \\dfrac{24}{8} = 3\\ \\text{A}$",
        "$P = V \\times I = 24 \\times 3 = 72\\ \\text{W}$",
      ],
      answer: "$I = 3\\ \\text{A},\\ P = 72\\ \\text{W}$",
    },
  },
  {
    id: "p-power",
    front: "전력 P를 구하는 3가지 식?",
    back: "$P = V \\times I$\n$P = I^2 \\times R$\n$P = \\dfrac{V^2}{R}$\n단위는 와트 [W]",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question: "10 Ω 저항에 2 A의 전류가 흐를 때 소비전력은?",
      solution: ["$P = I^2 \\times R = 2^2 \\times 10$", "$P = 4 \\times 10 = 40\\ \\text{W}$"],
      answer: "$P = 40\\ \\text{W}$",
    },
  },
  {
    id: "p-kcl",
    front: "키르히호프 전류 법칙(KCL)?",
    back: "한 접점에 들어오는 전류의 합 = 나가는 전류의 합.\n$\\sum I_{in} = \\sum I_{out}$",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question:
        "한 접점에 5 A가 들어오고 두 가지로 분기되어 한 쪽으로 2 A가 흐를 때, 나머지 분기의 전류는?",
      solution: ["KCL: $I_{in} = I_{out}$", "$5 = 2 + I_2$", "$I_2 = 5 - 2 = 3\\ \\text{A}$"],
      answer: "$I_2 = 3\\ \\text{A}$",
    },
  },
  {
    id: "p-kvl",
    front: "키르히호프 전압 법칙(KVL)?",
    back: "폐회로 한 바퀴 돌 때 전압의 합 = 0.\n$\\sum V_{loop} = 0$",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question:
        "12 V 전원에 $R_1 = 4\\ \\Omega$, $R_2 = 8\\ \\Omega$이 직렬로 연결되어 있다. 각 저항에 걸리는 전압은?",
      solution: [
        "$R = R_1 + R_2 = 4 + 8 = 12\\ \\Omega$",
        "$I = \\dfrac{V}{R} = \\dfrac{12}{12} = 1\\ \\text{A}$",
        "$V_{R_1} = I \\cdot R_1 = 1 \\cdot 4 = 4\\ \\text{V}$",
        "$V_{R_2} = I \\cdot R_2 = 1 \\cdot 8 = 8\\ \\text{V}$",
        "검증: $V_{R_1} + V_{R_2} = 12\\ \\text{V}$ ✓ (KVL)",
      ],
      answer: "$V_{R_1} = 4\\ \\text{V},\\ V_{R_2} = 8\\ \\text{V}$",
    },
  },
  {
    id: "p-series",
    front: "직렬 회로의 합성 저항?",
    back: "$R = R_1 + R_2 + R_3 + \\cdots$\n전류는 모든 저항에서 동일, 전압은 분배.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question: "10 Ω, 20 Ω, 30 Ω이 직렬로 연결되었을 때 합성저항은?",
      solution: ["$R = R_1 + R_2 + R_3$", "$R = 10 + 20 + 30 = 60\\ \\Omega$"],
      answer: "$R = 60\\ \\Omega$",
    },
  },
  {
    id: "p-parallel",
    front: "병렬 회로의 합성 저항?",
    back: "$\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2} + \\cdots$\n전압은 모든 저항에서 동일, 전류는 분배.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question: "10 Ω과 20 Ω이 병렬로 연결되었을 때 합성저항은?",
      solution: [
        "두 저항 병렬: $R = \\dfrac{R_1 \\cdot R_2}{R_1 + R_2}$",
        "$R = \\dfrac{10 \\times 20}{10 + 20}$",
        "$R = \\dfrac{200}{30} \\approx 6.67\\ \\Omega$",
      ],
      answer: "$R \\approx 6.67\\ \\Omega$",
    },
  },
  // 전기이론 — 교류회로
  {
    id: "p-rlc-resonance",
    front: "RLC 직렬 공진 주파수?",
    back: "$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}$\n공진점에서 $X_L = X_C$, 임피던스 $|Z| = R$로 최소.",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question:
        "$L = 10\\ \\text{mH}$, $C = 10\\ \\mu\\text{F}$인 직렬 RLC 회로의 공진 주파수는 약 몇 Hz인가?",
      solution: [
        "$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}$",
        "$LC = 10^{-2} \\times 10^{-5} = 10^{-7}$",
        "$\\sqrt{LC} = 3.16 \\times 10^{-4}$",
        "$f_0 = \\dfrac{1}{2\\pi \\times 3.16 \\times 10^{-4}} \\approx 503\\ \\text{Hz}$",
      ],
      answer: "약 503 Hz",
    },
  },
  {
    id: "p-impedance",
    front: "RLC 직렬 회로의 임피던스 |Z|?",
    back: "$|Z| = \\sqrt{R^2 + (X_L - X_C)^2}$\n$X_L = \\omega L$, $X_C = \\dfrac{1}{\\omega C}$, $\\omega = 2\\pi f$",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question:
        "$R = 6\\ \\Omega$, $X_L = 12\\ \\Omega$, $X_C = 4\\ \\Omega$인 직렬 RLC 회로의 임피던스는?",
      solution: [
        "$|Z| = \\sqrt{R^2 + (X_L - X_C)^2}$",
        "$|Z| = \\sqrt{6^2 + (12 - 4)^2}$",
        "$|Z| = \\sqrt{36 + 64} = \\sqrt{100}$",
        "$|Z| = 10\\ \\Omega$",
      ],
      answer: "$|Z| = 10\\ \\Omega$",
    },
  },
  {
    id: "p-q-factor",
    front: "Q 인자(품질계수)는?",
    back: "$Q = \\dfrac{1}{R}\\sqrt{\\dfrac{L}{C}}$\n공진의 날카로움. Q가 클수록 좁고 뾰족한 공진.",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question:
        "$R = 10\\ \\Omega$, $L = 100\\ \\text{mH}$, $C = 100\\ \\mu\\text{F}$인 회로의 Q 인자는?",
      solution: [
        "$Q = \\dfrac{1}{R}\\sqrt{\\dfrac{L}{C}}$",
        "$\\dfrac{L}{C} = \\dfrac{0.1}{10^{-4}} = 1000$",
        "$\\sqrt{1000} \\approx 31.6$",
        "$Q = \\dfrac{1}{10} \\times 31.6 = 3.16$",
      ],
      answer: "$Q \\approx 3.16$",
    },
  },
  {
    id: "p-3phase-power",
    front: "3상 전력 공식은?",
    back: "$P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos\\varphi$\n$V_L$ 선간전압, $I_L$ 선전류, $\\cos\\varphi$ 역률",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question:
        "선간전압 380 V, 선전류 10 A, 역률 0.8인 3상 부하의 유효전력은?",
      solution: [
        "$P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos\\varphi$",
        "$P = 1.732 \\times 380 \\times 10 \\times 0.8$",
        "$P \\approx 5{,}265\\ \\text{W} \\approx 5.27\\ \\text{kW}$",
      ],
      answer: "약 5.27 kW",
    },
  },
  // 전기이론 — 전자기
  {
    id: "p-coulomb",
    front: "쿨롱의 법칙은?",
    back: "$F = k \\cdot \\dfrac{Q_1 \\cdot Q_2}{r^2}$\n$k = 9 \\times 10^9\\ \\text{N·m}^2/\\text{C}^2$\n같은 부호 → 반발, 다른 부호 → 흡인",
    subject: "전기이론",
    topic: "전자기",
    source: "preset",
    example: {
      question:
        "거리 0.1 m 떨어진 $Q_1 = 2\\ \\mu\\text{C}$, $Q_2 = 3\\ \\mu\\text{C}$ 사이에 작용하는 정전기력은?",
      solution: [
        "$F = k \\cdot \\dfrac{Q_1 \\cdot Q_2}{r^2}$",
        "$F = 9 \\times 10^9 \\times \\dfrac{2 \\times 10^{-6} \\cdot 3 \\times 10^{-6}}{0.1^2}$",
        "$F = 9 \\times 10^9 \\times \\dfrac{6 \\times 10^{-12}}{0.01}$",
        "$F = 5.4\\ \\text{N}$",
      ],
      answer: "$F = 5.4\\ \\text{N}$",
    },
  },
  {
    id: "p-mutual",
    front: "상호 유도란?",
    back: "한 코일(1차)의 전류 변화 → 자속 변화 → 인접 코일(2차)에 전압 유도.\n$e = M \\cdot \\dfrac{di}{dt}$\n변압기·유도전동기의 원리.",
    subject: "전기이론",
    topic: "전자기",
    source: "preset",
    example: {
      question:
        "상호 인덕턴스 $M = 0.5\\ \\text{H}$, 1차 전류 변화율 $\\dfrac{di}{dt} = 10\\ \\text{A/s}$일 때 2차 유도 기전력은?",
      solution: ["$e = M \\cdot \\dfrac{di}{dt}$", "$e = 0.5 \\times 10 = 5\\ \\text{V}$"],
      answer: "$e = 5\\ \\text{V}$",
    },
  },
  {
    id: "p-parallel-wire",
    front: "평행도선 단위 길이당 자기력?",
    back: "$\\dfrac{F}{L} = \\dfrac{\\mu_0 \\cdot I_1 \\cdot I_2}{2\\pi \\cdot d}$\n$\\mu_0 = 4\\pi \\times 10^{-7}\\ \\text{H/m}$\n같은 방향 → 흡인, 반대 → 반발",
    subject: "전기이론",
    topic: "전자기",
    source: "preset",
    example: {
      question:
        "거리 0.5 m, 같은 방향으로 각각 10 A씩 흐르는 두 평행 도선의 단위 길이당 힘은?",
      solution: [
        "$\\dfrac{F}{L} = \\dfrac{\\mu_0 \\cdot I_1 \\cdot I_2}{2\\pi \\cdot d}$",
        "$\\dfrac{F}{L} = \\dfrac{4\\pi \\times 10^{-7} \\times 10 \\times 10}{2\\pi \\times 0.5}$",
        "$\\dfrac{F}{L} = 4 \\times 10^{-5}\\ \\text{N/m}$ (흡인)",
      ],
      answer: "$\\dfrac{F}{L} = 4 \\times 10^{-5}\\ \\text{N/m}$ (흡인)",
    },
  },
  // 전기기기 — 변압기
  {
    id: "p-trans-ratio",
    front: "변압기 권수비·변압비·전류비 관계?",
    back: "권수비 $a = \\dfrac{N_1}{N_2}$\n$\\dfrac{V_2}{V_1} = \\dfrac{N_2}{N_1}$\n$\\dfrac{I_2}{I_1} = \\dfrac{N_1}{N_2}$\n임피던스비 $\\dfrac{Z_1}{Z_2} = a^2$",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
    example: {
      question:
        "1차 권수 $N_1 = 200$, 2차 권수 $N_2 = 100$인 변압기에 1차 220 V를 가했을 때 2차 단자전압은?",
      solution: [
        "$a = \\dfrac{N_1}{N_2} = \\dfrac{200}{100} = 2$",
        "$V_2 = \\dfrac{V_1}{a} = \\dfrac{220}{2}$",
        "$V_2 = 110\\ \\text{V}$ (강압)",
      ],
      answer: "$V_2 = 110\\ \\text{V}$",
    },
  },
  {
    id: "p-y-delta",
    front: "Y 결선의 선간전압·선전류 관계?",
    back: "Y 결선: $V_L = \\sqrt{3} \\cdot V_p$, $I_L = I_p$\nΔ 결선: $V_L = V_p$, $I_L = \\sqrt{3} \\cdot I_p$",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
    example: {
      question: "Y 결선 3상 변압기의 상전압이 220 V일 때 선간전압은?",
      solution: [
        "$V_L = \\sqrt{3} \\cdot V_p$",
        "$V_L = 1.732 \\times 220$",
        "$V_L \\approx 381\\ \\text{V}$",
      ],
      answer: "$V_L \\approx 381\\ \\text{V}$",
    },
  },
  {
    id: "p-trans-loss",
    front: "변압기 손실 2가지?",
    back: "1. 무부하손(철손): 자속에 의한 히스테리시스+와전류 손실\n2. 부하손(동손): 권선 저항에 의한 $I^2 R$ 손실",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
    example: {
      question:
        "변압기의 1차 권선 저항이 0.5 Ω일 때, 1차 전류 10 A에서의 동손은?",
      solution: [
        "$P_c = I^2 \\times R$",
        "$P_c = 10^2 \\times 0.5$",
        "$P_c = 100 \\times 0.5 = 50\\ \\text{W}$",
      ],
      answer: "동손 = 50 W",
    },
  },
  // 전기기기 — 회전기
  {
    id: "p-sync-speed",
    front: "유도전동기 동기속도 $N_s$?",
    back: "$N_s = \\dfrac{120 \\cdot f}{P}$ [rpm]\n$f$ 주파수, $P$ 극수",
    subject: "전기기기",
    topic: "유도전동기",
    source: "preset",
    example: {
      question: "전원 주파수 60 Hz, 4극 유도전동기의 동기속도는?",
      solution: [
        "$N_s = \\dfrac{120f}{P}$",
        "$N_s = \\dfrac{120 \\times 60}{4}$",
        "$N_s = 1800\\ \\text{rpm}$",
      ],
      answer: "$N_s = 1800\\ \\text{rpm}$",
    },
  },
  {
    id: "p-slip",
    front: "슬립 s의 정의?",
    back: "$s = \\dfrac{N_s - N}{N_s}$\n$N_s$ 동기속도, $N$ 회전자속도\n$0 < s < 1$, 슬립 0이면 토크도 0",
    subject: "전기기기",
    topic: "유도전동기",
    source: "preset",
    example: {
      question: "동기속도 1800 rpm, 회전자 속도 1728 rpm일 때 슬립은?",
      solution: [
        "$s = \\dfrac{N_s - N}{N_s}$",
        "$s = \\dfrac{1800 - 1728}{1800}$",
        "$s = \\dfrac{72}{1800} = 0.04\\ (4\\%)$",
      ],
      answer: "$s = 0.04\\ (4\\%)$",
    },
  },
  {
    id: "p-dc-emf",
    front: "직류기 유도 기전력?",
    back: "$e = B \\cdot L \\cdot v \\cdot \\sin\\theta$ (한 변 도체)\n정류자가 매 반회전마다 극성을 뒤집어 직류로 출력",
    subject: "전기기기",
    topic: "직류기",
    source: "preset",
    example: {
      question:
        "$B = 1.2\\ \\text{T}$ 자기장 속에서 길이 0.1 m 도체가 2 m/s, 자기장과 수직($\\theta = 90°$)으로 움직일 때 유도 기전력은?",
      solution: [
        "$e = B \\cdot L \\cdot v \\cdot \\sin\\theta$",
        "$e = 1.2 \\times 0.1 \\times 2 \\times 1$",
        "$e = 0.24\\ \\text{V}$",
      ],
      answer: "$e = 0.24\\ \\text{V}$",
    },
  },
  {
    id: "p-sync-power",
    front: "동기기 출력 전력?",
    back: "$P = \\dfrac{E \\cdot V}{X_s} \\cdot \\sin\\delta$\n$E$ 유기기전력, $V$ 단자전압, $X_s$ 동기임피던스, $\\delta$ 부하각\n최대 $P_{max}$는 $\\delta = 90°$에서",
    subject: "전기기기",
    topic: "동기기",
    source: "preset",
    example: {
      question:
        "$E = 220\\ \\text{V}$, $V = 200\\ \\text{V}$, $X_s = 5\\ \\Omega$, 부하각 $\\delta = 30°$일 때 동기기 출력 전력은?",
      solution: [
        "$P = \\dfrac{E \\cdot V}{X_s} \\cdot \\sin\\delta$",
        "$P = \\dfrac{220 \\times 200}{5} \\times \\sin 30°$",
        "$P = 8800 \\times 0.5$",
        "$P = 4400\\ \\text{W} = 4.4\\ \\text{kW}$",
      ],
      answer: "$P = 4.4\\ \\text{kW}$",
    },
  },
  // 전기설비
  {
    id: "p-grounding-rod",
    front: "봉형 접지 저항 공식?",
    back: "$R = \\dfrac{\\rho}{2\\pi L} \\cdot \\ln\\dfrac{4L}{d}$\n$\\rho$ 토양 저항률, $L$ 길이, $d$ 직경",
    subject: "전기설비",
    topic: "접지",
    source: "preset",
    example: {
      question:
        "$\\rho = 100\\ \\Omega \\cdot \\text{m}$, 길이 2 m, 직경 14 mm 봉형 접지 전극의 접지 저항은?",
      solution: [
        "$R = \\dfrac{\\rho}{2\\pi L} \\cdot \\ln\\dfrac{4L}{d}$",
        "$R = \\dfrac{100}{12.57} \\cdot \\ln\\dfrac{8}{0.014}$",
        "$R \\approx 7.96 \\times \\ln(571)$",
        "$R \\approx 7.96 \\times 6.35 \\approx 50.5\\ \\Omega$",
      ],
      answer: "$R \\approx 50.5\\ \\Omega$",
    },
  },
  {
    id: "p-grounding-grade",
    front: "전기 접지 등급 3가지?",
    back: "제1종: 10 Ω 이하 (고압·특고압)\n제2종: 100 Ω 이하 (변압기)\n제3종: 100 Ω 이하 (저압)",
    subject: "전기설비",
    topic: "접지",
    source: "preset",
    example: {
      question:
        "측정한 접지 저항이 75 Ω이고, 제2종 접지 시설일 때 합격 여부는?",
      solution: [
        "제2종 접지 한도: 100 Ω 이하",
        "측정값 75 Ω < 100 Ω",
        "→ 합격",
      ],
      answer: "합격 (75 Ω ≤ 100 Ω)",
    },
  },
  {
    id: "p-circuit-breaker",
    front: "차단기 역시간 특성?",
    back: "$t = \\dfrac{K}{(I/I_n)^2 - 1}$\n전류가 커질수록 트립 시간이 짧아짐.\n단락 시(8배 이상): 즉시 차단 ($t \\leq 0.02\\ \\text{s}$)",
    subject: "전기설비",
    topic: "보호장치",
    source: "preset",
    example: {
      question:
        "정격 전류 20 A인 MCCB에 60 A (3배)의 과전류가 흐를 때 트립 예상 시간은? ($K = 60$)",
      solution: [
        "$t = \\dfrac{K}{(I/I_n)^2 - 1}$",
        "$\\dfrac{I}{I_n} = \\dfrac{60}{20} = 3$",
        "$t = \\dfrac{60}{3^2 - 1} = \\dfrac{60}{8}$",
        "$t = 7.5\\ \\text{초}$",
      ],
      answer: "$t = 7.5\\ \\text{초}$",
    },
  },
  {
    id: "p-elcb",
    front: "누전차단기(ELCB) 동작 원리?",
    back: "정상 시: 들어가는 전류 = 나오는 전류 (영상전류 0)\n누전 시: 차이 발생 → 영상전류 검출 → 차단",
    subject: "전기설비",
    topic: "보호장치",
    source: "preset",
    example: {
      question:
        "정격 감도 30 mA의 ELCB에서, 인입 전류 10.000 A, 인출 전류 9.985 A일 때 동작 여부는?",
      solution: [
        "$\\Delta I = 10.000 - 9.985 = 0.015\\ \\text{A} = 15\\ \\text{mA}$",
        "정격 감도 30 mA보다 작음",
        "→ 미동작 (정상 범위)",
      ],
      answer: "미동작 (영상전류 15 mA < 30 mA)",
    },
  },
  {
    id: "p-wire-size",
    front: "전선 굵기 선정 기준?",
    back: "1. 허용전류 (열적 허용)\n2. 전압강하 (3 % 이하 권장)\n3. 기계적 강도",
    subject: "전기설비",
    topic: "전선과 케이블",
    source: "preset",
    example: {
      question:
        "220 V 회로에서 6.6 V 이하의 전압 강하를 허용한다면 전압 강하율은?",
      solution: [
        "전압 강하율 $= \\dfrac{V_{drop}}{V_n} \\times 100\\%$",
        "$= \\dfrac{6.6}{220} \\times 100 = 3\\%$",
      ],
      answer: "3 % (권장 한도)",
    },
  },
  {
    id: "p-conduit",
    front: "금속관 공사 vs 합성수지관 공사 차이?",
    back: "금속관: 기계적 강도 강, 부식 가능, 접지 필요\n합성수지관: 절연성 좋고 부식 X, 기계적 강도 약, 옥내·노출에 적합",
    subject: "전기설비",
    topic: "배선공사",
    source: "preset",
    example: {
      question:
        "공장 외부의 노출 배관 공사로 가장 적합한 것은? (부식·기계 강도 고려)",
      solution: [
        "외부 노출 → 부식·기계 충격 위험 모두 존재",
        "금속관: 강도 강하지만 부식 우려 → 도금 처리 필요",
        "합성수지관: 부식 X, 강도는 약함",
        "→ 일반적으로 부식 방지된 금속관(스틸제) 또는 합성수지관 두꺼운 것",
      ],
      answer: "강도 우선이면 금속관(부식방지), 부식 우려가 크면 합성수지관",
    },
  },
];

/**
 * CBT 응시 기록의 오답을 자동 카드로 변환.
 * 오답 카드는 문제 자체가 예제이므로 별도 example은 생략.
 */
export function getCbtWrongCards(): Flashcard[] {
  if (typeof window === "undefined") return [];
  const attempts = readAttempts().filter((a) => a.submittedAt !== null);
  const cards: Flashcard[] = [];
  const seen = new Set<string>();

  for (const attempt of attempts) {
    const exam = mockExams.find((e) => e.id === attempt.examId);
    if (!exam) continue;
    exam.questions.forEach((q, i) => {
      const userAnswer = attempt.answers[i];
      if (userAnswer === null || userAnswer === q.answer) return;
      const cardId = `cbt-${exam.id}-${i}`;
      if (seen.has(cardId)) return;
      seen.add(cardId);
      cards.push({
        id: cardId,
        front: q.questionText,
        back: `정답: ${q.answer}번 — ${q.choices[q.answer - 1]}\n\n${q.explanation}`,
        subject: q.subject,
        topic: q.topic,
        source: "cbt-wrong",
        hint: `[${q.subject}] ${q.topic}`,
      });
    });
  }

  return cards;
}

/**
 * 모든 카드 (프리셋 + CBT 오답 자동 + 사용자 AI 생성). 클라이언트 전용.
 */
export function getAllCards(): Flashcard[] {
  return [...presetCards, ...getCbtWrongCards(), ...loadUserCards()];
}
