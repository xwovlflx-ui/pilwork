import {
  Bell,
  BookOpen,
  Bot,
  Box,
  Building2,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Database,
  FileImage,
  FileText,
  Files,
  FolderKanban,
  Hash,
  HardHat,
  Headphones,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Pin,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Trash2,
  UserPlus,
  Users,
  Video,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AuthProfileButton } from "@/components/auth/auth-profile-button";

type Channel = { label: string; icon?: LucideIcon; badge?: number; active?: boolean; locked?: boolean };

const mainChannels: Channel[] = [
  { label: "전체 공지", icon: Bell, badge: 2 },
  { label: "현장지원", icon: HardHat, active: true, badge: 5 },
  { label: "기술문의", icon: Headphones },
  { label: "자유채팅", icon: MessageCircle },
];

const projectChannels: Channel[] = [
  { label: "성수 물류센터", badge: 3 },
  { label: "마포 리모델링" },
  { label: "강남 고객사 구축" },
];

const participants = [
  { name: "김지연", role: "현장 매니저", initials: "김", tone: "blue", online: true },
  { name: "박민수", role: "기술 지원", initials: "박", tone: "orange", online: true },
  { name: "이서연", role: "고객 성공", initials: "이", tone: "violet", online: true },
  { name: "최준호", role: "프로젝트 리드", initials: "최", tone: "green", online: false },
];

function GlobalSidebar() {
  const nav: Array<{ label: string; icon: LucideIcon; href?: string; active?: boolean }> = [
    { label: "대시보드", icon: LayoutDashboard, href: "/" },
    { label: "프로젝트", icon: FolderKanban, href: "/projects" },
    { label: "문서", icon: FileText, href: "/documents" },
    { label: "채팅", icon: MessageSquare, href: "/chat", active: true },
    { label: "파일", icon: Files, href: "/files" },
    { label: "관리자", icon: ShieldCheck, href: "/admin" },
    { label: "위키", icon: BookOpen },
    { label: "데이터베이스", icon: Database },
    { label: "템플릿", icon: Box },
    { label: "휴지통", icon: Trash2 },
  ];
  return (
    <aside className="sidebar chat-global-sidebar">
      <div className="workspace-switcher"><span className="workspace-mark">F</span><span>FillWork</span><ChevronDown className="workspace-chevron" size={15} /></div>
      <button className="sidebar-search" type="button"><Search size={17} /><span>검색</span></button>
      <div className="nav-section"><a className="nav-item" href="/"><Home size={17} /><span>홈</span></a><a className="nav-item" href="/notifications"><Bell size={17} /><span>알림</span><span className="nav-badge">3</span></a><a className="nav-item" href="/settings"><Settings size={17} /><span>설정</span></a></div>
      <div className="nav-section"><p className="nav-label">팀 스페이스</p>{nav.map(({ label, icon: Icon, href, active }) => href ? <a className={`nav-item${active ? " active" : ""}`} href={href} key={label}><Icon size={17} /><span>{label}</span></a> : <button className="nav-item" type="button" key={label}><Icon size={17} /><span>{label}</span></button>)}</div>
      <div className="nav-section"><p className="nav-label">개인 페이지</p><button className="nav-item" type="button"><Star size={17} /><span>즐겨찾기</span></button></div>
      <div className="plan-card chat-plan"><span className="plan-kicker">메시지</span><div className="plan-row"><strong>이번 주 활동</strong><span>284건</span></div><div className="usage-track"><i style={{ width: "72%" }} /></div><p>응답률 94% · 평균 4분</p><button type="button">채팅 설정</button></div>
    </aside>
  );
}

function GlobalHeader() {
  return (
    <header className="header chat-global-header">
      <button className="mobile-menu" type="button" aria-label="메뉴 열기"><Menu size={20} /></button><div className="header-spacer" />
      <div className="mode-toggle" aria-label="업무 모드"><button type="button"><Building2 size={14} />사무실 모드</button><button className="active" type="button"><HardHat size={14} />현장 모드</button></div>
      <button className="global-search" type="button"><Search size={16} /><span>메시지 검색 (Ctrl + K)</span></button><button className="header-icon" type="button" aria-label="알림"><Bell size={19} /></button><AuthProfileButton />
    </header>
  );
}

function ChannelGroup({ title, channels, project }: { title: string; channels: Channel[]; project?: boolean }) {
  return <section className="channel-group"><div className="channel-group-title"><span><ChevronDown size={11} />{title}</span><Plus size={13} /></div>{channels.map(({ label, icon: Icon, badge, active }) => <button className={`channel-item${active ? " active" : ""}`} type="button" key={label}>{Icon ? <Icon size={14} /> : <Hash size={13} />}<span>{label}</span>{project && label === "성수 물류센터" ? <i /> : null}{badge ? <b>{badge}</b> : null}</button>)}</section>;
}

function ChannelRail() {
  return (
    <aside className="channel-rail">
      <div className="channel-heading"><div><MessageSquare size={15} /><strong>채팅</strong></div><button type="button"><Plus size={15} /></button></div>
      <button className="channel-search" type="button"><Search size={14} />대화 검색</button>
      <ChannelGroup title="채널" channels={mainChannels} />
      <ChannelGroup title="프로젝트 채널" channels={projectChannels} project />
      <section className="channel-group dm-group"><div className="channel-group-title"><span><ChevronDown size={11} />다이렉트 메시지</span><Plus size={13} /></div>{participants.slice(0, 3).map((person) => <button className="dm-item" type="button" key={person.name}><span className={`member-avatar ${person.tone}`}>{person.initials}<i /></span><span>{person.name}</span>{person.name === "박민수" ? <b>1</b> : null}</button>)}</section>
      <button className="browse-channels" type="button"><Hash size={13} />채널 둘러보기</button>
    </aside>
  );
}

function ChatHeader() {
  return (
    <div className="chat-channel-header">
      <div className="chat-channel-title"><span><HardHat size={16} /></span><div><div><h1>현장지원</h1><b>LIVE</b></div><p>현장 이슈와 긴급 지원을 빠르게 공유합니다.</p></div></div>
      <div className="chat-channel-actions"><button type="button"><Users size={14} /><span>12</span></button><button type="button"><Pin size={14} /><span>3</span></button><button type="button"><Search size={15} /></button><button type="button"><MoreHorizontal size={16} /></button><button className="urgent-call" type="button"><Zap size={14} />긴급 호출</button></div>
    </div>
  );
}

function Avatar({ name, tone }: { name: string; tone: string }) {
  return <span className={`message-avatar ${tone}`}>{name}<i /></span>;
}

function Reaction({ emoji, count, active }: { emoji: string; count: number; active?: boolean }) {
  return <button className={`reaction${active ? " active" : ""}`} type="button"><span>{emoji}</span>{count}</button>;
}

function ChatMessages() {
  return (
    <div className="chat-messages">
      <div className="channel-intro"><span><HardHat size={20} /></span><h2># 현장지원 채널</h2><p>현장에서 생긴 문제, 사진, 위치와 음성 기록을 팀에 공유하세요.</p><button type="button"><UserPlus size={13} />팀원 초대</button></div>
      <div className="date-divider"><span>2026년 6월 13일 토요일</span></div>

      <article className="message-row"><Avatar name="김" tone="blue" /><div className="message-content"><div className="message-meta"><strong>김지연</strong><span>현장 매니저</span><time>오전 9:18</time></div><p>성수 물류센터 도착했습니다. A동 네트워크 장비부터 점검 시작할게요.</p><div className="location-card"><span><MapPin size={17} /></span><div><strong>성수 물류센터 A동</strong><p>서울 성동구 성수이로 88 · 현재 위치</p></div><button type="button">지도 보기</button></div><div className="message-reactions"><Reaction emoji="👍" count={4} active /><Reaction emoji="📍" count={2} /><button type="button"><Smile size={12} /></button></div></div></article>

      <article className="message-row"><Avatar name="박" tone="orange" /><div className="message-content"><div className="message-meta"><strong>박민수</strong><span>기술 지원</span><time>오전 9:24</time></div><p>확인했습니다. 장비 전면과 배선함 사진을 먼저 올려주세요. AI 분류 후 원격으로 같이 보겠습니다.</p><span className="read-state"><CheckCheck size={13} />12명 읽음</span></div></article>

      <article className="message-row highlight"><Avatar name="김" tone="blue" /><div className="message-content"><div className="message-meta"><strong>김지연</strong><span>현장 매니저</span><time>오전 9:41</time><b className="field-label">현장 사진</b></div><p>장비실 사진 8장을 업로드했습니다. 케이블 포트 쪽 발열 흔적이 보여요.</p><div className="photo-classification"><div className="photo-grid"><div className="field-photo photo-one"><span>장비 전면</span><ImageIcon size={18} /></div><div className="field-photo photo-two"><span>배선함</span><ImageIcon size={18} /></div><div className="field-photo photo-three"><span>포트 근접</span><ImageIcon size={18} /><b>+5</b></div></div><div className="ai-classification"><span><Sparkles size={13} />AI 현장 사진 분류</span><strong>네트워크 장비 5 · 배선 2 · 이상 징후 1</strong><p>발열 의심 영역을 자동으로 표시했습니다.</p></div></div><div className="message-reactions"><Reaction emoji="👀" count={6} active /><Reaction emoji="⚠️" count={3} /><Reaction emoji="✅" count={2} /></div></div></article>

      <div className="unread-divider"><span>새 메시지 2개</span></div>

      <article className="message-row"><Avatar name="이" tone="violet" /><div className="message-content"><div className="message-meta"><strong>이서연</strong><span>고객 성공</span><time>오전 10:03</time></div><p>고객 담당자에게 11시까지 1차 점검 결과를 안내하기로 했습니다. 아래 양식에 업데이트 부탁드려요.</p><div className="file-attachment"><span><FileText size={18} /></span><div><strong>현장 장애 1차 보고서.docx</strong><p>DOCX · 284KB · 이서연</p></div><button type="button"><ChevronRight size={15} /></button></div></div></article>

      <article className="message-row"><Avatar name="최" tone="green" /><div className="message-content"><div className="message-meta"><strong>최준호</strong><span>프로젝트 리드</span><time>오전 10:07</time></div><div className="voice-note"><button type="button"><Mic size={16} /></button><div className="voice-wave">{[8,14,20,11,24,17,9,19,13,22,10,16,7,18,12,21,9,15].map((height, i) => <i style={{ height }} key={i} />)}</div><time>0:38</time></div><div className="ai-transcript"><span><Bot size={13} />AI 음성메모 텍스트 변환</span><p>“발열 포트는 즉시 분리하고 예비 장비로 전환해 주세요. 교체 전후 속도 측정값과 사진을 보고서에 함께 첨부하면 됩니다.”</p><button type="button">전체 내용 보기</button></div><span className="read-state"><CheckCheck size={13} />8명 읽음</span></div></article>
    </div>
  );
}

function Composer() {
  return (
    <div className="chat-composer-wrap"><div className="chat-composer"><div className="composer-tools"><button type="button"><Plus size={16} /></button><button type="button"><Paperclip size={15} /></button><button type="button"><ImageIcon size={15} /></button><button type="button"><MapPin size={15} /></button><button className="voice-tool" type="button"><Mic size={15} /></button><span /><button type="button"><Smile size={15} /></button></div><div className="composer-input"><span>#현장지원에 메시지 보내기</span><div><small><Sparkles size={11} />AI 문장 다듬기</small><button type="button"><Send size={15} /></button></div></div></div><p>Enter로 전송 · Shift + Enter로 줄바꿈</p></div>
  );
}

function ContextPanel() {
  return (
    <aside className="chat-context-panel">
      <div className="context-heading"><strong>채널 정보</strong><button type="button"><X size={14} /></button></div>
      <section className="context-section"><div className="context-title"><h3>참여자</h3><button type="button">12명 <ChevronRight size={12} /></button></div><div className="participant-stack">{participants.map((person) => <button className="participant-row" type="button" key={person.name}><span className={`member-avatar ${person.tone}`}>{person.initials}{person.online ? <i /> : null}</span><div><strong>{person.name}</strong><p>{person.role}</p></div><MessageCircle size={13} /></button>)}</div><button className="invite-member" type="button"><UserPlus size={13} />참여자 추가</button></section>
      <section className="context-section"><div className="context-title"><h3>공유 파일</h3><button type="button">전체 보기</button></div><button className="shared-file" type="button"><span className="image"><FileImage size={15} /></span><div><strong>장비실 점검 사진</strong><p>사진 8장 · 오늘</p></div></button><button className="shared-file" type="button"><span className="document"><FileText size={15} /></span><div><strong>현장 장애 1차 보고서</strong><p>DOCX · 284KB</p></div></button><button className="shared-file" type="button"><span className="link"><Link2 size={15} /></span><div><strong>성수센터 작업 가이드</strong><p>FillWork 문서</p></div></button></section>
      <section className="context-section pinned-section"><div className="context-title"><h3>고정 메시지</h3><button type="button">3 <ChevronRight size={12} /></button></div><article className="pinned-message"><Pin size={13} /><div><strong>긴급 장애 대응 절차</strong><p>장비 전원 차단 전 기술지원팀 확인 필수</p><span>박민수 · 6월 10일</span></div></article><article className="pinned-message"><Pin size={13} /><div><strong>현장 사진 촬영 기준</strong><p>전체, 근접, 라벨 사진을 순서대로 업로드</p><span>김지연 · 6월 8일</span></div></article></section>
      <div className="channel-health"><div><span><CircleAlert size={14} />현장 응답 상태</span><strong>양호</strong></div><p>평균 응답 4분 · 미확인 긴급 호출 없음</p><i><b /></i></div>
    </aside>
  );
}

export function ChatWorkspace() {
  return (
    <div className="stage chat-stage">
      <div className="concept-label"><span>Chat</span><div><strong>현장지원 채널</strong><p>메시지에서 현장 조치까지 하나의 흐름으로 연결합니다.</p></div></div>
      <div className="app-window chat-window">
        <GlobalSidebar /><GlobalHeader /><ChannelRail /><ChatHeader />
        <main className="chat-main"><ChatMessages /><Composer /></main>
        <ContextPanel /><button className="mobile-close" type="button" aria-label="닫기"><X size={18} /></button>
      </div>
    </div>
  );
}
