import type { Flashcard } from "./types";
import { mockExams } from "@/lib/cbt/mockData";
import { readAttempts } from "@/lib/cbt/stats";

export const presetCards: Flashcard[] = [
  // 전기이론 — 직류회로
  {
    id: "p-ohm",
    front: "옴의 법칙은?",
    back: "V = I × R\n전압은 전류와 저항의 곱.\n전류 I = V/R, 저항 R = V/I 로 변형 가능.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    hint: "V·I·R 관계식",
    example: {
      question: "8 Ω의 저항에 24 V를 가했을 때 흐르는 전류와 소비전력은?",
      solution: ["I = V / R = 24 / 8 = 3 A", "P = V × I = 24 × 3 = 72 W"],
      answer: "I = 3 A, P = 72 W",
    },
  },
  {
    id: "p-power",
    front: "전력 P를 구하는 3가지 식?",
    back: "P = V × I\nP = I² × R\nP = V² / R\n단위는 와트 [W]",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question: "10 Ω 저항에 2 A의 전류가 흐를 때 소비전력은?",
      solution: ["P = I² × R = 2² × 10", "P = 4 × 10 = 40 W"],
      answer: "P = 40 W",
    },
  },
  {
    id: "p-kcl",
    front: "키르히호프 전류 법칙(KCL)?",
    back: "한 접점에 들어오는 전류의 합 = 나가는 전류의 합.\nΣ I_in = Σ I_out",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question:
        "한 접점에 5 A가 들어오고 두 가지로 분기되어 한 쪽으로 2 A가 흐를 때, 나머지 분기의 전류는?",
      solution: ["KCL: I_in = I_out", "5 A = 2 A + I₂", "I₂ = 5 − 2 = 3 A"],
      answer: "I₂ = 3 A",
    },
  },
  {
    id: "p-kvl",
    front: "키르히호프 전압 법칙(KVL)?",
    back: "폐회로 한 바퀴 돌 때 전압의 합 = 0.\nΣ V (폐회로) = 0",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question:
        "12 V 전원에 R₁ = 4 Ω, R₂ = 8 Ω이 직렬로 연결되어 있다. 각 저항에 걸리는 전압은?",
      solution: [
        "전체 저항 R = 4 + 8 = 12 Ω",
        "전류 I = V / R = 12 / 12 = 1 A",
        "V_R1 = I·R₁ = 1·4 = 4 V",
        "V_R2 = I·R₂ = 1·8 = 8 V",
        "검증: V_R1 + V_R2 = 4 + 8 = 12 V ✓ (KVL)",
      ],
      answer: "V_R1 = 4 V, V_R2 = 8 V",
    },
  },
  {
    id: "p-series",
    front: "직렬 회로의 합성 저항?",
    back: "R = R₁ + R₂ + R₃ + ...\n전류는 모든 저항에서 동일, 전압은 분배.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question: "10 Ω, 20 Ω, 30 Ω이 직렬로 연결되었을 때 합성저항은?",
      solution: ["R = R₁ + R₂ + R₃", "R = 10 + 20 + 30 = 60 Ω"],
      answer: "R = 60 Ω",
    },
  },
  {
    id: "p-parallel",
    front: "병렬 회로의 합성 저항?",
    back: "1/R = 1/R₁ + 1/R₂ + 1/R₃ + ...\n전압은 모든 저항에서 동일, 전류는 분배.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question: "10 Ω과 20 Ω이 병렬로 연결되었을 때 합성저항은?",
      solution: [
        "두 저항 병렬: R = (R₁·R₂) / (R₁+R₂)",
        "R = (10 × 20) / (10 + 20)",
        "R = 200 / 30 ≈ 6.67 Ω",
      ],
      answer: "R ≈ 6.67 Ω",
    },
  },
  // 전기이론 — 교류회로
  {
    id: "p-rlc-resonance",
    front: "RLC 직렬 공진 주파수?",
    back: "f₀ = 1 / (2π √(L·C))\n공진점에서 X_L = X_C, 임피던스 |Z| = R로 최소.",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question:
        "L = 10 mH, C = 10 μF인 직렬 RLC 회로의 공진 주파수는 약 몇 Hz인가?",
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
    id: "p-impedance",
    front: "RLC 직렬 회로의 임피던스 |Z|?",
    back: "|Z| = √(R² + (X_L − X_C)²)\nX_L = ωL, X_C = 1/(ωC), ω = 2πf",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question: "R = 6 Ω, X_L = 12 Ω, X_C = 4 Ω인 직렬 RLC 회로의 임피던스는?",
      solution: [
        "|Z| = √(R² + (X_L − X_C)²)",
        "|Z| = √(6² + (12 − 4)²)",
        "|Z| = √(36 + 64) = √100",
        "|Z| = 10 Ω",
      ],
      answer: "|Z| = 10 Ω",
    },
  },
  {
    id: "p-q-factor",
    front: "Q 인자(품질계수)는?",
    back: "Q = (1/R) · √(L/C)\n공진의 날카로움. Q가 클수록 좁고 뾰족한 공진.",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question: "R = 10 Ω, L = 100 mH, C = 100 μF인 회로의 Q 인자는?",
      solution: [
        "Q = (1/R) · √(L/C)",
        "L/C = 0.1 / 10⁻⁴ = 1000",
        "√(L/C) = √1000 ≈ 31.6",
        "Q = (1/10) × 31.6 = 3.16",
      ],
      answer: "Q ≈ 3.16",
    },
  },
  {
    id: "p-3phase-power",
    front: "3상 전력 공식은?",
    back: "P = √3 · V_L · I_L · cosφ\nV_L 선간전압, I_L 선전류, cosφ 역률",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question:
        "선간전압 380 V, 선전류 10 A, 역률 0.8인 3상 부하의 유효전력은?",
      solution: [
        "P = √3 · V_L · I_L · cosφ",
        "P = 1.732 × 380 × 10 × 0.8",
        "P ≈ 5,265 W ≈ 5.27 kW",
      ],
      answer: "약 5.27 kW",
    },
  },
  // 전기이론 — 전자기
  {
    id: "p-coulomb",
    front: "쿨롱의 법칙은?",
    back: "F = k · (Q₁·Q₂) / r²\nk = 9 × 10⁹ N·m²/C²\n같은 부호 → 반발, 다른 부호 → 흡인",
    subject: "전기이론",
    topic: "전자기",
    source: "preset",
    example: {
      question:
        "거리 0.1 m 떨어진 Q₁ = 2 μC, Q₂ = 3 μC 사이에 작용하는 정전기력은?",
      solution: [
        "F = k · Q₁·Q₂ / r²",
        "F = 9×10⁹ × (2×10⁻⁶ × 3×10⁻⁶) / 0.1²",
        "F = 9×10⁹ × 6×10⁻¹² / 0.01",
        "F = 5.4 N",
      ],
      answer: "F = 5.4 N",
    },
  },
  {
    id: "p-mutual",
    front: "상호 유도란?",
    back: "한 코일(1차)의 전류 변화 → 자속 변화 → 인접 코일(2차)에 전압 유도.\n변압기·유도전동기의 원리.",
    subject: "전기이론",
    topic: "전자기",
    source: "preset",
    example: {
      question:
        "상호 인덕턴스 M = 0.5 H, 1차 전류 변화율 di/dt = 10 A/s일 때 2차에 유도되는 기전력은?",
      solution: ["e = M · (di/dt)", "e = 0.5 × 10 = 5 V"],
      answer: "e = 5 V",
    },
  },
  {
    id: "p-parallel-wire",
    front: "평행도선 단위 길이당 자기력?",
    back: "F/L = μ₀ · I₁ · I₂ / (2π · d)\nμ₀ = 4π × 10⁻⁷ H/m\n같은 방향 → 흡인, 반대 → 반발",
    subject: "전기이론",
    topic: "전자기",
    source: "preset",
    example: {
      question:
        "거리 0.5 m, 같은 방향으로 각각 10 A씩 흐르는 두 평행 도선의 단위 길이당 힘은?",
      solution: [
        "F/L = μ₀·I₁·I₂ / (2π·d)",
        "F/L = (4π×10⁻⁷ × 10 × 10) / (2π × 0.5)",
        "F/L = 4 × 10⁻⁵ N/m (흡인)",
      ],
      answer: "F/L = 4 × 10⁻⁵ N/m (흡인)",
    },
  },
  // 전기기기 — 변압기
  {
    id: "p-trans-ratio",
    front: "변압기 권수비·변압비·전류비 관계?",
    back: "권수비 a = N₁/N₂\nV₂/V₁ = N₂/N₁ (전압 변환)\nI₂/I₁ = N₁/N₂ (전류 반비례)\n임피던스비 Z₁/Z₂ = a²",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
    example: {
      question:
        "1차 권수 N₁ = 200, 2차 권수 N₂ = 100인 변압기에 1차 220 V를 가했을 때 2차 단자전압은?",
      solution: [
        "권수비 a = N₁/N₂ = 200/100 = 2",
        "V₂ = V₁ / a = 220 / 2",
        "V₂ = 110 V (강압)",
      ],
      answer: "V₂ = 110 V",
    },
  },
  {
    id: "p-y-delta",
    front: "Y 결선의 선간전압·선전류 관계?",
    back: "V_L = √3 · V_p (선간 = 상의 √3배)\nI_L = I_p (선전류 = 상전류)\nΔ는 반대로: V_L=V_p, I_L=√3·I_p",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
    example: {
      question: "Y 결선 3상 변압기의 상전압이 220 V일 때 선간전압은?",
      solution: [
        "V_L = √3 · V_p",
        "V_L = 1.732 × 220",
        "V_L ≈ 381 V",
      ],
      answer: "V_L ≈ 381 V",
    },
  },
  {
    id: "p-trans-loss",
    front: "변압기 손실 2가지?",
    back: "1. 무부하손(철손): 자속에 의한 히스테리시스+와전류 손실\n2. 부하손(동손): 권선 저항에 의한 I²R 손실",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
    example: {
      question:
        "변압기의 1차 권선 저항이 0.5 Ω일 때, 1차 전류 10 A에서의 동손은?",
      solution: [
        "동손 P_c = I² × R",
        "P_c = 10² × 0.5",
        "P_c = 100 × 0.5 = 50 W",
      ],
      answer: "동손 = 50 W",
    },
  },
  // 전기기기 — 회전기
  {
    id: "p-sync-speed",
    front: "유도전동기 동기속도 N_s?",
    back: "N_s = 120 · f / P [rpm]\nf 주파수, P 극수",
    subject: "전기기기",
    topic: "유도전동기",
    source: "preset",
    example: {
      question: "전원 주파수 60 Hz, 4극 유도전동기의 동기속도는?",
      solution: ["N_s = 120·f/P", "N_s = 120 × 60 / 4", "N_s = 1800 rpm"],
      answer: "N_s = 1800 rpm",
    },
  },
  {
    id: "p-slip",
    front: "슬립 s의 정의?",
    back: "s = (N_s − N) / N_s\nN_s 동기속도, N 회전자속도\n0 < s < 1, 슬립 0이면 토크도 0",
    subject: "전기기기",
    topic: "유도전동기",
    source: "preset",
    example: {
      question: "동기속도 1800 rpm, 회전자 속도 1728 rpm일 때 슬립은?",
      solution: [
        "s = (N_s − N) / N_s",
        "s = (1800 − 1728) / 1800",
        "s = 72 / 1800 = 0.04 (4%)",
      ],
      answer: "s = 0.04 (4%)",
    },
  },
  {
    id: "p-dc-emf",
    front: "직류기 유도 기전력?",
    back: "e = B · L · v · sinθ (한 변 도체)\n정류자가 매 반회전마다 극성을 뒤집어 직류로 출력",
    subject: "전기기기",
    topic: "직류기",
    source: "preset",
    example: {
      question:
        "B = 1.2 T 자기장 속에서 길이 0.1 m 도체가 2 m/s, 자기장과 수직(θ=90°)으로 움직일 때 유도 기전력은?",
      solution: [
        "e = B · L · v · sinθ",
        "e = 1.2 × 0.1 × 2 × 1",
        "e = 0.24 V",
      ],
      answer: "e = 0.24 V",
    },
  },
  {
    id: "p-sync-power",
    front: "동기기 출력 전력?",
    back: "P = (E·V/X_s) · sinδ\nE 유기기전력, V 단자전압, X_s 동기임피던스, δ 부하각\n최대출력 P_max는 δ=90°에서 (동기 한계)",
    subject: "전기기기",
    topic: "동기기",
    source: "preset",
    example: {
      question:
        "E = 220 V, V = 200 V, X_s = 5 Ω, 부하각 δ = 30°일 때 동기기 출력 전력은?",
      solution: [
        "P = (E·V/X_s) · sinδ",
        "P = (220 × 200 / 5) × sin30°",
        "P = 8800 × 0.5",
        "P = 4400 W = 4.4 kW",
      ],
      answer: "P = 4.4 kW",
    },
  },
  // 전기설비
  {
    id: "p-grounding-rod",
    front: "봉형 접지 저항 공식?",
    back: "R = ρ / (2π·L) × ln(4L/d)\nρ 토양 저항률, L 길이, d 직경",
    subject: "전기설비",
    topic: "접지",
    source: "preset",
    example: {
      question:
        "ρ = 100 Ω·m, 길이 2 m, 직경 14 mm 봉형 접지 전극의 접지 저항은?",
      solution: [
        "R = (ρ / 2π·L) · ln(4L/d)",
        "R = (100 / 12.57) · ln(8 / 0.014)",
        "R ≈ 7.96 × ln(571)",
        "R ≈ 7.96 × 6.35 ≈ 50.5 Ω",
      ],
      answer: "R ≈ 50.5 Ω",
    },
  },
  {
    id: "p-grounding-grade",
    front: "전기 접지 등급 3가지?",
    back: "제1종: 10Ω 이하 (고압·특고압)\n제2종: 100Ω 이하 (변압기)\n제3종: 100Ω 이하 (저압)",
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
    back: "t = K / ((I/I_n)² − 1)\n전류가 커질수록 트립 시간이 짧아짐.\n단락(8배 이상)은 즉시 차단(≤0.02초).",
    subject: "전기설비",
    topic: "보호장치",
    source: "preset",
    example: {
      question:
        "정격 전류 20 A인 MCCB에 60 A (3배)의 과전류가 흐를 때 트립 예상 시간은? (K=60)",
      solution: [
        "t = K / ((I/I_n)² − 1)",
        "I/I_n = 60/20 = 3",
        "t = 60 / (3² − 1) = 60 / 8",
        "t = 7.5 초",
      ],
      answer: "t = 7.5 초",
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
        "영상전류 ΔI = 10.000 − 9.985 = 0.015 A = 15 mA",
        "정격 감도 30 mA보다 작음",
        "→ 미동작 (정상 범위)",
      ],
      answer: "미동작 (영상전류 15 mA < 30 mA)",
    },
  },
  {
    id: "p-wire-size",
    front: "전선 굵기 선정 기준?",
    back: "1. 허용전류 (열적 허용)\n2. 전압강하 (3% 이하 권장)\n3. 기계적 강도",
    subject: "전기설비",
    topic: "전선과 케이블",
    source: "preset",
    example: {
      question:
        "220 V 회로에서 6.6 V 이하의 전압 강하를 허용한다면 전압 강하율은?",
      solution: [
        "전압 강하율 = (강하전압 / 정격전압) × 100",
        "= (6.6 / 220) × 100 = 3 %",
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
 * 모든 카드 (프리셋 + 자동 추가). 클라이언트 전용.
 */
export function getAllCards(): Flashcard[] {
  return [...presetCards, ...getCbtWrongCards()];
}
