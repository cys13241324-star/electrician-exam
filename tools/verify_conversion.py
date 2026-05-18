import sys, openpyxl
sys.stdout.reconfigure(encoding='utf-8')

wb = openpyxl.load_workbook(r'data/2022_1회_변환결과.xlsx')
ws = wb['문항등록']
headers = [ws.cell(1, c).value for c in range(1, ws.max_column + 1)]
def col(h): return headers.index(h) + 1

print('=== 변환 결과 샘플 (1번, 9번, 11번, 21번, 41번, 51번) ===')
for target_no in [1, 9, 11, 21, 41, 51]:
    for r in range(2, ws.max_row + 1):
        if ws.cell(r, col('번호')).value == target_no:
            print(f'\n--- 문항 {target_no} (page {ws.cell(r, col("PDF페이지")).value}, 과목={ws.cell(r, col("과목ID")).value}) ---')
            print(f'  발문:   ', repr(ws.cell(r, col('발문')).value)[:200])
            print(f'  보기1:  ', repr(ws.cell(r, col('보기1')).value)[:80])
            print(f'  보기2:  ', repr(ws.cell(r, col('보기2')).value)[:80])
            print(f'  보기3:  ', repr(ws.cell(r, col('보기3')).value)[:80])
            print(f'  보기4:  ', repr(ws.cell(r, col('보기4')).value)[:80])
            print(f'  정답:   ', ws.cell(r, col('정답(1~4)')).value)
            print(f'  해설:   ', repr(ws.cell(r, col('해설')).value)[:150])
            print(f'  오답분석:', repr(ws.cell(r, col('오답분석')).value)[:100])
            print(f'  이슈:   ', ws.cell(r, col('이슈')).value)
            break

print('\n\n=== 이슈리포트 시트 전체 ===')
iws = wb['이슈리포트']
for r in range(1, iws.max_row + 1):
    print(f'  R{r}:', [iws.cell(r, c).value for c in range(1, iws.max_column + 1)])

print('\n\n=== 변환통계 시트 ===')
sws = wb['변환통계']
for r in range(1, sws.max_row + 1):
    print(f'  R{r}:', [sws.cell(r, c).value for c in range(1, sws.max_column + 1)])
