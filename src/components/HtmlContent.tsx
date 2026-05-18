"use client";

import { useEffect, useRef } from "react";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

/**
 * 해설 / 오답분석 / 학습포인트 / 발문 등 운영자 작성 HTML을 렌더하는 공용 컴포넌트.
 *
 * - HTML 그대로 렌더 (dangerouslySetInnerHTML)
 * - 렌더 후 KaTeX auto-render 로 수식 치환
 *     · 인라인:    $ ... $
 *     · 디스플레이: $$ ... $$
 *   (Math.tsx 의 $ 관례와 통일. <img>·코드/스크립트 태그는 건드리지 않음.)
 *
 * 주: 향후 HTML sanitize 도입 시 "sanitize → 렌더(KaTeX)" 순서를 지킬 것.
 */

const PROSE =
  "prose prose-sm max-w-none " +
  "[&_table]:my-2 [&_table]:border-collapse " +
  "[&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:px-2 [&_th]:py-1 " +
  "[&_td]:border [&_td]:border-slate-300 [&_td]:px-2 [&_td]:py-1 " +
  "[&_sub]:text-[0.75em] [&_sup]:text-[0.75em] " +
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1";

export default function HtmlContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      renderMathInElement(ref.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
        ignoredTags: [
          "script",
          "noscript",
          "style",
          "textarea",
          "pre",
          "code",
        ],
      });
    } catch {
      /* 수식 렌더 실패해도 본문 HTML은 그대로 노출 */
    }
  }, [html]);

  if (!html?.trim()) return null;
  return (
    <div
      ref={ref}
      className={`${PROSE} ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
