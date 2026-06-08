<?php
$kakao = 'http://pf.kakao.com/_jsJDn/chat';
$sns = 'https://litt.ly/oshermusic';
$phone = '010-3115-0291';
$teacher = 'https://fantastic-blue-ed2.notion.site/33891a9644ce80c38005f5dd163717c1?source=copy_link';
$youtube1 = 'https://youtube.com/shorts/whzZo2DCFUg?feature=share';
$youtube2 = 'https://youtube.com/shorts/UUGExtIVkBE?feature=share';
?>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>오쉐르 뮤직 | 1:1 맞춤 방문 음악 레슨</title>
  <meta name="description" content="오쉐르 뮤직은 회원에게 맞는 1:1 음악 레슨과 전문 교사 양성 시스템을 운영합니다.">
  <link rel="preconnect" href="https://cdn.jsdelivr.net">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<nav class="navbar navbar-expand-lg fixed-top glass">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#home">OSHER MUSIC</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto gap-lg-3">
        <li class="nav-item"><a class="nav-link" href="#brand">브랜드 소개</a></li>
        <li class="nav-item"><a class="nav-link" href="#lesson">회원 수업 안내</a></li>
        <li class="nav-item"><a class="nav-link" href="#teacher">교사 채용 안내</a></li>
        <li class="nav-item"><a class="nav-link" href="#contact">문의하기</a></li>
      </ul>
    </div>
  </div>
</nav>

<header id="home" class="hero">
  <div class="container">
    <div class="row align-items-center g-5">
      <div class="col-lg-7">
        <p class="eyebrow">1:1 맞춤 음악 레슨 · 교사 양성 전문</p>
        <h1>회원에게는 즐거운 레슨을,<br>교사에게는 성장하는 커리어를.</h1>
        <p class="lead">오쉐르 뮤직은 아이와 회원의 성향을 이해하고, 검증된 교사와 체계적인 커리큘럼으로 음악 레슨을 연결합니다.</p>
        <div class="d-flex flex-wrap gap-2 mt-4">
          <a class="btn btn-primary btn-lg" href="<?= $kakao ?>">무료 레슨 상담</a>
          <a class="btn btn-outline-dark btn-lg" href="#lesson">수업 안내 보기</a>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="hero-card">
          <div class="logo-mark">O</div>
          <h2>OSHER MUSIC</h2>
          <p>회원 맞춤 레슨 · 전문 교사 매칭 · 체계적 관리</p>
        </div>
      </div>
    </div>
  </div>
</header>

<main>
<section id="brand" class="section">
  <div class="container">
    <div class="section-title"><span>Brand</span><h2>브랜드 소개</h2></div>
    <div class="row g-4">
      <div class="col-lg-6"><div class="card-box h-100"><h3>회사 소개</h3><p>오쉐르 뮤직은 2014년부터 음악 교육 현장에서 쌓아온 경험을 바탕으로 회원이 원하는 레슨과 교사를 연결하는 음악 교육 서비스입니다.</p><p>단순한 선생님 소개가 아니라 상담, 매칭, 수업 관리, 피드백까지 함께하는 파트너를 지향합니다.</p></div></div>
      <div class="col-lg-6"><div class="card-box h-100"><h3>기업 역량</h3><div class="score-wrap"><div><b>10년+</b><span>운영 노하우</span></div><div><b>1:1</b><span>맞춤 레슨</span></div><div><b>ABC</b><span>사전/중간/사후 관리</span></div></div></div></div>
      <div class="col-lg-6"><div class="card-box h-100"><h3>조직도</h3><div class="org"><div>CEO<br><small>운영 & 전략 기획</small></div><div>CTO<br><small>교육 & 회원 관리</small></div><div>교육팀</div><div>마케팅팀</div><div>CS 고객관리팀</div><div>교사 관리팀</div></div></div></div>
      <div class="col-lg-6"><div class="card-box h-100"><h3>교사 양성</h3><p>오쉐르 뮤직은 교사를 단순 배정하지 않고, 회원 응대와 수업 운영에 필요한 실무 역량을 함께 성장시킵니다.</p><div class="timeline"><span>입문</span><span>실습</span><span>수업 운영</span><span>피드백</span></div></div></div>
    </div>
  </div>
</section>

<section id="lesson" class="section soft">
  <div class="container">
    <div class="section-title"><span>Lesson</span><h2>회원 수업 안내</h2></div>
    <div class="guide"><div>악기 전문 컨설팅<br><b>1:1 상담</b></div><div>교사 소개 및 선택</div><div>무료 레슨 상담</div><div>정규 레슨 시작</div></div>
    <div class="row g-4 mt-4">
      <div class="col-md-6"><div class="video-card"><h3>초등 여아 레슨 영상</h3><p>실제 레슨 분위기를 영상으로 확인해보세요.</p><a class="btn btn-dark" href="<?= $youtube1 ?>">영상 재생</a></div></div>
      <div class="col-md-6"><div class="video-card"><h3>초등 남아 레슨 영상</h3><p>아이에게 부담 없는 즐거운 레슨을 지향합니다.</p><a class="btn btn-dark" href="<?= $youtube2 ?>">영상 재생</a></div></div>
    </div>
  </div>
</section>

<section id="teacher" class="section">
  <div class="container">
    <div class="section-title"><span>Recruit</span><h2>교사 채용 안내</h2></div>
    <div class="row g-4 align-items-center">
      <div class="col-lg-6"><h3 class="big-copy">개인별 맞춤 교육으로<br>교사를 성장시킵니다.</h3><p>악기 전공자와 예비 교사를 대상으로 레슨 운영, 회원 상담, 커뮤니케이션, 스케줄 관리까지 실무 중심으로 안내합니다.</p><a class="btn btn-primary" href="<?= $teacher ?>">자세히 살펴보기</a></div>
      <div class="col-lg-6"><div class="grid-list"><div>기초 운영 가이드</div><div>스케줄 및 지역 관리</div><div>회원별 페르소나</div><div>기초 교육학</div><div>안정적인 수업 운영</div><div>회원 유지 관리</div><div>DB 이해 및 활용</div><div>커뮤니티 성장</div></div></div>
    </div>
  </div>
</section>

<section id="contact" class="section soft">
  <div class="container">
    <div class="contact-box">
      <h2>문의하기</h2>
      <p>회원 상담, 기업 상담, 교사 지원 상담을 카카오 채널에서 빠르게 도와드립니다.</p>
      <div class="d-flex flex-wrap justify-content-center gap-2">
        <a class="btn btn-warning btn-lg" href="<?= $kakao ?>">카카오 상담 신청</a>
        <a class="btn btn-outline-dark btn-lg" href="tel:<?= str_replace('-', '', $phone) ?>">전화문의</a>
        <a class="btn btn-outline-dark btn-lg" href="<?= $sns ?>">SNS 보기</a>
      </div>
    </div>
  </div>
</section>
</main>

<footer class="footer">
  <div class="container">
    <b>OSHER MUSIC</b>
    <p>사업자등록번호: 807-43-01256 · 상호명: 오쉐르 뮤직 · 대표: 이루리</p>
    <p>주소: 인천광역시 계양구 까치말로 22, 403호(작전동) · 이메일: oshermusic49@gmail.com</p>
  </div>
</footer>

<div class="floating">
  <a href="<?= $sns ?>">SNS</a>
  <a href="tel:<?= str_replace('-', '', $phone) ?>">전화</a>
  <a href="<?= $kakao ?>">상담</a>
</div>
<div class="mobile-bar"><a href="tel:<?= str_replace('-', '', $phone) ?>">전화하기</a><a href="<?= $kakao ?>">카카오상담</a><a href="#lesson">레슨안내</a></div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
