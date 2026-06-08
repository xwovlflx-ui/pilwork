from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Iterable, Dict


def connect(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS collected_posts (
            hash TEXT PRIMARY KEY,
            author TEXT,
            posted_at TEXT,
            body TEXT,
            collected_at TEXT
        )
    ''')
    conn.commit()
    return conn


def is_collected(conn: sqlite3.Connection, hash_value: str) -> bool:
    cur = conn.execute('SELECT 1 FROM collected_posts WHERE hash = ? LIMIT 1', (hash_value,))
    return cur.fetchone() is not None


def mark_collected(conn: sqlite3.Connection, item: Dict[str, str]) -> None:
    conn.execute(
        'INSERT OR IGNORE INTO collected_posts(hash, author, posted_at, body, collected_at) VALUES (?, ?, ?, ?, ?)',
        (
            item.get('hash', ''),
            item.get('author', ''),
            item.get('posted_at', ''),
            item.get('body', ''),
            item.get('collected_at', ''),
        ),
    )
    conn.commit()


def filter_new_posts(db_path: Path, posts: Iterable[Dict[str, str]]) -> list[Dict[str, str]]:
    conn = connect(db_path)
    result = []
    try:
        for item in posts:
            hash_value = item.get('hash', '')
            if not hash_value:
                continue
            if is_collected(conn, hash_value):
                continue
            mark_collected(conn, item)
            result.append(item)
    finally:
        conn.close()
    return result
