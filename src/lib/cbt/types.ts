export type ExamStatus = "응시대기" | "응시중" | "완료";

export type Subject = "전기이론" | "전기기기" | "전기설비";

export type Choice = 1 | 2 | 3 | 4;

export type Question = {
  number: number;
  subjectId: string;
  subject: Subject;
  topicId: string;
  topic: string;
  subtopicId: string;
  subtopic: string;
  questionText: string;
  choices: [string, string, string, string];
  answer: Choice;
  explanation: string;
};

export type Exam = {
  id: string;
  round: number;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  questions: Question[];
};

export type ExamSummary = {
  id: string;
  round: number;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  status: ExamStatus;
};

export type Attempt = {
  examId: string;
  examineeName: string;
  startedAt: number;
  endsAt: number;
  answers: (Choice | null)[];
  checked: boolean[];
  submittedAt: number | null;
};

export type LayoutMode = "single" | "double" | "one";

export type FontScale = 100 | 130 | 150;
