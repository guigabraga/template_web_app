import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TSidebarStore = {
  isExpanded: boolean;
  toggleSidebar: () => void;
};

const useSidebarStore = create<TSidebarStore>()(
  persist(
    (set) => ({
      isExpanded: true,
      toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
    }),
    {
      name: "template-web-app-sidebar",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ isExpanded }) => ({ isExpanded }),
    },
  ),
);

export { useSidebarStore, type TSidebarStore };
