"""v3 엑셀 ↔ JSON 왕복 변환 검증."""
import sys, json
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'tools')

from question_io import xlsx_to_json_list, json_list_to_xlsx, blocks_to_cell, cell_to_blocks

SRC = 'data/templates/question-template-v3.xlsx'
ROUND = 'data/templates/_roundtrip.xlsx'
JSON_OUT = 'data/templates/_v3_to_json.json'

# 1. xlsx → json
items = xlsx_to_json_list(SRC)
print(f'\n[1단계] 엑셀 → JSON  ({len(items)} 문항)')
for it in items:
    code = it.get('문항코드', '?')
    exp_blocks = it.get('해설블록', [])
    lp_blocks = it.get('학습포인트블록', [])
    print(f'\n  📄 {code}')
    print(f'     발문: {(it.get("발문") or "")[:60]}')
    print(f'     해설블록 ({len(exp_blocks)}개):')
    for b in exp_blocks:
        v = (b["value"] or "")[:60]
        print(f'       • [{b["type"]}] {v}')
    print(f'     학습포인트블록 ({len(lp_blocks)}개):')
    for b in lp_blocks:
        v = (b["value"] or "")[:60]
        print(f'       • [{b["type"]}] {v}')

with open(JSON_OUT, 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f'\n  → {JSON_OUT}')

# 2. json → xlsx
json_list_to_xlsx(items, ROUND)
print(f'\n[2단계] JSON → 엑셀  → {ROUND}')

# 3. 다시 xlsx → json (왕복 일치 확인)
back = xlsx_to_json_list(ROUND)
print(f'\n[3단계] 왕복 후 다시 JSON  ({len(back)} 문항)')

# 4. 비교 (id는 새로 생성되므로 제외)
def strip_ids(items):
    out = []
    for it in items:
        clone = {k: v for k, v in it.items() if k not in ('해설블록', '학습포인트블록')}
        clone['해설블록'] = [{'type': b['type'], 'value': b['value']} for b in it.get('해설블록', [])]
        clone['학습포인트블록'] = [{'type': b['type'], 'value': b['value']} for b in it.get('학습포인트블록', [])]
        out.append(clone)
    return out

a = strip_ids(items)
b = strip_ids(back)
match = a == b
print(f'\n[검증] 왕복 일치: {"✅ OK" if match else "❌ MISMATCH"}')
if not match:
    for i, (x, y) in enumerate(zip(a, b)):
        if x != y:
            print(f'  미스매치 #{i}:')
            for k in set(list(x.keys()) + list(y.keys())):
                if x.get(k) != y.get(k):
                    print(f'    {k}:')
                    print(f'      A: {repr(x.get(k))[:120]}')
                    print(f'      B: {repr(y.get(k))[:120]}')
