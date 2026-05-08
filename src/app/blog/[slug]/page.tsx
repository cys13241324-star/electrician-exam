import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { posts, getPost } from "@/lib/blog";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "글을 찾을 수 없습니다" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // 본문은 마크다운 비슷한 텍스트 → 간단 파싱 (## 헤딩만)
  const blocks = post.body.split("\n\n").map((para, idx) => {
    if (para.startsWith("## ")) {
      return (
        <h2
          key={idx}
          className="mt-10 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl"
        >
          {para.slice(3)}
        </h2>
      );
    }
    if (para.startsWith("- ")) {
      const items = para.split("\n").map((l) => l.replace(/^- /, ""));
      return (
        <ul key={idx} className="mt-4 list-disc space-y-1.5 pl-6 text-zinc-700">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={idx} className="mt-4 leading-7 text-zinc-700">
        {para}
      </p>
    );
  });

  // 다른 글 (현재 제외)
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <article className="mx-auto max-w-3xl px-6 py-14">
        <Reveal>
          <Link
            href="/blog"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            ← 블로그 목록
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              {post.category}
            </span>
            <span className="text-xs text-zinc-500">{post.readTime} 읽기</span>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            {post.excerpt}
          </p>
          <div className="mt-5 flex items-center gap-3 border-b border-zinc-200 pb-5 text-xs text-zinc-500">
            <span>{post.date}</span>
            <span>·</span>
            <span>addto 편집팀</span>
          </div>
        </Reveal>

        <Reveal type="fade-up">
          <div className="mt-8 text-base">{blocks}</div>
        </Reveal>

        <Reveal type="fade-up">
          <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <p className="text-sm font-bold text-blue-900">
              📚 글이 도움이 되었다면
            </p>
            <p className="mt-2 text-xs text-blue-800">
              실제 학습에 적용해 보세요. CBT 모의고사로 적용 효과를 바로 확인할 수 있습니다.
            </p>
            <Link
              href="/cbt/exams"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              모의고사 응시하기 →
            </Link>
          </div>
        </Reveal>
      </article>

      <section className="border-t border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h3 className="text-lg font-bold text-zinc-900">다른 글 살펴보기</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/blog/${o.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="text-3xl">{o.emoji}</span>
                <h4 className="mt-3 text-sm font-bold text-zinc-900 group-hover:text-blue-700">
                  {o.title}
                </h4>
                <p className="mt-2 line-clamp-2 text-xs text-zinc-600">
                  {o.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
