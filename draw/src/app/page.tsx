"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Video, Clapperboard, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStoryboardStore } from "@/lib/store";
import { StoryboardList } from "@/components/StoryboardList";

export default function Home() {
  const [inputPrompt, setInputPrompt] = useState("");
  const { isGenerating, setIsGenerating, setScenes, setPrompt, scenes } = useStoryboardStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setPrompt(inputPrompt);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt: inputPrompt }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.scenes) {
        setScenes(data.scenes);
        // 平滑滚动到结果区域
        setTimeout(() => {
          document.getElementById("storyboard-results")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to generate scenes:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* SEO 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Video Storyboard",
            "operatingSystem": "Web",
            "applicationCategory": "MultimediaApplication",
            "description": "一句话生成专业视频分镜脚本的 AI 工具",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CNY"
            }
          })
        }}
      />

      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Video className="h-5 w-5" />
            </div>
            <span>AI Storyboard</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">功能</a>
            <a href="#" className="hover:text-primary transition-colors">案例</a>
            <a href="#" className="hover:text-primary transition-colors">定价</a>
          </nav>
          <button className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors">
            开始使用
          </button>
        </div>
      </header>

      <main className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden px-4 transition-all duration-700",
        scenes.length > 0 ? "min-h-[70vh] pt-20" : "min-h-screen"
      )}>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 bg-primary/20 opacity-20 blur-[120px]" />

        <div className="container relative z-10 mx-auto max-w-5xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI 驱动的创意视频助手</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl"
          >
            一句话，<br />
            让创意<span className="text-primary">跃然屏上</span>
          </motion.h1>

          {/* Subtitle */}
          <AnimatePresence>
            {scenes.length === 0 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground sm:text-xl overflow-hidden"
              >
                借助 AI 力量，秒级将您的创意点子转化为结构化的专业分镜脚本、视觉描述和导演剪辑建议。
              </motion.p>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <motion.div
            layout
            className="mx-auto max-w-3xl"
          >
            <form
              onSubmit={handleSubmit}
              className="group relative flex items-center rounded-2xl border border-border bg-card p-2 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-primary/50"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="描述您的视频创意，例如：一个赛博朋克风格的雨夜街头追逐戏..."
                className="h-12 w-full flex-1 bg-transparent px-4 text-lg outline-none placeholder:text-muted-foreground"
              />
              <button
                disabled={isGenerating || !inputPrompt.trim()}
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100",
                  isGenerating && "animate-pulse"
                )}
              >
                {isGenerating ? "正在解析脚本..." : "立即生成"}
                {!isGenerating && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            {/* Quick Suggestions */}
            {scenes.length === 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                <span>试一试：</span>
                {["唯美古风短片", "未来感产品广告", "悬疑电影开场", "温馨家庭生活记"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setInputPrompt(tag)}
                    className="rounded-full border border-border px-3 py-1 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Features Section */}
          <AnimatePresence>
            {scenes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-24 grid gap-8 sm:grid-cols-3 overflow-hidden"
              >
                {[
                  { icon: Video, title: "镜头语言解析", desc: "自动生成全景、特写、推拉等专业镜头术语。" },
                  { icon: Clapperboard, title: "分镜视觉预览", desc: "为每一幕提供详细的视觉画面描述。" },
                  { icon: Edit3, title: "高度可编辑", desc: "AI 生成后，您可以像编辑文档一样修改每一处细节。" },
                ].map((feature, i) => (
                  <div key={i} className="flex flex-col items-center p-6">
                    <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div id="storyboard-results">
        <StoryboardList />
      </div>

      <footer className="border-t border-border bg-muted/30 py-12 mt-20">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <div className="flex justify-center gap-6 mb-8 text-muted-foreground">
            <a href="#" className="hover:text-primary">关于我们</a>
            <a href="#" className="hover:text-primary">服务条款</a>
            <a href="#" className="hover:text-primary">隐私政策</a>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2024 AI Video Storyboard. Built with passion for creators.
          </p>
        </div>
      </footer>
    </div>
  );
}
