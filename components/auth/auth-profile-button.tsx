"use client";

import { ChevronDown, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";

const roleNames = {
  SUPER_ADMIN: "슈퍼 관리자",
  ORG_ADMIN: "조직 관리자",
  MANAGER: "팀 매니저",
  MEMBER: "멤버",
  GUEST: "게스트",
};

export function AuthProfileButton() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!user) return null;
  const initials = user.name.slice(0, 1);

  return <div className="auth-profile" ref={ref}>
    <button className="profile auth-profile-trigger" type="button" aria-label="프로필 메뉴" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      <span className="auth-avatar">{initials}</span><ChevronDown size={11}/>
    </button>
    {open ? <div className="auth-profile-menu">
      <div className="auth-profile-summary"><span>{initials}</span><div><strong>{user.name}</strong><p>{user.email}</p></div></div>
      <div className="auth-role"><ShieldCheck size={13}/><span>{roleNames[user.role]}</span><b>{user.organization}</b></div>
      <button type="button"><UserRound size={14}/>내 프로필</button>
      <button className="logout" type="button" onClick={async () => { await logout(); router.replace("/login"); }}><LogOut size={14}/>로그아웃</button>
    </div> : null}
  </div>;
}

