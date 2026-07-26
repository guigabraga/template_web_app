import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ThemeMode } from "../../types";

type ThemeStore = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "template-web-app-theme",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ mode }) => ({ mode }),
    },
  ),
);
