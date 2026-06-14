"use client";

import { Building2, CheckCircle2, Clock3, LogOut, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { roleHome, useAuth } from "@/components/auth/auth-provider";

export default function PendingPage() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  if (!user) return null;

  const check = async () => {
    setChecking(true);
    await refreshUser();
    const { authApi } = await import("@/lib/auth-api");
    const latest = await authApi.getMe();
    if (latest?.status === "active") router.replace(roleHome(latest));
    setChecking(false);
  };

  return <main className="pending-page">
    <div className="pending-brand"><span>F</span><strong>FillWork</strong></div>
    <section className="pending-card">
      <div className="pending-visual"><span className="pending-orbit one"/><span className="pending-orbit two"/><i><Clock3 size={28}/></i></div>
      <span className="pending-kicker"><ShieldCheck size={13}/>관리자 확인 중</span>
      <h1>가입 승인을 기다리고 있어요.</h1>
      <p>조직 관리자가 요청을 확인하면 모든 업무 공간을 사용할 수 있습니다.<br/>승인 결과는 이메일로도 알려드릴게요.</p>
      <div className="pending-user"><span>{user.name.slice(0, 1)}</span><div><strong>{user.name}</strong><p>{user.email}</p></div></div>
      <div className="pending-info"><article><Building2 size={16}/><div><small>요청 조직</small><strong>{user.organization}</strong></div></article><article><Mail size={16}/><div><small>승인 알림</small><strong>이메일로 안내</strong></div></article></div>
      <div className="pending-progress"><span className="done"><CheckCircle2 size={14}/>가입 완료</span><i/><span className="active"><Clock3 size={14}/>관리자 승인</span><i/><span>업무 시작</span></div>
      <button className="pending-refresh" type="button" onClick={check} disabled={checking}><RefreshCw className={checking ? "spin" : ""} size={15}/>{checking ? "승인 상태 확인 중" : "승인 상태 다시 확인"}</button>
      <button className="pending-logout" type="button" onClick={async () => { await logout(); router.replace("/login"); }}><LogOut size={14}/>다른 계정으로 로그인</button>
    </section>
    <p className="pending-help">승인이 지연되나요? <a href="mailto:support@fillwork.kr">support@fillwork.kr</a></p>
  </main>;
}
