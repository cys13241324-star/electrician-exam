"""분할된 이미지의 빈 영역(아래쪽)을 잘라낸다."""
import sys
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8')

DATA_HEIGHT = 470  # 헤더 2단 + 샘플 3행 (대략)

for name in ['xlsx_left_meta', 'xlsx_right_content']:
    src = f'data/presentation/img/{name}.png'
    img = Image.open(src).convert('RGB')
    W, H = img.size
    trimmed = img.crop((0, 0, W, DATA_HEIGHT))
    trimmed.save(src)
    print(f'TRIM {src} → ({W}x{DATA_HEIGHT})')
