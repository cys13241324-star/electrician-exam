# AI 기능 사용법

> Google Gemini 2.5 Flash 기반 AI 학습 도구 3종.
> 무료 티어로 충분 (분당 15회 / 일일 1,500회까지 무료).

## 🚀 시작하기

### 1. API 키 발급 (5분, 무료)

1. https://aistudio.google.com/apikey 접속
2. Google 계정 로그인
3. **"Create API key"** 클릭 → "새 프로젝트" 선택
4. `AIzaSy...` 로 시작하는 키 복사

### 2. .env.local 파일 만들기

프로젝트 루트(`D:/webpage/`)에 `.env.local` 파일 생성:

```
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...여기에붙여넣기...
```

> 참고용 템플릿: `.env.local.example` 파일 보기

### 3. 개발 서버 재시작

```bash
npm run dev
```

환경변수는 dev 서버 시작 시에만 로드됩니다. 키 추가 후 반드시 재시작.

---

## ✨ 3가지 AI 기능

### 1. AI 학습 코치 (떠있는 챗봇)
- 모든 페이지 우하단 🤖 버튼
- 학습자의 응시 기록·플립카드 진행도를 자동으로 참고해 맞춤 답변
- 추천 질문: "오늘 뭐 공부할까요?", "RLC 직렬 공진 쉽게 설명해줘"

### 2. AI 카드 생성기
- `/flashcards` 페이지 우상단 **"✨ AI로 카드 만들기"** 버튼
- 교재 텍스트·노트(최대 6,000자) 붙여넣기 → 3~7장 카드 자동 생성
- 미리보기에서 원하는 카드만 골라 저장

### 3. AI 다른 각도 해설
- **CBT 해설 페이지**(`/cbt/[id]/review`) 각 문제 하단
- **플립카드 답면**의 "💡 AI에게 다른 각도로 설명 요청" 버튼
- 일상 비유와 쉬운 말로 다시 설명

---

## 🔒 보안

- API 키는 서버 사이드(API Routes)에서만 사용
- 클라이언트로 노출되지 않음
- `.env.local` 은 `.gitignore` 처리되어 GitHub에 안 올라감

## 💸 비용

- 무료 티어: 분당 15회, 일일 1,500회 (Gemini 2.5 Flash)
- **추가 청구서 폭격 방지**: 클라이언트에 일일 50회 제한 (localStorage 카운터)
- 데모/시연용으로 충분

## 🛠 모델 변경하고 싶다면

`src/lib/ai/config.ts` 한 곳만 수정:

```ts
// Anthropic Claude 로 갈아끼우기
import { anthropic } from "@ai-sdk/anthropic";
export const COACH_MODEL = anthropic("claude-haiku-4-5");
```

(추가 패키지 설치 필요: `npm install @ai-sdk/anthropic`)

---

## ❌ 문제 해결

### "AI 응답 실패" 에러
- `.env.local` 의 API 키 확인 (오타·공백·따옴표 없는지)
- dev 서버 재시작했는지
- 터미널에서 정확한 에러 메시지 확인

### 응답이 너무 느리거나 멈춤
- Gemini 2.5 Flash는 보통 2~5초 응답
- 10초 이상 안 오면 네트워크/방화벽 확인
- VPN 사용 중이면 일시 해제 권장 (Google API 차단 가능성)

### 한도 초과
- "오늘 50회 호출 한도" 메시지 → localStorage에서 `ai-usage-counter` 삭제하면 즉시 리셋
- 또는 다음 날 자동 리셋
