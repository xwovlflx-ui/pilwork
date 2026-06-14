import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문서 워크스페이스 | FillWork",
  description: "FillWork 문서 작성 및 현장 기록 워크스페이스",
};

export default function DocumentsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
