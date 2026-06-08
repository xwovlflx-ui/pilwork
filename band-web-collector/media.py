from __future__ import annotations

from pathlib import Path
from typing import List
from urllib.parse import urlparse

import requests

IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']


def looks_like_image_url(url: str) -> bool:
    if not url:
        return False
    lowered = url.lower()
    if lowered.startswith('data:'):
        return False
    if any(ext in lowered for ext in IMAGE_EXTENSIONS):
        return True
    if 'image' in lowered or 'photo' in lowered or 'thumbnail' in lowered:
        return True
    return False


def collect_image_urls_from_element(element) -> List[str]:
    urls: List[str] = []
    try:
        images = element.find_elements('tag name', 'img')
    except Exception:
        images = []

    for img in images:
        for attr in ['src', 'data-src', 'data-original']:
            try:
                value = img.get_attribute(attr)
            except Exception:
                value = None
            if value and looks_like_image_url(value) and value not in urls:
                urls.append(value)
    return urls


def cookie_dict_from_driver(driver) -> dict:
    cookies = {}
    try:
        for item in driver.get_cookies():
            name = item.get('name')
            value = item.get('value')
            if name and value:
                cookies[name] = value
    except Exception:
        pass
    return cookies


def ext_from_url(url: str) -> str:
    try:
        path = urlparse(url).path.lower()
    except Exception:
        path = ''
    for ext in IMAGE_EXTENSIONS:
        if path.endswith(ext):
            return ext
    return '.jpg'


def download_images(driver, urls: List[str], image_dir: Path, post_no: int) -> List[str]:
    image_dir.mkdir(parents=True, exist_ok=True)
    cookies = cookie_dict_from_driver(driver)
    headers = {'User-Agent': 'Mozilla/5.0'}
    saved: List[str] = []

    for idx, url in enumerate(urls, start=1):
        ext = ext_from_url(url)
        path = image_dir / f'post_{post_no:04d}_{idx:02d}{ext}'
        try:
            response = requests.get(url, headers=headers, cookies=cookies, timeout=15)
            if response.status_code == 200 and response.content:
                path.write_bytes(response.content)
                saved.append(str(path))
        except Exception:
            continue
    return saved
