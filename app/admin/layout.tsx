import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 센터 | FillWork",
  description: "FillWork 회사 운영 및 현장 현황 관리자 센터",
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
