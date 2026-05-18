"""PDF 페이지의 텍스트 블록 좌표를 추출. 어떤 블록이 어떤 영역(발문/보기/...)인지 분류용."""
import sys, fitz, json
sys.stdout.reconfigure(encoding='utf-8')

PDF = r'data/templates/sample/2022년 1회.pdf'
doc = fitz.open(PDF)

# 페이지 2 (콘덴서 01번 포함)
for page_idx in [1, 15]:  # 0-base: 페이지 2, 페이지 16
    print(f'\n========== PDF page {page_idx + 1} ==========')
    page = doc[page_idx]
    print(f'  page size: {page.rect}')
    blocks = page.get_text('blocks')
    for i, b in enumerate(blocks):
        x0, y0, x1, y1, text = b[0], b[1], b[2], b[3], b[4]
        snippet = (text or '').strip().replace('\n', ' / ')[:80]
        print(f'  [{i:2d}] ({x0:6.1f},{y0:6.1f})-({x1:6.1f},{y1:6.1f}) {snippet}')
