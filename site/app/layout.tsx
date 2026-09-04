import type { Metadata } from "next";
import "./globals.css";
import { PersistentLanguageProvider } from "./usePersistentLanguage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteDescription =
  "面向 CS 研究者的选题发现、Idea 评估、论文写作与重构、科研绘图及投稿策略工作台。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "研术台 · YanShu",
  description: siteDescription,
  applicationName: "研术台",
  keywords: [
    "计算机科学",
    "科研选题",
    "Idea 评估",
    "科研写作",
    "论文初稿",
    "论文重构",
    "科研绘图",
    "投稿策略",
    "学术写作",
    "Research workflow",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    title: "研术台 · YanShu",
    description: siteDescription,
    images: [
      {
        url: "/og-reconstruction-2026-07-7.png",
        width: 1731,
        height: 909,
        alt: "研术台 · YanShu：可配置、可执行的科研工作流。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "研术台 · YanShu",
    description: siteDescription,
    images: ["/og-reconstruction-2026-07-7.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <PersistentLanguageProvider>{children}</PersistentLanguageProvider>
      </body>
    </html>
  );
}
