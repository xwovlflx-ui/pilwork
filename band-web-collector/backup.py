from __future__ import annotations

from datetime import datetime
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED


def make_backup(output_dir: Path, backup_dir: Path) -> Path:
    backup_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    zip_path = backup_dir / f'band_backup_{stamp}.zip'

    with ZipFile(zip_path, 'w', ZIP_DEFLATED) as zf:
        for path in output_dir.rglob('*'):
            if path.is_file() and backup_dir not in path.parents:
                zf.write(path, path.relative_to(output_dir))

    return zip_path
