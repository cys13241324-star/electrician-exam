import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "공기업", href: "https://www.addto.co.kr/", external: true },
  { name: "자격증", href: "https://www.addto.co.kr/", external: true },
  { name: "대기업", href: "https://www.addto.co.kr/", external: true },
  { name: "전기기능사", href: "/cbt", active: true },
];

const utilityLinks = [
  { name: "로그인", href: "#" },
  { name: "회원가입", href: "#" },
  { name: "나의 쿠폰", href: "#" },
  { name: "장바구니", href: "#" },
  { name: "1:1 문의", href: "#" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-end gap-4 px-6 text-xs text-zinc-500">
        {utilityLinks.map((link) => (
          <a key={link.name} href={link.href} className="hover:text-zinc-900">
            {link.name}
          </a>
        ))}
      </div>

      <div className="border-t border-zinc-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-10 px-6">
          <Link href="/" className="flex items-center" aria-label="애드투 홈">
            <Image
              src="/addto-bi.png"
              alt="addto"
              width={120}
              height={40}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <nav className="flex flex-1 items-center gap-1">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                target={cat.external ? "_blank" : undefined}
                rel={cat.external ? "noreferrer" : undefined}
                className={
                  cat.active
                    ? "relative px-4 py-2 text-sm font-semibold text-blue-600 after:absolute after:inset-x-3 after:-bottom-[17px] after:h-0.5 after:bg-blue-600"
                    : "px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
                }
              >
                {cat.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
            >
              내강의실
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
