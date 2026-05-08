import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BackgroundPattern from "@/components/BackgroundPattern";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "블로그 / 학습 팁",
  description:
    "전기기능사 학습 전략, 자주 틀리는 함정, 시험 팁까지. 합격생들의 노하우를 글로 정리했습니다.",
};

export default function BlogIndex() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <section className="relative overflow-hidden border-b border-zinc-100 bg-gradient-to-br from-blue-50 via-white to-violet-50">
        <BackgroundPattern variant="grid" color="#1e40af" opacity={0.05} />
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            학습 팁
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            합격생의 글
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            교재만으로 부족한 디테일과 노하우. 짧게 읽고 바로 적용해 보세요.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Featured */}
        <Reveal>
          <Link
            href={`/blog/${featured.slug}`}
            className="group mb-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-xl lg:grid-cols-2"
          >
            <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 lg:h-auto">
              <span className="text-7xl drop-shadow-md">{featured.emoji}</span>
              <div className="absolute left-5 top-5 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold text-amber-950">
                ⭐ 추천 글
              </div>
            </div>
            <div className="flex flex-col p-8">
              <span className="inline-block w-fit rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                {featured.category}
              </span>
              <h2 className="mt-3 text-xl font-bold leading-tight text-zinc-900 group-hover:text-blue-700 sm:text-2xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {featured.excerpt}
              </p>
              <div className="mt-auto flex items-center gap-3 pt-5 text-xs text-zinc-500">
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime} 읽기</span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} type="fade-up" delay={i * 80}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-5xl">
                  {p.emoji}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="inline-block w-fit rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                    {p.category}
                  </span>
                  <h3 className="mt-2 text-base font-bold leading-tight text-zinc-900 group-hover:text-blue-700">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-5 text-zinc-600">
                    {p.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500">
                    <span>{p.date}</span>
                    <span>·</span>
                    <span>{p.readTime}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
