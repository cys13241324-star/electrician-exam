"""PDF 페이지 수와 텍스트 추출 가능 여부 점검."""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')

PDF = r'data/templates/sample/2022년 1회.pdf'
print('exists:', os.path.exists(PDF), 'size:', os.path.getsize(PDF))

try:
    import pypdf
except ImportError:
    print('NEED: pip install pypdf')
    sys.exit(0)

r = pypdf.PdfReader(PDF)
print('pages:', len(r.pages))
print('metadata:', r.metadata)

# 첫 페이지 텍스트 시도
for i in [0, 1, 2]:
    if i >= len(r.pages):
        break
    try:
        t = r.pages[i].extract_text() or ''
    except Exception as e:
        t = f'(ERROR: {e})'
    print(f'\n--- page {i+1} (len={len(t)}) ---')
    print(t[:1000])
