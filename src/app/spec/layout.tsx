import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기획서 (Spec) — 섹션별 상세",
  description:
    "독끝 전기기능사 필기 사이트의 모든 섹션과 컴포넌트에 대한 통합 기획서",
};

export default function SpecLayout({ children }: { children: React.ReactNode }) {
  return children;
}
