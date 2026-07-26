import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteDescription =
  "面向 CS 研究者的论文初稿、可恢复论文重构、科研绘图与投稿策略工作台。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "研术台 · YanShu",
  description: siteDescription,
  applicationName: "研术台",
  keywords: [
    "计算机科学",
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
        alt: "研术台 · YanShu：五轮重构，支持断点继续。",
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
      <body>{children}</body>
    </html>
  );
}
