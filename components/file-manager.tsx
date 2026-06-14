import {
  Activity,
  ArrowDownUp,
  Bell,
  BookOpen,
  Box,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Database,
  Download,
  FileCheck2,
  FileImage,
  FileSignature,
  FileText,
  Files,
  Filter,
  Folder,
  FolderKanban,
  FolderOpen,
  Gauge,
  Grid2X2,
  HardHat,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  List,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  Upload,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { AuthProfileButton } from "@/components/auth/auth-profile-button";

type FileCard = { name: string; meta: string; type: string; tone: string; tag: string; selected?: boolean };

const fieldFolders = [
  { name: "성수 물류센터", count: "사진 38 · 문서 6", tone: "blue", status: "오늘 업데이트" },
  { name: "마포 리모델링", count: "사진 24 · 문서 4", tone: "orange", status: "어제 업데이트" },
  { name: "강남 고객사 구축", count: "사진 17 · 문서 8", tone: "violet", status: "6월 11일" },
];

const files: FileCard[] = [
  { name: "성수 장비실_작업후.jpg", meta: "오늘 10:42 · 4.8MB", type: "image", tone: "blue", tag: "작업후", selected: true },
  { name: "성수 장비실_작업전.jpg", meta: "오늘 09:18 · 4.2MB", type: "image", tone: "slate", tag: "작업전" },
  { name: "네트워크 속도측정.pdf", meta: "오늘 10:51 · 684KB", type: "pdf", tone: "green", tag: "측정결과" },
  { name: "고객 확인 서명.png", meta: "오늘 11:06 · 312KB", type: "signature", tone: "violet", tag: "고객서명" },
];

const recentRows = [
  { name: "현장 장애 1차 보고서.docx", location: "성수 물류센터 / 보고서", owner: "이서연", date: "오늘 11:14", size: "284KB", icon: FileText, tone: "blue" },
  { name: "배선함 근접사진_03.jpg", location: "성수 물류센터 / 작업후", owner: "김지연", date: "오늘 10:44", size: "3.7MB", icon: FileImage, tone: "cyan" },
  { name: "고객 작업완료 확인서.pdf", location: "마포 리모델링 / 서명", owner: "박민수", date: "어제 17:32", size: "1.2MB", icon: FileCheck2, tone: "purple" },
];

function GlobalSidebar() {
  const nav: Array<{ label: string; icon: LucideIcon; href?: string; active?: boolean }> = [
    { label: "대시보드", icon: LayoutDashboard, href: "/" },
    { label: "프로젝트", icon: FolderKanban, href: "/projects" },
    { label: "문서", icon: FileText, href: "/documents" },
    { label: "채팅", icon: MessageSquare, href: "/chat" },
    { label: "파일", icon: Files, href: "/files", active: true },
    { label: "관리자", icon: ShieldCheck, href: "/admin" },
    { label: "위키", icon: BookOpen },
    { label: "데이터베이스", icon: Database },
    { label: "템플릿", icon: Box },
  ];
  return (
    <aside className="sidebar file-global-sidebar">
      <div className="workspace-switcher"><span className="workspace-mark">F</span><span>FillWork</span><ChevronDown className="workspace-chevron" size={15} /></div>
      <button className="sidebar-search" type="button"><Search size={17} /><span>검색</span></button>
      <div className="nav-section"><a className="nav-item" href="/"><Home size={17} /><span>홈</span></a><a className="nav-item" href="/notifications"><Bell size={17} /><span>알림</span><span className="nav-badge">3</span></a><a className="nav-item" href="/settings"><Settings size={17} /><span>설정</span></a></div>
      <div className="nav-section"><p className="nav-label">팀 스페이스</p>{nav.map(({ label, icon: Icon, href, active }) => href ? <a className={`nav-item${active ? " active" : ""}`} href={href} key={label}><Icon size={17} /><span>{label}</span></a> : <button className="nav-item" type="button" key={label}><Icon size={17} /><span>{label}</span></button>)}</div>
      <div className="nav-section"><p className="nav-label">개인 페이지</p><button className="nav-item" type="button"><Star size={17} /><span>즐겨찾기</span></button></div>
      <div className="plan-card file-plan"><span className="plan-kicker">저장 공간</span><div className="plan-row"><strong>비즈니스</strong><span>32%</span></div><div className="usage-track"><i style={{ width: "32%" }} /></div><p>3.2GB / 10GB 사용 중</p><button type="button">저장 공간 관리</button></div>
    </aside>
  );
}

function GlobalHeader() {
  return (
    <header className="header file-global-header"><button className="mobile-menu" type="button" aria-label="메뉴 열기"><Menu size={20} /></button><div className="header-spacer" /><div className="mode-toggle" aria-label="업무 모드"><button type="button"><Building2 size={14} />사무실 모드</button><button className="active" type="button"><HardHat size={14} />현장 모드</button></div><button className="global-search" type="button"><Search size={16} /><span>파일 검색 (Ctrl + K)</span></button><button className="header-icon" type="button" aria-label="알림"><Bell size={19} /></button><AuthProfileButton /></header>
  );
}

function FolderTree() {
  const roots = [
    { label: "전체 파일", icon: Files, active: true, count: "184" },
    { label: "최근 파일", icon: Clock3 },
    { label: "즐겨찾기", icon: Star, count: "12" },
    { label: "공유 파일", icon: Share2 },
    { label: "휴지통", icon: Trash2 },
  ];
  return (
    <aside className="file-folder-tree">
      <div className="file-tree-heading"><div><FolderOpen size={15} /><strong>파일</strong></div><button type="button"><Plus size={15} /></button></div>
      <button className="file-upload-primary" type="button"><Upload size={14} />파일 업로드</button>
      <nav className="file-root-nav">{roots.map(({ label, icon: Icon, active, count }) => <button className={active ? "active" : ""} type="button" key={label}><Icon size={14} /><span>{label}</span>{count ? <b>{count}</b> : null}</button>)}</nav>
      <div className="file-tree-section"><div className="file-tree-label"><span><ChevronDown size={11} />현장 폴더</span><Plus size={12} /></div>{fieldFolders.map((folder, index) => <button className="folder-tree-row" type="button" key={folder.name}><Folder size={14} /><span>{folder.name}</span>{index === 0 ? <b>38</b> : null}</button>)}</div>
      <div className="file-tree-section"><div className="file-tree-label"><span><ChevronDown size={11} />업무 유형</span></div>{["현장 사진", "속도측정 결과", "고객 서명", "완료 보고서"].map((label, index) => <button className="folder-tree-row" type="button" key={label}>{index === 0 ? <ImageIcon size={14} /> : index === 1 ? <Gauge size={14} /> : index === 2 ? <FileSignature size={14} /> : <FileCheck2 size={14} />}<span>{label}</span></button>)}</div>
      <div className="auto-organize-card"><span><Sparkles size={14} /></span><div><strong>AI 자동 정리</strong><p>오늘 38개 파일 중 31개를 현장별로 분류했습니다.</p></div><i><b /></i></div>
    </aside>
  );
}

function MainToolbar() {
  return (
    <div className="file-main-toolbar"><div className="file-title"><div><h1>전체 파일</h1><span>184개 항목</span></div><p>현장과 업무 유형에 따라 자동으로 정리된 파일입니다.</p></div><div className="file-toolbar-actions"><button className="file-search-box" type="button"><Search size={14} />파일 검색</button><button type="button"><ArrowDownUp size={14} />최근 수정</button><button type="button"><Filter size={14} />필터</button><div className="view-switch"><button className="active" type="button" aria-label="그리드 보기"><Grid2X2 size={14} /></button><button type="button" aria-label="목록 보기"><List size={14} /></button></div><button className="file-upload-button" type="button"><Upload size={14} />업로드</button></div></div>
  );
}

function FieldAutomation() {
  return (
    <section className="file-field-automation"><div className="automation-copy"><span><Sparkles size={15} /></span><div><strong>현장별 자동 분류가 진행 중입니다.</strong><p>새 파일 7개를 성수 물류센터와 마포 리모델링 폴더로 분류했습니다.</p></div><button type="button">분류 결과 확인 <ChevronRight size={13} /></button></div><div className="automation-status"><article><ImageIcon size={14} /><span>현장 사진</span><strong>31</strong><small>자동 분류</small></article><article><Gauge size={14} /><span>속도측정</span><strong>4</strong><small>결과 보관</small></article><article><FileSignature size={14} /><span>고객 서명</span><strong>3</strong><small>안전 보관</small></article></div></section>
  );
}

function FieldFolders() {
  return <section className="file-section"><div className="file-section-heading"><div><h2>현장 폴더</h2><p>최근 업데이트된 현장</p></div><button type="button">모두 보기 <ChevronRight size={13} /></button></div><div className="field-folder-grid">{fieldFolders.map((folder) => <article className={`field-folder-card ${folder.tone}`} key={folder.name}><div className="folder-card-top"><span><Folder size={18} /></span><button type="button"><MoreHorizontal size={15} /></button></div><strong>{folder.name}</strong><p>{folder.count}</p><div><span>{folder.status}</span><span className="mini-members"><i>김</i><i>박</i></span></div></article>)}</div></section>;
}

function FilePreviewArt({ type, tone }: { type: string; tone: string }) {
  return <div className={`file-preview-art ${tone}`}>{type === "image" ? <><ImageIcon size={18} /><div className="preview-building"><i /><i /><i /></div></> : type === "pdf" ? <><Gauge size={22} /><b>487</b><small>Mbps</small></> : <><FileSignature size={23} /><span className="signature-line">KIM JIYEON</span></>}</div>;
}

function FileGrid() {
  return <section className="file-section"><div className="file-section-heading"><div><h2>최근 파일</h2><p>오늘 업로드 및 수정된 파일</p></div><button type="button"><SlidersHorizontal size={13} />표시 설정</button></div><div className="file-card-grid">{files.map((file) => <article className={`file-card${file.selected ? " selected" : ""}`} key={file.name}><div className="file-card-head"><span className={`file-type-icon ${file.tone}`}>{file.type === "image" ? <FileImage size={14} /> : file.type === "pdf" ? <FileText size={14} /> : <FileSignature size={14} />}</span><button type="button"><MoreHorizontal size={15} /></button></div><FilePreviewArt type={file.type} tone={file.tone} /><strong>{file.name}</strong><p>{file.meta}</p><span className={`file-tag ${file.tone}`}>{file.tag}</span></article>)}</div></section>;
}

function FileList() {
  return <section className="file-section compact-list-section"><div className="file-section-heading"><div><h2>목록 보기</h2><p>공유 및 보고서 파일</p></div><button type="button">전체 목록</button></div><div className="file-list-table"><div className="file-list-header"><span>이름</span><span>소유자</span><span>수정일</span><span>크기</span><span /></div>{recentRows.map(({ name, location, owner, date, size, icon: Icon, tone }) => <button className="file-list-row" type="button" key={name}><span className={`file-list-name ${tone}`}><i><Icon size={14} /></i><b>{name}<small>{location}</small></b></span><span>{owner}</span><span>{date}</span><span>{size}</span><MoreHorizontal size={14} /></button>)}</div></section>;
}

function MainFiles() {
  return <main className="file-main"><MainToolbar /><div className="file-main-scroll"><FieldAutomation /><FieldFolders /><FileGrid /><FileList /></div></main>;
}

function DetailPanel() {
  return (
    <aside className="file-detail-panel"><div className="file-detail-heading"><strong>파일 세부정보</strong><button type="button"><X size={14} /></button></div><div className="selected-file-name"><span><FileImage size={16} /></span><div><strong>성수 장비실_작업후.jpg</strong><p>이미지 · 4.8MB</p></div><button type="button"><MoreHorizontal size={15} /></button></div>
      <section className="detail-preview-section"><div className="detail-preview"><span>작업후</span><div className="preview-building large"><i /><i /><i /></div><ImageIcon size={20} /></div><div className="compare-shortcut"><div><span className="before-thumb"><ImageIcon size={12} /></span><span className="after-thumb"><Check size={12} /></span></div><p><strong>작업 전/후 비교</strong>AI가 동일 위치 사진을 연결했습니다.</p><button type="button"><ChevronRight size={14} /></button></div></section>
      <section className="file-detail-section"><div className="detail-section-title"><h3>AI 자동 태그</h3><button type="button"><Sparkles size={12} />다시 생성</button></div><div className="file-tags"><span>성수 물류센터</span><span>작업후</span><span>네트워크 장비</span><span>배선 정리</span><button type="button"><Plus size={11} /></button></div><p className="tag-confidence">분류 정확도 96% · 이미지 분석 완료</p></section>
      <section className="file-detail-section"><div className="detail-section-title"><h3>업로드 정보</h3></div><dl className="file-information"><div><dt>업로드한 사람</dt><dd><span>김</span>김지연</dd></div><div><dt>업로드 시간</dt><dd>2026.06.13 10:42</dd></div><div><dt>위치</dt><dd>성수 물류센터 A동</dd></div><div><dt>연결 프로젝트</dt><dd>네트워크 장비 교체</dd></div></dl></section>
      <section className="file-detail-section"><div className="detail-section-title"><h3>활동 내역</h3><button type="button">전체 보기</button></div><div className="file-activity"><article><span className="blue"><Upload size={12} /></span><p><strong>김지연</strong>님이 파일을 업로드했습니다.<small>오늘 10:42</small></p></article><article><span className="violet"><Sparkles size={12} /></span><p>AI가 태그 4개를 생성했습니다.<small>오늘 10:43</small></p></article><article><span className="green"><Check size={12} /></span><p><strong>박민수</strong>님이 작업후 사진으로 승인했습니다.<small>오늘 10:58</small></p></article></div></section>
      <div className="detail-actions"><button type="button"><Share2 size={13} />공유</button><button type="button"><Download size={13} />다운로드</button></div>
    </aside>
  );
}

export function FileManager() {
  return <div className="stage file-stage"><div className="concept-label"><span>Files</span><div><strong>성수 물류센터 파일</strong><p>현장 파일이 자동으로 정리되고 증빙으로 연결됩니다.</p></div></div><div className="app-window file-window"><GlobalSidebar /><GlobalHeader /><FolderTree /><MainFiles /><DetailPanel /><button className="mobile-close" type="button" aria-label="닫기"><X size={18} /></button></div></div>;
}
