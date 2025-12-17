"use client";

import { useStoryboardStore, Scene } from "@/lib/store";
import { motion } from "framer-motion";
import { Clock, Video, MessageSquare, Lightbulb, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function StoryboardCard({ scene, index }: { scene: Scene; index: number }) {
  const updateScene = useStoryboardStore((state) => state.updateScene);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {scene.sceneNumber}
          </span>
          <h3 className="font-bold text-lg">场景 {scene.sceneNumber}</h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{scene.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            <span>{scene.cameraAngle}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Visual Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Lightbulb className="h-3 w-3" />
            画面描述
          </label>
          <textarea
            value={scene.visualDescription}
            onChange={(e) => updateScene(scene.id, { visualDescription: e.target.value })}
            className="w-full resize-none bg-transparent text-sm leading-relaxed outline-none focus:ring-0"
            rows={3}
          />
        </div>

        {/* Dialogue */}
        {scene.dialogue && (
          <div className="rounded-2xl bg-muted/50 p-4 space-y-2 border border-border/50">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-3 w-3" />
              对白 / 旁白
            </label>
            <textarea
              value={scene.dialogue}
              onChange={(e) => updateScene(scene.id, { dialogue: e.target.value })}
              className="w-full resize-none bg-transparent text-sm italic outline-none focus:ring-0"
              rows={2}
            />
          </div>
        )}

        {/* Lighting/Atmosphere */}
        <div className="flex items-center gap-2 text-xs text-primary/80 bg-primary/5 w-fit px-2 py-1 rounded-md">
          <Sparkles className="h-3 w-3" />
          <span>{scene.lighting}</span>
        </div>
      </div>

      <button className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-primary">
        <Edit2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
