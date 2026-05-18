"""Playwright로 /admin/register 페이지 자동 캡처 (v2).

신규: 강의주소 / 그림 파일 업로드 (실제 set_input_files).
"""
import sys, os, asyncio
sys.stdout.reconfigure(encoding='utf-8')

from playwright.async_api import async_playwright

URL = 'http://localhost:3000/admin/register'
OUT_DIR = 'data/presentation/img'
DUMMY = os.path.abspath('tools/_dummy')
os.makedirs(OUT_DIR, exist_ok=True)

CLEAN_OVERLAYS_JS = """
() => {
  document.querySelectorAll('[class*="fixed"]').forEach(el => {
    const style = getComputedStyle(el);
    if (style.position === 'fixed' && !el.closest('header')) {
      el.style.display = 'none';
    }
  });
}
"""


async def upload_image(page, slot_label_or_selector, file_path):
    """드롭존을 클릭해서 file input 열고 파일 선택."""
    # ImageUploadField 컴포넌트는 hidden input[type=file]을 내부에 가짐
    # 같은 부모 div 안의 hidden input에 set_input_files 사용
    pass


async def fill_q01(page):
    await page.get_by_placeholder('2022').first.fill('2022')
    await page.get_by_placeholder('1').first.fill('1')
    await page.get_by_placeholder('elec_A_2022_01_01').fill('elec_A_2022_01_01')
    # 강의주소
    await page.get_by_placeholder('https://youtu.be/...').fill('https://youtu.be/sample-cap-q01')

    await page.locator('select').nth(1).select_option('theory')
    await page.get_by_placeholder('정자계').fill('정전기')
    await page.get_by_placeholder('자성체와 자기회로').fill('콘덴서')
    await page.get_by_placeholder('투자율과 자성체의 분류').fill('정전용량')
    await page.get_by_placeholder('자성체의 분류 (강·상·반자성)').fill('정전용량 비례 관계')

    await page.get_by_role('button', name='4점').first.click(force=True)
    diff = await page.get_by_role('button', name='2점').all()
    if len(diff) >= 2:
        await diff[1].click(force=True)
    await page.locator('select').nth(2).select_option('단답형')

    await page.get_by_placeholder('콘덴서의 정전용량에 대한 설명으로 틀린 것은?').fill(
        '콘덴서의 정전용량에 대한 설명으로 틀린 것은?'
    )
    for n, txt in enumerate([
        '전압에 반비례한다.',
        '이동 전하량에 비례한다.',
        '극판의 넓이에 비례한다.',
        '극판의 간격에 비례한다.',
    ], 1):
        await page.get_by_placeholder(f'보기 {n}').fill(txt)
    await page.locator('label:has(input[value="4"][name="answer"])').click(force=True)

    await page.get_by_placeholder('해설 본문 (HTML 허용)').first.fill(
        '정전용량(<i>C</i>)은 극판의 넓이(<i>S</i>)에 비례하고 극판의 간격(<i>d</i>)에 반비례한다.'
    )

    await page.get_by_role('button', name='+ 텍스트 블록 추가').last.click()
    await page.wait_for_timeout(150)
    await page.get_by_placeholder('학습 POINT 본문 (HTML, <table> 가능)').fill(
        '<p><strong>정전용량 공식</strong></p>'
        '<p><i>C</i> = <i>εS</i> / <i>d</i> [F]</p>'
        '<ul><li><i>C</i>: 정전용량[F]</li>'
        '<li><i>ε</i>: 유전율[F/m]</li></ul>'
    )


async def fill_q21_with_upload(page):
    """21번 — 강의주소 + 그림 파일 실제 업로드 (드롭존 → file input)"""
    await page.get_by_placeholder('2022').first.fill('2022')
    await page.get_by_placeholder('1').first.fill('1')
    await page.get_by_placeholder('elec_A_2022_01_01').fill('elec_A_2022_01_21')

    # 강의주소
    await page.get_by_placeholder('https://youtu.be/...').fill(
        'https://youtu.be/sample-differential-relay'
    )

    await page.locator('select').nth(1).select_option('machinery')
    await page.get_by_placeholder('정자계').fill('변압기')
    await page.get_by_placeholder('자성체와 자기회로').fill('보호 계전기')
    await page.get_by_placeholder('투자율과 자성체의 분류').fill('계전기 종류')
    await page.get_by_placeholder('자성체의 분류 (강·상·반자성)').fill('내부 고장 보호용')

    await page.get_by_role('button', name='5점').first.click(force=True)
    diff = await page.get_by_role('button', name='2점').all()
    if len(diff) >= 2:
        await diff[1].click(force=True)
    await page.locator('select').nth(2).select_option('단답형')

    await page.get_by_placeholder('콘덴서의 정전용량에 대한 설명으로 틀린 것은?').fill(
        '변압기 내부 고장 보호에 쓰이는 계전기로써 가장 알맞은 것은?'
    )
    for n, txt in enumerate([
        '차동계전기', '접지계전기', '과전류계전기', '역상계전기',
    ], 1):
        await page.get_by_placeholder(f'보기 {n}').fill(txt)
    await page.locator('label:has(input[value="1"][name="answer"])').click(force=True)

    # 해설 첫 블록 텍스트
    await page.get_by_placeholder('해설 본문 (HTML 허용)').first.fill(
        '변압기 내부 권선의 층간 단락이나 지락 사고 시, '
        '입력 전류와 출력 전류 사이에 차이가 발생한다.'
    )
    # 그림 블록 추가
    await page.get_by_role('button', name='+ 아래에 그림').first.click(force=True)
    await page.wait_for_timeout(200)

    # 그림 블록의 hidden file input에 더미 PNG 업로드
    # ImageUploadField는 file input을 hidden으로 둠 → set_input_files로 직접 채움
    file_inputs = page.locator('input[type="file"]')
    n_inputs = await file_inputs.count()
    print(f'file inputs found: {n_inputs}')
    # 발문그림(0) + 보기1~4그림(1~4) + 해설블록 그림(5) — 6번째 input이 해설 그림
    # 더 안전: 가장 마지막에 추가된 file input
    if n_inputs >= 1:
        await file_inputs.nth(n_inputs - 1).set_input_files(os.path.join(DUMMY, 'diagram.png'))
        await page.wait_for_timeout(1500)  # 업로드 완료 대기

    # 텍스트 블록 추가
    await page.get_by_role('button', name='+ 아래에 텍스트').first.click(force=True)
    await page.wait_for_timeout(200)
    areas = await page.get_by_placeholder('해설 본문 (HTML 허용)').all()
    if len(areas) >= 2:
        await areas[-1].fill(
            '이 차이를 검출하여 동작하는 <strong>차동 계전기</strong>가 가장 적합하다.'
        )


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        ctx = await browser.new_context(
            viewport={'width': 1500, 'height': 1200},
            device_scale_factor=2,
        )
        page = await ctx.new_page()

        # 1. 빈 페이지
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(500)
        await page.evaluate(CLEAN_OVERLAYS_JS)
        await page.screenshot(path=os.path.join(OUT_DIR, 'register_empty.png'), full_page=True)
        print('WROTE register_empty.png')

        # 2. 콘덴서 1번 + 강의주소
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(300)
        await page.evaluate(CLEAN_OVERLAYS_JS)
        await fill_q01(page)
        await page.wait_for_timeout(800)
        await page.screenshot(path=os.path.join(OUT_DIR, 'register_q01_filled.png'),
                              full_page=True)
        print('WROTE register_q01_filled.png')

        aside = page.locator('aside').first
        await aside.screenshot(path=os.path.join(OUT_DIR, 'register_q01_preview.png'))
        print('WROTE register_q01_preview.png')

        # 3. 21번 + 실제 그림 업로드
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(300)
        await page.evaluate(CLEAN_OVERLAYS_JS)
        await fill_q21_with_upload(page)
        await page.wait_for_timeout(800)
        await page.screenshot(path=os.path.join(OUT_DIR, 'register_q21_blocks.png'),
                              full_page=True)
        print('WROTE register_q21_blocks.png')

        aside = page.locator('aside').first
        await aside.screenshot(path=os.path.join(OUT_DIR, 'register_q21_preview.png'))
        print('WROTE register_q21_preview.png')

        # 4. 새 슬라이드용 — 강의 fieldset + 그림 업로드 영역 클로즈업
        # 강의주소 fieldset 캡처
        legend = page.locator('legend:has-text("강의주소")').first
        video_fieldset = legend.locator('xpath=ancestor::fieldset[1]')
        await video_fieldset.screenshot(path=os.path.join(OUT_DIR, 'register_video_field.png'))
        print('WROTE register_video_field.png')

        # 그림 업로드 — 발문그림 ImageUploadField 영역
        stem_img = page.locator('label:has-text("발문그림")').first.locator(
            'xpath=ancestor::div[contains(@class, "border-l-4")][1]'
        )
        await stem_img.screenshot(path=os.path.join(OUT_DIR, 'register_image_dropzone.png'))
        print('WROTE register_image_dropzone.png')

        # 해설 블록 클로즈업 (업로드된 상태)
        explain_section = page.locator('label:has-text("해설")').first.locator(
            'xpath=ancestor::div[contains(@class, "border-l-4")][1]'
        )
        await explain_section.screenshot(
            path=os.path.join(OUT_DIR, 'register_q21_explain_blocks.png'))
        print('WROTE register_q21_explain_blocks.png')

        await browser.close()


if __name__ == '__main__':
    asyncio.run(main())
