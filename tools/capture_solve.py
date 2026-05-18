"""Playwright 캡처 — 결과 대시보드 + 해설 토글 케이스."""
import sys, os, asyncio
sys.stdout.reconfigure(encoding='utf-8')
from playwright.async_api import async_playwright

OUT_DIR = 'data/presentation/img'
CLEAN = """
() => {
  document.querySelectorAll('[class*="fixed"]').forEach(el => {
    const style = getComputedStyle(el);
    if (style.position === 'fixed' && !el.closest('header')) {
      el.style.display = 'none';
    }
  });
}
"""

async def submit(page, url, choice_idx):
    """페이지 로드 → choice_idx 클릭 → 제출."""
    await page.goto(url, wait_until='networkidle')
    await page.wait_for_timeout(500)
    options = page.locator('button[aria-pressed]')
    await options.nth(choice_idx).click()
    await page.wait_for_timeout(200)
    await page.locator('button.bg-pink-600').first.click()
    await page.wait_for_timeout(1000)


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        ctx = await browser.new_context(
            viewport={'width': 1280, 'height': 1000},
            device_scale_factor=2,
        )
        page = await ctx.new_page()

        # 1) 풀이 전
        await page.goto('http://localhost:3000/cbt/solve/elec_A_2022_01_01',
                        wait_until='networkidle')
        await page.wait_for_timeout(800)
        await page.evaluate(CLEAN)
        await page.screenshot(path=os.path.join(OUT_DIR, 'solve_before.png'),
                              full_page=True)
        print('WROTE solve_before.png')

        # 2) 정답 ④ → 결과 대시보드만 (해설 닫힘)
        await submit(page, 'http://localhost:3000/cbt/solve/elec_A_2022_01_01', 3)
        await page.evaluate(CLEAN)
        await page.screenshot(path=os.path.join(OUT_DIR, 'solve_q01_dashboard.png'),
                              full_page=True)
        print('WROTE solve_q01_dashboard.png')

        # 3) 해설 바로가기 클릭 → 해설 펼친 상태
        # "📖 해설 바로가기" 분홍 큰 버튼 — class에 bg-pink-600
        await page.locator('button.bg-pink-600').first.click()
        await page.wait_for_timeout(1000)
        await page.evaluate(CLEAN)
        await page.screenshot(path=os.path.join(OUT_DIR, 'solve_q01_explain.png'),
                              full_page=True)
        print('WROTE solve_q01_explain.png')

        # 4) 오답 케이스 (대시보드)
        await submit(page, 'http://localhost:3000/cbt/solve/elec_A_2022_01_01', 1)
        await page.evaluate(CLEAN)
        await page.screenshot(path=os.path.join(OUT_DIR, 'solve_q01_wrong_dashboard.png'),
                              full_page=True)
        print('WROTE solve_q01_wrong_dashboard.png')

        # 5) 21번 차동계전기 정답 → 대시보드
        await submit(page, 'http://localhost:3000/cbt/solve/elec_A_2022_01_21', 0)
        await page.evaluate(CLEAN)
        await page.screenshot(path=os.path.join(OUT_DIR, 'solve_q21_dashboard.png'),
                              full_page=True)
        print('WROTE solve_q21_dashboard.png')

        # 6) 21번 해설 펼침
        await page.locator('button.bg-pink-600').first.click()
        await page.wait_for_timeout(1000)
        await page.evaluate(CLEAN)
        await page.screenshot(path=os.path.join(OUT_DIR, 'solve_q21_explain.png'),
                              full_page=True)
        print('WROTE solve_q21_explain.png')

        await browser.close()


if __name__ == '__main__':
    asyncio.run(main())
