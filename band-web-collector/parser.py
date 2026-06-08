from __future__ import annotations

import re
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Dict


DATE_PATTERNS = [
    r'\d{4}\.\s*\d{1,2}\.\s*\d{1,2}\.?',
    r'\d{4}-\d{1,2}-\d{1,2}',
    r'\d{1,2}월\s*\d{1,2}일',
    r'어제|오늘|방금|\d+분 전|\d+시간 전|\d+일 전',
]

IGNORE_WORDS = {
    '좋아요', '댓글', '공유', '더보기', '밴드', 'BAND', '홈', '채팅', '멤버', '설정',
}


@dataclass
class ParsedPost:
    no: int
    collected_at: str
    author: str
    posted_at: str
    body: str
    raw_text: str
    screenshot: str
    hash: str


def find_date(text: str) -> str:
    for pattern in DATE_PATTERNS:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return ''


def guess_author(lines: List[str]) -> str:
    for line in lines[:6]:
        cleaned = line.strip()
        if not cleaned or cleaned in IGNORE_WORDS:
            continue
        if len(cleaned) <= 30 and not re.search('|'.join(DATE_PATTERNS), cleaned):
            return cleaned
    return ''


def clean_lines(text: str) -> List[str]:
    result = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if line in IGNORE_WORDS:
            continue
        result.append(line)
    return result


def parse_block(no: int, raw_text: str, screenshot: str, hash_value: str) -> Dict[str, str]:
    lines = clean_lines(raw_text)
    posted_at = find_date(raw_text)
    author = guess_author(lines)

    body_lines = []
    for line in lines:
        if line == author:
            continue
        if posted_at and posted_at in line:
            continue
        if line in IGNORE_WORDS:
            continue
        body_lines.append(line)

    body = '\n'.join(body_lines).strip()
    item = ParsedPost(
        no=no,
        collected_at=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        author=author,
        posted_at=posted_at,
        body=body,
        raw_text=raw_text,
        screenshot=screenshot,
        hash=hash_value,
    )
    return asdict(item)
