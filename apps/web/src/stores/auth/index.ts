import type { TPostAuthUserData } from "@template-web-app/shared-types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TAuthUser = Omit<TPostAuthUserData, "token">;

type TAuthStore = {
  token: string | null;
  user: TAuthUser | null;
  setSession: (data: TPostAuthUserData) => void;
  clearSession: () => void;
};

const useAuthStore = create<TAuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: ({ token, ...user }) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: "template-web-app-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ token, user }) => ({ token, user }),
    },
  ),
);

export { useAuthStore, type TAuthStore, type TAuthUser };
