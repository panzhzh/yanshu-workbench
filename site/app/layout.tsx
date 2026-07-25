import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "研术台 · YanShu Workbench",
  description:
    "面向计算机科学研究者的科研方法文档站与交互式论文重构工作台。",
  applicationName: "研术台",
  keywords: [
    "计算机科学",
    "科研写作",
    "论文重构",
    "学术写作",
    "Research workflow",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    title: "研术台 · YanShu Workbench",
    description:
      "面向计算机科学研究者的科研方法文档站与交互式论文重构工作台。",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "研术台 · YanShu Workbench",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "研术台 · YanShu Workbench",
    description:
      "面向计算机科学研究者的科研方法文档站与交互式论文重构工作台。",
    images: ["/og.png"],
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
