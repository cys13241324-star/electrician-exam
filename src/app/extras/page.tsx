import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ElectricExtras from "@/components/ElectricExtras";

export const metadata: Metadata = {
  title: "별의 콘텐츠",
  description:
    "카톡방·신문·만화 등 다양한 형식으로 풀어낸 전기기능사 개념 콘텐츠. 재미있게 배우는 전기 이론.",
};

export default function ExtrasPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ElectricExtras />
      <Footer />
    </div>
  );
}
