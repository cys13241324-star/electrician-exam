"""LibreOffice headless로 xlsx → PDF → PNG 변환.
페이지 잘림 방지를 위해 인쇄영역 / 가로 한 페이지 설정은 별도 매크로 필요하나,
스크린샷 용도라면 PDF 1페이지가 충분.
"""
import sys, os, subprocess, shutil
sys.stdout.reconfigure(encoding='utf-8')

SOFFICE = r'C:\Program Files\LibreOffice\program\soffice.exe'
OUT_DIR = 'data/presentation/img'
os.makedirs(OUT_DIR, exist_ok=True)

XLSX = sys.argv[1] if len(sys.argv) > 1 else 'data/templates/question-template-v3.xlsx'
NAME = os.path.splitext(os.path.basename(XLSX))[0]

# 1) xlsx → pdf
tmp_pdf_dir = os.path.join(OUT_DIR, '_tmp')
os.makedirs(tmp_pdf_dir, exist_ok=True)
print(f'Converting {XLSX} → PDF...')
r = subprocess.run(
    [SOFFICE, '--headless', '--convert-to', 'pdf', '--outdir', tmp_pdf_dir, XLSX],
    capture_output=True, text=True, timeout=120,
)
print(r.stdout)
print(r.stderr)
pdf_path = os.path.join(tmp_pdf_dir, f'{NAME}.pdf')
if not os.path.exists(pdf_path):
    print(f'PDF not created: {pdf_path}')
    sys.exit(1)

# 2) pdf → png 페이지별
import fitz
doc = fitz.open(pdf_path)
mat = fitz.Matrix(150 / 72, 150 / 72)  # 150 DPI
for i, page in enumerate(doc, 1):
    pix = page.get_pixmap(matrix=mat)
    out_png = os.path.join(OUT_DIR, f'xlsx_{NAME}_p{i}.png')
    pix.save(out_png)
    print(f'  WROTE {out_png} ({pix.width}x{pix.height})')
doc.close()

# cleanup
shutil.rmtree(tmp_pdf_dir, ignore_errors=True)
print('DONE')
