"""Playwright로 /cbt/library 캡처."""
import sys, os, asyncio
sys.stdout.reconfigure(encoding='utf-8')
from playwright.async_api import async_playwright

URL = 'http://localhost:3000/cbt/library'
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

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        ctx = await browser.new_context(
            viewport={'width': 1500, 'height': 1100},
            device_scale_factor=2,
        )
        page = await ctx.new_page()

        # 1. 전체 (기본 정렬: 문항코드)
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(800)
        await page.evaluate(CLEAN)
        await page.screenshot(path=os.path.join(OUT_DIR, 'library_default.png'),
                              full_page=True)
        print('WROTE library_default.png')

        # 2. 빈출도 ≥ 5 필터
        await page.get_by_role('button', name='★').nth(5).click()  # 빈출 5점
        await page.wait_for_timeout(500)
        await page.evaluate(CLEAN)
        await page.screenshot(path=os.path.join(OUT_DIR, 'library_filter_freq5.png'),
                              full_page=True)
        print('WROTE library_filter_freq5.png')

        # 3. machinery 과목 클릭
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(500)
        await page.evaluate(CLEAN)
        # 좌측 분류 트리에서 machinery 클릭 (이름 부분 매칭)
        await page.locator('aside button', has_text='전기기기').first.click()
        await page.wait_for_timeout(500)
        await page.evaluate(CLEAN)
        await page.screenshot(path=os.path.join(OUT_DIR, 'library_subject_machinery.png'),
                              full_page=True)
        print('WROTE library_subject_machinery.png')

        # 4. 21번 행 클릭해서 미리보기에 차동계전기 표시
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(500)
        await page.evaluate(CLEAN)
        rows = await page.locator('tbody tr').all()
        # 21번 (3번째) 클릭
        if len(rows) >= 3:
            await rows[2].click()
            await page.wait_for_timeout(500)
        await page.evaluate(CLEAN)
        await page.screenshot(path=os.path.join(OUT_DIR, 'library_select_q21.png'),
                              full_page=True)
        print('WROTE library_select_q21.png')

        await browser.close()


if __name__ == '__main__':
    asyncio.run(main())
