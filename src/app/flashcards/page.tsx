import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardApp from "@/components/flashcards/FlashcardApp";

export const metadata: Metadata = {
  title: "플립 암기카드",
  description:
    "전기기능사 핵심 키워드를 카드로 암기. 간격 반복 알고리즘으로 가장 효율적인 학습.",
};

export default function FlashcardsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <FlashcardApp />
      <Footer />
    </div>
  );
}
