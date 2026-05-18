"""PDF 페이지 이미지 위에 영역별 컬러 박스 + 라벨 오버레이.
- 페이지 2 (01번 콘덴서) — 전체 정상 케이스
- 페이지 16 (51번 그림기호) — 그림 필요 케이스
출력: data/presentation/img/mapping_*.png
"""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')

from PIL import Image, ImageDraw, ImageFont

IMG_DIR = 'data/presentation/img'

# 200 DPI 렌더링 → PDF pt × (200/72) = × 2.7778
SCALE = 200 / 72

def pt2px(x, y):
    return (x * SCALE, y * SCALE)

# 색상 정의 (영역별)
COLORS = {
    '카테고리':     '#607D8B',   # 회색
    '번호':         '#455A64',
    '발문':         '#E91E63',   # 빨강
    '발문그림':     '#FFC107',   # 노랑 (그림)
    '보기':         '#2196F3',   # 파랑
    '해설':         '#FF6F00',   # 주황
    '학습포인트':   '#2E7D32',   # 초록
    '오답분석':     '#7B1FA2',   # 보라
    '정답':         '#00897B',   # 청록
}

# 폰트 (Windows 기본 한국어 폰트)
def load_font(size):
    candidates = [
        r'C:\Windows\Fonts\malgun.ttf',
        r'C:\Windows\Fonts\NanumGothic.ttf',
        r'C:\Windows\Fonts\arial.ttf',
    ]
    for f in candidates:
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def draw_region(draw, label, pt_box, color, *, pad=4, label_side='right', font=None):
    """PDF pt 좌표계의 박스를 픽셀로 변환해서 그림. 라벨은 박스 옆에 배치."""
    x0, y0, x1, y1 = pt_box
    px0, py0 = pt2px(x0, y0)
    px1, py1 = pt2px(x1, y1)
    # 박스 (반투명 fill + outline)
    draw.rectangle([px0 - pad, py0 - pad, px1 + pad, py1 + pad],
                   outline=color, width=4)
    # 라벨
    text = f'  {label}  '
    if font is None:
        font = load_font(28)
    tbox = draw.textbbox((0, 0), text, font=font)
    tw, th = tbox[2] - tbox[0], tbox[3] - tbox[1]
    if label_side == 'right':
        lx, ly = px1 + pad + 10, (py0 + py1) / 2 - th / 2 - 6
    else:
        lx, ly = px0 - pad - tw - 10, (py0 + py1) / 2 - th / 2 - 6
    # 라벨 배경
    draw.rectangle([lx - 4, ly - 2, lx + tw + 4, ly + th + 6], fill=color)
    draw.text((lx, ly), text, fill='white', font=font)


# ================ 페이지 2 (01번 콘덴서) ================
src = Image.open(os.path.join(IMG_DIR, 'p02_q01_콘덴서.png')).convert('RGB')
# 좌측 절반만 크롭 (01번 영역) — 페이지 폭 561pt → 픽셀 약 1559
# 01번은 좌측 컬럼, 우측 컬럼은 02번
left = 0
right = int(290 * SCALE)        # x 290pt 까지 (좌측 컬럼)
top = int(140 * SCALE)          # 헤더 아래부터
bottom = int(560 * SCALE)        # 01번 끝 태그까지
cropped = src.crop((left, top, right, bottom))
# 캔버스 확장 (라벨이 우측으로 넘어가니까)
canvas_w = cropped.width + 540
canvas = Image.new('RGB', (canvas_w, cropped.height), 'white')
canvas.paste(cropped, (0, 0))
draw = ImageDraw.Draw(canvas)
fnt = load_font(30)
fnt_small = load_font(22)

# 블록 좌표 (PDF pt 기준, 크롭 오프셋 보정 필요)
# crop offset: top=140pt → 박스 y에서 140 빼야 함
def shift(box):
    x0, y0, x1, y1 = box
    return (x0, y0 - 140, x1, y1 - 140)

regions_p2 = [
    ('카테고리',   shift((102, 148, 146, 161)),  '카테고리', 'right'),
    ('번호',       shift(( 85, 176, 102, 192)),  '문항번호', 'left'),
    ('발문',       shift(( 85, 196, 245, 206)),  '발문',     'right'),
    ('보기',       shift(( 85, 215, 245, 260)),  '보기①~④', 'right'),
    ('해설',       shift(( 85, 290, 276, 324)),  '해설',     'right'),
    ('학습포인트', shift(( 85, 353, 245, 425)),  '학습포인트 (공식박스)', 'right'),
    ('오답분석',   shift(( 85, 453, 245, 531)),  '오답분석', 'right'),
    ('정답',       shift((129, 545, 269, 553)),  '정답 (➍ → 4)', 'right'),
]
for key, box, label, side in regions_p2:
    color = COLORS[key]
    draw_region(draw, label, box, color, label_side=side, font=fnt_small)

canvas.save(os.path.join(IMG_DIR, 'mapping_p02_q01.png'))
print(f'WROTE mapping_p02_q01.png ({canvas.size})')


# ================ 페이지 16 (51번 그림기호) ================
src = Image.open(os.path.join(IMG_DIR, 'p16_q51_그림기호.png')).convert('RGB')
# 좌측 절반 + 51번 영역만
left = 0
right = int(290 * SCALE)
top = int(485 * SCALE)          # 51번 시작
bottom = int(680 * SCALE)        # 51번 끝 태그까지
cropped = src.crop((left, top, right, bottom))
canvas_w = cropped.width + 540
canvas = Image.new('RGB', (canvas_w, cropped.height), 'white')
canvas.paste(cropped, (0, 0))
draw = ImageDraw.Draw(canvas)

def shift16(box):
    x0, y0, x1, y1 = box
    return (x0, y0 - 485, x1, y1 - 485)

regions_p16 = [
    ('번호',       shift16(( 85, 491, 102, 507)), '문항번호', 'left'),
    ('발문',       shift16(( 85, 511, 195, 521)), '발문',     'right'),
    ('발문그림',   shift16(( 85, 525, 280, 568)), '발문그림 [필요: 심볼] ⚠', 'right'),
    ('보기',       shift16(( 85, 573, 265, 595)), '보기①~④', 'right'),
    ('해설',       shift16(( 85, 625, 274, 647)), '해설',     'right'),
    ('정답',       shift16((129, 660, 269, 668)), '정답 (➌ → 3)', 'right'),
]
for key, box, label, side in regions_p16:
    color = COLORS[key]
    draw_region(draw, label, box, color, label_side=side, font=fnt_small)

canvas.save(os.path.join(IMG_DIR, 'mapping_p16_q51.png'))
print(f'WROTE mapping_p16_q51.png ({canvas.size})')

print('DONE')
