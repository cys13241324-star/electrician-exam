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
  },
  {
    id: "p-power",
    front: "전력 P를 구하는 3가지 식?",
    back: "P = V × I\nP = I² × R\nP = V² / R\n단위는 와트 [W]",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
  },
  {
    id: "p-kcl",
    front: "키르히호프 전류 법칙(KCL)?",
    back: "한 접점에 들어오는 전류의 합 = 나가는 전류의 합.\nΣ I_in = Σ I_out",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
  },
  {
    id: "p-kvl",
    front: "키르히호프 전압 법칙(KVL)?",
    back: "폐회로 한 바퀴 돌 때 전압의 합 = 0.\nΣ V (폐회로) = 0",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
  },
  {
    id: "p-series",
    front: "직렬 회로의 합성 저항?",
    back: "R = R₁ + R₂ + R₃ + ...\n전류는 모든 저항에서 동일, 전압은 분배.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
  },
  {
    id: "p-parallel",
    front: "병렬 회로의 합성 저항?",
    back: "1/R = 1/R₁ + 1/R₂ + 1/R₃ + ...\n전압은 모든 저항에서 동일, 전류는 분배.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
  },
  // 전기이론 — 교류회로
  {
    id: "p-rlc-resonance",
    front: "RLC 직렬 공진 주파수?",
    back: "f₀ = 1 / (2π √(L·C))\n공진점에서 X_L = X_C, 임피던스 |Z| = R로 최소.",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
  },
  {
    id: "p-impedance",
    front: "RLC 직렬 회로의 임피던스 |Z|?",
    back: "|Z| = √(R² + (X_L − X_C)²)\nX_L = ωL, X_C = 1/(ωC), ω = 2πf",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
  },
  {
    id: "p-q-factor",
    front: "Q 인자(품질계수)는?",
    back: "Q = (1/R) · √(L/C)\n공진의 날카로움. Q가 클수록 좁고 뾰족한 공진.",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
  },
  {
    id: "p-3phase-power",
    front: "3상 전력 공식은?",
    back: "P = √3 · V_L · I_L · cosφ\nV_L 선간전압, I_L 선전류, cosφ 역률",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
  },
  // 전기이론 — 전자기
  {
    id: "p-coulomb",
    front: "쿨롱의 법칙은?",
    back: "F = k · (Q₁·Q₂) / r²\nk = 9 × 10⁹ N·m²/C²\n같은 부호 → 반발, 다른 부호 → 흡인",
    subject: "전기이론",
    topic: "전자기",
    source: "preset",
  },
  {
    id: "p-mutual",
    front: "상호 유도란?",
    back: "한 코일(1차)의 전류 변화 → 자속 변화 → 인접 코일(2차)에 전압 유도.\n변압기·유도전동기의 원리.",
    subject: "전기이론",
    topic: "전자기",
    source: "preset",
  },
  {
    id: "p-parallel-wire",
    front: "평행도선 단위 길이당 자기력?",
    back: "F/L = μ₀ · I₁ · I₂ / (2π · d)\nμ₀ = 4π × 10⁻⁷ H/m\n같은 방향 → 흡인, 반대 → 반발",
    subject: "전기이론",
    topic: "전자기",
    source: "preset",
  },
  // 전기기기 — 변압기
  {
    id: "p-trans-ratio",
    front: "변압기 권수비·변압비·전류비 관계?",
    back: "권수비 a = N₁/N₂\nV₂/V₁ = N₂/N₁ (전압 변환)\nI₂/I₁ = N₁/N₂ (전류 반비례)\n임피던스비 Z₁/Z₂ = a²",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
  },
  {
    id: "p-y-delta",
    front: "Y 결선의 선간전압·선전류 관계?",
    back: "V_L = √3 · V_p (선간 = 상의 √3배)\nI_L = I_p (선전류 = 상전류)\nΔ는 반대로: V_L=V_p, I_L=√3·I_p",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
  },
  {
    id: "p-trans-loss",
    front: "변압기 손실 2가지?",
    back: "1. 무부하손(철손): 자속에 의한 히스테리시스+와전류 손실\n2. 부하손(동손): 권선 저항에 의한 I²R 손실",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
  },
  // 전기기기 — 회전기
  {
    id: "p-sync-speed",
    front: "유도전동기 동기속도 N_s?",
    back: "N_s = 120 · f / P [rpm]\nf 주파수, P 극수",
    subject: "전기기기",
    topic: "유도전동기",
    source: "preset",
  },
  {
    id: "p-slip",
    front: "슬립 s의 정의?",
    back: "s = (N_s − N) / N_s\nN_s 동기속도, N 회전자속도\n0 < s < 1, 슬립 0이면 토크도 0",
    subject: "전기기기",
    topic: "유도전동기",
    source: "preset",
  },
  {
    id: "p-dc-emf",
    front: "직류기 유도 기전력?",
    back: "e = B · L · v · sinθ (한 변 도체)\n정류자가 매 반회전마다 극성을 뒤집어 직류로 출력",
    subject: "전기기기",
    topic: "직류기",
    source: "preset",
  },
  {
    id: "p-sync-power",
    front: "동기기 출력 전력?",
    back: "P = (E·V/X_s) · sinδ\nE 유기기전력, V 단자전압, X_s 동기임피던스, δ 부하각\n최대출력 P_max는 δ=90°에서 (동기 한계)",
    subject: "전기기기",
    topic: "동기기",
    source: "preset",
  },
  // 전기설비
  {
    id: "p-grounding-rod",
    front: "봉형 접지 저항 공식?",
    back: "R = ρ / (2π·L) × ln(4L/d)\nρ 토양 저항률, L 길이, d 직경",
    subject: "전기설비",
    topic: "접지",
    source: "preset",
  },
  {
    id: "p-grounding-grade",
    front: "전기 접지 등급 3가지?",
    back: "제1종: 10Ω 이하 (고압·특고압)\n제2종: 100Ω 이하 (변압기)\n제3종: 100Ω 이하 (저압)",
    subject: "전기설비",
    topic: "접지",
    source: "preset",
  },
  {
    id: "p-circuit-breaker",
    front: "차단기 역시간 특성?",
    back: "t = K / ((I/I_n)² − 1)\n전류가 커질수록 트립 시간이 짧아짐.\n단락(8배 이상)은 즉시 차단(≤0.02초).",
    subject: "전기설비",
    topic: "보호장치",
    source: "preset",
  },
  {
    id: "p-elcb",
    front: "누전차단기(ELCB) 동작 원리?",
    back: "정상 시: 들어가는 전류 = 나오는 전류 (영상전류 0)\n누전 시: 차이 발생 → 영상전류 검출 → 차단",
    subject: "전기설비",
    topic: "보호장치",
    source: "preset",
  },
  {
    id: "p-wire-size",
    front: "전선 굵기 선정 기준?",
    back: "1. 허용전류 (열적 허용)\n2. 전압강하 (3% 이하 권장)\n3. 기계적 강도",
    subject: "전기설비",
    topic: "전선과 케이블",
    source: "preset",
  },
  {
    id: "p-conduit",
    front: "금속관 공사 vs 합성수지관 공사 차이?",
    back: "금속관: 기계적 강도 강, 부식 가능, 접지 필요\n합성수지관: 절연성 좋고 부식 X, 기계적 강도 약, 옥내·노출에 적합",
    subject: "전기설비",
    topic: "배선공사",
    source: "preset",
  },
];

/**
 * CBT 응시 기록의 오답을 자동 카드로 변환.
 * 클라이언트에서만 동작 (localStorage 의존).
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
