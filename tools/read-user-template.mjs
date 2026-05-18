import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSXmod from "xlsx";

const XLSX = XLSXmod.default ?? XLSXmod;
const __dirname = dirname(fileURLToPath(import.meta.url));
const inPath = resolve(__dirname, "..", "data", "templates", "[전기기능사 필기]CBT_문항관리_통합템플릿.xlsx");

const wb = XLSX.read(readFileSync(inPath), { type: "buffer" });
console.log("=== Sheets ===");
console.log(wb.SheetNames);

const sheet = wb.Sheets["문항관리"];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

console.log(`\n[문항관리] 총 ${rows.length}행, 컬럼 ${rows[0].length}개`);
console.log("\n헤더:", rows[0]);
console.log(`\n원본 메타 행 (행 1, 콘텐츠 비어있음 확인):`);
console.log(rows[1].slice(0, 25).join(" | "));
console.log("콘텐츠 컬럼(25~):", JSON.stringify(rows[1].slice(25)));

console.log(`\n콘텐츠 예시 행 (마지막 행 = ${rows.length - 1}):`);
const last = rows[rows.length - 1];
console.log("문항코드:", last[2], "/ 분류:", last[13], "→", last[14], "→", last[15]);
console.log("발문:", last[25]);
console.log("정답:", last[31]);
console.log("학습포인트 길이:", String(last[34]).length, "자");
