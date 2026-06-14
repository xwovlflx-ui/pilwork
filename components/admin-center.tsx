import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Box,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  Database,
  FileCheck2,
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
  MoreHorizontal,
  Network,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  UserCog,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AdminApprovalPanel } from "@/components/auth/admin-approval-panel";
import { AuthProfileButton } from "@/components/auth/auth-profile-button";

const summaryCards = [
  { label: "오늘 방문", value: "12", unit: "곳", detail: "완료 7 · 진행 3", delta: "+2", icon: MapPin, tone: "blue" },
  { label: "미완료 업무", value: "24", unit: "건", detail: "긴급 4건", delta: "-8%", icon: Clock3, tone: "orange" },
  { label: "활동 직원", value: "38", unit: "명", detail: "전체 42명", delta: "90%", icon: Users, tone: "cyan" },
  { label: "사진 업로드", value: "186", unit: "장", detail: "7개 현장", delta: "+24%", icon: ImageIcon, tone: "violet" },
  { label: "결재 대기", value: "7", unit: "건", detail: "오늘 만료 2건", delta: "확인", icon: FileCheck2, tone: "green" },
  { label: "긴급 이슈", value: "3", unit: "건", detail: "미확인 1건", delta: "주의", icon: CircleAlert, tone: "red" },
];

const employees = [
  { name: "김지연", role: "현장 매니저", team: "운영 1팀", status: "근무", activity: "성수센터 점검 중", time: "3분 전", initials: "김", tone: "blue" },
  { name: "박민수", role: "기술 지원", team: "기술지원팀", status: "근무", activity: "장애 보고서 검토", time: "8분 전", initials: "박", tone: "orange" },
  { name: "이서연", role: "고객 성공", team: "고객경험팀", status: "근무", activity: "고객 서명 승인", time: "12분 전", initials: "이", tone: "violet" },
  { name: "최준호", role: "프로젝트 리드", team: "PMO", status: "휴무", activity: "주간 일정 업데이트", time: "어제", initials: "최", tone: "green" },
];

const departments = [
  { name: "현장운영본부", people: 18, teams: 3, progress: 86, tone: "blue" },
  { name: "기술지원본부", people: 11, teams: 2, progress: 74, tone: "violet" },
  { name: "고객경험본부", people: 8, teams: 2, progress: 92, tone: "green" },
];

const fieldWorkers = [
  { name: "김지연", site: "성수 물류센터", time: "09:12 도착", x: 67, y: 30, tone: "blue" },
  { name: "장도윤", site: "마포 리모델링", time: "10:03 도착", x: 32, y: 50, tone: "orange" },
  { name: "오세훈", site: "강남 고객사", time: "이동 중", x: 72, y: 71, tone: "violet" },
];

function GlobalSidebar() {
  const nav: Array<{ label: string; icon: LucideIcon; href?: string; active?: boolean }> = [
    { label: "대시보드", icon: LayoutDashboard, href: "/" },
    { label: "프로젝트", icon: FolderKanban, href: "/projects" },
    { label: "문서", icon: FileText, href: "/documents" },
    { label: "채팅", icon: MessageSquare, href: "/chat" },
    { label: "파일", icon: Files, href: "/files" },
    { label: "관리자", icon: ShieldCheck, href: "/admin", active: true },
    { label: "위키", icon: BookOpen },
    { label: "데이터베이스", icon: Database },
    { label: "템플릿", icon: Box },
  ];
  return (
    <aside className="sidebar admin-global-sidebar">
      <div className="workspace-switcher"><span className="workspace-mark">F</span><span>FillWork</span><ChevronDown className="workspace-chevron" size={15} /></div>
      <button className="sidebar-search" type="button"><Search size={17} /><span>검색</span></button>
      <div className="nav-section"><a className="nav-item" href="/"><Home size={17} /><span>홈</span></a><a className="nav-item" href="/notifications"><Bell size={17} /><span>알림</span><span className="nav-badge">3</span></a><a className="nav-item" href="/settings"><Settings size={17} /><span>설정</span></a></div>
      <div className="nav-section"><p className="nav-label">팀 스페이스</p>{nav.map(({ label, icon: Icon, href, active }) => href ? <a className={`nav-item${active ? " active" : ""}`} href={href} key={label}><Icon size={17} /><span>{label}</span></a> : <button className="nav-item" type="button" key={label}><Icon size={17} /><span>{label}</span></button>)}</div>
      <div className="nav-section"><p className="nav-label">개인 페이지</p><button className="nav-item" type="button"><Star size={17} /><span>즐겨찾기</span></button></div>
      <div className="plan-card admin-plan"><span className="plan-kicker">조직 플랜</span><div className="plan-row"><strong>비즈니스</strong><span>42명</span></div><div className="usage-track"><i style={{ width: "70%" }} /></div><p>라이선스 42 / 60 사용 중</p><button type="button">플랜 관리</button></div>
    </aside>
  );
}

function GlobalHeader() {
  return <header className="header admin-global-header"><button className="mobile-menu" type="button" aria-label="메뉴 열기"><Menu size={20} /></button><div className="header-spacer" /><button className="admin-date-filter" type="button"><CalendarCheck2 size={14} />2026년 6월 13일 <ChevronDown size={12} /></button><div className="mode-toggle" aria-label="업무 모드"><button type="button"><Building2 size={14} />사무실 모드</button><button className="active" type="button"><HardHat size={14} />현장 모드</button></div><button className="global-search" type="button"><Search size={16} /><span>관리자 검색 (Ctrl + K)</span></button><button className="header-icon" type="button" aria-label="알림"><Bell size={19} /></button><AuthProfileButton /></header>;
}

function AdminRail() {
  const groups = [
    { title: "운영", items: [{ label: "경영 현황", icon: LayoutDashboard, active: true }, { label: "직원 관리", icon: UserCog }, { label: "조직 관리", icon: Network }, { label: "권한 관리", icon: ShieldCheck }] },
    { title: "분석", items: [{ label: "업무 통계", icon: BarChart3 }, { label: "프로젝트 분석", icon: FolderKanban }, { label: "AI 사용량", icon: Bot }] },
    { title: "시스템", items: [{ label: "접속 로그", icon: Activity }, { label: "결제 및 플랜", icon: BriefcaseBusiness }, { label: "관리자 설정", icon: Settings }] },
  ];
  return <aside className="admin-rail"><div className="admin-rail-heading"><div><ShieldCheck size={15} /><strong>관리자 센터</strong></div><button type="button"><MoreHorizontal size={15} /></button></div><div className="admin-company"><span>FW</span><div><strong>필워크 주식회사</strong><p>Business Plan</p></div><ChevronRight size={13} /></div>{groups.map(group => <section className="admin-menu-group" key={group.title}><p>{group.title}</p>{group.items.map(({ label, icon: Icon, active }) => <button className={active ? "active" : ""} type="button" key={label}><Icon size={14} /><span>{label}</span>{active ? <i /> : null}</button>)}</section>)}<div className="admin-security"><span><ShieldCheck size={14} /></span><div><strong>보안 상태 양호</strong><p>최근 위험 로그인 없음</p></div></div></aside>;
}

function SummaryCards() {
  return <section className="admin-summary-grid">{summaryCards.map(({ label, value, unit, detail, delta, icon: Icon, tone }) => <article className={`admin-summary-card ${tone}`} key={label}><div><span><Icon size={15} /></span><b>{delta}</b></div><p>{label}</p><strong>{value}<small>{unit}</small></strong><footer>{detail}</footer></article>)}</section>;
}

function ProductivityChart() {
  const bars = [54,68,61,74,70,86,79,91,82,88,94,90];
  return <section className="admin-card productivity-card"><div className="admin-card-heading"><div><h2>업무 처리량</h2><p>최근 12주 완료 업무</p></div><div className="chart-legend"><span><i />완료 업무</span><button type="button">주간 <ChevronDown size={11} /></button></div></div><div className="productivity-metric"><strong>1,248건</strong><span><TrendingUp size={12} />지난달 대비 14.2%</span></div><div className="bar-chart">{bars.map((bar,index)=><div key={index}><i style={{height:`${bar}%`}} className={index===10?"active":""}/><span>{index+1}주</span></div>)}</div></section>;
}

function ProjectProgress() {
  const projects=[{name:"성수 물류센터",value:86,tone:"blue"},{name:"마포 리모델링",value:64,tone:"orange"},{name:"강남 고객사 구축",value:48,tone:"violet"},{name:"본사 네트워크 개선",value:92,tone:"green"}];
  return <section className="admin-card project-progress-card"><div className="admin-card-heading"><div><h2>프로젝트 진행률</h2><p>주요 프로젝트 4개</p></div><button type="button">전체 보기</button></div><div className="project-progress-list">{projects.map(project=><article key={project.name}><div><strong>{project.name}</strong><span>{project.value}%</span></div><i><b className={project.tone} style={{width:`${project.value}%`}}/></i></article>)}</div></section>;
}

function EmployeeManagement() {
  return <section className="admin-card employee-card"><div className="admin-card-heading"><div><h2>직원 활동 현황</h2><p>근무 38명 · 휴무 4명</p></div><button type="button"><Plus size={12} />직원 추가</button></div><div className="employee-table"><div className="employee-table-head"><span>직원</span><span>상태</span><span>최근 활동</span><span>역할</span><span /></div>{employees.map(employee=><div className="employee-row" key={employee.name}><span className="employee-person"><i className={employee.tone}>{employee.initials}<b /></i><strong>{employee.name}<small>{employee.team}</small></strong></span><span className={`employee-status ${employee.status==="근무"?"working":"off"}`}><i />{employee.status}</span><span className="employee-activity">{employee.activity}<small>{employee.time}</small></span><button type="button">{employee.role}<ChevronDown size={10}/></button><MoreHorizontal size={14}/></div>)}</div></section>;
}

function OrganizationManagement() {
  return <section className="admin-card organization-card"><div className="admin-card-heading"><div><h2>조직 관리</h2><p>3개 본부 · 7개 팀</p></div><button type="button">조직도 <ChevronRight size={11}/></button></div><div className="department-list">{departments.map(dept=><article key={dept.name}><span className={dept.tone}><Building2 size={14}/></span><div><strong>{dept.name}</strong><p>{dept.teams}개 팀 · {dept.people}명</p><i><b style={{width:`${dept.progress}%`}}/></i></div><em>{dept.progress}%</em></article>)}</div><div className="permission-summary"><span><ShieldCheck size={14}/></span><p><strong>권한 정책 8개 적용 중</strong>관리자 3명 · 팀 리더 7명</p><button type="button">관리</button></div></section>;
}

function AdminMain() {
  return <main className="admin-main"><div className="admin-main-heading"><div><span>대표님, 좋은 오후입니다.</span><h1>회사 운영 현황</h1><p>오늘의 인력, 현장, 업무 흐름을 한눈에 확인하세요.</p></div><div className="admin-health"><span><CheckCircle2 size={14}/></span><div><strong>전체 운영 상태 양호</strong><p>긴급 확인 항목 1건</p></div><ChevronRight size={14}/></div></div><div className="admin-main-scroll"><SummaryCards/><AdminApprovalPanel/><div className="admin-analysis-grid"><ProductivityChart/><ProjectProgress/></div><div className="admin-management-grid"><EmployeeManagement/><OrganizationManagement/></div></div></main>;
}

function FieldMap() {
  return <section className="executive-card field-map-card"><div className="executive-title"><div><h3>현장 기사 위치</h3><p>현재 활동 중 9명</p></div><button type="button">전체 지도</button></div><div className="field-map"><div className="map-road r1"/><div className="map-road r2"/><div className="map-road r3"/>{fieldWorkers.map(worker=><span className={`worker-pin ${worker.tone}`} style={{left:`${worker.x}%`,top:`${worker.y}%`}} key={worker.name}><MapPin size={12}/><i>{worker.name[0]}</i></span>)}</div><div className="worker-list">{fieldWorkers.map(worker=><article key={worker.name}><span className={worker.tone}>{worker.name[0]}</span><div><strong>{worker.name}</strong><p>{worker.site}</p></div><time>{worker.time}</time></article>)}</div></section>;
}

function SpeedStats() {
  return <section className="executive-card speed-card"><div className="executive-title"><div><h3>속도측정 현황</h3><p>오늘 측정 16건</p></div><span className="status-good">정상 92%</span></div><div className="speed-donut"><div><strong>487</strong><small>평균 Mbps</small></div></div><div className="speed-stats"><span><i className="good"/>정상 <b>14</b></span><span><i className="warn"/>주의 <b>2</b></span><span><i className="bad"/>장애 <b>0</b></span></div></section>;
}

function UploadRanking() {
  const ranks=[{name:"김지연",count:58,tone:"blue"},{name:"장도윤",count:43,tone:"orange"},{name:"박민수",count:37,tone:"violet"}];
  return <section className="executive-card ranking-card"><div className="executive-title"><div><h3>사진 업로드 순위</h3><p>이번 주 기준</p></div><ImageIcon size={14}/></div>{ranks.map((rank,index)=><article key={rank.name}><b>{index+1}</b><span className={rank.tone}>{rank.name[0]}</span><strong>{rank.name}</strong><i><em style={{width:`${rank.count/58*100}%`}}/></i><small>{rank.count}장</small></article>)}</section>;
}

function IssueStatus() {
  return <section className="executive-card issue-card"><div className="executive-title"><div><h3>미처리 장애</h3><p>즉시 확인이 필요한 항목</p></div><span className="issue-count">3</span></div><article className="critical"><span><Zap size={13}/></span><div><strong>성수센터 포트 발열</strong><p>긴급 · 18분 경과</p></div><ChevronRight size={13}/></article><article><span><AlertTriangle size={13}/></span><div><strong>마포 현장 속도 저하</strong><p>주의 · 담당자 배정</p></div><ChevronRight size={13}/></article><article><span><Clock3 size={13}/></span><div><strong>고객 서명 미수신</strong><p>보통 · 2시간 경과</p></div><ChevronRight size={13}/></article></section>;
}

function AiUsage() {
  return <section className="executive-card ai-usage-card"><div className="executive-title"><div><h3>AI 사용량</h3><p>이번 달 68% 사용</p></div><Bot size={14}/></div><div className="ai-usage-value"><strong>6,842</strong><span>회</span><em>+18%</em></div><i><b/></i><div><span>문서 요약 42%</span><span>사진 분류 35%</span></div></section>;
}

function ExecutiveRail() {
  return <aside className="executive-rail"><div className="executive-heading"><div><Sparkles size={14}/><strong>현장 인사이트</strong></div><button type="button"><MoreHorizontal size={14}/></button></div><FieldMap/><SpeedStats/><UploadRanking/><IssueStatus/><AiUsage/></aside>;
}

export function AdminCenter() {
  return <div className="stage admin-stage"><div className="concept-label"><span>Admin</span><div><strong>회사 운영 센터</strong><p>대표가 한 화면에서 조직과 현장의 상태를 파악합니다.</p></div></div><div className="app-window admin-window"><GlobalSidebar/><GlobalHeader/><AdminRail/><AdminMain/><ExecutiveRail/><button className="mobile-close" type="button" aria-label="닫기"><X size={18}/></button></div></div>;
}
