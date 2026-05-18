"""PDF 전체 텍스트 페이지별 추출 → tools/_pdf_dump.txt"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import pypdf

PDF = r'data/templates/sample/2022년 1회.pdf'
r = pypdf.PdfReader(PDF)

with open('tools/_pdf_dump.txt', 'w', encoding='utf-8') as f:
    for i, p in enumerate(r.pages, 1):
        f.write(f'\n\n========== PAGE {i} ==========\n\n')
        try:
            f.write(p.extract_text() or '(empty)')
        except Exception as e:
            f.write(f'(ERROR: {e})')

print('dumped', len(r.pages), 'pages → tools/_pdf_dump.txt')
