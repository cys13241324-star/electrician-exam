# CBT 문항관리 엑셀 템플릿

## 최종본 (canonical)

- **`question-template-v3.xlsx`** — 관리자용 CBT 문항관리 통합 템플릿 **최종본**
  - 1행 영역 그룹 헤더 + 2행 컬럼 헤더 + 데이터 행
  - 32컬럼 (출처·코드·강의·분류·속성·발문·보기·정답·해설·오답분석·학습POINT)
  - 시트: `문항등록` / `사용가이드` / `커리큘럼ID` / `색상범례`
  - **생성 원본(source of truth)**: `tools/build_template_v3.py` — 이 스크립트를 실행해 재생성한다. 파일을 직접 수정하지 말 것.
- **`sample_batch_5문항.xlsx`** — 일괄 등록 데모용 샘플 5문항 (위 v3 스키마와 동일). 발표자료·배치등록 시연용.

## _archive/

과거 버전. 참조하지 말 것.

- `question-template-v3.pre-regen-20260518.xlsx` — 그룹헤더·강의주소 추가 이전의 옛 v3 빌드 (2026-05-18 재생성 직전 백업)
- `question-template-v3-new.xlsx` — v3 신구조를 임시로 `-new`로 저장했던 파일. 현재 `question-template-v3.xlsx`와 내용 동일하여 보관용으로 이동.
- `question-template.xlsx`, `question-template-v2.xlsx` — v1/v2 (단일 헤더, 강의주소 없음)
- `[전기기능사 필기]CBT_문항관리_통합템플릿*.xlsx` — 최초 "통합템플릿" 접근. question-template 계열로 대체됨.
