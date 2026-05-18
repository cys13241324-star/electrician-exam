"""xlsx 페이지 1 PNG를 좌(메타 16컬럼) / 우(콘텐츠 15컬럼)로 분할.
LibreOffice 출력 이미지 크기: 2481 x 1754
컬럼 31개 중 16번(비고) 다음에서 자른다. 비율 16/31 ≈ 0.516
오차 보정: 그룹 헤더 셀 경계 위치를 실제 픽셀로 확인."""
import sys, os
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8')

SRC = 'data/presentation/img/xlsx_question-template-v3-new_p1.png'
OUT_LEFT = 'data/presentation/img/xlsx_left_meta.png'
OUT_RIGHT = 'data/presentation/img/xlsx_right_content.png'

img = Image.open(SRC).convert('RGB')
W, H = img.size
print(f'src: {W}x{H}')

# 영역 컬럼 width 합계로 분할 지점 계산
# build_template_v3.py의 COLS 너비:
# 메타 16개: 11+7+6+20+8+22+11+14+18+18+24+8+8+10+8+18 = 211
# 콘텐츠 15개: 45+22+16+24+13+24+13+24+13+24+13+8+55+45+55 = 394
# 합: 605
# 좌 비율: 211 / 605 ≈ 0.349  → 픽셀 2481 * 0.349 ≈ 866
# 단, LibreOffice는 페이지 여백 + 약간 다르게 렌더링되므로 실측 보정 필요

# 한 행을 슬라이스해서 셀 경계 색 변화 위치 추정
# 실제로는 미세조정이 필요해 보임. 일단 추정 픽셀로 잘라보고 결과 확인.
# 헤더 행 첫 두 줄(높이 약 0~120px) 패턴: 11색 컬러 띠가 좌→우로 배치됨
# 색상 띠 경계를 찾으면 정확.

# 간단 방법: row 0~20 의 픽셀을 보고 색이 크게 바뀌는 x 좌표들 추출
from collections import Counter
ys = [20, 30, 40]   # 그룹 헤더 가운데 픽셀
breaks = []
prev_color = None
for x in range(0, W):
    c = img.getpixel((x, 25))
    # 비슷한 색 묶기 (R,G,B 각 30씩 그루핑)
    bucket = (c[0]//30, c[1]//30, c[2]//30)
    if prev_color is not None and bucket != prev_color:
        breaks.append(x)
    prev_color = bucket

# 너무 많으니 큰 변화만 (앞뒤 100px 이상 떨어진 것)
filtered = []
last = -200
for x in breaks:
    if x - last > 80:
        filtered.append(x)
    last = x

print('big breaks (group boundaries):', filtered[:15])

# 그룹 헤더 순서: 출처 / 코드 / 분류 / 속성 / 발문 / 보기 / 정답 / 해설 / 오답분석 / 학습POINT
# 즉 "속성" 다음 ~ "발문" 시작 사이가 메타/콘텐츠 경계
# filtered에서 5번째 break (속성 다음) 부근이 콘텐츠 시작

# fallback: 컬럼 너비 기반 추정
META_WIDTH = 211
CONTENT_WIDTH = 394
TOTAL = META_WIDTH + CONTENT_WIDTH
# 페이지 여백 추정 (좌우 약 30px씩)
LEFT_PAD = 30
DATA_W = W - 2 * LEFT_PAD
split_x = LEFT_PAD + int(DATA_W * META_WIDTH / TOTAL)
print(f'computed split_x: {split_x}')

# filtered 중 가장 가까운 후보로 보정
if filtered:
    closest = min(filtered, key=lambda x: abs(x - split_x))
    if abs(closest - split_x) < 100:
        split_x = closest
        print(f'snap to nearest break: {split_x}')

# 좌측: 0 ~ split_x
left = img.crop((0, 0, split_x, H))
left.save(OUT_LEFT)
print(f'WROTE {OUT_LEFT} ({left.size})')

# 우측: split_x ~ W
right = img.crop((split_x, 0, W, H))
right.save(OUT_RIGHT)
print(f'WROTE {OUT_RIGHT} ({right.size})')
