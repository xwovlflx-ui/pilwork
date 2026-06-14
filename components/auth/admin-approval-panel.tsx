"use client";

import { Check, Clock3, ShieldCheck, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/auth-api";
import type { AuthRole, AuthUser } from "@/types/auth";

export function AdminApprovalPanel() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try { setUsers(await authApi.listPending()); }
    catch { setUsers([]); }
  };
  useEffect(() => { void load(); }, []);

  const approve = async (id: string, role: Exclude<AuthRole, "SUPER_ADMIN">) => {
    setBusyId(id);
    await authApi.approve(id, role);
    await load();
    setBusyId(null);
  };

  return <section className="admin-card auth-approval-card">
    <div className="admin-card-heading"><div><h2>가입 승인 대기</h2><p>조직과 역할을 확인한 뒤 접근을 허용하세요.</p></div><span className="approval-total"><Clock3 size={12}/>{users.length}명</span></div>
    {users.length ? <div className="approval-user-list">{users.slice(0, 3).map((user) => <article key={user.id}>
      <span className="approval-avatar">{user.name.slice(0, 1)}</span>
      <div><strong>{user.name}</strong><p>{user.email} · {user.organization}</p></div>
      <select aria-label={`${user.name} 역할`} defaultValue={user.role === "GUEST" ? "GUEST" : "MEMBER"} id={`role-${user.id}`}>
        <option value="ORG_ADMIN">조직 관리자</option><option value="MANAGER">팀 매니저</option><option value="MEMBER">멤버</option><option value="GUEST">게스트</option>
      </select>
      <button disabled={busyId === user.id} type="button" onClick={() => {
        const element = document.getElementById(`role-${user.id}`) as HTMLSelectElement;
        void approve(user.id, element.value as Exclude<AuthRole, "SUPER_ADMIN">);
      }}><UserCheck size={13}/>{busyId === user.id ? "처리 중" : "승인"}</button>
    </article>)}</div> : <div className="approval-empty"><span><Check size={16}/></span><div><strong>대기 중인 가입 요청이 없습니다.</strong><p>새 요청이 도착하면 이곳에서 바로 승인할 수 있습니다.</p></div></div>}
    <div className="approval-policy"><ShieldCheck size={13}/><span>승인 즉시 역할 기반 접근 정책이 적용됩니다.</span></div>
  </section>;
}
