from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from backup import make_backup
from config import (
    OUTPUT_DIR,
    EXCEL_DIR,
    IMAGE_DIR,
    SCREENSHOT_DIR,
    LOG_DIR,
    BACKUP_DIR,
    EXCEL_PATH,
    SCROLL_COUNT,
    SCROLL_WAIT_SECONDS,
    START_URL,
)
from db import filter_new_posts
from storage import ensure_dirs, save_posts_to_excel
from collector_v2 import collect_band_texts

DB_PATH = OUTPUT_DIR / 'band_collector.sqlite3'


def main():
    ensure_dirs(OUTPUT_DIR, SCREENSHOT_DIR, LOG_DIR)
    EXCEL_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    options = Options()
    options.add_argument('--start-maximized')
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(START_URL)

        print('네이버 BAND 웹에 로그인하세요.')
        print('수집할 밴드방으로 이동한 뒤 Enter를 누르세요.')
        input('준비 완료 후 Enter...')

        posts = collect_band_texts(
            driver=driver,
            scroll_count=SCROLL_COUNT,
            scroll_wait_seconds=SCROLL_WAIT_SECONDS,
            screenshot_dir=SCREENSHOT_DIR,
            image_dir=IMAGE_DIR,
        )

        new_posts = filter_new_posts(DB_PATH, posts)
        save_posts_to_excel(new_posts, EXCEL_PATH)
        zip_path = make_backup(OUTPUT_DIR, BACKUP_DIR)

        print(f'수집 완료: {EXCEL_PATH}')
        print(f'새 게시글 수: {len(new_posts)}')
        print(f'백업 파일: {zip_path}')

    finally:
        driver.quit()


if __name__ == '__main__':
    main()
