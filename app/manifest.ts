import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "FillWork - 현장 업무 워크스페이스",
    short_name: "FillWork",
    description: "현장 기사와 관리자를 위한 올인원 업무 협업 데모",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#090d16",
    theme_color: "#0b1020",
    lang: "ko-KR",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "프로젝트", short_name: "프로젝트", url: "/projects", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "현장 채팅", short_name: "채팅", url: "/chat", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "파일 업로드", short_name: "파일", url: "/files", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
