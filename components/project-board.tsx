"use client";

import {
  Bell,
  BookOpen,
  Box,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  FileText,
  Files,
  Filter,
  FolderKanban,
  HardHat,
  Home,
  LayoutDashboard,
  List,
  MapPin,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { AuthProfileButton } from "@/components/auth/auth-profile-button";
import { type DragEvent, useMemo, useState } from "react";

type Status = "todo" | "doing" | "done";
type Priority = "긴급" | "높음" | "보통" | "낮음";
type Task = {
  id: number;
  title: string;
  status: Status;
  assignee: string;
  initials: string;
  due: string;
  priority: Priority;
  tag: string;
  location?: string;
  attachments?: number;
};

const initialTasks: Task[] = [
  { id: 1, title: "현장 안전 점검 체크리스트 정리", status: "todo", assignee: "김지연", initials: "김", due: "6월 14일", priority: "긴급", tag: "현장 운영", location: "성수 물류센터", attachments: 4 },
  { id: 2, title: "고객사 주간 보고서 초안 작성", status: "todo", assignee: "이서연", initials: "이", due: "6월 17일", priority: "높음", tag: "문서", attachments: 2 },
  { id: 3, title: "마포 현장 사진 자동 분류 검수", status: "todo", assignee: "박민수", initials: "박", due: "오늘", priority: "보통", tag: "사진", location: "마포 리모델링", attachments: 18 },
  { id: 4, title: "프로젝트 일정 및 담당자 업데이트", status: "doing", assignee: "최준호", initials: "최", due: "6월 15일", priority: "높음", tag: "기획" },
  { id: 5, title: "신규 고객 온보딩 자료 제작", status: "doing", assignee: "이서연", initials: "이", due: "6월 18일", priority: "보통", tag: "고객 관리", attachments: 3 },
  { id: 6, title: "속도측정 결과 AI 요약 확인", status: "doing", assignee: "김지연", initials: "김", due: "오늘", priority: "긴급", tag: "AI 분석", location: "강남 고객사" },
  { id: 7, title: "5월 현장 운영 가이드 배포", status: "done", assignee: "박민수", initials: "박", due: "6월 11일", priority: "보통", tag: "운영" },
  { id: 8, title: "브랜드 가이드라인 개정 승인", status: "done", assignee: "최준호", initials: "최", due: "6월 10일", priority: "낮음", tag: "디자인", attachments: 1 },
];

const columns: Array<{ id: Status; title: string; description: string; tone: string }> = [
  { id: "todo", title: "할 일", description: "시작을 기다리는 업무", tone: "slate" },
  { id: "doing", title: "진행 중", description: "현재 작업하고 있는 업무", tone: "blue" },
  { id: "done", title: "완료", description: "마무리된 업무", tone: "green" },
];

const nav: Array<{ label: string; icon: LucideIcon; active?: boolean; href?: string }> = [
  { label: "대시보드", icon: LayoutDashboard, href: "/" },
  { label: "프로젝트", icon: FolderKanban, active: true, href: "/projects" },
  { label: "문서", icon: FileText, href: "/documents" },
  { label: "채팅", icon: MessageSquare, href: "/chat" },
  { label: "파일", icon: Files, href: "/files" },
  { label: "관리자", icon: ShieldCheck, href: "/admin" },
  { label: "위키", icon: BookOpen },
  { label: "데이터베이스", icon: Database },
  { label: "템플릿", icon: Box },
  { label: "휴지통", icon: Trash2 },
];

function ProjectSidebar() {
  return (
    <aside className="sidebar project-sidebar">
      <div className="workspace-switcher"><span className="workspace-mark">F</span><span>FillWork</span><ChevronDown className="workspace-chevron" size={15} /></div>
      <button className="sidebar-search" type="button"><Search size={17} /><span>검색</span></button>
      <div className="nav-section">
        <a className="nav-item" href="/"><Home size={17} /><span>홈</span></a>
        <a className="nav-item" href="/notifications"><Bell size={17} /><span>알림</span><span className="nav-badge">3</span></a>
        <a className="nav-item" href="/settings"><Settings size={17} /><span>설정</span></a>
      </div>
      <div className="nav-section"><p className="nav-label">팀 스페이스</p>{nav.map(({ label, icon: Icon, active, href }) => href ? <a className={`nav-item${active ? " active" : ""}`} href={href} key={label}><Icon size={17} /><span>{label}</span></a> : <button className="nav-item" key={label} type="button"><Icon size={17} /><span>{label}</span></button>)}</div>
      <div className="nav-section"><p className="nav-label">개인 페이지</p><button className="nav-item" type="button"><Star size={17} /><span>즐겨찾기</span></button><button className="nav-item" type="button"><Clock3 size={17} /><span>최근 페이지</span></button></div>
      <div className="plan-card"><span className="plan-kicker">프로젝트</span><div className="plan-row"><strong>웹사이트 리뉴얼</strong><span>62%</span></div><div className="usage-track"><i style={{ width: "62%" }} /></div><p>업무 8개 중 2개 완료</p><button type="button">프로젝트 설정</button></div>
    </aside>
  );
}

function ProjectHeader() {
  return (
    <header className="header project-global-header">
      <button className="mobile-menu" type="button" aria-label="메뉴 열기"><Menu size={20} /></button>
      <div className="header-spacer" />
      <div className="mode-toggle" aria-label="업무 모드"><button type="button"><Building2 size={14} />사무실 모드</button><button className="active" type="button"><HardHat size={14} />현장 모드</button></div>
      <button className="global-search" type="button"><Search size={16} /><span>검색 (Ctrl + K)</span></button>
      <button className="header-icon" type="button" aria-label="알림"><Bell size={19} /></button>
      <AuthProfileButton />
    </header>
  );
}

function TaskCard({ task, onDragStart }: { task: Task; onDragStart: (event: DragEvent<HTMLElement>, id: number) => void }) {
  return (
    <article className="task-card" draggable onDragStart={(event) => onDragStart(event, task.id)}>
      <div className="task-card-top"><span className={`priority ${task.priority}`}>{task.priority}</span><button type="button" aria-label="업무 메뉴"><MoreHorizontal size={16} /></button></div>
      <h4>{task.title}</h4>
      <span className="task-tag">{task.tag}</span>
      {task.location ? <p className="task-location"><MapPin size={12} />{task.location}</p> : null}
      <div className="task-meta"><span className="task-avatar" title={task.assignee}>{task.initials}</span><span className="task-assignee">{task.assignee}</span><span className={`task-due${task.due === "오늘" ? " today" : ""}`}><CalendarDays size={13} />{task.due}</span>{task.attachments ? <span className="task-attachments"><Paperclip size={12} />{task.attachments}</span> : null}</div>
    </article>
  );
}

export function ProjectBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overColumn, setOverColumn] = useState<Status | null>(null);
  const grouped = useMemo(() => Object.fromEntries(columns.map((column) => [column.id, tasks.filter((task) => task.status === column.id)])) as Record<Status, Task[]>, [tasks]);

  const startDrag = (event: DragEvent<HTMLElement>, id: number) => {
    setDraggingId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(id));
  };
  const dropTask = (event: DragEvent<HTMLElement>, status: Status) => {
    event.preventDefault();
    const id = Number(event.dataTransfer.getData("text/plain") || draggingId);
    if (id) setTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task));
    setDraggingId(null);
    setOverColumn(null);
  };

  return (
    <div className="stage project-stage">
      <div className="concept-label"><span>Project</span><div><strong>웹사이트 리뉴얼</strong><p>업무 흐름과 현장 진행을 한눈에 관리합니다.</p></div></div>
      <div className="app-window project-window">
        <ProjectSidebar />
        <ProjectHeader />
        <main className="project-main">
          <section className="project-heading">
            <div className="project-title"><span className="project-symbol"><FolderKanban size={19} /></span><div><div><h1>웹사이트 리뉴얼</h1><span className="project-status">진행 중</span></div><p>브랜드 경험 개선과 현장 콘텐츠 통합 프로젝트</p></div></div>
            <div className="project-heading-actions"><div className="project-members"><span>김</span><span>박</span><span>이</span><span>최</span></div><button className="project-primary" type="button"><Plus size={16} />새 업무</button></div>
          </section>
          <section className="project-toolbar">
            <div className="view-tabs"><button className="active" type="button"><FolderKanban size={14} />보드</button><button type="button"><List size={14} />리스트</button><button type="button"><CalendarDays size={14} />캘린더</button></div>
            <span className="toolbar-divider" /><button type="button"><Filter size={14} />필터</button><button type="button"><Users size={14} />담당자</button><span className="project-summary"><CheckCircle2 size={14} />전체 8개 · 완료 2개</span>
          </section>
          <section className="kanban-board" aria-label="프로젝트 칸반 보드">
            {columns.map((column) => (
              <div className={`kanban-column${overColumn === column.id ? " drag-over" : ""}`} key={column.id} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; setOverColumn(column.id); }} onDragLeave={() => setOverColumn(null)} onDrop={(event) => dropTask(event, column.id)}>
                <div className="column-header"><div><span className={`column-dot ${column.tone}`} /><h3>{column.title}</h3><b>{grouped[column.id].length}</b></div><button type="button" aria-label={`${column.title}에 업무 추가`}><Plus size={16} /></button></div>
                <p className="column-description">{column.description}</p>
                <div className="task-list">{grouped[column.id].map((task) => <TaskCard key={task.id} task={task} onDragStart={startDrag} />)}<button className="add-task-card" type="button"><Plus size={15} />업무 추가</button></div>
              </div>
            ))}
          </section>
        </main>
        <button className="mobile-close" type="button" aria-label="닫기"><X size={18} /></button>
      </div>
    </div>
  );
}
