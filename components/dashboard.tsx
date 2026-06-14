import {
  Bell,
  Bot,
  BookOpen,
  Box,
  Building2,
  CircleAlert,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  Files,
  FolderKanban,
  Gauge,
  HardHat,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  UserCheck,
  WandSparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { AuthProfileButton } from "@/components/auth/auth-profile-button";

type NavItem = { label: string; icon: LucideIcon; badge?: number; active?: boolean; href?: string };

const primaryNav: NavItem[] = [
  { label: "홈", icon: Home, active: true, href: "/" },
  { label: "알림", icon: Bell, badge: 3, href: "/notifications" },
  { label: "설정", icon: Settings, href: "/settings" },
];

const teamNav: NavItem[] = [
  { label: "대시보드", icon: LayoutDashboard, active: true, href: "/" },
  { label: "프로젝트", icon: FolderKanban, href: "/projects" },
  { label: "문서", icon: FileText, href: "/documents" },
  { label: "채팅", icon: MessageSquare, href: "/chat" },
  { label: "파일", icon: Files, href: "/files" },
  { label: "관리자", icon: ShieldCheck, href: "/admin" },
  { label: "위키", icon: BookOpen, href: "/wiki" },
  { label: "데이터베이스", icon: Database, href: "/database" },
  { label: "템플릿", icon: Box, href: "/templates" },
  { label: "휴지통", icon: Trash2, href: "/trash" },
];

const personalNav: NavItem[] = [
  { label: "즐겨찾기", icon: Star, href: "/favorites" },
  { label: "최근 페이지", icon: Clock3, href: "/recent" },
];

const recentDocuments = [
  { title: "현장 운영 가이드", meta: "김지연 · 2분 전", detail: "방문 체크리스트와 촬영 기준", icon: FileText, tone: "blue" },
  { title: "주간 업무 회의록", meta: "박민수 · 1시간 전", detail: "5월 4주차 실행 항목 정리", icon: FileText, tone: "cyan" },
  { title: "고객 관리 데이터베이스", meta: "이서연 · 3시간 전", detail: "신규 고객 8건 업데이트", icon: Database, tone: "green" },
  { title: "브랜드 가이드라인", meta: "최준호 · 어제", detail: "디지털 채널 규칙 개정", icon: BookOpen, tone: "purple" },
];

const fieldMetrics = [
  { label: "오늘 방문 예정", value: "4", unit: "곳", hint: "다음 10:30", icon: MapPin, tone: "blue" },
  { label: "업로드 사진", value: "38", unit: "장", hint: "오늘", icon: ImageIcon, tone: "violet" },
  { label: "미처리 업무", value: "7", unit: "건", hint: "긴급 2건", icon: CheckSquare, tone: "orange" },
  { label: "속도측정 현황", value: "92", unit: "%", hint: "정상", icon: Gauge, tone: "green" },
  { label: "긴급 공지", value: "1", unit: "건", hint: "확인 필요", icon: CircleAlert, tone: "red" },
];

const visits = [
  { time: "10:30", title: "성수 물류센터", person: "김지연 · 안전 점검", tone: "blue" },
  { time: "13:00", title: "마포 리모델링 현장", person: "박민수 · 사진 기록", tone: "orange" },
  { time: "16:20", title: "강남 고객사", person: "이서연 · 정기 미팅", tone: "purple" },
];

const uploadStatus = [
  { label: "오늘 업로드", value: "38", unit: "장", detail: "3개 현장", icon: ImageIcon, tone: "blue" },
  { label: "자동 분류", value: "31", unit: "장", detail: "정확도 96%", icon: WandSparkles, tone: "violet" },
  { label: "AI 요약", value: "6", unit: "건", detail: "완료 5 · 진행 1", icon: Bot, tone: "green" },
  { label: "승인 대기", value: "5", unit: "건", detail: "긴급 1건", icon: UserCheck, tone: "orange" },
];

const favorites = [
  { label: "프로젝트 로드맵", tone: "blue", icon: FileText },
  { label: "회사 위키 홈", tone: "yellow", icon: BookOpen },
  { label: "디자인 시스템", tone: "purple", icon: FileText },
];

function NavSection({ title, items }: { title?: string; items: NavItem[] }) {
  return (
    <div className="nav-section">
      {title ? <p className="nav-label">{title}</p> : null}
      {items.map(({ label, icon: Icon, badge, active, href }) => href ? (
        <a className={`nav-item${active ? " active" : ""}`} href={href} key={label}><Icon size={17} strokeWidth={1.7} /><span>{label}</span>{badge ? <span className="nav-badge">{badge}</span> : null}</a>
      ) : (
        <button className={`nav-item${active ? " active" : ""}`} key={label} type="button"><Icon size={17} strokeWidth={1.7} /><span>{label}</span>{badge ? <span className="nav-badge">{badge}</span> : null}</button>
      ))}
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="workspace-switcher">
        <span className="workspace-mark">F</span>
        <span>FillWork</span>
        <ChevronDown className="workspace-chevron" size={15} />
      </div>
      <button className="sidebar-search" type="button"><Search size={17} /><span>검색</span></button>
      <NavSection items={primaryNav} />
      <NavSection title="팀 스페이스" items={teamNav} />
      <NavSection title="개인 페이지" items={personalNav} />
      <div className="plan-card">
        <span className="plan-kicker">플랜</span>
        <div className="plan-row"><strong>비즈니스</strong><span>사용 중</span></div>
        <div className="usage-track"><i /></div>
        <p>3.2GB / 10GB 사용 중</p>
        <button type="button">플랜 관리</button>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="header">
      <button className="mobile-menu" type="button" aria-label="메뉴 열기"><Menu size={20} /></button>
      <div className="header-spacer" />
      <div className="mode-toggle" aria-label="업무 모드">
        <button type="button"><Building2 size={14} />사무실 모드</button>
        <button className="active" type="button"><HardHat size={14} />현장 모드</button>
      </div>
      <button className="global-search" type="button"><Search size={16} /><span>검색 (Ctrl + K)</span></button>
      <button className="header-icon" type="button" aria-label="알림"><Bell size={19} /></button>
      <AuthProfileButton />
    </header>
  );
}

function QuickActions() {
  const actions = [
    { label: "새 문서", icon: FileText },
    { label: "새 업무", icon: CheckSquare },
    { label: "사진 업로드", icon: Upload },
    { label: "방문 기록", icon: MapPin },
  ];
  return (
    <div className="quick-actions">
      {actions.map(({ label, icon: Icon }) => <button key={label} type="button"><Icon size={15} />{label}</button>)}
    </div>
  );
}

function RecentDocuments() {
  return (
    <section className="section-block">
      <h3>최근 페이지</h3>
      <div className="document-grid">
        {recentDocuments.map(({ title, meta, detail, icon: Icon, tone }) => (
          <article className="document-card" key={title}>
            <span className={`doc-icon ${tone}`}><Icon size={17} /></span>
            <div><strong>{title}</strong><span>{detail}</span><p>{meta}</p></div>
          </article>
        ))}
      </div>
      <button className="document-more" type="button">모든 문서 보기 <ChevronRight size={14} /></button>
    </section>
  );
}

function UploadCenter() {
  return (
    <section className="section-block upload-section">
      <div className="section-title-row">
        <div><h3>현장 업로드 센터</h3><p>사진이 자동으로 정리되고 보고서로 연결됩니다.</p></div>
        <button type="button">업로드 관리 <ChevronRight size={14} /></button>
      </div>
      <div className="upload-center-card">
        <div className="upload-progress">
          <span><Upload size={16} /></span>
          <div><strong>오늘 처리율 82%</strong><p>38장 중 31장 자동 분류 완료</p></div>
          <i><b /></i>
        </div>
        <div className="upload-status-grid">
          {uploadStatus.map(({ label, value, unit, detail, icon: Icon, tone }) => (
            <article key={label}>
              <span className={`upload-icon ${tone}`}><Icon size={14} /></span>
              <div><p>{label}</p><strong>{value}<small>{unit}</small></strong><em>{detail}</em></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FieldOverview() {
  return (
    <section className="section-block field-section">
      <div className="section-title-row"><h3>오늘의 현장</h3><button type="button">현장 보드 <ChevronRight size={14} /></button></div>
      <div className="field-grid">
        {fieldMetrics.map(({ label, value, unit, hint, icon: Icon, tone }) => (
          <article className="field-card" key={label}>
            <span className={`field-icon ${tone}`}><Icon size={16} /></span>
            <p>{label}</p>
            <div><strong>{value}</strong><b>{unit}</b></div>
            <small>{hint}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function WelcomeAssistant() {
  const insights = [
    { label: "미처리 업무", value: "긴급 2건 포함 7건", icon: CircleAlert, tone: "red" },
    { label: "업무 추천", value: "10:30 방문 전 체크리스트", icon: CheckSquare, tone: "blue" },
    { label: "공지 생성 제안", value: "서버 점검 안내 초안", icon: Bell, tone: "violet" },
    { label: "생산성 분석", value: "이번 주 집중도 12% 상승", icon: Gauge, tone: "green" },
  ];
  return (
    <section className="welcome-assistant">
      <div className="welcome-copy">
        <span className="today-label">6월 13일 금요일</span>
        <h2>안녕하세요, 관리자님.</h2>
        <p>오늘도 중요한 일에 집중해 보세요.</p>
      </div>
      <div className="assistant-card">
        <span className="assistant-icon"><Bot size={18} /></span>
        <div className="assistant-copy"><small>AI 업무비서 · 먼저 준비했어요</small><strong>지금 확인하면 좋은 업무 4가지를 찾았습니다.</strong></div>
        <button className="assistant-open" type="button" aria-label="AI 업무비서 열기"><ChevronRight size={16} /></button>
        <div className="assistant-insights">
          {insights.map(({ label, value, icon: Icon, tone }) => <button key={label} type="button"><span className={tone}><Icon size={12} /></span><div><small>{label}</small><b>{value}</b></div></button>)}
        </div>
      </div>
    </section>
  );
}

function CalendarCard() {
  const days = [
    ["28", "muted"], ["29", "muted"], ["30", "muted"], ["1", "event"], ["2", ""], ["3", ""], ["4", ""],
    ["5", ""], ["6", ""], ["7", "event"], ["8", ""], ["9", ""], ["10", "event"], ["11", ""],
    ["12", ""], ["13", ""], ["14", ""], ["15", ""], ["16", "event"], ["17", "event"], ["18", ""],
    ["19", ""], ["20", "selected"], ["21", ""], ["22", "event"], ["23", "event"], ["24", ""], ["25", ""],
    ["26", ""], ["27", "event"], ["28", ""], ["29", ""], ["30", "event"], ["31", ""], ["1", "muted"],
  ];
  return (
    <section className="right-card calendar-card">
      <div className="right-title-row"><h3>캘린더</h3><strong>2024년 5월</strong><span><ChevronLeft size={16} /><ChevronRight size={16} /></span></div>
      <div className="weekdays">{["일", "월", "화", "수", "목", "금", "토"].map(day => <span key={day}>{day}</span>)}</div>
      <div className="calendar-grid">
        {days.map(([day, state], index) => <button className={state} key={`${day}-${index}`} type="button">{day}</button>)}
      </div>
    </section>
  );
}

function RightRail() {
  return (
    <aside className="right-rail">
      <section className="right-card urgent-card">
        <div className="urgent-heading"><span><CircleAlert size={15} /> 긴급 공지</span><time>10분 전</time></div>
        <strong>금일 18시 서버 점검이 예정되어 있습니다.</strong>
        <p>현장 사진은 17시 30분까지 동기화해 주세요.</p>
      </section>
      <section className="right-card visits-card">
        <div className="right-title-row"><h3>오늘 방문 예정</h3><button type="button">전체 보기</button></div>
        <div className="visit-list">
          {visits.map(visit => (
            <div className="visit-row" key={visit.time}>
              <time>{visit.time}</time><i className={visit.tone} /><div><strong>{visit.title}</strong><p>{visit.person}</p></div>
            </div>
          ))}
        </div>
      </section>
      <CalendarCard />
      <section className="right-card favorites-card">
        <div className="right-title-row"><h3>즐겨찾기</h3><button type="button">편집</button></div>
        {favorites.map(({ label, tone, icon: Icon }) => <button className="favorite-row" key={label} type="button"><span className={`doc-icon ${tone}`}><Icon size={15} /></span>{label}</button>)}
      </section>
    </aside>
  );
}

export function Dashboard() {
  return (
    <div className="stage">
      <div className="concept-label"><span>FillWork</span><div><strong>문서와 현장을 잇는 업무 공간</strong><p>Notion 50% · Toss 30% · Slack 20%</p></div></div>
      <div className="app-window">
        <Sidebar />
        <Header />
        <main className="main-content">
          <div className="page-heading"><h1>대시보드</h1><button type="button"><Plus size={17} /> 새 페이지</button></div>
          <WelcomeAssistant />
          <div className="quick-block"><h3>빠른 생성</h3><QuickActions /></div>
          <RecentDocuments />
          <FieldOverview />
          <UploadCenter />
        </main>
        <RightRail />
        <button className="mobile-close" type="button" aria-label="닫기"><X size={18} /></button>
      </div>
    </div>
  );
}
