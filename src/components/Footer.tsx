import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Image
              src="/addto-bi.png"
              alt="addto"
              width={120}
              height={40}
              className="h-8 w-auto opacity-80"
            />
            <p className="mt-1 text-xs text-zinc-500">VALUE WISDOM</p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              공기업, 자격증, 대기업, 그리고 전기기능사까지.
              <br />
              합격을 위한 모든 학습을 한 곳에서.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-900">고객센터</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                <a href="#" className="hover:text-zinc-900">
                  자주 묻는 질문
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-900">
                  1:1 문의
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-900">
                  공지사항
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-900">정책</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                <a href="#" className="hover:text-zinc-900">
                  이용약관
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-900">
                  개인정보 처리방침
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
          <p>(주)애드투 | 대표: 박경식</p>
          <p className="mt-1">© 2026 addto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
