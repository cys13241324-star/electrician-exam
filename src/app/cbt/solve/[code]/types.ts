/**
 * 풀이 페이지 공통 타입 — Agent 1(페이지)과 Agent 2(결과뷰) 공유.
 *
 * Question 구조는 src/data/questions.json 과 1:1 매칭.
 * 한국어 키는 엑셀 v3 양식 컬럼명을 그대로 사용.
 */

export type Block = {
  id?: string;
  type: "text" | "image";
  value: string;
};

export type Question = {
  문항코드?: string;
  과정?: string;
  연도?: string | number;
  회차?: string | number;
  사용교재?: string;
  교재구분?: string;
  강의주소?: string;
  과목ID?: string;
  챕터?: string;
  대유형?: string;
  중유형?: string;
  내용?: string;
  빈출도?: number;
  난이도?: number;
  문제유형?: string;
  변형이력?: string | number;
  비고?: string;
  발문?: string;
  조건?: string;
  발문그림?: string;
  보기1?: string;
  보기1그림?: string;
  보기2?: string;
  보기2그림?: string;
  보기3?: string;
  보기3그림?: string;
  보기4?: string;
  보기4그림?: string;
  "정답(1~4)"?: string | number;
  오답분석?: string;
  해설블록?: Block[];
  학습포인트블록?: Block[];
};

/** 1~4 정답 번호 */
export type AnswerNum = 1 | 2 | 3 | 4;

/**
 * SolveResult 컴포넌트 props — Agent 2가 구현.
 * Agent 1이 제출 후 이 컴포넌트를 import해서 렌더링.
 */
export type SolveResultProps = {
  question: Question;
  userAnswer: AnswerNum;        // 학습자가 고른 답
  elapsedMs: number;            // 풀이 소요 시간
  onNext?: () => void;          // "다음 문항" 콜백 (선택)
  onRetry?: () => void;         // "다시 풀기" 콜백 (선택)
};
