from __future__ import annotations

from pathlib import Path
from time import sleep
from typing import List, Dict

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

from comments import enrich_comment_fields
from filters import is_valid_post_text
from media import collect_image_urls_from_element, download_images
from parser import parse_block
from storage import make_hash

POST_SELECTORS = [
    'article',
    '[role="article"]',
    'div[class*="post"]',
    'div[class*="Post"]',
    'div[class*="feed"]',
    'div[class*="Feed"]',
    'li[class*="post"]',
]


def element_text(element) -> str:
    try:
        return element.text or ''
    except Exception:
        return ''


def body_text(driver: WebDriver) -> str:
    try:
        return driver.find_element(By.TAG_NAME, 'body').text or ''
    except Exception:
        return ''


def screenshot(driver: WebDriver, screenshot_dir: Path, index: int) -> str:
    screenshot_dir.mkdir(parents=True, exist_ok=True)
    path = screenshot_dir / f'screen_{index:04d}.png'
    try:
        driver.save_screenshot(str(path))
        return str(path)
    except Exception:
        return ''


def find_post_candidates(driver: WebDriver):
    found = []
    seen = set()
    for selector in POST_SELECTORS:
        try:
            elements = driver.find_elements(By.CSS_SELECTOR, selector)
        except Exception:
            continue
        for element in elements:
            txt = element_text(element).strip()
            if not is_valid_post_text(txt):
                continue
            key = make_hash(txt)
            if key in seen:
                continue
            seen.add(key)
            found.append(element)
    return found


def fallback_blocks(text: str) -> List[str]:
    lines = [x.strip() for x in text.splitlines() if x.strip()]
    blocks: List[str] = []
    current: List[str] = []
    for line in lines:
        current.append(line)
        if len(current) >= 12:
            block = '\n'.join(current)
            if is_valid_post_text(block):
                blocks.append(block)
            current = []
    if current:
        block = '\n'.join(current)
        if is_valid_post_text(block):
            blocks.append(block)
    return blocks


def add_post(posts: List[Dict[str, str]], seen: set, raw: str, screenshot_path: str, image_urls=None, image_paths=None) -> None:
    if not is_valid_post_text(raw):
        return
    h = make_hash(raw)
    if h in seen:
        return
    seen.add(h)
    item = parse_block(len(posts) + 1, raw, screenshot_path, h)
    item = enrich_comment_fields(item)
    item['image_urls'] = '\n'.join(image_urls or [])
    item['image_paths'] = '\n'.join(image_paths or [])
    item['image_count'] = len(image_paths or image_urls or [])
    posts.append(item)


def scroll_down(driver: WebDriver) -> None:
    try:
        driver.execute_script('window.scrollBy(0, Math.floor(window.innerHeight * 0.8));')
    except Exception:
        pass


def collect_band_texts(driver: WebDriver, scroll_count: int, scroll_wait_seconds: int, screenshot_dir: Path, image_dir: Path | None = None) -> List[Dict[str, str]]:
    posts: List[Dict[str, str]] = []
    seen = set()

    for idx in range(1, scroll_count + 1):
        shot = screenshot(driver, screenshot_dir, idx)
        candidates = find_post_candidates(driver)

        for element in candidates:
            raw = element_text(element).strip()
            urls = collect_image_urls_from_element(element)
            paths = []
            if image_dir and urls:
                paths = download_images(driver, urls, image_dir, len(posts) + 1)
            add_post(posts, seen, raw, shot, urls, paths)

        if not candidates:
            for block in fallback_blocks(body_text(driver)):
                add_post(posts, seen, block, shot)

        scroll_down(driver)
        sleep(scroll_wait_seconds)

    return posts
