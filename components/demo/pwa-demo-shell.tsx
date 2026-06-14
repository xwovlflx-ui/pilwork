"use client";

import {
  Bell,
  Bot,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Database,
  Download,
  FileText,
  Files,
  FolderKanban,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquare,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Signal,
  SignalZero,
  Sparkles,
  UserRoundSearch,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { authApi } from "@/lib/auth-api";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type DemoNavItem = { label: string; href: string; icon: LucideIcon; adminOnly?: boolean };

const demoNavigation: DemoNavItem[] = [
  { label: "대시보드", href: "/", icon: LayoutDashboard },
  { label: "프로젝트", href: "/projects", icon: FolderKanban },
  { label: "문서", href: "/documents", icon: FileText },
  { label: "위키", href: "/wiki", icon: BookOpen },
  { label: "데이터베이스", href: "/database", icon: Database },
  { label: "캘린더", href: "/calendar", icon: CalendarDays },
  { label: "채팅", href: "/chat", icon: MessageSquare },
  { label: "파일", href: "/files", icon: Files },
  { label: "전자결재", href: "/approvals", icon: ClipboardCheck },
  { label: "CRM", href: "/crm", icon: UserRoundSearch },
  { label: "통계", href: "/statistics", icon: Database },
  { label: "AI 비서", href: "/ai", icon: Bot },
  { label: "알림센터", href: "/notifications", icon: Bell },
  { label: "설정", href: "/settings", icon: Settings },
  { label: "관리자", href: "/admin", icon: ShieldCheck, adminOnly: true },
];

export function PwaDemoShell() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [online, setOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);

    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    const openMobileDrawer = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(".mobile-menu")) setDrawerOpen(true);
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("appinstalled", onInstalled);
    document.addEventListener("click", openMobileDrawer);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("beforeinstallprompt", onInstall);
      window.removeEventListener("appinstalled", onInstalled);
      document.removeEventListener("click", openMobileDrawer);
    };
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setPanelOpen(false);
  }, [pathname]);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstallPrompt(null);
  };

  const reset = async () => {
    if (!window.confirm("데모 계정과 브라우저 Mock 데이터를 초기 상태로 되돌릴까요?")) return;
    setResetting(true);
    await authApi.resetDemo();
    window.location.assign("/login?reset=1");
  };

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ORG_ADMIN";
  const visibleNavigation = demoNavigation.filter((item) => !item.adminOnly || isAdmin);
  const publicScreen = ["/login", "/register", "/forgot-password", "/offline"].includes(pathname);

  return <>
    {!online && pathname !== "/offline" ? <div className="offline-banner" role="status"><SignalZero size={14} />오프라인 모드 · 방문한 화면과 로컬 Mock 데이터는 계속 사용할 수 있습니다.</div> : null}

    {!publicScreen ? <div className="demo-tools">
      <button className="demo-tool-trigger" type="button" aria-expanded={panelOpen} onClick={() => setPanelOpen((value) => !value)}>
        <Sparkles size={15} /><span>현장 데모</span><i className={online ? "online" : "offline"} />
      </button>
      {panelOpen ? <section className="demo-tool-panel" aria-label="현장 데모 도구">
        <header><div><span><CheckCircle2 size={16} /></span><div><strong>FillWork Demo v1.0</strong><p>3명 기사 · 1명 관리자 테스트 환경</p></div></div><button type="button" aria-label="닫기" onClick={() => setPanelOpen(false)}><X size={16} /></button></header>
        <div className={`demo-network ${online ? "online" : "offline"}`}>{online ? <Signal size={14} /> : <SignalZero size={14} />}<span>{online ? "온라인 · 동기화 가능" : "오프라인 · 로컬 작업 모드"}</span></div>
        <nav>{visibleNavigation.map(({ label, href, icon: Icon }) => <Link className={pathname === href ? "active" : ""} href={href} key={href}><Icon size={14} /><span>{label}</span><ChevronRight size={12} /></Link>)}</nav>
        <div className="demo-tool-actions">
          <button type="button" onClick={install} disabled={installed || !installPrompt}><Download size={14} />{installed ? "앱 설치됨" : installPrompt ? "이 기기에 설치" : "브라우저 메뉴에서 설치"}</button>
          <button className="danger" type="button" onClick={reset} disabled={resetting}><RefreshCcw className={resetting ? "spin" : ""} size={14} />{resetting ? "초기화 중" : "Mock Data 초기화"}</button>
        </div>
      </section> : null}
    </div> : null}

    <div className={`demo-drawer-backdrop${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />
    <aside className={`demo-mobile-drawer${drawerOpen ? " open" : ""}`} aria-hidden={!drawerOpen}>
      <header><Link href="/" aria-label="FillWork 홈"><span>F</span><strong>FillWork</strong></Link><button type="button" aria-label="메뉴 닫기" onClick={() => setDrawerOpen(false)}><X size={20} /></button></header>
      <div className={`demo-drawer-status ${online ? "online" : "offline"}`}>{online ? <Signal size={14} /> : <SignalZero size={14} />}{online ? "현장 연결 정상" : "오프라인 작업 중"}</div>
      <nav>{visibleNavigation.map(({ label, href, icon: Icon }) => <Link className={pathname === href ? "active" : ""} href={href} key={href}><Icon size={18} /><span>{label}</span>{pathname === href ? <i /> : null}</Link>)}</nav>
      <footer><button type="button" onClick={install} disabled={installed || !installPrompt}><Download size={15} />{installed ? "설치 완료" : "홈 화면에 설치"}</button><button type="button" onClick={reset}><RefreshCcw size={15} />데모 초기화</button></footer>
    </aside>
  </>;
}
