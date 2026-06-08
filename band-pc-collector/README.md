# BAND PC Collector

본인 계정으로 로그인된 Android BAND 앱 화면을 PC에서 Appium으로 조작해 자료를 정리하는 보조 프로그램입니다.

## 원칙
- 본인이 접근 권한을 가진 밴드 1개만 대상으로 사용합니다.
- 비밀번호를 저장하지 않습니다.
- 사용자가 직접 로그인한 BAND 앱 화면만 사용합니다.
- 우회 접속, 계정 탈취, 비공개 권한 우회 용도로 사용하지 않습니다.

## 준비물
1. Windows PC
2. Android 스마트폰
3. USB 케이블
4. Python 3.11 이상
5. Node.js
6. Appium
7. Android USB 디버깅 활성화

## 설치
```bash
pip install -r requirements.txt
npm install -g appium
appium driver install uiautomator2
```

## 실행 순서
1. 스마트폰에서 BAND 앱 로그인
2. 수집할 밴드방을 직접 열어둠
3. USB로 PC 연결
4. Appium 서버 실행
```bash
appium
```
5. 새 터미널에서 실행
```bash
python main.py
```

## 저장 위치
```text
band_output/
  band_posts.xlsx
  screenshots/
  logs/
```

## 현재 버전 기능
- Android 기기 연결 확인
- BAND 앱 실행
- 현재 화면 텍스트 수집
- 스크린샷 저장
- 화면 스크롤
- 중복 텍스트 제거
- 엑셀 저장

## 주의
BAND 앱 화면 구조가 바뀌면 수집 품질이 달라질 수 있습니다.
