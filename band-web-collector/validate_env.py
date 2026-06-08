from __future__ import annotations

import importlib.util
import sys

REQUIRED = ['selenium', 'pandas', 'openpyxl', 'requests']


def check_python() -> bool:
    version = sys.version_info
    ok = version.major == 3 and version.minor >= 10
    print(f'Python: {version.major}.{version.minor}.{version.micro} - ' + ('OK' if ok else '업데이트 필요'))
    return ok


def check_modules() -> bool:
    all_ok = True
    for name in REQUIRED:
        ok = importlib.util.find_spec(name) is not None
        print(f'{name}: ' + ('OK' if ok else '설치 필요'))
        all_ok = all_ok and ok
    return all_ok


def main():
    print('BAND Web Collector 환경 점검')
    python_ok = check_python()
    module_ok = check_modules()
    if python_ok and module_ok:
        print('환경 점검 완료: 실행 가능합니다.')
    else:
        print('환경 점검 실패: install_requirements.txt의 패키지를 설치하세요.')


if __name__ == '__main__':
    main()
