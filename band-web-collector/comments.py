from __future__ import annotations

import re
from typing import List, Dict


COMMENT_MARKERS = ['댓글', '답글']
REACTION_MARKERS = ['좋아요', '공감']


def extract_number_after_marker(text: str, markers: List[str]) -> int:
    for marker in markers:
        pattern1 = rf'{marker}\s*(\d+)'
        pattern2 = rf'(\d+)\s*{marker}'
        for pattern in [pattern1, pattern2]:
            match = re.search(pattern, text)
            if match:
                try:
                    return int(match.group(1))
                except Exception:
                    return 0
    return 0


def guess_comment_count(text: str) -> int:
    return extract_number_after_marker(text, COMMENT_MARKERS)


def guess_like_count(text: str) -> int:
    return extract_number_after_marker(text, REACTION_MARKERS)


def extract_comment_lines(text: str) -> str:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    result: List[str] = []
    capture = False

    for line in lines:
        if line.startswith('댓글') or line == '댓글':
            capture = True
            continue
        if capture:
            if line in ['표정짓기', '댓글쓰기', '공유', '좋아요']:
                continue
            if len(line) >= 2:
                result.append(line)

    return '\n'.join(result[:30])


def enrich_comment_fields(item: Dict[str, str]) -> Dict[str, str]:
    raw = item.get('raw_text') or item.get('body') or ''
    item['comment_count'] = guess_comment_count(raw)
    item['like_count'] = guess_like_count(raw)
    item['comments'] = extract_comment_lines(raw)
    return item
