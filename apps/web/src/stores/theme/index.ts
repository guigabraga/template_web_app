import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TThemeMode } from "../../types";

type TThemeStore = {
  mode: TThemeMode;
  setMode: (mode: TThemeMode) => void;
};

export const useThemeStore = create<TThemeStore>()(
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
