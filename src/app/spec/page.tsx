"use client";

import Link from "next/link";

type Slide = {
  no: string;
  category: string;
  title: string;
  summary: string;
  why: string;
  features: string[];
  hook: string;
  emoji?: string;
  accent?: "blue" | "violet" | "emerald" | "amber" | "rose" | "indigo";
};

const slides: Slide[] = [
  {
    no: "01",
    category: "1부 · 사이트 개요",
    title: "독끝 전기기능사 필기, 한눈에",
    summary:
      "교재 한 권으로 시작해 합격까지 이어지는 통합 학습 사이트. 교재 + CBT 모의고사 + 부가 콘텐츠가 하나로 연결됩니다.",
    why: "전기기능사 시험 준비자에게 흩어진 학습 자원(책 / 강의 / 카드 / 모의고사)을 한 군데에서 끝낼 수 있게 만들기 위해 기획.",
    features: [
      "1,600+ 엄선된 CBT 문제",
      "100% 기출 해설 무료 공개",
      "13개 인터랙티브 이론 시뮬레이터",
      "300+ 핵심 암기카드 + 오디오북",
      "재미있는 콘셉트 콘텐츠 (카톡·신문 형식)",
    ],
    hook: "비전공자·직장인·학생까지, 학습 시간이 다른 모든 학습자를 한 사이트에서 합격시키는 것이 목표.",
  },
  {
    no: "02",
    category: "1부 · 사이트 개요",
    title: "사용자가 사이트를 이용하는 흐름",
    summary:
      "방문 → 가치 발견 → 가입(예정) → 교재 구매 → 학습 → 합격 → 후기·추천. 각 단계마다 자연스럽게 다음으로 넘어가도록 설계.",
    why: "단순히 페이지가 있는 것이 아니라, 합격까지의 전체 여정을 사이트가 안내해야 학습자가 이탈 없이 끝까지 옴.",
    features: [
      "랜딩에서 6슬라이드 자동 회전 — 모든 가치 자동 노출",
      "5가지 학습 도구 → 클릭 시 미리보기로 신뢰 형성",
      "CBT 모의고사 → 학습 사이클 (응시→결과→해설→오답)",
      "후기 + 합격 갤러리 + 친구 초대로 확산",
    ],
    hook: "사용자가 어디로 가야 할지 모를 일이 없도록 모든 페이지가 다음 액션을 제안.",
  },

  // 글로벌 셀링 요소
  {
    no: "03",
    category: "2부 · 글로벌 셀링",
    title: "상단 교재 구매 배너",
    summary:
      "사이트의 모든 페이지 최상단에 깔리는 sticky 배너. 교재 한 권 셀링을 항상 눈에 보이게.",
    why: "교재가 비즈니스의 시작점이자 핵심 매출원. 어떤 페이지에 들어와도 한 줄 셀링이 노출되어야 함.",
    features: [
      "그라디언트 배경(앰버→오렌지→로즈)으로 시선 끌기",
      "한 줄 카피: '합격을 책임지는 단 하나의 교재'",
      "구매하러 가기 버튼 (출시 시 결제 페이지로 연결)",
      "닫아도 24시간 후 다시 표시 (도배 방지하면서 노출 유지)",
    ],
    hook: "사이트 어디서든 '교재가 있다'는 신호를 무의식에 박아둠. 결국 학습 도구만 쓰던 사용자도 책으로 유도.",
  },
  {
    no: "04",
    category: "2부 · 글로벌 셀링",
    title: "헤더 — addto 카테고리 통합",
    summary:
      "공기업 / 자격증 / 대기업 / 전기기능사 4개 카테고리가 나란히. 우리 사이트는 그 중 '전기기능사' 탭이 활성된 형태.",
    why: "addto.co.kr 기존 회원이 자연스럽게 우리 페이지로 유입되도록, 본사 사이트와 일관된 네비게이션을 가져감.",
    features: [
      "addto BI 로고로 본사 정체성 유지",
      "전기기능사 탭 액센트로 현재 위치 명확",
      "검색 단축키 (Ctrl+K) — 익숙한 키 한 번에 검색",
      "내강의실 / CBT 시작하기 / 로그인·회원가입 즉시 접근",
    ],
    hook: "addto 본사 트래픽이 자격증 → 전기기능사로 자연스럽게 흘러 들어옴.",
  },
  {
    no: "05",
    category: "2부 · 글로벌 셀링",
    title: "우측 교재 플로팅 팝업",
    summary:
      "주요 학습 페이지 우측에 책 일러스트와 함께 떠 있는 작은 카드. 시각적으로 교재의 존재감을 강조.",
    why: "학습 도구를 쓰는 동안에도 교재가 실재한다는 인식을 유지. '도구가 아닌 책으로 시작하라'는 메시지.",
    features: [
      "독끝 전기기능사 필기 책 일러스트 (CSS 3D)",
      "'옆으로 접기' / '오늘 하루 보지 않기' / '이번에만 닫기' 3단계 옵션",
      "학습 흐름을 가리지 않으면서 시각적 어필",
    ],
    hook: "디지털 학습 도구만 쓰는 사용자에게 '책 한 권의 가치'를 매 방문마다 환기시킴.",
  },
  {
    no: "06",
    category: "2부 · 글로벌 셀링",
    title: "실시간 활동 알림 (소셜 프루프)",
    summary:
      "좌하단에 14초마다 등장하는 작은 토스트. '○○님이 CBT 응시', '○○님이 합격(78점)' 등.",
    why: "혼자 공부하는 시험 준비는 외로움. 다른 사람도 활발히 학습 중이라는 시그널이 학습 동기 + 사이트 신뢰로 이어짐.",
    features: [
      "9가지 활동 패턴 (응시 / 합격 / 카드 학습 / 시뮬 체험 등)",
      "초록 점멸 점으로 'live' 느낌",
      "응시 중·시뮬 상세에선 자동 숨김 (학습 방해 안 됨)",
    ],
    hook: "'사이트가 살아있다'는 인상 → 가입하고 싶어지는 무의식적 신호.",
  },

  // 랜딩 페이지
  {
    no: "07",
    category: "3부 · 랜딩 페이지",
    title: "히어로 슬라이더 (6슬라이드 자동 회전)",
    summary:
      "방문 즉시 6장의 카드가 5.5초 간격으로 돌아가며 사이트의 모든 가치를 노출.",
    why: "첫 인상에서 한 가지만 보여주면 다른 가치가 가려짐. 6가지를 자동 회전으로 모두 노출하면 누구든 자기에게 맞는 가치를 발견.",
    features: [
      "1번 슬라이드: 독끝 전기기능사 필기 교재 (검정/앰버 — 프리미엄 톤)",
      "2~6번: CBT / 해설강의 / 플립카드 / 오디오북 / 시뮬레이터",
      "각 슬라이드 컬러가 달라 시각적으로 구분",
      "큰 이모지 부유 애니메이션 → 살아있는 느낌",
      "수동 조작 가능 (좌우 화살표 + 하단 dots)",
    ],
    hook: "5초 안에 사이트의 모든 가치를 학습자가 알게 됨 → 이탈율 감소, 체류 시간 증가.",
  },
  {
    no: "08",
    category: "3부 · 랜딩 페이지",
    title: "합격 로드맵 — 단 3단계",
    summary:
      "교재 → 모의고사 → 부가 서비스. 막연한 시험 준비를 단순한 3단계로 정리.",
    why: "처음 도전하는 사람에게 '뭐부터 해야 할지'가 가장 큰 진입 장벽. 3단계 안내로 막연함을 해소.",
    features: [
      "STEP 01 — 기본 학습 (📘 교재로 기초)",
      "STEP 02 — 실전 콘텐츠 (🖥 CBT 모의고사로 검증)",
      "STEP 03 — 부가 서비스 (✨ 오디오북·카드·시뮬로 마무리)",
      "각 단계마다 즉시 시작 가능한 CTA",
    ],
    hook: "복잡해 보이던 시험 준비가 'A → B → C'로 단순해짐 → '나도 할 수 있겠다' 확신 형성.",
  },
  {
    no: "09",
    category: "3부 · 랜딩 페이지",
    title: "5가지 학습 도구 카드",
    summary:
      "사이트의 핵심 가치 5개를 카드로 빠르게 훑어볼 수 있고, 클릭하면 실제 동작 미리보기까지 확인 가능.",
    why: "가입 전에 '이 사이트에서 뭘 할 수 있는지' 직접 체험할 수 있어야 신뢰가 생김.",
    features: [
      "🖥 CBT 모의고사 (이용 가능)",
      "🎬 기출 해설강의 (Coming Soon)",
      "🃏 플립 암기카드 (실제 샘플 동작)",
      "🎧 오디오북 (실제 샘플 트랙 재생)",
      "⚡ 이론 시뮬레이터 (실제 시뮬 임베드)",
    ],
    hook: "Coming Soon 기능도 샘플은 동작 → '말만이 아니라 진짜로 만들고 있다'는 신뢰감.",
  },
  {
    no: "10",
    category: "3부 · 랜딩 페이지",
    title: "5도구 특장점 자세히 보기",
    summary:
      "5개 카드 아래 좌우 교차 레이아웃으로 도구별 5가지 특장점을 깊이 있게 풀어줌.",
    why: "결제·가입 직전 단계의 사용자는 짧은 카피보다 구체적인 기능 리스트가 결정에 결정적.",
    features: [
      "각 도구마다 5가지 ✓ 특장점 + 한 줄 설명",
      "도구별 시그니처 컬러로 시각 구분",
      "단계 번호(STEP 01~05) 워터마크로 임팩트",
      "각 도구마다 즉시 시작 CTA",
    ],
    hook: "비교 검토 단계의 사용자가 정보 부족으로 떠나지 않도록, 정보 깊이로 결정을 유도.",
  },
  {
    no: "11",
    category: "3부 · 랜딩 페이지",
    title: "CBT 셀링 스포트라이트 — 무료 강조",
    summary:
      "'교재 구매자에게는 강력한 CBT 기능을 무료로 제공'이라는 메시지를 다크 톤으로 임팩트 있게.",
    why: "교재 구매를 망설이는 사용자에게 '책 사면 디지털 도구 다 무료'라는 결정적 한 방.",
    features: [
      "🪟 가로·세로 유형별 문제풀이 (1단/2단/1문제 모드)",
      "📝 모든 문항 상세 해설",
      "🎬 모든 문항 영상 강의",
      "각 기능마다 ✓ 무료 제공 표시",
    ],
    hook: "'교재 한 권 = 학원 한 학기 가치' → 결제 전환 핵심 섹션.",
  },
  {
    no: "12",
    category: "3부 · 랜딩 페이지",
    title: "출판사 신뢰감 — 왜 독끝인가요?",
    summary:
      "다크 톤 + 골드 액센트로 프리미엄 분위기. 통계와 차별점으로 교재 브랜드의 신뢰 형성.",
    why: "처음 보는 출판사 책을 사기 망설이는 사용자에게 '검증된 교재'임을 수치로 증명.",
    features: [
      "누적 판매 부수 12,400+ / 합격률 87% / 5쇄 / 평점 4.8",
      "빅데이터 기반 출제 분석",
      "합격 임계점 역산 설계",
      "현장 실무자 검수",
    ],
    hook: "'그냥 책'이 아니라 '데이터로 검증된 합격 교재'라는 프리미엄 포지셔닝.",
  },
  {
    no: "13",
    category: "3부 · 랜딩 페이지",
    title: "학습 플래너 — 14일 / 28일 / 90일",
    summary:
      "교재의 학습 플래너 3종을 그대로 반영 + 부가 학습 통합. '전략적 학습 기간으로 효율적으로 한 방에 합격'.",
    why: "학습자마다 가용 시간이 다름. 한 가지 일정만 제시하면 누군가는 부담 + 누군가는 답답.",
    features: [
      "TYPE 01 단기완성 14일 — '핵심만 잡고 끝낸다'",
      "TYPE 02 표준형 28일 — '한 번에 합격하는 정공법' (가장 추천)",
      "TYPE 03 학습몰두 90일 — '내 페이스로 완벽하게'",
      "각 단계마다 부가 학습 도구 통합 제안",
      "추천 대상 / 주요 학습 도구 / 진행률 / 핵심 전략 한눈에",
    ],
    hook: "'언제 끝낼 수 있을까?'에 대한 답이 명확해져 결제·시작 망설임 감소.",
  },
  {
    no: "14",
    category: "3부 · 랜딩 페이지",
    title: "잠깐! 콘셉트 콘텐츠",
    summary:
      "5개 학습 도구 외에 '재미있는 콘셉트 콘텐츠'도 있다는 시그널. 카톡방·신문 형식의 이론 학습.",
    why: "딱딱한 시험 공부에 지친 학습자에게 'addto만의 차별 즐거움'을 한 번 더 제공.",
    features: [
      "💬 단톡방 시리즈 — 옴의 법칙·전력 (직급별 단톡방 콘셉트)",
      "📰 전기 일보 — 환형자계·키르히호프 (모바일 신문)",
      "카드 클릭 시 실제 콘텐츠 모달로 즉시 체험",
      "매주 새 콘셉트 콘텐츠 추가 예정",
    ],
    hook: "SNS 공유 가능한 재미있는 콘텐츠 → 자연스러운 바이럴 트래픽.",
  },
  {
    no: "15",
    category: "3부 · 랜딩 페이지",
    title: "통계 / 후기 / FAQ / 뉴스레터",
    summary:
      "신뢰(통계+후기) → 정보(FAQ+무료자료) → 전환(뉴스레터). 결제 직전 모든 의문을 해소.",
    why: "결제 전 사용자의 마음속 마지막 질문(이거 진짜 효과 있나? 환불 되나? 출시일은?)에 모두 답하는 섹션 묶음.",
    features: [
      "Stats Bar 4개 통계 (1,600+ 문제 / 13 시뮬 / 300+ 카드 / 100% 무료)",
      "합격 후기 6명 (점수 + 활용 도구 해시태그)",
      "FAQ 10개 아코디언 (학습/결제/환불/단체/오프라인)",
      "무료 자료 4종 (체크리스트 / 출제 분석 / 한 장 요약 / 플래너)",
      "뉴스레터 가입 폼 (출시 알림)",
    ],
    hook: "결정 직전 사용자의 모든 의문을 해소 → 이메일 가입까지 끌고 옴.",
  },

  // 전기기능사 학습 영역
  {
    no: "16",
    category: "4부 · 학습 영역",
    title: "전기기능사 학습 대시보드",
    summary:
      "로그인한 사용자가 자기 학습 진행 현황을 한 페이지에서 파악. D-day, 학습량, 취약 진단, 학습 곡선 모두 한곳에.",
    why: "재방문할 이유를 만들어주는 핵심 페이지. 매일 들어왔을 때 '오늘 뭐 해야 하지'가 즉시 보여야 함.",
    features: [
      "📅 시험까지 D-day (시기별 메시지)",
      "🎯 과목별 누적 정답률 (3과목 삼각형)",
      "📊 학습량 vs 이용자 평균 (비교)",
      "🔥 오늘의 도전 (일일 30문항 + 연속 학습일)",
      "취약 토픽 자동 진단 + 최근 응시 + 학습 곡선 + 공지사항",
    ],
    hook: "lock-in 효과: 한 번 시작하면 '내 진도'가 쌓이니까 떠날 수 없음. 재방문율 핵심.",
  },
  {
    no: "17",
    category: "4부 · 학습 영역",
    title: "과목별 학습 — 원하는 범위만",
    summary:
      "전기이론 / 전기기기 / 전기설비 3과목 → 주제 → 하위분류까지. 약점만 골라서 풀 수 있음.",
    why: "전체 60문항을 다시 푸는 건 비효율. '어디가 약한지'를 알려주고 '거기만 풀게' 해주는 게 학원의 1:1 관리 효과.",
    features: [
      "3과목 × 평균 3주제 × 평균 3 하위분류 = 28개 세분화 학습 단위",
      "어느 레벨에서든 '응시하기' 버튼으로 즉시 시험",
      "선택한 범위만 추려서 동적 시험 생성",
      "대상 연도 2009~2016년 표기",
    ],
    hook: "1:1 학원 관리 같은 맞춤 학습 = 효율 + 자기 주도 학습 = 학습자가 통제권을 가진다는 만족.",
  },
  {
    no: "18",
    category: "4부 · 학습 영역",
    title: "CBT 모의고사 응시 화면",
    summary:
      "실제 시험장의 CBT 환경을 그대로 재현. 60문항 60분, 글자 크기·화면 배치·계산기까지 똑같이.",
    why: "시험 당일 처음 보는 환경에서 당황해 떨어지는 학습자가 많음. 익숙한 환경 = 합격률 상승.",
    features: [
      "글자 크기 3단계 (100/130/150%)",
      "화면 배치 3종 (1단·2단·1문제)",
      "팝업 계산기 / 전체문제 그리드 / 체크 표시",
      "남은 시간 카운트다운 + 자동 제출",
      "중간 종료해도 진행 상태 자동 저장",
    ],
    hook: "'시험장에서 처음 보는 환경'이 사라짐 = 합격률에 직접 기여 = 후기·재방문 강화.",
  },
  {
    no: "19",
    category: "4부 · 학습 영역",
    title: "결과 + 해설 + 오답 노트",
    summary:
      "응시가 끝이 아니라 학습의 시작. PASS/FAIL 즉시 → 과목별 분석 → 60문항 해설 → 오답만 모은 노트.",
    why: "응시 후 '결과만 보고 끝나는' 사이트가 대부분. 우리는 '왜 틀렸는지 → 다시 풀이' 사이클을 완성.",
    features: [
      "PASS / FAIL 큰 배너 + 100점 환산",
      "과목별 삼각형 레이더 + 강점/취약 진단",
      "60문항 해설 (페이지당 10) + 정답·내선택 색상 구분",
      "오답 노트: 모든 회차의 틀린 문제만 자동 모음 + 과목 필터",
    ],
    hook: "응시 사이클을 완성 = '점수만 알려주는 사이트'와의 결정적 차별점.",
  },

  // 시뮬레이터
  {
    no: "20",
    category: "5부 · 시뮬레이터",
    title: "이론 시뮬레이터 13종",
    summary:
      "글로 읽지 말고 손으로 만지자. 전기력선·자기력·RLC·변압기·차단기까지 13개 인터랙티브 시뮬.",
    why: "전기 비전공자에게 '자기력선'이나 'RLC 공진'은 추상적. 슬라이더 하나 움직였을 때 결과가 즉시 보이면 이해가 직관으로 박힘.",
    features: [
      "전기이론 6종 (전기력선·평행도선·RLC·직병렬·옴의법칙·키르히호프)",
      "전기기기 5종 (변압기 권수비/Y-Δ·직류기·유도전동기·동기기)",
      "전기설비 2종 (접지·차단기)",
      "변수 슬라이더 + 그래프·다이어그램 즉시 갱신",
      "공식과 시각이 같은 화면에서 동시에",
    ],
    hook: "타사 어디에도 없는 자체 시뮬 13종 = 강력한 차별점 + SEO 콘텐츠 + 이론 비전공자 유입.",
  },
  {
    no: "21",
    category: "5부 · 시뮬레이터",
    title: "시뮬 상세 — 핵심 공식 + 핵심 예제",
    summary:
      "각 시뮬레이터 페이지에 핵심 공식과 풀이 단계까지 나오는 예제가 함께. 시뮬만 가지고 끝나지 않게.",
    why: "시뮬은 이해용. 시험은 결국 공식과 풀이 능력. 두 가지를 한 화면에서 연결하면 '시뮬 = 시험 점수'로 가치가 직결됨.",
    features: [
      "📐 핵심 공식 카드 — 1~3개 공식 (수식 + 의미)",
      "✏️ 핵심 예제 — 문제 / 주어진 값 / 풀이 단계 / 정답",
      "단계별 풀이를 검정+골드 모노스페이스로 강조",
      "같은 과목의 다른 시뮬 추천 카드",
    ],
    hook: "'시뮬 보러 왔다가 시험 공부까지 하고 가는' 페이지 → 체류 시간 + 학습 효과 동시 향상.",
  },

  // 부가 페이지
  {
    no: "22",
    category: "6부 · 부가 페이지",
    title: "시험 일정 캘린더",
    summary:
      "큐넷 정기 시험 4회차 일정 + D-day + 응시 절차 4단계.",
    why: "처음 응시하는 사람들이 '언제 어떻게 신청하지?'에서 막힘. 일정과 절차를 한 페이지에 정리해 진입 장벽 제거.",
    features: [
      "4회차 일정 카드 (D-day 자동 계산)",
      "시기별 컬러 (30일+ 블루 / 7~30일 앰버 / 7일 이내 로즈)",
      "응시 절차 4단계 (원서접수 → 결제 → 응시 → 합격발표)",
      "큐넷 외부 링크",
    ],
    hook: "시험 일정 검색 SEO 트래픽 흡수 + 처음 도전자에게 친절한 가이드.",
  },
  {
    no: "23",
    category: "6부 · 부가 페이지",
    title: "합격 인증 갤러리",
    summary:
      "먼저 합격한 사람들의 점수와 짧은 후기. 어떤 도구가 결정적이었는지 해시태그로 정리.",
    why: "후기 6개로는 부족. 갤러리 형태로 9~수십 개를 보여주면 '이 사이트로 정말 합격하는구나' 신뢰가 강해짐.",
    features: [
      "9개 인증 카드 + 점수 뱃지 + 활용 도구 해시태그",
      "각 후기마다 어떤 도구가 결정적이었는지 명시",
      "추후 사용자가 자기 인증을 직접 등록 가능 (예정)",
    ],
    hook: "사회적 증명 (social proof) 극대화 → 결제 전 마지막 망설임 해소.",
  },
  {
    no: "24",
    category: "6부 · 부가 페이지",
    title: "블로그 / 학습 팁",
    summary:
      "학습 전략·자주 틀리는 함정·시험 당일 체크리스트 등 5편의 자체 작성 글.",
    why: "검색 엔진을 통한 자연 유입 트래픽 = 마케팅 비용 0원의 사용자 확보 채널.",
    features: [
      "5편 글: 4주 학습 순서 / 자주 틀리는 5가지 / 시험 당일 / 무료 가능? / 합격 후 활용",
      "각 글마다 'CBT 모의고사 응시' CTA로 자연스러운 전환",
      "다른 글 추천으로 체류 시간 연장",
    ],
    hook: "구글 검색 'CBT 4주 합격', '전기기능사 함정' 등 키워드 → 우리 사이트로 유입 → 학습 도구 발견.",
  },
  {
    no: "25",
    category: "6부 · 부가 페이지",
    title: "친구 초대 (바이럴)",
    summary:
      "사용자가 친구를 초대하면 양쪽 모두에게 학습 부스터(자료팩·카드·시청권) 제공.",
    why: "광고 비용 없이 사용자 1명이 친구 1~2명을 데려오면 트래픽이 기하급수적으로 성장.",
    features: [
      "추천 코드 + 초대 링크 자동 발급",
      "혜택 3가지 (양쪽 자료팩 / 카드 50장 / 우선 시청권)",
      "카카오·네이버 밴드·이메일 공유 (출시 시 연동)",
    ],
    hook: "K = 1.5 (1명이 1.5명 초대) 정도의 바이럴 계수만 나와도 사용자 베이스 폭발적 성장.",
  },
];

type AccentKey = "blue" | "violet" | "emerald" | "amber" | "rose" | "indigo";

const ACCENTS: Record<
  AccentKey,
  { bg: string; text: string; chip: string }
> = {
  blue: { bg: "bg-blue-600", text: "text-blue-700", chip: "bg-blue-50 text-blue-700" },
  violet: { bg: "bg-violet-600", text: "text-violet-700", chip: "bg-violet-50 text-violet-700" },
  emerald: { bg: "bg-emerald-600", text: "text-emerald-700", chip: "bg-emerald-50 text-emerald-700" },
  amber: { bg: "bg-amber-500", text: "text-amber-700", chip: "bg-amber-50 text-amber-700" },
  rose: { bg: "bg-rose-600", text: "text-rose-700", chip: "bg-rose-50 text-rose-700" },
  indigo: { bg: "bg-indigo-600", text: "text-indigo-700", chip: "bg-indigo-50 text-indigo-700" },
};

// 카테고리별 액센트 자동 매핑
const CATEGORY_ACCENT: Record<string, Slide["accent"]> = {
  "1부 · 사이트 개요": "blue",
  "2부 · 글로벌 셀링": "amber",
  "3부 · 랜딩 페이지": "violet",
  "4부 · 학습 영역": "blue",
  "5부 · 시뮬레이터": "indigo",
  "6부 · 부가 페이지": "rose",
};

const EMOJIS = [
  "📘", "🗺️",
  "🏷️", "🧭", "📕", "💬",
  "🎢", "🛣️", "🃏", "📋", "⚡", "🏆", "📅", "🗞️", "⭐",
  "📊", "🎯", "🖥️", "📈",
  "🧪", "📐",
  "📅", "🏆", "📝", "🎁",
];

slides.forEach((s, i) => {
  s.accent = CATEGORY_ACCENT[s.category] ?? s.accent ?? "blue";
  s.emoji = EMOJIS[i] ?? "📄";
});

export default function SpecPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* 표지 */}
      <header className="break-after-page bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 px-6 py-20 text-white print:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold tracking-widest text-amber-300">
            PROJECT BRIEF · 2026
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            독끝 전기기능사 필기
            <br />
            <span className="text-amber-300">addto 온라인 기획서</span>
          </h1>
          <p className="mt-6 text-base leading-7 text-white/85 sm:text-lg">
            각 페이지·섹션을
            <br />
            <strong>왜 만들었나 / 특장점 / 모객 포인트</strong> 3관점으로 정리.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <Stat label="섹션" value={`${slides.length}개`} />
            <Stat label="페이지" value="16개" />
            <Stat label="시뮬레이터" value="13개" />
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

      <section className="border-b border-zinc-200 bg-amber-50/60 px-6 py-6 print:hidden">
        <div className="mx-auto flex max-w-4xl items-start gap-3 text-sm text-amber-900">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-semibold">PPT로 활용하시려면</p>
            <ul className="mt-1 space-y-0.5 text-xs">
              <li>· 카드 한 장을 PPT 1슬라이드로 옮기세요 (텍스트 그대로 복사)</li>
              <li>
                · 이미지가 필요한 슬라이드는 사이트 해당 페이지에서{" "}
                <code className="mx-1 rounded bg-white px-1">Win + Shift + S</code>{" "}
                영역 캡처
              </li>
              <li>
                · 혹은 우상단 <strong>"PDF로 출력"</strong>으로 바로 PDF 생성
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 슬라이드 카드 */}
      <main className="mx-auto max-w-4xl px-6 py-12 print:py-0">
        {slides.map((s) => {
          const a = ACCENTS[s.accent ?? "blue"];
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
                {/* 한 줄 요약 */}
                <p className="text-sm leading-7 text-zinc-800 sm:text-base">
                  {s.summary}
                </p>

                {/* 왜 만들었나 */}
                <div className={`mt-5 rounded-lg px-4 py-3 ${a.chip}`}>
                  <p className="text-[11px] font-bold uppercase tracking-wide">
                    왜 만들었나
                  </p>
                  <p className="mt-1 text-sm leading-6">{s.why}</p>
                </div>

                {/* 특장점 */}
                <div className="mt-5">
                  <p
                    className={`text-[11px] font-bold uppercase tracking-wide ${a.text}`}
                  >
                    특장점
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm leading-6 text-zinc-800">
                    {s.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${a.bg}`}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 모객 포인트 */}
                <div className="mt-5 rounded-lg border-2 border-amber-300 bg-amber-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
                    💡 모객 포인트
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-amber-900">
                    {s.hook}
                  </p>
                </div>
              </div>
            </article>
          );
        })}

        <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-8 text-center print:hidden">
          <p className="text-2xl">📑</p>
          <p className="mt-2 text-sm font-semibold text-zinc-800">
            동일 본문은{" "}
            <code className="mx-1 rounded bg-zinc-100 px-1.5 py-0.5">
              SPEC.md
            </code>{" "}
            파일에서도 확인 가능합니다
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            프로젝트 루트 — Notion / Google Docs 복붙 가능
          </p>
        </div>
      </main>

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
