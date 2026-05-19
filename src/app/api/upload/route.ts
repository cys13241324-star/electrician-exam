import { NextRequest } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * 그림 파일 업로드 — multipart/form-data
 *   field "file"  : 업로드할 파일 (필수)
 *   field "code"  : 문항코드 (선택, 파일명 prefix) 예: elec_A_2022_01_21
 *   field "slot"  : 슬롯 이름 (예: stem / opt1 / explain_1 / lp_2) — 선택
 *
 * 저장 규칙: public/questions/<문항코드>_<슬롯토큰>.<확장자>
 *   - 슬롯 토큰 정규화:
 *       stem            → stem1
 *       opt1 ~ opt4     → opt1 ~ opt4
 *       explain_N       → expN
 *       wrong_N         → wrongN
 *       lp_N            → lpN
 *       block_N / 기타  → imgN
 *   - 문항코드 없으면 "uncoded"
 *   - 슬롯 없으면 "etc<timestamp>"
 *   - 동일 문항코드+슬롯 재업로드 시 같은 이름으로 덮어씀
 *     → 규칙 파일명이 항상 고정(엑셀/콘텐츠가 예측한 이름과 일치)
 *   - 확장자: png/jpg/jpeg/gif/webp/svg 만, 소문자. 그 외는 .png
 *
 * (작성규칙서 4-1 항목과 일치. data/templates/작성규칙서_v1초안.md)
 *
 * 응답: { ok: true, filename: "elec_A_2022_01_21_exp1.png",
 *         url: "/questions/elec_A_2022_01_21_exp1.png" }
 */

const SAFE_NAME = /[^a-zA-Z0-9._\-]+/g;
const UPLOAD_DIR = path.join(process.cwd(), "public", "questions");

/** 문항코드 등 prefix 정리 (영문/숫자/._- 만 허용) */
function sanitizeCode(name: string): string {
  return name.replace(SAFE_NAME, "_").slice(0, 60);
}

/** 프론트가 보내는 슬롯 문자열 → 규칙서 표준 토큰 */
function normalizeSlot(raw: string): string {
  const s = raw.toLowerCase().trim();

  // 보기: opt1~opt4 (슬롯 자체가 번호를 포함)
  const opt = s.match(/^opt([1-4])$/);
  if (opt) return `opt${opt[1]}`;

  // 발문: 번호 없는 단일 → stem1
  if (s === "stem") return "stem1";

  // prefix_번호 형태 (explain_1, lp_2, wrong_3, block_1 …)
  const m = s.match(/^([a-z]+)_(\d+)$/);
  if (m) {
    const MAP: Record<string, string> = {
      explain: "exp",
      exp: "exp",
      wrong: "wrong",
      lp: "lp",
      stem: "stem",
      block: "img",
    };
    const token = MAP[m[1]] ?? "img";
    return `${token}${m[2]}`;
  }

  // 그 외(슬롯 미지정 fallback 등)는 안전하게 정리
  return s.replace(/[^a-z0-9]+/g, "") || `etc${Date.now()}`;
}

/** 이미지 확장자만 허용, 소문자. 없으면 .png */
function pickExt(filename: string): string {
  const m = filename.toLowerCase().match(/\.(png|jpe?g|gif|webp|svg)$/);
  return m ? m[0] : ".png";
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "multipart/form-data 필요" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: "file 필드가 없습니다" }, { status: 400 });
  }
  if (file.size === 0) {
    return Response.json({ ok: false, error: "빈 파일" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ ok: false, error: "10MB 초과" }, { status: 413 });
  }

  const code = sanitizeCode(String(form.get("code") || "uncoded"));
  const slot = normalizeSlot(String(form.get("slot") || ""));
  const ext = pickExt(file.name || "");
  const base = `${code}_${slot}`;

  await mkdir(UPLOAD_DIR, { recursive: true });

  // 규칙 파일명 고정: 같은 문항코드+슬롯 재업로드 시 덮어씀.
  // (suffix(_2)를 붙이면 셀/엑셀이 예측한 이름과 어긋나 <img>가 깨짐)
  const filename = `${base}${ext}`;

  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buf);

  return Response.json({
    ok: true,
    filename,
    url: `/questions/${filename}`,
    size: file.size,
  });
}
