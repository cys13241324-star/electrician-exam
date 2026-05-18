import sys, openpyxl
sys.stdout.reconfigure(encoding='utf-8')

for path in ['data/templates/question-template-v2.xlsx',
             'data/templates/[전기기능사 필기]CBT_문항관리_통합템플릿_v2.xlsx']:
    print(f'\n########## {path}')
    wb = openpyxl.load_workbook(path)
    for sn in wb.sheetnames:
        ws = wb[sn]
        print(f'\n--- {sn} ({ws.max_row} rows × {ws.max_column} cols) ---')
        for r in range(1, min(2, ws.max_row) + 1):
            cells = [ws.cell(r, c).value for c in range(1, ws.max_column + 1)]
            print(f'  R{r}:', cells)
        if sn in ('문항등록', '문항관리'):
            # 콘텐츠 컬럼 첫 샘플 행만 살짝
            print('  --- sample row 2 (요약):')
            headers = [ws.cell(1, c).value for c in range(1, ws.max_column + 1)]
            row2 = [ws.cell(2, c).value for c in range(1, ws.max_column + 1)]
            for h, v in zip(headers, row2):
                if h in ('발문', '보기1', '보기1그림', '해설', '오답분석', '학습포인트', '발문그림'):
                    sv = (str(v)[:80] + '…') if v and len(str(v)) > 80 else v
                    print(f'    {h}: {sv}')
