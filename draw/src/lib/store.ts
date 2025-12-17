import { create } from "zustand";

export interface Scene {
  id: string;
  sceneNumber: number;
  visualDescription: string;
  cameraAngle: string;
  dialogue?: string;
  duration: string;
  lighting?: string;
}

interface StoryboardState {
  prompt: string;
  scenes: Scene[];
  isGenerating: boolean;
  setPrompt: (prompt: string) => void;
  setScenes: (scenes: Scene[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
}

export const useStoryboardStore = create<StoryboardState>((set) => ({
  prompt: "",
  scenes: [],
  isGenerating: false,
  setPrompt: (prompt) => set({ prompt }),
  setScenes: (scenes) => set({ scenes }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  updateScene: (id, updates) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === id ? { ...scene, ...updates } : scene
      ),
    })),
}));
