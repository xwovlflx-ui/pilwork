import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "협업 채팅 | FillWork",
  description: "FillWork 현장 협업 채팅 워크스페이스",
};

export default function ChatLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
