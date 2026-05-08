import { curriculum, findSubject, findTopic, findSubtopic } from "./curriculum";
import type { Choice, Exam, ExamSummary, Question, Subject } from "./types";

type SlotMeta = {
  subjectId: string;
  subject: Subject;
  topicId: string;
  topic: string;
  subtopicId: string;
  subtopic: string;
};

function buildSlots(): SlotMeta[] {
  const slots: SlotMeta[] = [];
  for (const s of curriculum) {
    for (const t of s.topics) {
      for (const sub of t.subtopics) {
        slots.push({
          subjectId: s.id,
          subject: s.subject,
          topicId: t.id,
          topic: t.name,
          subtopicId: sub.id,
          subtopic: sub.name,
        });
      }
    }
  }
  return slots;
}

const slots = buildSlots(); // ~28 subtopics

const realPlacements: Record<
  number,
  Omit<Question, "number" | "subjectId" | "topicId" | "subtopicId" | "subject" | "topic" | "subtopic">
> = {
  // 상호유도 → 전기이론 / 전자기 / mutual_induction
  1: {
    questionText:
      "2개의 코일을 서로 근접시켰을 때 한 쪽 코일의 전류가 변화하면 다른 쪽 코일에 유도 기전력이 발생하는 현상을 무엇이라고 하는가?",
    choices: ["상호 결합", "자체유도", "상호 유도", "자체 결합"],
    answer: 3,
    explanation:
      "상호 유도는 한쪽 코일(1차)에 흐르는 전류가 변하면 자속이 변하고, 이 자속이 인접한 코일(2차)을 쇄교하면서 전압이 유도되는 현상을 의미한다.",
  },
  // 검류계(휘트스톤 브릿지) → 전기이론 / 직류회로 / series_parallel
  2: {
    questionText: "회로에서 검류계의 지시기가 0일 때 저항 X는 몇 [Ω]인가?",
    choices: ["10[Ω]", "40[Ω]", "100[Ω]", "400[Ω]"],
    answer: 4,
    explanation:
      "검류계의 지시값이 0이므로 브리지가 평형 상태임을 의미한다. 브리지가 평형인 경우 마주보는 저항의 곱은 서로 같으므로 PR=QX를 만족한다. X에 대해 식을 정리하고 대입하여 계산한다. X=PR/Q=100×40/10 = 400[Ω]",
  },
};

const realSlotMap: Record<number, { subjectId: string; topicId: string; subtopicId: string }> = {
  1: { subjectId: "theory", topicId: "electromagnetism", subtopicId: "mutual_induction" },
  2: { subjectId: "theory", topicId: "dc_circuit", subtopicId: "series_parallel" },
};

function buildSharedQuestions(): Question[] {
  // Distribute 60 questions across slots: 2 per slot first, then fill
  const total = 60;
  const baseAssignments: SlotMeta[] = [];
  // 2 per slot
  for (const slot of slots) {
    baseAssignments.push(slot, slot);
  }
  // Top up with extras (round-robin into popular topic 변압기)
  while (baseAssignments.length < total) {
    const idx = baseAssignments.length % slots.length;
    baseAssignments.push(slots[idx]);
  }
  // Trim to 60 (in case slots × 2 > 60)
  baseAssignments.length = total;

  const result: Question[] = [];
  for (let i = 0; i < total; i++) {
    const number = i + 1;
    let slot = baseAssignments[i];

    // If this number has a real placement, override
    const realPlace = realSlotMap[number];
    if (realPlace) {
      const sMeta = findSubject(realPlace.subjectId)!;
      const tMeta = findTopic(realPlace.subjectId, realPlace.topicId)!;
      const subMeta = findSubtopic(
        realPlace.subjectId,
        realPlace.topicId,
        realPlace.subtopicId,
      )!;
      slot = {
        subjectId: sMeta.id,
        subject: sMeta.subject,
        topicId: tMeta.id,
        topic: tMeta.name,
        subtopicId: subMeta.id,
        subtopic: subMeta.name,
      };
    }

    const real = realPlacements[number];

    result.push({
      number,
      subjectId: slot.subjectId,
      subject: slot.subject,
      topicId: slot.topicId,
      topic: slot.topic,
      subtopicId: slot.subtopicId,
      subtopic: slot.subtopic,
      questionText:
        real?.questionText ??
        `[샘플 문항 ${number}] ${slot.topic} - ${slot.subtopic}에 관한 설명으로 옳은 것은?`,
      choices:
        real?.choices ??
        ([
          `${slot.subtopic} 보기 1번 설명입니다.`,
          `${slot.subtopic} 보기 2번 설명입니다.`,
          `${slot.subtopic} 보기 3번 설명입니다.`,
          `${slot.subtopic} 보기 4번 설명입니다.`,
        ] as [string, string, string, string]),
      answer: real?.answer ?? ((((number - 1) % 4) + 1) as Choice),
      explanation:
        real?.explanation ??
        `[${slot.subject}] ${slot.topic} - ${slot.subtopic}\n${slot.subtopic}에 대한 핵심 개념을 정리한 해설입니다. 실제 콘텐츠 입력 전 임시 데이터입니다.`,
    });
  }
  return result;
}

const sharedQuestions = buildSharedQuestions();

export const mockExams: Exam[] = Array.from({ length: 5 }, (_, idx) => {
  const round = idx + 1;
  return {
    id: `exam-${round}`,
    round,
    title: `전기기능사 CBT 모의고사 ${round}회`,
    totalQuestions: 60,
    durationMinutes: 60,
    questions: sharedQuestions,
  };
});

export const mockExamSummaries: ExamSummary[] = mockExams.map((exam, idx) => ({
  id: exam.id,
  round: exam.round,
  title: exam.title,
  totalQuestions: exam.totalQuestions,
  durationMinutes: exam.durationMinutes,
  status: idx === 1 ? "완료" : idx === 2 ? "응시중" : "응시대기",
}));

export function getMockExam(id: string): Exam | undefined {
  return mockExams.find((e) => e.id === id);
}

export type PracticeFilter = {
  subjectId: string;
  topicId?: string;
  subtopicId?: string;
};

function parsePracticeId(id: string): PracticeFilter | null {
  if (!id.startsWith("practice-")) return null;
  const parts = id.slice("practice-".length).split("-");
  if (parts.length === 0) return null;
  return {
    subjectId: parts[0],
    topicId: parts[1],
    subtopicId: parts[2],
  };
}

function buildPracticeId(f: PracticeFilter): string {
  const segments = [f.subjectId];
  if (f.topicId) segments.push(f.topicId);
  if (f.subtopicId) segments.push(f.subtopicId);
  return `practice-${segments.join("-")}`;
}

function buildPracticeExam(filter: PracticeFilter): Exam | undefined {
  const subjectMeta = findSubject(filter.subjectId);
  if (!subjectMeta) return undefined;
  if (filter.topicId && !findTopic(filter.subjectId, filter.topicId))
    return undefined;
  if (
    filter.subtopicId &&
    !findSubtopic(filter.subjectId, filter.topicId!, filter.subtopicId)
  )
    return undefined;

  const matched = sharedQuestions.filter((q) => {
    if (q.subjectId !== filter.subjectId) return false;
    if (filter.topicId && q.topicId !== filter.topicId) return false;
    if (filter.subtopicId && q.subtopicId !== filter.subtopicId) return false;
    return true;
  });

  if (matched.length === 0) return undefined;

  const renumbered: Question[] = matched.map((q, i) => ({ ...q, number: i + 1 }));

  let title = `${subjectMeta.subject}`;
  if (filter.topicId) {
    const t = findTopic(filter.subjectId, filter.topicId)!;
    title += ` · ${t.name}`;
    if (filter.subtopicId) {
      const sub = findSubtopic(
        filter.subjectId,
        filter.topicId,
        filter.subtopicId,
      )!;
      title += ` · ${sub.name}`;
    }
  } else {
    title += " 전체";
  }

  // 1.5분/문항, 최소 10분, 최대 60분
  const durationMinutes = Math.min(
    60,
    Math.max(10, Math.round(matched.length * 1.5)),
  );

  return {
    id: buildPracticeId(filter),
    round: 0,
    title,
    totalQuestions: matched.length,
    durationMinutes,
    questions: renumbered,
  };
}

export function getExamById(id: string): Exam | undefined {
  if (id.startsWith("practice-")) {
    const filter = parsePracticeId(id);
    if (!filter) return undefined;
    return buildPracticeExam(filter);
  }
  return getMockExam(id);
}

export function countQuestionsBy(filter: PracticeFilter): number {
  return sharedQuestions.filter((q) => {
    if (q.subjectId !== filter.subjectId) return false;
    if (filter.topicId && q.topicId !== filter.topicId) return false;
    if (filter.subtopicId && q.subtopicId !== filter.subtopicId) return false;
    return true;
  }).length;
}

export { buildPracticeId };
