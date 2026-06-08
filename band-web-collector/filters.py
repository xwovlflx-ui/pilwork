from __future__ import annotations

AD_KEYWORDS = [
    '광고', 'AD', 'Sponsored', '스폰서', '대출', '보험', '카드', '한도',
    '금리', '상담', '신청하기', '바로가기', '최대', '이벤트', '프로모션',
    '캐시백', '지원금', '무료상담', '클릭', '문의하기'
]


def is_ad_text(text: str) -> bool:
    if not text:
        return False
    lowered = text.lower()
    hit = 0
    for keyword in AD_KEYWORDS:
        if keyword.lower() in lowered:
            hit += 1
    return hit >= 2


def is_valid_post_text(text: str) -> bool:
    if not text or len(text.strip()) < 10:
        return False
    if is_ad_text(text):
        return False
    return True
