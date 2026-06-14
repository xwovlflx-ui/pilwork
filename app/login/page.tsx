"use client";

import { ArrowRight, Eye, EyeOff, KeyRound, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { roleHome, useAuth } from "@/components/auth/auth-provider";
import { authDemoAccounts, authDemoPassword } from "@/lib/mock-auth-api";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("admin@fillwork.kr");
  const [password, setPassword] = useState(authDemoPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const user = await login({ email, password });
      router.replace(roleHome(user));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "로그인에 실패했습니다.");
    } finally { setLoading(false); }
  };

  const google = async () => {
    setLoading(true); setError("");
    try { const user = await loginWithGoogle(); router.replace(roleHome(user)); }
    catch { setError("Google 로그인에 실패했습니다."); }
    finally { setLoading(false); }
  };

  return <AuthShell eyebrow="다시 만나 반가워요" title="FillWork에 로그인" description="업무가 멈춘 곳에서 바로 이어서 시작하세요.">
    <button className="auth-google" type="button" onClick={google} disabled={loading}><span className="google-mark">G</span>Google로 계속하기</button>
    <div className="auth-divider"><span>또는 이메일로 로그인</span></div>
    <form className="auth-form" onSubmit={submit}>
      <label><span>이메일</span><div><Mail size={16}/><input aria-label="이메일" autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" required/></div></label>
      <label><span>비밀번호 <Link href="/forgot-password">비밀번호를 잊으셨나요?</Link></span><div><KeyRound size={16}/><input aria-label="비밀번호" autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호 입력" required/><button type="button" aria-label="비밀번호 표시" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></label>
      {error ? <p className="auth-error" role="alert">{error}</p> : null}
      <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={16}/>확인 중</> : <>로그인<ArrowRight size={16}/></>}</button>
    </form>
    <p className="auth-switch">아직 FillWork 계정이 없으신가요? <Link href="/register">무료로 시작하기</Link></p>
    <details className="auth-demo"><summary>데모 계정 보기</summary><div>{authDemoAccounts.map((account) => <button type="button" key={account.email} onClick={() => { setEmail(account.email); setPassword(authDemoPassword); }}><span>{account.role}</span><b>{account.email}</b></button>)}</div><p>Mock 모드에서는 8자 이상 임의 문자열로 로그인할 수 있습니다.</p></details>
  </AuthShell>;
}
