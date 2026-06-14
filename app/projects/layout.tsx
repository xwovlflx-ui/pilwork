import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로젝트 칸반 | FillWork",
  description: "FillWork 프로젝트 업무 칸반 보드",
};

export default function ProjectsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
