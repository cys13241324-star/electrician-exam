import sys, openpyxl
sys.stdout.reconfigure(encoding='utf-8')

wb = openpyxl.load_workbook(r'data/2022_1회_변환결과.xlsx')

# 통계
sws = wb['변환통계']
print('=== 변환통계 ===')
for r in range(1, sws.max_row + 1):
    row = [sws.cell(r, c).value for c in range(1, sws.max_column + 1)]
    if any(v is not None for v in row):
        print('  ', row)

# 남은 이슈
iws = wb['이슈리포트']
print('\n=== 남은 이슈 (이슈리포트) ===')
for r in range(1, iws.max_row + 1):
    print(f'  R{r}:', [iws.cell(r, c).value for c in range(1, iws.max_column + 1)][:3])

# 1번, 6번 학습포인트 확인
ws = wb['문항등록']
headers = [ws.cell(1, c).value for c in range(1, ws.max_column + 1)]
print('\n=== 1번 / 6번 / 9번 / 11번 학습포인트 확인 ===')
for target in [1, 6, 9, 11]:
    for r in range(2, ws.max_row + 1):
        if ws.cell(r, headers.index('번호') + 1).value == target:
            lp = ws.cell(r, headers.index('학습포인트') + 1).value
            stem = ws.cell(r, headers.index('발문') + 1).value
            o1 = ws.cell(r, headers.index('보기1') + 1).value
            print(f'\n  ## {target}번')
            print(f'    발문: {(stem or "")[:80]}')
            print(f'    보기1: {(o1 or "")[:80]}')
            print(f'    학습포인트: {(lp or "(없음)")[:200]}')
            break
