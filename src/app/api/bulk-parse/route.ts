import { NextRequest } from "next/server";
import * as XLSX from "xlsx";

/**
 * v3 양식 xlsx 업로드 → 문항 배열 파싱.
 *
 *  - 1행: 그룹 헤더 (병합)
 *  - 2행: 컬럼 헤더 (헤더로 사용)
 *  - 3행~: 데이터
 *
 * 해설 / 학습포인트 셀은 HTML-native: 본문 HTML 안의 <img src="…"> (또는
 * 레거시 [IMG: 파일명]) 를 기준으로 text/image 블록으로 분리한다.
 * (오답분석은 블록이 아니라 raw HTML 그대로 — <img> 인라인 렌더됨.)
 *
 * 응답: { ok: true, items: Question[], summary: { count, withVideo, withImageMarker } }
 */

type Block = { type: "text" | "image"; value: string };

// 그림 토큰: HTML <img …> 태그 또는 레거시 [IMG: 파일명]
const IMG_TOKEN_RE = /<img\b[^>]*>|\[IMG:\s*([^\]]+?)\s*\]/gi;
const SRC_RE = /src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;

function imgValue(token: string, legacy: string | undefined): string {
  if (legacy !== undefined) return legacy.trim(); // [IMG: …]
  const m = token.match(SRC_RE); // <img src="…">
  return m ? (m[1] ?? m[2] ?? m[3] ?? "").trim() : "";
}

function cellToBlocks(cell: unknown): Block[] {
  if (cell === null || cell === undefined) return [];
  const s = String(cell);
  if (!s.trim()) return [];
  const out: Block[] = [];
  let pos = 0;
  IMG_TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = IMG_TOKEN_RE.exec(s)) !== null) {
    const head = s.slice(pos, m.index).trim();
    if (head) out.push({ type: "text", value: head });
    const val = imgValue(m[0], m[1]);
    if (val) out.push({ type: "image", value: val });
    pos = m.index + m[0].length;
  }
  const tail = s.slice(pos).trim();
  if (tail) out.push({ type: "text", value: tail });
  return out;
}

const BATCH_COLS_TO_BLOCKS = new Map([
  ["해설", "해설블록"],
  ["학습포인트", "학습포인트블록"],
]);

/**
 * 문항코드 폴백: 셀이 비어 있으면(엑셀 수식이 미계산 상태로 제출된 경우 등)
 * 출처값으로 재구성한다. 등록 페이지의 코드 생성 규칙과 동일:
 *   elec_<교재구분>_<연도>_<회차2자리>_<번호2자리>  (과정=전기기능사일 때)
 */
function codeFromSource(o: Record<string, unknown>): string {
  const proc = String(o["과정"] ?? "").trim();
  const book = String(o["교재구분"] ?? "").trim();
  const year = String(o["연도"] ?? "").trim();
  const round = String(o["회차"] ?? "").trim();
  const no = String(o["번호"] ?? "").trim();
  if (proc !== "전기기능사" || !book || !year || !round || !no) return "";
  const pad2 = (s: string) => (s.length < 2 ? "0".repeat(2 - s.length) + s : s);
  return `elec_${book}_${year}_${pad2(round)}_${pad2(no)}`;
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json(
      { ok: false, error: "multipart/form-data 필요" },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: "file 필드 없음" }, { status: 400 });
  }

  let wb: XLSX.WorkBook;
  try {
    const buf = await file.arrayBuffer();
    wb = XLSX.read(buf, { type: "array" });
  } catch (e) {
    return Response.json(
      { ok: false, error: `xlsx 파싱 실패: ${(e as Error).message}` },
      { status: 400 }
    );
  }

  const sheetName = "문항등록";
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    return Response.json(
      { ok: false, error: `시트 "${sheetName}" 없음. 시트: ${wb.SheetNames.join(", ")}` },
      { status: 400 }
    );
  }

  // header:1 → 배열의 배열
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (rows.length < 3) {
    return Response.json(
      { ok: false, error: "데이터 행이 없음 (최소 3행 필요: 그룹헤더+컬럼헤더+데이터)" },
      { status: 400 }
    );
  }

  const headers = rows[1].map((h) => String(h ?? "").trim());
  const dataRows = rows.slice(2).filter((r) => r.some((v) => String(v ?? "").trim()));

  const items = dataRows.map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      if (!h) return;
      obj[h] = row[i] ?? "";
    });

    // 문항코드 폴백 (수식 미계산·누락 대비)
    if (!String(obj["문항코드"] ?? "").trim()) {
      const c = codeFromSource(obj);
      if (c) obj["문항코드"] = c;
    }

    // 블록 시퀀스 변환
    for (const [col, key] of BATCH_COLS_TO_BLOCKS) {
      obj[key] = cellToBlocks(obj[col]);
      delete obj[col];
    }

    return obj;
  });

  const withVideo = items.filter((it) => String(it["강의주소"] || "").trim()).length;
  const withImageMarker = items.filter((it) => {
    const fields = [
      it["발문그림"],
      it["보기1그림"],
      it["보기2그림"],
      it["보기3그림"],
      it["보기4그림"],
    ];
    return fields.some((v) => String(v || "").startsWith("[필요"));
  }).length;

  return Response.json({
    ok: true,
    items,
    summary: {
      count: items.length,
      withVideo,
      withImageMarker,
    },
  });
}
