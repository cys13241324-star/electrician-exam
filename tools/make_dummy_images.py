"""캡처 데모용 더미 그림 만들기 (회로도 흉내)."""
import os, sys
sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image, ImageDraw, ImageFont

OUT = 'tools/_dummy'
os.makedirs(OUT, exist_ok=True)

def make(name, w, h, title):
    img = Image.new('RGB', (w, h), '#FFFFFF')
    d = ImageDraw.Draw(img)
    # 테두리
    d.rectangle([2, 2, w - 3, h - 3], outline='#1F2937', width=2)
    # 가짜 회로도 — 사각형 + 선
    cx, cy = w // 2, h // 2
    d.rectangle([cx - 60, cy - 30, cx + 60, cy + 30], outline='#DB2777', width=3)
    d.line([(40, cy), (cx - 60, cy)], fill='#1F2937', width=2)
    d.line([(cx + 60, cy), (w - 40, cy)], fill='#1F2937', width=2)
    d.ellipse([35, cy - 5, 45, cy + 5], fill='#1F2937')
    d.ellipse([w - 45, cy - 5, w - 35, cy + 5], fill='#1F2937')
    # 라벨
    try:
        font = ImageFont.truetype(r'C:\Windows\Fonts\malgun.ttf', 16)
    except Exception:
        font = ImageFont.load_default()
    d.text((cx - 40, cy - 8), '계전기', fill='#DB2777', font=font)
    d.text((10, 10), title, fill='#6B7280', font=font)

    img.save(os.path.join(OUT, name))
    print(f'WROTE {OUT}/{name}')

make('diagram.png', 400, 200, 'q21_differential_diagram.png')
make('stem.png', 400, 220, '발문 회로도 예시')
