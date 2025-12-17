import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Video Storyboard - 一句话生成专业分镜脚本",
  description: "借助 AI 力量，秒级将您的视频创意转化为结构化的专业分镜脚本、视觉描述和导演剪辑建议。提升影视创作与广告策划效率。",
  keywords: ["AI视频", "分镜脚本", "剧本生成", "AI创作工具", "影视策划"],
  authors: [{ name: "AI Video Assistant" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        {children}
      </body>
    </html>
  );
}
