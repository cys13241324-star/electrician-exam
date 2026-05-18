import { NextRequest } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * 그림 파일 업로드 — multipart/form-data
 *   field "file"  : 업로드할 파일 (필수)
 *   field "code"  : 문항코드 (선택, 파일명 prefix에 사용)
 *   field "slot"  : 슬롯 이름 (예: stem / opt1 / explain) — 선택
 *
 * 저장: public/questions/<코드>__<슬롯>__<원본이름>
 *   - 코드 없으면 "uncoded"
 *   - 슬롯 없으면 timestamp
 *   - 파일명 충돌 방지: 동일 파일명 존재 시 _2, _3 suffix
 *
 * 응답: { ok: true, filename: "elec_A_2022_01_21__explain__diagram.png",
 *         url: "/questions/..." }
 */

const SAFE_NAME = /[^a-zA-Z0-9._\-]+/g;
const UPLOAD_DIR = path.join(process.cwd(), "public", "questions");

function sanitize(name: string): string {
  return name.replace(SAFE_NAME, "_").slice(0, 80);
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

  const code = sanitize(String(form.get("code") || "uncoded"));
  const slot = sanitize(String(form.get("slot") || `t${Date.now()}`));
  const orig = sanitize(file.name || "image");
  const base = `${code}__${slot}__${orig}`;

  await mkdir(UPLOAD_DIR, { recursive: true });

  // 충돌 방지
  let filename = base;
  let n = 2;
  const exts = base.match(/\.[^.]+$/)?.[0] ?? "";
  const stem = exts ? base.slice(0, -exts.length) : base;
  // 파일이 이미 있는지 가벼운 체크
  const { existsSync } = await import("node:fs");
  while (existsSync(path.join(UPLOAD_DIR, filename))) {
    filename = `${stem}_${n}${exts}`;
    n += 1;
  }

  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buf);

  return Response.json({
    ok: true,
    filename,
    url: `/questions/${filename}`,
    size: file.size,
  });
}
