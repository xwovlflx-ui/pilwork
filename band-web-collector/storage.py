from __future__ import annotations

from pathlib import Path
from typing import Iterable
import hashlib
import pandas as pd


def ensure_dirs(output_dir: Path, screenshot_dir: Path, log_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    screenshot_dir.mkdir(parents=True, exist_ok=True)
    log_dir.mkdir(parents=True, exist_ok=True)


def make_hash(text: str) -> str:
    cleaned = ' '.join((text or '').split())
    return hashlib.sha256(cleaned.encode('utf-8')).hexdigest()[:16]


def save_posts_to_excel(posts: Iterable[dict], excel_path: Path) -> None:
    rows = list(posts)
    if not rows:
        rows = [{
            'no': 0,
            'collected_at': '',
            'text': '수집된 게시글이 없습니다.',
            'screenshot': '',
            'hash': ''
        }]
    df = pd.DataFrame(rows)
    excel_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_excel(excel_path, index=False)
