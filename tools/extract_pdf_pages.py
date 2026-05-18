"""PDF 주요 페이지를 200 DPI PNG로 추출 → data/presentation/img/"""
import fitz, os, sys
sys.stdout.reconfigure(encoding='utf-8')

PDF = r'data/templates/sample/2022년 1회.pdf'
OUT_DIR = r'data/presentation/img'
os.makedirs(OUT_DIR, exist_ok=True)

# 페이지: PDF 1-base → PyMuPDF 0-base
# 페이지 2(01번), 페이지 8(23번 반작용 표), 페이지 13(39번 TRIAC), 페이지 16(51번 그림기호), 페이지 14(43번 매설깊이 표), 페이지 4(09번 빈칸)
TARGETS = [
    (2, 'p02_q01_콘덴서.png'),
    (4, 'p04_q09_빈칸문제.png'),
    (8, 'p08_q23_반작용표.png'),
    (13, 'p13_q39_TRIAC.png'),
    (14, 'p14_q43_매설깊이.png'),
    (16, 'p16_q51_그림기호.png'),
]

doc = fitz.open(PDF)
mat = fitz.Matrix(200/72, 200/72)  # 200 DPI

for page_no, fname in TARGETS:
    page = doc[page_no - 1]
    pix = page.get_pixmap(matrix=mat)
    out = os.path.join(OUT_DIR, fname)
    pix.save(out)
    print(f'WROTE {out} ({pix.width}x{pix.height})')

doc.close()
print('DONE')
