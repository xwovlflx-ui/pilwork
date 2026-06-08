from __future__ import annotations

from datetime import datetime
from pathlib import Path
from time import sleep
from typing import List, Dict

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

from storage import make_hash


def get_visible_text(driver: WebDriver) -> str:
    try:
        body = driver.find_element(By.TAG_NAME, 'body')
        return body.text or ''
    except Exception:
        return ''


def save_screenshot(driver: WebDriver, screenshot_dir: Path, index: int) -> str:
    screenshot_dir.mkdir(parents=True, exist_ok=True)
    path = screenshot_dir / f'screen_{index:04d}.png'
    try:
        driver.save_screenshot(str(path))
        return str(path)
    except Exception:
        return ''


def split_text_blocks(text: str) -> List[str]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    blocks: List[str] = []
    current: List[str] = []

    for line in lines:
        current.append(line)
        if len(current) >= 8:
            blocks.append('\n'.join(current))
            current = []

    if current:
        blocks.append('\n'.join(current))

    return blocks


def collect_band_texts(
    driver: WebDriver,
    scroll_count: int,
    scroll_wait_seconds: int,
    screenshot_dir: Path,
) -> List[Dict[str, str]]:
    posts: List[Dict[str, str]] = []
    seen = set()

    for idx in range(1, scroll_count + 1):
        collected_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        screenshot_path = save_screenshot(driver, screenshot_dir, idx)
        text = get_visible_text(driver)
        blocks = split_text_blocks(text)

        for block in blocks:
            h = make_hash(block)
            if h in seen:
                continue
            seen.add(h)
            posts.append({
                'no': len(posts) + 1,
                'collected_at': collected_at,
                'text': block,
                'screenshot': screenshot_path,
                'hash': h,
            })

        driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')
        sleep(scroll_wait_seconds)

    return posts
