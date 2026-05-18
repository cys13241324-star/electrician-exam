"""sample_batch_5문항.xlsx → src/data/questions.json (정적 import용).
시험 페이지가 fetch 없이 바로 import 해서 쓰도록."""
import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'tools')

from question_io import xlsx_to_json_list

SRC = 'data/templates/sample_batch_5문항.xlsx'
OUT = 'src/data/questions.json'
os.makedirs(os.path.dirname(OUT), exist_ok=True)

items = xlsx_to_json_list(SRC)
# id 필드는 React key 용도로만 쓰이므로 정적 export 시 안정값으로 (uuid 대신 인덱스)
for i, it in enumerate(items):
    for key in ('해설블록', '학습포인트블록'):
        for j, b in enumerate(it.get(key, [])):
            b['id'] = f'{key}_{i}_{j}'

with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f'WROTE: {OUT}  ({len(items)} 문항)')
