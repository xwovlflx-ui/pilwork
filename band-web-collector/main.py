from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from config import OUTPUT_DIR, SCREENSHOT_DIR, LOG_DIR, EXCEL_PATH, SCROLL_COUNT, SCROLL_WAIT_SECONDS, START_URL
from storage import ensure_dirs, save_posts_to_excel
from collector import collect_band_texts


def main():
    ensure_dirs(OUTPUT_DIR, SCREENSHOT_DIR, LOG_DIR)

    options = Options()
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(START_URL)

        print('네이버 BAND 웹에 로그인 후 원하는 밴드방으로 이동하세요.')
        input('준비가 끝나면 Enter를 누르세요...')

        posts = collect_band_texts(
            driver=driver,
            scroll_count=SCROLL_COUNT,
            scroll_wait_seconds=SCROLL_WAIT_SECONDS,
            screenshot_dir=SCREENSHOT_DIR,
        )

        save_posts_to_excel(posts, EXCEL_PATH)

        print(f'수집 완료: {EXCEL_PATH}')
        print(f'게시글 수: {len(posts)}')

    finally:
        driver.quit()


if __name__ == '__main__':
    main()
