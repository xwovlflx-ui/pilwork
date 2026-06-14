"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { authApi } from "@/lib/auth-api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setLoading(true); await authApi.forgotPassword(email); setLoading(false); setSent(true); };

  return <AuthShell eyebrow="계정 복구" title="비밀번호 재설정" description="가입한 이메일로 안전한 재설정 링크를 보내드릴게요.">
    {sent ? <div className="forgot-success"><span><CheckCircle2 size={21}/></span><h3>이메일을 확인해 주세요.</h3><p>계정이 존재한다면 <strong>{email}</strong>로<br/>30분 동안 유효한 링크를 발송했습니다.</p><Link href="/login"><ArrowLeft size={15}/>로그인으로 돌아가기</Link></div> : <form className="auth-form" onSubmit={submit}>
      <label><span>이메일</span><div><Mail size={16}/><input aria-label="재설정 이메일" autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" required/></div></label>
      <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={16}/>발송 중</> : <>재설정 링크 받기<ArrowRight size={16}/></>}</button>
      <Link className="auth-back" href="/login"><ArrowLeft size={14}/>로그인으로 돌아가기</Link>
    </form>}
  </AuthShell>;
}
