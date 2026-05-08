"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Activity = {
  text: string;
  time: string;
  emoji: string;
};

const POOL: Activity[] = [
  { text: "이*훈 님이 CBT 1회차 응시", time: "1분 전", emoji: "🖥️" },
  { text: "박*영 님이 플립카드 50장 학습", time: "3분 전", emoji: "🃏" },
  { text: "김*수 님이 시뮬레이터 체험", time: "4분 전", emoji: "⚡" },
  { text: "정*우 님이 합격 (78점)", time: "8분 전", emoji: "🎉" },
  { text: "장*은 님이 오디오북 청취 시작", time: "10분 전", emoji: "🎧" },
  { text: "최*경 님이 CBT 3회차 합격", time: "13분 전", emoji: "🏆" },
  { text: "윤*지 님이 과목별 학습 시작", time: "16분 전", emoji: "📚" },
  { text: "한*민 님이 변압기 시뮬 완료", time: "20분 전", emoji: "🔁" },
  { text: "조*나 님이 합격 (85점)", time: "22분 전", emoji: "🎉" },
];

const SHOW_INTERVAL_MS = 8000; // 8초마다 새 알림
const VISIBLE_MS = 5500; // 5.5초 후 사라짐

const SUPPRESS_PATHS = [/\/cbt\/[^/]+\/take$/, /\/simulator\/[^/]+$/];

export default function ActivityTicker() {
  const pathname = usePathname();
  const [current, setCurrent] = useState<Activity | null>(null);
  const [visible, setVisible] = useState(false);

  const suppressed = SUPPRESS_PATHS.some((re) => re.test(pathname ?? ""));

  useEffect(() => {
    if (suppressed) return;
    let i = 0;
    let hideTimer: number | null = null;

    function showNext() {
      const item = POOL[i % POOL.length];
      i += 1;
      setCurrent(item);
      setVisible(true);
      hideTimer = window.setTimeout(() => setVisible(false), VISIBLE_MS);
    }

    // 첫 알림은 4초 후에
    const initial = window.setTimeout(showNext, 4000);
    const interval = window.setInterval(showNext, SHOW_INTERVAL_MS);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
      if (hideTimer !== null) window.clearTimeout(hideTimer);
    };
  }, [suppressed]);

  if (suppressed || !current) return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-20 left-4 z-30 transition-all duration-500 ease-out sm:bottom-6 sm:left-6 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      aria-live="polite"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-zinc-200 bg-white py-2 pl-2 pr-4 shadow-xl">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-lg">
          {current.emoji}
        </div>
        <div className="text-xs sm:text-sm">
          <p className="font-semibold text-zinc-900">{current.text}</p>
          <p className="text-[11px] text-zinc-500">{current.time}</p>
        </div>
        <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}
