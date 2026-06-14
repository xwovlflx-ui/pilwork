import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  Box,
  Building2,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock3,
  Code2,
  Columns3,
  Database,
  FileClock,
  FileImage,
  FileText,
  Files,
  FolderKanban,
  HardHat,
  Highlighter,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  ListTree,
  Menu,
  MessageSquare,
  MoreHorizontal,
  PenLine,
  Plus,
  Quote,
  Search,
  Settings,
  ShieldCheck,
  Share2,
  Signature,
  Sparkles,
  Star,
  Table2,
  Trash2,
  Upload,
  WandSparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { AuthProfileButton } from "@/components/auth/auth-profile-button";

type TreeItem = { label: string; icon: LucideIcon; active?: boolean; children?: string[] };

const personalPages: TreeItem[] = [
  { label: "업무 메모", icon: FileText, children: ["이번 주 할 일", "아이디어 노트"] },
  { label: "개인 회의록", icon: FileText },
];

const teamPages: TreeItem[] = [
  { label: "현장 운영 가이드", icon: BookOpen, active: true, children: ["안전 점검 기준", "사진 촬영 규칙", "고객 확인 절차"] },
  { label: "주간 업무 회의록", icon: FileText },
  { label: "프로젝트 위키", icon: ListTree },
];

function GlobalSidebar() {
  const nav: Array<{ label: string; icon: LucideIcon; href?: string; active?: boolean }> = [
    { label: "대시보드", icon: LayoutDashboard, href: "/" },
    { label: "프로젝트", icon: FolderKanban, href: "/projects" },
    { label: "문서", icon: FileText, href: "/documents", active: true },
    { label: "채팅", icon: MessageSquare, href: "/chat" },
    { label: "파일", icon: Files, href: "/files" },
    { label: "관리자", icon: ShieldCheck, href: "/admin" },
    { label: "위키", icon: BookOpen },
    { label: "데이터베이스", icon: Database },
    { label: "템플릿", icon: Box },
    { label: "휴지통", icon: Trash2 },
  ];
  return (
    <aside className="sidebar document-global-sidebar">
      <div className="workspace-switcher"><span className="workspace-mark">F</span><span>FillWork</span><ChevronDown className="workspace-chevron" size={15} /></div>
      <button className="sidebar-search" type="button"><Search size={17} /><span>검색</span></button>
      <div className="nav-section"><a className="nav-item" href="/"><Home size={17} /><span>홈</span></a><a className="nav-item" href="/notifications"><Bell size={17} /><span>알림</span><span className="nav-badge">3</span></a><a className="nav-item" href="/settings"><Settings size={17} /><span>설정</span></a></div>
      <div className="nav-section"><p className="nav-label">팀 스페이스</p>{nav.map(({ label, icon: Icon, href, active }) => href ? <a className={`nav-item${active ? " active" : ""}`} href={href} key={label}><Icon size={17} /><span>{label}</span></a> : <button className="nav-item" type="button" key={label}><Icon size={17} /><span>{label}</span></button>)}</div>
      <div className="nav-section"><p className="nav-label">개인 페이지</p><button className="nav-item" type="button"><Star size={17} /><span>즐겨찾기</span></button><button className="nav-item" type="button"><Clock3 size={17} /><span>최근 페이지</span></button></div>
      <div className="plan-card"><span className="plan-kicker">문서 공간</span><div className="plan-row"><strong>팀 문서</strong><span>128개</span></div><div className="usage-track"><i style={{ width: "48%" }} /></div><p>최근 7일간 문서 14개 생성</p><button type="button">문서 설정</button></div>
    </aside>
  );
}

function GlobalHeader() {
  return (
    <header className="header document-global-header">
      <button className="mobile-menu" type="button" aria-label="메뉴 열기"><Menu size={20} /></button><div className="header-spacer" />
      <div className="mode-toggle" aria-label="업무 모드"><button type="button"><Building2 size={14} />사무실 모드</button><button className="active" type="button"><HardHat size={14} />현장 모드</button></div>
      <button className="global-search" type="button"><Search size={16} /><span>검색 (Ctrl + K)</span></button><button className="header-icon" type="button" aria-label="알림"><Bell size={19} /></button><AuthProfileButton />
    </header>
  );
}

function DocumentActionbar() {
  return (
    <div className="document-actionbar">
      <div className="document-breadcrumb"><BookOpen size={14} /><span>팀 문서</span><ChevronRight size={13} /><strong>현장 운영 가이드</strong></div>
      <span className="document-saved"><Check size={12} />저장됨</span>
      <div className="document-actions"><button type="button"><Share2 size={14} />공유</button><button type="button"><MessageSquare size={14} />댓글 <b>4</b></button><button type="button"><FileClock size={14} />버전관리</button><button className="ai-write" type="button"><Sparkles size={14} />AI 작성</button><button className="star-action" type="button" aria-label="즐겨찾기"><Star size={16} /></button><button type="button" aria-label="더보기"><MoreHorizontal size={17} /></button></div>
    </div>
  );
}

function TreeGroup({ title, items }: { title: string; items: TreeItem[] }) {
  return <div className="tree-group"><div className="tree-group-title"><span>{title}</span><Plus size={13} /></div>{items.map(({ label, icon: Icon, active, children }) => <div key={label}><button className={`tree-item${active ? " active" : ""}`} type="button"><ChevronRight className={children ? "open" : "empty"} size={12} /><Icon size={14} /><span>{label}</span><MoreHorizontal size={13} /></button>{children ? <div className="tree-children">{children.map((child) => <button type="button" key={child}><FileText size={12} />{child}</button>)}</div> : null}</div>)}</div>;
}

function PageTree() {
  return (
    <aside className="page-tree">
      <div className="page-tree-heading"><div><ListTree size={15} /><strong>문서</strong></div><button type="button"><Plus size={15} /></button></div>
      <button className="tree-search" type="button"><Search size={14} />페이지 검색</button>
      <TreeGroup title="즐겨찾기" items={[{ label: "현장 운영 가이드", icon: Star, active: true }]} />
      <TreeGroup title="개인 문서" items={personalPages} />
      <TreeGroup title="팀 문서" items={teamPages} />
      <TreeGroup title="최근 문서" items={[{ label: "고객사 미팅 노트", icon: Clock3 }, { label: "속도측정 보고서", icon: Activity }]} />
      <button className="new-page-tree" type="button"><Plus size={14} />새 페이지</button>
    </aside>
  );
}

function EvidenceBlocks() {
  return (
    <section className="field-evidence-block">
      <div className="editor-section-title"><span><HardHat size={15} /></span><div><h3>현장 증빙</h3><p>작업 전후 기록과 측정 결과를 문서에 연결합니다.</p></div><button type="button"><Upload size={13} />현장 사진 첨부</button></div>
      <div className="comparison-block">
        <div className="site-photo before"><span>작업 전</span><div><ImageIcon size={19} /><small>6월 12일 · 09:20</small></div></div>
        <div className="compare-arrow"><ChevronRight size={16} /></div>
        <div className="site-photo after"><span>작업 후</span><div><Check size={19} /><small>6월 12일 · 16:40</small></div></div>
      </div>
      <div className="evidence-row"><article><Activity size={15} /><div><span>속도측정 결과</span><strong>다운로드 487 Mbps</strong><small>업로드 92 Mbps · 지연 8ms</small></div><b>정상</b></article><article><Signature size={15} /><div><span>고객 확인 서명</span><strong>정민호 고객 확인 완료</strong><small>2026.06.12 17:05</small></div><b className="signed">서명됨</b></article></div>
    </section>
  );
}

function Editor() {
  return (
    <main className="document-editor">
      <div className="document-cover"><span>현장 운영 · 표준 가이드</span><div className="cover-lines"><i /><i /><i /></div></div>
      <article className="editor-page">
        <div className="document-icon-large">🏗️</div>
        <div className="title-tools"><button type="button"><ImageIcon size={12} />커버 변경</button><button type="button"><MessageSquare size={12} />댓글</button></div>
        <h1>현장 운영 가이드</h1>
        <div className="document-meta-line"><span>김지연 작성</span><i /> <span>6월 13일 업데이트</span><i /><span>읽는 시간 6분</span></div>
        <p className="lead-copy">현장 방문부터 사진 기록, 속도측정, 고객 확인까지 FillWork에서 일관된 방식으로 처리하기 위한 운영 기준입니다.</p>
        <div className="editor-divider" />
        <section className="editor-block"><h2>방문 전 체크리스트</h2><label className="check-row checked"><span><Check size={12} /></span>방문 일정과 담당자 확인</label><label className="check-row checked"><span><Check size={12} /></span>필수 장비와 측정 도구 준비</label><label className="check-row"><span /></label><p className="check-placeholder">고객 연락처 및 출입 방법 재확인</p></section>
        <div className="editor-two-column">
          <section className="editor-block compact"><h2><Table2 size={15} />현장 담당 정보</h2><div className="notion-table"><div><b>구분</b><b>내용</b></div><div><span>현장</span><span>성수 물류센터</span></div><div><span>담당자</span><span>김지연 매니저</span></div><div><span>방문 시간</span><span>10:30 - 17:00</span></div></div></section>
          <section className="editor-block compact"><h2><Code2 size={15} />측정 명령어</h2><pre><span>network</span>.test({`{`}<br />  mode: <b>&quot;full&quot;</b>,<br />  save: <em>true</em><br />{`}`});</pre></section>
        </div>
        <blockquote><Quote size={17} /><p>사진은 동일한 위치와 각도에서 촬영해야 전후 비교와 AI 분석 정확도가 높아집니다.</p></blockquote>
        <button className="toggle-block" type="button"><ChevronRight size={14} /><strong>촬영 품질 기준 자세히 보기</strong><span>ISO, 해상도, 구도 가이드 6개 항목</span></button>
        <EvidenceBlocks />
        <div className="slash-hint"><Plus size={14} />블록을 추가하려면 <b>/</b> 를 입력하세요</div>
      </article>
    </main>
  );
}

function AiAssistant() {
  const actions = [
    { title: "회의록 요약", text: "핵심 결정과 후속 업무 추출", icon: Highlighter, tone: "blue" },
    { title: "공지 초안 작성", text: "이 문서를 팀 공지로 변환", icon: PenLine, tone: "violet" },
    { title: "문서 개선 제안", text: "누락된 현장 기준 3개 발견", icon: WandSparkles, tone: "green" },
  ];
  return (
    <aside className="document-ai-panel">
      <div className="ai-panel-heading"><span><Bot size={17} /></span><div><strong>AI 문서 비서</strong><small>문서 내용을 이해하고 있어요</small></div><button type="button"><X size={14} /></button></div>
      <div className="document-score"><div><span>문서 완성도</span><strong>86%</strong></div><i><b /></i><p><Check size={12} />구조와 현장 정보가 잘 정리되어 있습니다.</p></div>
      <div className="ai-panel-section"><h3>빠른 작업</h3>{actions.map(({ title, text, icon: Icon, tone }) => <button className="ai-doc-action" type="button" key={title}><span className={tone}><Icon size={14} /></span><div><strong>{title}</strong><p>{text}</p></div><ChevronRight size={14} /></button>)}</div>
      <div className="ai-panel-section"><div className="ai-section-title"><h3>개선 제안</h3><span>3</span></div><div className="ai-suggestion"><Sparkles size={13} /><p><strong>안전 기준 보강</strong>보호 장비 착용 확인 항목을 체크리스트에 추가해 보세요.</p></div><div className="ai-suggestion"><FileImage size={13} /><p><strong>사진 설명 생성</strong>첨부된 전후 사진에 AI 설명을 자동 생성할 수 있습니다.</p></div></div>
      <div className="ai-chat-box"><p>이 문서에서 무엇을 도와드릴까요?</p><div><button type="button"><Plus size={14} /></button><span>AI에게 요청하기...</span><button type="button"><Sparkles size={14} /></button></div></div>
    </aside>
  );
}

export function DocumentWorkspace() {
  return (
    <div className="stage document-stage">
      <div className="concept-label"><span>Document</span><div><strong>현장 운영 가이드</strong><p>문서와 현장 증빙을 하나의 흐름으로 작성합니다.</p></div></div>
      <div className="app-window document-window">
        <GlobalSidebar /><GlobalHeader /><DocumentActionbar /><PageTree /><Editor /><AiAssistant />
        <button className="mobile-close" type="button" aria-label="닫기"><X size={18} /></button>
      </div>
    </div>
  );
}
