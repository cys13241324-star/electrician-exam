"""변환 결과 엑셀에서 아직 남은 문제를 스캔.
- [수식] 마커 남아있는 셀
- 학습포인트 비어 있는 문항
- 해설 너무 짧음
- 발문그림/해설그림/학습포인트그림 비어있지만 수동필요 키워드 포함
"""
import sys, re, openpyxl
sys.stdout.reconfigure(encoding='utf-8')

wb = openpyxl.load_workbook(r'data/2022_1회_변환결과.xlsx')
ws = wb['문항등록']
headers = [ws.cell(1, c).value for c in range(1, ws.max_column + 1)]

def col(h): return headers.index(h) + 1

CHECK_COLS = ['발문', '보기1', '보기2', '보기3', '보기4', '해설', '오답분석', '학습포인트']
IMG_COLS = ['발문그림', '해설그림', '학습포인트그림']

print('=' * 80)
print('남은 [수식] 마커 / 누락 학습포인트 / 짧은 해설')
print('=' * 80)

count_marker = 0
count_no_lp = 0
count_short_explain = 0
needs_image = []

for r in range(2, ws.max_row + 1):
    no = ws.cell(r, col('번호')).value
    issues_here = []

    for c_name in CHECK_COLS:
        val = ws.cell(r, col(c_name)).value or ''
        if '[수식]' in val:
            count_marker += 1
            issues_here.append(f'{c_name}에 [수식] 마커')

    lp = ws.cell(r, col('학습포인트')).value or ''
    if not lp.strip():
        count_no_lp += 1
        issues_here.append('학습포인트 비어 있음')

    explain = ws.cell(r, col('해설')).value or ''
    if 0 < len(explain) < 30:
        count_short_explain += 1
        issues_here.append(f'해설 너무 짧음 ({len(explain)}자)')

    # 발문/해설에 '그림' 키워드가 있는데 그림컬럼 비어있나
    stem = ws.cell(r, col('발문')).value or ''
    if ('그림' in stem or '심볼' in stem) and not ws.cell(r, col('발문그림')).value:
        issues_here.append('발문에 그림 키워드 있지만 발문그림 비어 있음')

    if issues_here:
        print(f'\n  #{no}:')
        for it in issues_here:
            print(f'    - {it}')

print('\n' + '=' * 80)
print(f'요약: [수식] 마커 잔존 {count_marker}건 / 학습포인트 누락 {count_no_lp}건 / 짧은 해설 {count_short_explain}건')
