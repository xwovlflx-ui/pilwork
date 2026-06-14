import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./auth.css";
import { AuthProvider, AuthRouteGuard } from "@/components/auth/auth-provider";
import { PwaDemoShell } from "@/components/demo/pwa-demo-shell";

export const metadata: Metadata = {
  title: "FillWork | 문서와 현장을 잇는 업무 공간",
  description: "현장과 사무실을 연결하는 올인원 업무 협업 플랫폼",
  applicationName: "FillWork",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FillWork",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1020",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body><AuthProvider><PwaDemoShell /><AuthRouteGuard>{children}</AuthRouteGuard></AuthProvider></body>
    </html>
  );
}
