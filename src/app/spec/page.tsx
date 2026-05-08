"use client";

import Link from "next/link";

type Slide = {
  no: string;
  category: string;
  title: string;
  intro?: string;
  why?: string;
  features?: string[];
  visuals?: string[];
  tech?: string;
  capture?: string;
  emoji: string;
  accent: string; // tailwind color class root, e.g. blue, violet
};

const slides: Slide[] = [
  {
    no: "01",
    category: "1부 · 개요",
    title: "프로젝트 한눈에",
    emoji: "📘",
    accent: "blue",
    intro: "독끝 전기기능사 필기 — addto 온라인 / 교재 한 권으로 시작해 합격까지 이어지는 통합 학습 사이트",
    features: [
      "1,600+ 엄선된 CBT 문제",
      "100% 기출 해설 무료 공개",
      "13개 인터랙티브 시뮬레이터",
      "300+ 핵심 암기카드",
    ],
    visuals: [
      "대상: 비전공 입문자 / 시간 부족한 직장인 / 깊이 학습형 학생",
      "차별 가치: 빅데이터 기반 고적중 + 무료 부가 학습",
    ],
    capture: "/ 메인 진입 시 상단 풀샷 (히어로 0번째 교재 슬라이드)",
  },
  {
    no: "02",
    category: "1부 · 개요",
    title: "사이트맵",
    emoji: "🗺️",
    accent: "blue",
    intro: "16개 정적 라우트 + 7개 동적 라우트",
    features: [
      "/ 랜딩 (15개 섹션)",
      "/cbt 전기기능사 대시보드 + 4개 하위 (study/exams/wrong-notes)",
      "/cbt/[id]/take|result|review · CBT 응시 흐름",
      "/simulator + /simulator/[id] · 13개 시뮬",
      "/schedule · /gallery · /blog · /invite",
      "글로벌: /sitemap.xml · /robots.txt · /manifest.webmanifest",
    ],
  },
  {
    no: "03",
    category: "2부 · 디자인",
    title: "디자인 시스템",
    emoji: "🎨",
    accent: "violet",
    why: "addto.co.kr 톤 + 다산패스/해커스 패턴 차용. 콘텐츠 카피는 100% 자체 작성.",
    features: [
      "Primary Blue 600 + Accent Amber 400 (골드 강조)",
      "5도구별 시그니처 컬러 (CBT 블루 / 해설 에메랄드 / 카드 바이올렛 / 오디오 앰버 / 시뮬 인디고)",
      "한글 Pretendard Variable (CDN)",
      "자체 SVG 패턴 8종: grid · dots · diagonal · circuit · mesh-blue/amber/violet · noise",
      "패턴 opacity 6-8% (가독성 우선)",
    ],
  },
  {
    no: "04",
    category: "2부 · 디자인",
    title: "인터랙션 시스템",
    emoji: "✨",
    accent: "violet",
    why: "외부 라이브러리 0. 자체 제작으로 가벼움 + 학습 가능성.",
    features: [
      "<Reveal> · IntersectionObserver 기반 5종 (fade-up/fade-in/slide-left/slide-right/scale)",
      "<BackgroundPattern> · SVG 패턴 8종",
      "<SectionDivider> · spark/wave/line/dots",
      "<ScrollProgress> · 상단 그라디언트 바",
      "<ScrollToTop> · 우하단 ↑ 버튼 (600px 후 등장)",
      "prefers-reduced-motion 자동 대응",
    ],
  },
  {
    no: "05",
    category: "3부 · 글로벌",
    title: "상단 교재 배너",
    emoji: "📘",
    accent: "amber",
    why: "교재 판매가 수익 핵심. 모든 페이지에 한 줄 셀링.",
    features: [
      "풀폭 sticky (앰버→오렌지→로즈 그라디언트)",
      '"📘 합격을 책임지는 단 하나의 교재 — 독끝 전기기능사 필기"',
      "구매하러 가기 버튼 (준비중 비활성)",
      "✕ 닫으면 24시간 후 재표시 (localStorage)",
    ],
    tech: "src/components/TextbookBanner.tsx",
  },
  {
    no: "06",
    category: "3부 · 글로벌",
    title: "헤더 네비게이션",
    emoji: "🧭",
    accent: "blue",
    why: "addto 4개 카테고리 탭 + 검색 + 핵심 액션 즉시 접근",
    features: [
      "유틸 바: 로그인·회원가입·쿠폰·장바구니·1:1 문의",
      "메인 바: addto BI + 4 카테고리 + 🔍 검색 + CBT 시작 + 내강의실",
      "검색: Ctrl+K / ⌘K 단축키",
      "모바일: 햄버거 (3선→X 모핑)",
    ],
    tech: "src/components/Header.tsx + SearchModal.tsx",
  },
  {
    no: "07",
    category: "3부 · 글로벌",
    title: "푸터 + 우측 플로팅 팝업",
    emoji: "📬",
    accent: "amber",
    features: [
      "[푸터] 4컬럼: 브랜드 / 학습콘텐츠 / 고객지원 / 정책",
      "[푸터] SNS 4종 + 사업자 정보",
      "[플로팅] 우상단 fixed 카드 (xl:1280+)",
      "[플로팅] 책 일러스트 (CSS 3D) + 셀링 카피",
      "[플로팅] '오늘 하루 보지 않기' (자정까지)",
      "[플로팅] '옆으로 접기' 가능한 세로 탭",
    ],
    tech: "Footer.tsx + TextbookFloatingPopup.tsx",
  },
  {
    no: "08",
    category: "3부 · 글로벌",
    title: "활동 티커 (소셜 프루프)",
    emoji: "💬",
    accent: "emerald",
    why: '"지금 살아있는 사이트" 인상 + 다른 사람도 학습 중이라는 시그널',
    features: [
      "좌하단 14초 간격 알림 (6초 노출)",
      '9가지 활동 패턴 ("○○님이 합격" / "응시 시작" 등)',
      "응시 중·시뮬 상세에서는 자동 숨김 (산만함 방지)",
      "초록 점멸 점으로 live 느낌",
    ],
    tech: "src/components/ActivityTicker.tsx",
  },
  {
    no: "09",
    category: "4부 · 랜딩",
    title: "히어로 슬라이더 (6슬라이드)",
    emoji: "🎢",
    accent: "blue",
    why: "첫 인상에서 6가지 가치 제안을 자동 노출",
    features: [
      "5.5초 자동 회전 (호버 시 일시정지)",
      "좌우 화살표 + dots + 진행바",
      "큰 이모지 6초 부유 애니메이션",
      "슬라이드: ① 교재(검정/앰버) ② CBT(블루) ③ 해설강의(에메랄드) ④ 플립카드(바이올렛) ⑤ 오디오북(앰버/오렌지) ⑥ 시뮬레이터(인디고)",
    ],
    tech: "src/components/HeroSlider.tsx",
  },
  {
    no: "10",
    category: "4부 · 랜딩",
    title: "합격 로드맵 (3단계)",
    emoji: "🗺️",
    accent: "blue",
    why: "교재→모의고사→부가서비스 흐름 명시화",
    features: [
      "STEP 01 — 기본 학습 (앰버) · 📘 독끝 교재",
      "STEP 02 — 실전 콘텐츠 (블루) · 🖥 CBT 모의고사",
      "STEP 03 — 부가 서비스 (바이올렛) · ✨ 오디오/카드/시뮬",
      "거대 ROADMAP 워터마크 + 단계 번호 워터마크 (140px)",
      "헤드라인: '합격까지, 단 3단계' + 앰버 형광펜 효과",
    ],
    tech: "src/components/HowItWorks.tsx",
  },
  {
    no: "11",
    category: "4부 · 랜딩",
    title: "5가지 학습 도구 (카드 그리드)",
    emoji: "🃏",
    accent: "violet",
    features: [
      "5개 카드 (3/2/1열 반응형)",
      "상태 뱃지: Coming Soon (앰버) / 이용 가능 (에메랄드)",
      "CBT → /cbt 직접 이동",
      "해설강의 → 비활성 (모달 X)",
      "플립/오디오/시뮬 → 미리보기 모달",
      "거대 FEATURES 워터마크 + 그라디언트 헤드라인",
    ],
  },
  {
    no: "12",
    category: "4부 · 랜딩",
    title: "미리보기 모달 (4종)",
    emoji: "🔍",
    accent: "violet",
    features: [
      "info · 설명만 (해설강의)",
      "iframe · 실제 HTML 임베드 (시뮬레이터)",
      "audio · MP3 플레이어 (오디오북)",
      "rich-flashcards · 그라디언트 헤더 + 카드 스택 + 카테고리 + iframe",
      "ESC / 배경 / ✕로 닫기",
    ],
    tech: "src/components/FeaturePreviewModal.tsx",
  },
  {
    no: "13",
    category: "4부 · 랜딩",
    title: "특장점 자세히 (5도구 상세)",
    emoji: "📋",
    accent: "violet",
    why: "5카드는 빠른 개요, 깊은 정보는 별도 섹션. 좌우 교차 스토리텔링.",
    features: [
      "5도구 좌우 교차 (1·3·5 비주얼 좌측 / 2·4 우측)",
      "각 도구: 그라디언트 비주얼 + 워터마크 STEP 번호",
      "5개 특장점 (✓ 체크 + 한 줄 설명)",
      "도구 사이 'STEP 02' spark 디바이더",
      "거대 DETAILS 워터마크 + 그라디언트 헤드라인",
    ],
    tech: "src/components/FeatureDetails.tsx",
  },
  {
    no: "14",
    category: "4부 · 랜딩",
    title: "CBT 셀링 스포트라이트",
    emoji: "⚡",
    accent: "blue",
    why: '"교재 구매자에게 무료 강력 기능" 임팩트 강조',
    features: [
      "짙은 네이비 배경 + 발광 오브",
      "골드 PILL '⚡ 잠깐!'",
      "헤드라인: '교재 구매자에게는, 강력한 기능을 무료로' (무료 골드 underline)",
      "3가지 특징: 가로·세로 유형별 / 상세한 해설 / 모든 문항 강의",
      "CTA: CBT 무료 응시 + 교재 구매(준비중)",
    ],
    tech: "src/components/CbtSpotlight.tsx",
  },
  {
    no: "15",
    category: "4부 · 랜딩",
    title: "출판사 신뢰감 (Trust)",
    emoji: "📊",
    accent: "amber",
    features: [
      "다크 zinc-900 + 골드 회로 패턴 + 발광 오브",
      "'왜 독끝인가요?' 헤드라인",
      "통계 4개: 누적 12,400+ / 합격률 87% / 5쇄 / 평점 4.8",
      "차별점 4개: 빅데이터 / 합격 임계점 / 완전 연동 / 현장 검수",
      "mock 수치임을 정직하게 명시",
    ],
    tech: "src/components/TextbookTrust.tsx",
  },
  {
    no: "16",
    category: "4부 · 랜딩",
    title: "학습 플래너 (14/28/90일)",
    emoji: "📅",
    accent: "rose",
    why: "교재 학습 플래너를 그대로 반영 + 부가 학습 통합",
    features: [
      "TYPE 01 단기완성형 14일 (로즈) — '2주, 핵심만 잡고 끝낸다'",
      "TYPE 02 표준형 28일 (블루) — '4주, 한 번에 합격하는 정공법'",
      "TYPE 03 학습몰두형 90일 (에메랄드) — '3개월, 내 페이스로'",
      "각 단계 일정 + 부가 학습 통합 ('🎧 오디오북 + 🃏 플립카드')",
      "우측 다크 사이드바: STRATEGY 핵심 3포인트 + CTA",
      "메인 카피: '전략적 학습 기간으로, 효율적으로 한 방에 합격'",
    ],
    tech: "src/components/StudyPlan.tsx",
  },
  {
    no: "17",
    category: "4부 · 랜딩",
    title: "잠깐! 콘셉트 콘텐츠",
    emoji: "💬",
    accent: "rose",
    why: "5도구 외 재미있는 콘텐츠가 더 있다는 시그널",
    features: [
      "💬 단톡방 시리즈 (직급별 단톡방 콘셉트)",
      "📰 전기 일보 (모바일 신문 형식)",
      "카드 클릭 → 모달 임베드 (실제 HTML)",
      "'🎁 매주 새로운 콘셉트 콘텐츠 추가' 안내",
    ],
    tech: "ElectricExtras.tsx + public/extras/*.html",
  },
  {
    no: "18",
    category: "4부 · 랜딩",
    title: "후기 / FAQ / 뉴스레터",
    emoji: "⭐",
    accent: "amber",
    features: [
      "[후기] 6개 합격 카드 (점수 + 활용 도구 해시태그)",
      "[FAQ] 10개 아코디언 (학습/결제/환불/단체/오프라인)",
      "[무료 자료] 4 PDF (체크리스트 / 출제 분석 / 한 장 요약 / 플래너)",
      "[뉴스레터] 이메일 입력 + validation + mock 제출",
    ],
  },
  {
    no: "19",
    category: "5부 · 학습",
    title: "전기기능사 대시보드",
    emoji: "📊",
    accent: "blue",
    why: "다산패스 스타일 + 우리만의 위젯 추가",
    features: [
      "상단 배너: D-day 위젯 + 빠른 액션 (과목별/CBT/시뮬)",
      "Stats Row 3카드: 학습 현황 삼각형 / 학습량 vs 평균 / 오늘의 도전",
      "취약점 진단 + 최근 응시 기록",
      "학습 곡선 SVG 차트 (응시별 점수 + 합격선 60)",
      "공지사항 + 학습 게시판",
    ],
    tech: "Dashboard.tsx + DDayWidget/DailyChallenge/RecentAttempts/LearningCurve",
  },
  {
    no: "20",
    category: "5부 · 학습",
    title: "과목별 학습 (트리)",
    emoji: "📚",
    accent: "violet",
    why: "원하는 범위만 골라 응시 (약점 보강용)",
    features: [
      "3과목 탭 (전기이론/기기/설비)",
      "선택된 과목의 주제 카드 (3-4개)",
      "각 카드: 주제 + 하위분류 리스트 + 응시 버튼",
      "응시 → /cbt/practice-{과목}-{주제}-{하위}/take 동적 라우트",
      "ExamTaker 컴포넌트 재사용",
    ],
    tech: "StudyBrowser.tsx + curriculum.ts (28 하위분류)",
  },
  {
    no: "21",
    category: "5부 · 학습",
    title: "CBT 응시 (5회차)",
    emoji: "🖥️",
    accent: "blue",
    why: "실제 CBT 환경 그대로 — 시험장 친숙도",
    features: [
      "툴바: 글자크기(100/130/150) / 화면배치(1단/2단/1문제) / 계산기",
      "전체문제·남은문제·체크문제 필터 + 그리드",
      "좌·우 양방향 연동 답안 표기란",
      "카운트다운 타이머 (자동 제출)",
      "localStorage 자동 저장 (중단해도 이어서)",
      "미풀이 경고 → 최종 확인 → 제출",
    ],
    tech: "ExamTaker.tsx + Calculator/QuestionMap Dialog",
  },
  {
    no: "22",
    category: "5부 · 학습",
    title: "결과 + 해설 + 오답 노트",
    emoji: "📈",
    accent: "emerald",
    features: [
      "[결과] PASS/FAIL 큰 배너 + 100점 환산",
      "[결과] 과목별 삼각형 레이더 + 강점/보통/취약 진단",
      "[해설] 60문항 (페이지당 10) + 60번호 그리드 (맞힘/틀림/체크 색상)",
      "[해설] 정답·내선택 컬러 표시 + 필터 (전체/맞힘/틀림/체크)",
      "[오답노트] 모든 회차의 오답 자동 추출 + 과목 필터 + 정답 토글",
    ],
    tech: "ResultView.tsx + ReviewView.tsx + WrongNotes.tsx",
  },
  {
    no: "23",
    category: "6부 · 시뮬",
    title: "시뮬레이터 인덱스 (13개)",
    emoji: "⚡",
    accent: "indigo",
    why: "글로 읽지 말고 손으로 만져 이해",
    features: [
      "인디고-퍼플 그라디언트 히어로 + 회로 패턴",
      "카테고리별: 전기이론(6) / 전기기기(5) / 전기설비(2)",
      "각 카드: 이모지 + 토픽 칩 + '체험하기 →'",
      "하단 학습 팁 3종 (변수 끝까지 / 공식과 그림 / 시뮬→기출)",
    ],
    tech: "src/app/simulator/page.tsx",
  },
  {
    no: "24",
    category: "6부 · 시뮬",
    title: "시뮬 13종 카탈로그",
    emoji: "🧪",
    accent: "indigo",
    features: [
      "전기이론: 전기력선 · 평행도선 · RLC 공진 · 직병렬 · 옴의 법칙 · 키르히호프",
      "전기기기: 변압기 권수비 · Y/Δ 결선 · 직류기 · 유도전동기 회전자계 · 동기기 P-δ",
      "전기설비: 접지 저항 · 차단기 동작",
      "각 시뮬 단독 HTML (Tailwind CDN + Pretendard + Canvas/SVG)",
    ],
  },
  {
    no: "25",
    category: "6부 · 시뮬",
    title: "시뮬 상세 (공식 + 예제)",
    emoji: "📐",
    accent: "indigo",
    why: "시뮬만이 아니라 공식·예제까지 학습 — 시험 직결",
    features: [
      "인트로 헤더 (이모지 + 카테고리·토픽 + 큰 제목)",
      "시뮬 iframe (80vh)",
      "📐 핵심 공식 카드 (블루) — 수식+의미",
      "✏️ 핵심 예제 카드 (앰버) — 문제·주어진값·풀이단계·정답",
      "같은 과목의 다른 시뮬 추천 3개",
      "13개 시뮬 모두 정적 빌드 (generateStaticParams)",
    ],
    tech: "src/app/simulator/[id]/page.tsx + simulators.ts",
  },
  {
    no: "26",
    category: "7부 · 부가",
    title: "시험 일정 (`/schedule`)",
    emoji: "🗓️",
    accent: "blue",
    features: [
      "히어로: '언제 응시할지, 미리 정하세요'",
      "4회차 일정 카드 + D-day 자동 계산",
      "시기별 컬러 (30+ 블루 / 7-30 앰버 / 7- 로즈)",
      "응시 절차 4단계 (원서접수→결제→응시→발표)",
      "큐넷 외부 링크",
    ],
  },
  {
    no: "27",
    category: "7부 · 부가",
    title: "합격 갤러리 / 친구 초대",
    emoji: "🏆",
    accent: "rose",
    features: [
      "[갤러리] 9개 인증 카드 (그라디언트 헤더 + 점수 + 활용 도구)",
      "[갤러리] '인증 등록' (준비중)",
      "[초대] 추천 코드 + 초대 링크 복사",
      "[초대] 카카오·밴드·이메일 공유 (준비중)",
      "[초대] 3가지 혜택 (자료팩 / 카드 50장 / 우선 시청권)",
    ],
  },
  {
    no: "28",
    category: "7부 · 부가",
    title: "블로그 / 학습 팁",
    emoji: "📝",
    accent: "blue",
    why: "SEO 트래픽 + 권위 형성",
    features: [
      "5개 글: 4주 합격 학습 순서 / 자주 틀리는 함정 / 시험 당일 / 무료 가능 / 합격 후 활용",
      "인덱스: 추천 1개 + 그리드 4개",
      "상세: 카테고리·요약·본문(간단 마크다운) + 다른 글 추천",
      "각 글 정적 빌드 + SEO 메타",
    ],
    tech: "src/app/blog + src/lib/blog.ts",
  },
  {
    no: "29",
    category: "8부 · 시스템",
    title: "검색 모달 / 토스트 / 스켈레톤 / 에러",
    emoji: "🛠️",
    accent: "violet",
    features: [
      "[검색] 헤더 🔍 + Ctrl+K — 인기 검색어 + 빠른 이동",
      "[토스트] useToast() 훅, 4톤(성공/에러/안내), 4초 자동",
      "[스켈레톤] Skeleton/CardSkeleton/ListSkeleton, pulse 애니메이션",
      "[에러] app/error.tsx, '다시 시도' + '메인으로' + digest 표시",
    ],
  },
  {
    no: "30",
    category: "9부 · 부록",
    title: "기술 / SEO / 성능",
    emoji: "⚙️",
    accent: "blue",
    features: [
      "Next.js 16 App Router + TypeScript + Tailwind v4",
      "한글 Pretendard Variable (CDN)",
      "외부 UI 라이브러리 0 (자체 제작)",
      "정적 라우트 11개 + 동적 4개",
      "SEO: 페이지별 metadata + OG + JSON-LD + sitemap + robots",
      "PWA manifest (모바일 홈 화면 추가 가능)",
      "현재 100% 클라이언트 + mock + localStorage",
    ],
  },
  {
    no: "31",
    category: "9부 · 부록",
    title: "향후 확장 (Priority 1)",
    emoji: "🚀",
    accent: "amber",
    features: [
      "회원가입/로그인 (Supabase Auth + 카카오/네이버 소셜)",
      "DB 연동 (Supabase) — 사용자/문제/응시기록/후기",
      "결제 (PortOne / 토스페이먼츠)",
      "관리자 CMS (1,600문제 입력)",
      "이메일 발송 (Resend / Stibee)",
      "Google Analytics 4 + Microsoft Clarity",
      "다크모드 (선택)",
      "푸시 알림 (D-day 임박)",
    ],
  },
];

const ACCENTS: Record<
  string,
  { bg: string; text: string; ring: string; chip: string }
> = {
  blue: {
    bg: "bg-blue-600",
    text: "text-blue-700",
    ring: "ring-blue-200",
    chip: "bg-blue-50 text-blue-700",
  },
  violet: {
    bg: "bg-violet-600",
    text: "text-violet-700",
    ring: "ring-violet-200",
    chip: "bg-violet-50 text-violet-700",
  },
  emerald: {
    bg: "bg-emerald-600",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    chip: "bg-emerald-50 text-emerald-700",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-700",
    ring: "ring-amber-200",
    chip: "bg-amber-50 text-amber-700",
  },
  rose: {
    bg: "bg-rose-600",
    text: "text-rose-700",
    ring: "ring-rose-200",
    chip: "bg-rose-50 text-rose-700",
  },
  indigo: {
    bg: "bg-indigo-600",
    text: "text-indigo-700",
    ring: "ring-indigo-200",
    chip: "bg-indigo-50 text-indigo-700",
  },
};

export default function SpecPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* 인쇄용 표지 */}
      <header className="break-after-page bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 px-6 py-20 text-white print:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold tracking-widest text-amber-300">
            PROJECT SPEC · 2026
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            독끝 전기기능사 필기
            <br />
            <span className="text-amber-300">addto 온라인 기획서</span>
          </h1>
          <p className="mt-6 text-base leading-7 text-white/85 sm:text-lg">
            모든 페이지·섹션·컴포넌트의 목적과 구현을
            <br />
            슬라이드 단위로 정리한 통합 기획서
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <Stat label="섹션" value="31개" />
            <Stat label="페이지" value="16개" />
            <Stat label="시뮬레이터" value="13개" />
            <Stat label="컴포넌트" value="35+" />
          </div>
          <div className="mt-12 flex flex-wrap gap-3 print:hidden">
            <Link
              href="/"
              className="rounded-md bg-white px-5 py-2 text-sm font-bold text-blue-700 hover:bg-amber-50"
            >
              사이트로 돌아가기
            </Link>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
              className="rounded-md border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              📄 PDF로 출력 (Ctrl+P)
            </button>
          </div>
        </div>
      </header>

      {/* 사용 안내 (인쇄에서 빠짐) */}
      <section className="border-b border-zinc-200 bg-amber-50/60 px-6 py-6 print:hidden">
        <div className="mx-auto flex max-w-4xl items-start gap-3 text-sm text-amber-900">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-semibold">PPT로 활용하시려면</p>
            <ul className="mt-1 space-y-0.5 text-xs">
              <li>· 각 슬라이드 카드 한 장을 1슬라이드로 옮기세요</li>
              <li>
                · 캡처가 필요한 항목은 브라우저에서 해당 페이지를 열고
                <code className="mx-1 rounded bg-white px-1">Win + Shift + S</code>
                로 영역 캡처
              </li>
              <li>
                · 또는 우측 상단 <strong>"PDF로 출력"</strong> 버튼으로 인쇄 →
                Microsoft Print to PDF
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 슬라이드 카드들 */}
      <main className="mx-auto max-w-4xl px-6 py-12 print:py-0">
        {slides.map((s) => {
          const a = ACCENTS[s.accent] ?? ACCENTS.blue;
          return (
            <article
              key={s.no}
              className="break-inside-avoid-page mb-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm print:mb-0 print:break-after-page print:border-0 print:shadow-none"
            >
              <header
                className={`relative overflow-hidden ${a.bg} px-8 py-6 text-white`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -top-8 select-none text-[120px] font-black leading-none text-white/10"
                >
                  {s.no}
                </span>
                <div className="relative flex items-center gap-3">
                  <span className="text-3xl">{s.emoji}</span>
                  <div>
                    <p className="text-[11px] font-bold tracking-widest text-white/85">
                      SLIDE {s.no} · {s.category}
                    </p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                      {s.title}
                    </h2>
                  </div>
                </div>
              </header>

              <div className="px-8 py-6">
                {s.intro && (
                  <p className="mb-4 text-sm leading-6 text-zinc-800 sm:text-base">
                    {s.intro}
                  </p>
                )}

                {s.why && (
                  <div className={`mb-5 rounded-lg px-4 py-3 ${a.chip}`}>
                    <p className="text-[11px] font-bold tracking-wide uppercase">
                      Why
                    </p>
                    <p className="mt-1 text-sm leading-6">{s.why}</p>
                  </div>
                )}

                {s.features && s.features.length > 0 && (
                  <div className="mb-5">
                    <p className={`text-[11px] font-bold uppercase tracking-wide ${a.text}`}>
                      구현 / 구성
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-6 text-zinc-800">
                      {s.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${a.bg}`} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {s.visuals && s.visuals.length > 0 && (
                  <div className="mb-5">
                    <p className={`text-[11px] font-bold uppercase tracking-wide ${a.text}`}>
                      시각 / 추가 메모
                    </p>
                    <ul className="mt-2 space-y-1 text-sm leading-6 text-zinc-700">
                      {s.visuals.map((v, i) => (
                        <li key={i}>· {v}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-100 pt-4 text-xs">
                  {s.tech && (
                    <span className="rounded-md bg-zinc-900 px-2.5 py-1 font-mono text-amber-300">
                      💻 {s.tech}
                    </span>
                  )}
                  {s.capture && (
                    <span className="rounded-md bg-amber-50 px-2.5 py-1 text-amber-800">
                      📸 캡처: {s.capture}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-8 text-center print:hidden">
          <p className="text-2xl">📑</p>
          <p className="mt-2 text-sm font-semibold text-zinc-800">
            전체 본문은 <code className="mx-1 rounded bg-zinc-100 px-1.5 py-0.5">SPEC.md</code> 파일에서도 확인 가능합니다
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            프로젝트 루트에 위치 — Notion / Google Docs 복붙 가능
          </p>
        </div>
      </main>

      {/* 인쇄 전용 스타일 */}
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
      <p className="text-2xl font-black text-amber-300">{value}</p>
      <p className="mt-1 text-xs text-white/80">{label}</p>
    </div>
  );
}
