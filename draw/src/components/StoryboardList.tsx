"use client";

import { useStoryboardStore } from "@/lib/store";
import { StoryboardCard } from "./StoryboardCard";
import { motion } from "framer-motion";
import { Plus, Download, Share2 } from "lucide-react";

export function StoryboardList() {
  const { scenes, prompt } = useStoryboardStore();

  if (scenes.length === 0) return null;

  return (
    <section className="w-full max-w-5xl mx-auto py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">分镜脚本预览</h2>
          <p className="text-muted-foreground italic">“{prompt}”</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
            <Share2 className="h-4 w-4" />
            分享
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-bold transition-transform hover:scale-105">
            <Download className="h-4 w-4" />
            导出脚本
          </button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {scenes.map((scene, index) => (
          <StoryboardCard key={scene.id} scene={scene} index={index} />
        ))}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-32 w-full items-center justify-center rounded-3xl border-2 border-dashed border-border transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <Plus className="mr-2 h-5 w-5 text-muted-foreground" />
          <span className="font-medium text-muted-foreground">添加新分镜</span>
        </motion.button>
      </div>
    </section>
  );
}
