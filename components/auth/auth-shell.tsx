import { Bot, CheckCircle2, FileText, FolderKanban, Image as ImageIcon, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const activity = [
  { icon: ImageIcon, tone: "blue", title: "성수 현장 사진 18장", detail: "AI 자동 분류 완료" },
  { icon: FileText, tone: "violet", title: "주간 업무 보고서", detail: "검토 요청 2건" },
  { icon: FolderKanban, tone: "green", title: "네트워크 교체 프로젝트", detail: "진행률 76%" },
];

export function AuthShell({ eyebrow, title, description, children, compact = false }: { eyebrow: string; title: string; description: string; children: ReactNode; compact?: boolean }) {
  return <main className={`auth-page${compact ? " compact" : ""}`}>
    <section className="auth-brand-panel">
      <div className="auth-brand"><span>F</span><strong>FillWork</strong><small>WORK, FILLED.</small></div>
      <div className="auth-brand-copy">
        <span className="auth-kicker"><Sparkles size={13}/>문서와 현장을 하나의 흐름으로</span>
        <h1>팀의 모든 업무가<br/><em>선명하게 연결됩니다.</em></h1>
        <p>현장 기록부터 프로젝트, 문서와 대화까지.<br/>FillWork에서 오늘의 일을 완성하세요.</p>
      </div>
      <div className="auth-preview-card">
        <div className="auth-preview-head"><div><span className="auth-mini-logo">F</span><strong>오늘의 워크스페이스</strong></div><span><i/>실시간 동기화</span></div>
        <div className="auth-preview-ai"><span><Bot size={17}/></span><div><small>AI 업무비서</small><strong>오늘 우선 처리할 업무 3건을 정리했어요.</strong></div></div>
        <div className="auth-activity-list">{activity.map(({ icon: Icon, tone, title: itemTitle, detail }) => <article key={itemTitle}><span className={tone}><Icon size={14}/></span><div><strong>{itemTitle}</strong><p>{detail}</p></div><CheckCircle2 size={14}/></article>)}</div>
        <div className="auth-preview-foot"><span><ShieldCheck size={13}/>기업용 보안</span><span>99.9% 서비스 안정성</span></div>
      </div>
      <p className="auth-brand-foot">© 2026 FillWork. 현장과 사무실을 잇는 업무 플랫폼</p>
    </section>
    <section className="auth-form-panel">
      <div className="auth-mobile-brand"><span>F</span><strong>FillWork</strong></div>
      <div className="auth-form-wrap">
        <header><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p></header>
        {children}
      </div>
      <div className="auth-trust"><ShieldCheck size={13}/><span>모든 인증 정보는 안전하게 보호됩니다.</span></div>
    </section>
  </main>;
}

