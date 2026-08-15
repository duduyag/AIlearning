import { create } from "zustand";

interface ThemeState {
  levelOrder: number;
  setLevelOrder: (levelOrder: number) => void;
}

/** Drives the page background gradient - each course level gets its own look, so
 * advancing to a new level feels like arriving somewhere new, not staying in place. */
export const useThemeStore = create<ThemeState>((set) => ({
  levelOrder: 1,
  setLevelOrder: (levelOrder) => set({ levelOrder }),
}));
