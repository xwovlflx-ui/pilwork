"use client";

import { ArrowLeft, CloudOff, FileCheck2, RefreshCcw, WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return <main className="offline-page">
    <section className="offline-card">
      <div className="offline-brand"><span>F</span><strong>FillWork</strong></div>
      <div className="offline-symbol"><CloudOff size={34} /></div>
      <p className="offline-kicker">OFFLINE FIELD MODE</p>
      <h1>네트워크 연결이 잠시 끊겼습니다.</h1>
      <p className="offline-description">이미 방문한 화면과 브라우저에 저장된 데모 정보는 계속 확인할 수 있습니다. 연결이 복구되면 화면을 다시 불러와 주세요.</p>
      <div className="offline-capabilities">
        <article><FileCheck2 size={17} /><div><strong>로컬 Mock 데이터 유지</strong><p>계정과 현장 테스트 상태는 이 기기에 남아 있습니다.</p></div></article>
        <article><WifiOff size={17} /><div><strong>서버 전송 작업 제한</strong><p>새 화면 요청과 실제 업로드는 온라인 복귀 후 테스트합니다.</p></div></article>
      </div>
      <div className="offline-actions"><button type="button" onClick={() => window.location.reload()}><RefreshCcw size={16} />연결 다시 확인</button><Link href="/"><ArrowLeft size={15} />캐시된 홈 열기</Link></div>
    </section>
  </main>;
}
