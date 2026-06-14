import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "파일 관리자 | FillWork",
  description: "FillWork 현장 파일 및 증빙 관리 워크스페이스",
};

export default function FilesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
