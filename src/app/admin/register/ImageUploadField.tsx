"use client";

import { useState, useRef } from "react";

/**
 * 그림 컬럼용 입력 컴포넌트.
 * - 비어 있음 → 드롭존 (클릭 / 드래그앤드롭)
 * - 파일명 채워짐 → 썸네일 + 파일명 + [교체] [✕] 버튼
 * - [필요: …] 마커 → 노란 점선 박스 + 안내
 * - 마커 직접 입력 input은 항상 노출 (파일 없을 때만)
 */
export function ImageUploadField({
  value,
  onChange,
  questionCode,
  slot,
  placeholder = "파일 선택 / 드롭",
}: {
  value: string;
  onChange: (filename: string) => void;
  questionCode?: string;
  slot?: string;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (questionCode) fd.append("code", questionCode);
      if (slot) fd.append("slot", slot);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as
        | { ok: true; filename: string; url: string }
        | { ok: false; error: string };
      if (!data.ok) throw new Error(data.error || "업로드 실패");
      onChange(data.filename);
    } catch (e) {
      setError(String((e as Error).message || e));
    } finally {
      setUploading(false);
    }
  };

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    upload(files[0]);
  };

  const isMarker = value?.startsWith("[필요");
  const isFilled = !!value && !isMarker;

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files);
          if (fileRef.current) fileRef.current.value = "";
        }}
      />

      {isFilled ? (
        <div className="flex items-center gap-2 rounded border border-amber-300 bg-amber-50 p-2">
          <img
            src={`/questions/${value}`}
            alt=""
            className="h-12 w-12 rounded border bg-white object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="flex-1 truncate font-mono text-[11px] text-amber-800">
            {value}
          </span>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded border border-amber-400 bg-white px-2 py-1 text-xs hover:bg-amber-100"
            title="다른 파일로 교체"
          >
            교체
          </button>
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded border border-red-300 bg-white px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            title="제거"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            onFiles(e.dataTransfer.files);
          }}
          className={`cursor-pointer rounded border-2 border-dashed p-3 text-center text-xs transition-colors ${
            isDragOver
              ? "border-amber-500 bg-amber-100"
              : isMarker
              ? "border-amber-400 bg-amber-50 text-amber-700"
              : "border-slate-300 bg-white text-slate-500 hover:border-amber-400 hover:bg-amber-50"
          }`}
        >
          {uploading ? (
            <span>업로드 중…</span>
          ) : isMarker ? (
            <span>
              ⚠ <span className="font-mono">{value}</span>
              <br />
              <span className="text-[10px] underline">
                클릭 / 드롭으로 실제 그림 업로드
              </span>
            </span>
          ) : (
            <span>
              📁 {placeholder}
              <br />
              <span className="text-[10px] text-slate-400">또는 파일 드롭</span>
            </span>
          )}
        </div>
      )}

      {/* 마커 직접 입력 (파일이 없을 때만) */}
      {!isFilled && (
        <input
          type="text"
          value={isMarker ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="또는 [필요: …] 마커 직접 입력"
          className="mt-1 w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-mono outline-none focus:border-amber-500"
        />
      )}

      {error && (
        <p className="mt-1 text-[11px] text-red-600">⚠ {error}</p>
      )}
    </div>
  );
}
