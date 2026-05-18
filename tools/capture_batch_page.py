"""Playwright로 /admin/register-batch 페이지 자동 캡처."""
import sys, os, asyncio
sys.stdout.reconfigure(encoding='utf-8')

from playwright.async_api import async_playwright

URL = 'http://localhost:3000/admin/register-batch'
OUT_DIR = 'data/presentation/img'
SAMPLE_XLSX = os.path.abspath('data/templates/sample_batch_5문항.xlsx')

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

        # 1. 빈 상태 (드롭존)
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(500)
        await page.evaluate(CLEAN)
        out1 = os.path.join(OUT_DIR, 'batch_empty.png')
        await page.screenshot(path=out1, full_page=True)
        print(f'WROTE {out1}')

        # 2. 샘플 엑셀 업로드 후
        # input[type=file]가 hidden이지만 set_input_files는 가능
        file_input = page.locator('input[type="file"]')
        await file_input.first.set_input_files(SAMPLE_XLSX)

        # 결과 로딩 대기 — 표가 그려질 때까지
        await page.wait_for_selector('table', timeout=30000)
        await page.wait_for_timeout(1000)
        await page.evaluate(CLEAN)

        out2 = os.path.join(OUT_DIR, 'batch_uploaded.png')
        await page.screenshot(path=out2, full_page=True)
        print(f'WROTE {out2}')

        # 3. 21번 행 클릭 → 미리보기 변경 후 캡처
        rows = await page.locator('tbody tr').all()
        if len(rows) >= 3:
            await rows[2].click()  # 3번째 = 21번 차동계전기
            await page.wait_for_timeout(800)
            out3 = os.path.join(OUT_DIR, 'batch_select_q21.png')
            await page.screenshot(path=out3, full_page=True)
            print(f'WROTE {out3}')

        # 4. 상단 헤더 + 표 영역만 (좌측 절반)
        table = page.locator('table').first.locator('xpath=ancestor::section[1]')
        out4 = os.path.join(OUT_DIR, 'batch_table_only.png')
        await table.screenshot(path=out4)
        print(f'WROTE {out4}')

        await browser.close()


if __name__ == '__main__':
    asyncio.run(main())
