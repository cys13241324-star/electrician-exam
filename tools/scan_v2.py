import sys, openpyxl
sys.stdout.reconfigure(encoding='utf-8')

wb = openpyxl.load_workbook(r'data/2022_1회_변환결과_v2.xlsx')
ws = wb['문항등록']
headers = [ws.cell(1, c).value for c in range(1, ws.max_column + 1)]
def col(h): return headers.index(h) + 1

CHECK_COLS = ['발문', '보기1', '보기2', '보기3', '보기4', '해설', '오답분석', '학습포인트']
count_marker = 0
count_no_lp = 0
for r in range(2, ws.max_row + 1):
    no = ws.cell(r, col('번호')).value
    issues = []
    for c_name in CHECK_COLS:
        val = ws.cell(r, col(c_name)).value or ''
        if '[수식]' in val:
            count_marker += 1
            issues.append(f'{c_name}에 [수식]')
    lp = ws.cell(r, col('학습포인트')).value or ''
    if not lp.strip():
        count_no_lp += 1
        issues.append('학습포인트 비어 있음')
    if issues:
        print(f'  #{no}: {", ".join(issues)}')
print(f'\n요약: [수식] 잔존 {count_marker} / 학습포인트 누락 {count_no_lp}')
