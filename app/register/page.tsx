"use client";

import { ArrowRight, Building2, Check, KeyRound, LoaderCircle, Mail, TicketCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { roleHome, useAuth } from "@/components/auth/auth-provider";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", organization: "", inviteCode: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!agreed) { setError("서비스 이용약관과 개인정보 처리방침에 동의해 주세요."); return; }
    if (form.password.length < 8) { setError("비밀번호는 8자 이상 입력해 주세요."); return; }
    setLoading(true); setError("");
    try { const user = await register(form); router.replace(roleHome(user)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "가입에 실패했습니다."); }
    finally { setLoading(false); }
  };

  return <AuthShell compact eyebrow="팀의 새로운 시작" title="워크스페이스 만들기" description="조직 정보를 입력하면 관리자 승인 후 업무를 시작할 수 있어요.">
    <form className="auth-form register-form" onSubmit={submit}>
      <div className="auth-form-grid">
        <label><span>이름</span><div><UserRound size={16}/><input aria-label="이름" autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="홍길동" required/></div></label>
        <label><span>조직명</span><div><Building2 size={16}/><input aria-label="조직명" autoComplete="organization" value={form.organization} onChange={(event) => update("organization", event.target.value)} placeholder="회사 또는 팀 이름" required/></div></label>
      </div>
      <label><span>업무용 이메일</span><div><Mail size={16}/><input aria-label="업무용 이메일" autoComplete="email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="name@company.com" required/></div></label>
      <label><span>비밀번호 <small>8자 이상</small></span><div><KeyRound size={16}/><input aria-label="가입 비밀번호" autoComplete="new-password" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="안전한 비밀번호 입력" required/></div></label>
      <label><span>초대코드 <small>선택</small></span><div><TicketCheck size={16}/><input aria-label="초대코드" value={form.inviteCode} onChange={(event) => update("inviteCode", event.target.value)} placeholder="초대코드가 있다면 입력"/></div></label>
      <label className="auth-agree"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)}/><i>{agreed ? <Check size={12}/> : null}</i><span><Link href="#">서비스 이용약관</Link> 및 <Link href="#">개인정보 처리방침</Link>에 동의합니다.</span></label>
      {error ? <p className="auth-error" role="alert">{error}</p> : null}
      <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={16}/>워크스페이스 준비 중</> : <>가입하고 승인 요청<ArrowRight size={16}/></>}</button>
    </form>
    <p className="auth-switch">이미 계정이 있으신가요? <Link href="/login">로그인</Link></p>
  </AuthShell>;
}
