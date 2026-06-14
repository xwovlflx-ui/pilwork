import {
  Bell,
  Bot,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Database,
  FileArchive,
  Filter,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Trash2,
  UserRoundSearch,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type WorkspaceSpec = {
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  action: string;
  metrics: Array<{ label: string; value: string; hint: string }>;
  items: Array<{ title: string; meta: string; status: string; tone: string }>;
};

const specs: Record<string, WorkspaceSpec> = {
  wiki: { title: "팀 위키", description: "현장 매뉴얼과 회사의 운영 지식을 한곳에서 관리합니다.", eyebrow: "KNOWLEDGE BASE", icon: BookOpen, action: "새 위키 페이지", metrics: [{ label: "전체 페이지", value: "48", hint: "이번 주 +6" }, { label: "현장 매뉴얼", value: "17", hint: "최신화 92%" }, { label: "즐겨찾기", value: "8", hint: "내 바로가기" }], items: [{ title: "현장 사진 촬영 기준", meta: "안전운영팀 · 12분 전", status: "최신", tone: "green" }, { title: "고객 확인 서명 절차", meta: "서비스팀 · 어제", status: "검토", tone: "blue" }, { title: "장애 등급별 대응 매뉴얼", meta: "기술지원팀 · 2일 전", status: "필수", tone: "orange" }] },
  database: { title: "업무 데이터베이스", description: "고객, 장비, 현장 정보를 연결된 데이터로 조회합니다.", eyebrow: "CONNECTED DATA", icon: Database, action: "새 데이터베이스", metrics: [{ label: "고객사", value: "126", hint: "활성 118" }, { label: "관리 장비", value: "342", hint: "점검 예정 14" }, { label: "현장 레코드", value: "1,284", hint: "이번 달 +96" }], items: [{ title: "고객사 관리 DB", meta: "126개 레코드 · 8개 속성", status: "공유", tone: "blue" }, { title: "현장 장비 목록", meta: "342개 레코드 · 자동화 3개", status: "자동화", tone: "purple" }, { title: "방문 이력", meta: "1,284개 레코드 · 최근 갱신 4분 전", status: "실시간", tone: "green" }] },
  calendar: { title: "통합 캘린더", description: "현장 방문, 프로젝트 일정, 결재 마감일을 함께 확인합니다.", eyebrow: "FIELD SCHEDULE", icon: CalendarDays, action: "일정 추가", metrics: [{ label: "오늘 방문", value: "4", hint: "다음 10:30" }, { label: "이번 주 일정", value: "18", hint: "현장 12" }, { label: "마감 임박", value: "3", hint: "확인 필요" }], items: [{ title: "성수 물류센터 안전 점검", meta: "오늘 10:30 · 김지연", status: "현장", tone: "blue" }, { title: "마포 리모델링 사진 기록", meta: "오늘 13:00 · 박민수", status: "방문", tone: "orange" }, { title: "주간 프로젝트 회의", meta: "오늘 16:30 · 회의실 A", status: "회의", tone: "purple" }] },
  approvals: { title: "전자결재", description: "현장 보고서와 비용 요청을 빠르게 검토하고 승인합니다.", eyebrow: "APPROVAL CENTER", icon: ClipboardCheck, action: "결재 요청", metrics: [{ label: "승인 대기", value: "5", hint: "긴급 1건" }, { label: "내 요청", value: "3", hint: "진행 중 2" }, { label: "이번 달 완료", value: "42", hint: "평균 3.2시간" }], items: [{ title: "성수 현장 추가 자재 구매", meta: "박민수 · 280,000원", status: "승인 대기", tone: "orange" }, { title: "강남 고객사 작업 완료 보고", meta: "이서연 · 고객 서명 포함", status: "검토 중", tone: "blue" }, { title: "6월 장비 점검 계획", meta: "김지연 · 4개 현장", status: "승인", tone: "green" }] },
  crm: { title: "고객 관리", description: "상담부터 현장 완료까지 고객 접점을 놓치지 않습니다.", eyebrow: "CUSTOMER WORKSPACE", icon: UserRoundSearch, action: "고객 등록", metrics: [{ label: "활성 고객", value: "118", hint: "신규 +8" }, { label: "상담 진행", value: "14", hint: "오늘 3건" }, { label: "후속 연락", value: "7", hint: "기한 초과 1" }], items: [{ title: "브라이트 물류", meta: "정기 점검 · 담당 김서현", status: "계약", tone: "green" }, { title: "마포 디자인랩", meta: "견적 검토 · 마지막 상담 2시간 전", status: "제안", tone: "blue" }, { title: "한강 리테일", meta: "현장 실사 예정 · 6월 15일", status: "상담", tone: "purple" }] },
  statistics: { title: "업무 통계", description: "현장 처리량과 팀 생산성을 데이터로 확인합니다.", eyebrow: "WORK ANALYTICS", icon: Database, action: "리포트 생성", metrics: [{ label: "완료 업무", value: "184", hint: "전월 대비 +12%" }, { label: "평균 처리", value: "3.8h", hint: "0.6h 단축" }, { label: "현장 완료율", value: "92%", hint: "목표 +2%" }], items: [{ title: "프로젝트 진행률", meta: "진행 중 8개 · 평균 68%", status: "양호", tone: "green" }, { title: "기사별 업무 처리량", meta: "김지연 42 · 박민수 38 · 이서연 35", status: "이번 달", tone: "blue" }, { title: "사진 업로드 및 AI 분석", meta: "1,248장 · 자동 분류율 96%", status: "자동화", tone: "purple" }] },
  ai: { title: "AI 업무 비서", description: "현장 기록을 요약하고 다음 업무를 먼저 제안합니다.", eyebrow: "PROACTIVE ASSISTANT", icon: Bot, action: "AI에게 요청", metrics: [{ label: "오늘 자동 요약", value: "6", hint: "사진 38장 분석" }, { label: "추천 업무", value: "3", hint: "우선 처리" }, { label: "절약 시간", value: "2.4h", hint: "이번 주" }], items: [{ title: "성수 현장 사진 18장 요약 완료", meta: "누수 의심 지점 2곳을 발견했습니다.", status: "확인 필요", tone: "orange" }, { title: "미처리 업무 3건 우선순위 제안", meta: "마감일과 고객 중요도를 반영했습니다.", status: "추천", tone: "purple" }, { title: "금일 작업 완료 공지 초안", meta: "현장별 완료 내역을 한 문단으로 정리했습니다.", status: "초안", tone: "blue" }] },
  notifications: { title: "알림 센터", description: "업무, 멘션, 결재, 현장 긴급 알림을 우선순위로 확인합니다.", eyebrow: "NOTIFICATION INBOX", icon: Bell, action: "모두 읽음", metrics: [{ label: "읽지 않음", value: "3", hint: "긴급 1" }, { label: "오늘 알림", value: "12", hint: "업무 7" }, { label: "멘션", value: "4", hint: "채팅 3" }], items: [{ title: "성수 현장 긴급 이슈가 등록되었습니다.", meta: "김지연 · 4분 전", status: "긴급", tone: "red" }, { title: "추가 자재 구매 결재가 도착했습니다.", meta: "박민수 · 18분 전", status: "결재", tone: "orange" }, { title: "현장 운영 가이드에서 멘션되었습니다.", meta: "이서연 · 1시간 전", status: "멘션", tone: "blue" }] },
  settings: { title: "사용자 설정", description: "프로필, 알림, 화면과 현장 앱 환경을 관리합니다.", eyebrow: "PERSONAL SETTINGS", icon: Settings, action: "변경 저장", metrics: [{ label: "앱 모드", value: "현장", hint: "기본 시작" }, { label: "푸시 알림", value: "ON", hint: "긴급 우선" }, { label: "오프라인 캐시", value: "128MB", hint: "정상" }], items: [{ title: "프로필 및 계정", meta: "이름, 연락처, 비밀번호", status: "설정", tone: "blue" }, { title: "알림 우선순위", meta: "긴급 호출과 배정 업무 알림", status: "사용 중", tone: "green" }, { title: "PWA 및 오프라인", meta: "설치 상태와 캐시 데이터 관리", status: "준비됨", tone: "purple" }] },
  templates: { title: "템플릿", description: "반복되는 현장 문서와 업무를 표준화합니다.", eyebrow: "WORK TEMPLATES", icon: FileArchive, action: "템플릿 만들기", metrics: [{ label: "전체", value: "14", hint: "공식 8" }, { label: "문서", value: "7", hint: "최근 사용 4" }, { label: "프로젝트", value: "4", hint: "현장형 3" }], items: [{ title: "현장 방문 결과 보고서", meta: "사진·속도측정·서명 포함", status: "인기", tone: "blue" }, { title: "네트워크 장애 대응", meta: "업무 8개 자동 생성", status: "프로젝트", tone: "purple" }, { title: "고객 작업 완료 확인서", meta: "고객 서명 블록 포함", status: "문서", tone: "green" }] },
  favorites: { title: "즐겨찾기", description: "자주 확인하는 문서와 프로젝트를 빠르게 엽니다.", eyebrow: "QUICK ACCESS", icon: Star, action: "정렬 변경", metrics: [{ label: "즐겨찾기", value: "8", hint: "문서 5" }, { label: "오늘 열람", value: "4", hint: "최근 10:12" }, { label: "공유 항목", value: "3", hint: "팀 공용" }], items: [{ title: "성수 물류센터 프로젝트", meta: "프로젝트 · 진행률 68%", status: "프로젝트", tone: "blue" }, { title: "현장 운영 가이드", meta: "위키 · 12분 전 업데이트", status: "위키", tone: "green" }, { title: "고객 관리 데이터베이스", meta: "데이터베이스 · 126개 레코드", status: "DB", tone: "purple" }] },
  recent: { title: "최근 페이지", description: "최근 작업한 항목을 시간순으로 이어서 확인합니다.", eyebrow: "RECENT ACTIVITY", icon: Clock3, action: "기록 관리", metrics: [{ label: "오늘 본 항목", value: "12", hint: "문서 6" }, { label: "편집 항목", value: "5", hint: "자동 저장" }, { label: "공유 항목", value: "3", hint: "팀 공개" }], items: [{ title: "주간 업무 회의록", meta: "문서 · 2분 전 편집", status: "최근", tone: "blue" }, { title: "성수 물류센터", meta: "프로젝트 · 18분 전 열람", status: "프로젝트", tone: "green" }, { title: "현장지원 채널", meta: "채팅 · 31분 전", status: "채팅", tone: "purple" }] },
  trash: { title: "휴지통", description: "삭제한 문서와 파일을 30일 동안 보관합니다.", eyebrow: "RECOVERY", icon: Trash2, action: "휴지통 비우기", metrics: [{ label: "삭제 항목", value: "6", hint: "문서 4" }, { label: "7일 내 만료", value: "2", hint: "확인 필요" }, { label: "사용량", value: "84MB", hint: "자동 정리" }], items: [{ title: "구버전 현장 체크리스트", meta: "문서 · 6월 10일 삭제", status: "20일 남음", tone: "blue" }, { title: "테스트 업로드 사진", meta: "파일 12개 · 6월 8일 삭제", status: "18일 남음", tone: "orange" }, { title: "임시 프로젝트", meta: "프로젝트 · 6월 2일 삭제", status: "12일 남음", tone: "red" }] },
};

export function generateStaticParams() {
  return Object.keys(specs).map((workspace) => ({ workspace }));
}

export default async function WorkspacePage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = await params;
  const spec = specs[workspace];
  if (!spec) notFound();
  const Icon = spec.icon;

  return <main className="feature-stage">
    <section className="feature-window">
      <header className="feature-header"><Link href="/"><span>F</span><strong>FillWork</strong></Link><div className="feature-header-search"><Search size={15} />검색 (Ctrl + K)</div><Link href="/notifications" aria-label="알림"><Bell size={18} /></Link></header>
      <aside className="feature-side"><Link href="/"><LayoutDashboard size={16} />대시보드</Link><Link href="/projects"><FolderKanban size={16} />프로젝트</Link><Link href="/documents"><BookOpen size={16} />문서</Link><Link href="/chat"><MessageSquare size={16} />채팅</Link><Link href="/files"><FileArchive size={16} />파일</Link><div /><Link href="/settings"><Settings size={16} />설정</Link></aside>
      <div className="feature-main">
        <div className="feature-title"><div className="feature-title-icon"><Icon size={23} /></div><div><p>{spec.eyebrow}</p><h1>{spec.title}</h1><span>{spec.description}</span></div><button type="button"><Plus size={15} />{spec.action}</button></div>
        <div className="feature-metrics">{spec.metrics.map((metric) => <article key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><p>{metric.hint}</p></article>)}</div>
        <section className="feature-list-card"><header><div><h2>업무 공간</h2><p>데모 테스트용 Mock Data</p></div><div><button type="button"><Filter size={14} />필터</button><button type="button"><Search size={14} /></button></div></header><div>{spec.items.map((item) => <article key={item.title}><span className={`feature-item-icon ${item.tone}`}><Icon size={16} /></span><div><strong>{item.title}</strong><p>{item.meta}</p></div><em className={item.tone}>{item.status}</em><CheckCircle2 size={15} /></article>)}</div></section>
        <aside className="feature-ai-note"><Sparkles size={18} /><div><strong>FillWork AI 제안</strong><p>현재 화면의 Mock Data를 기준으로 우선 확인할 항목을 정리했습니다. 실제 DB 연결 없이도 메뉴 이동과 현장 흐름을 테스트할 수 있습니다.</p></div><button type="button">제안 확인</button></aside>
      </div>
    </section>
  </main>;
}
