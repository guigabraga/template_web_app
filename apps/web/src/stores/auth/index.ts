import type { TPostAuthUserData } from "@template-web-app/shared-types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const AUTH_STORAGE_KEY = "template-web-app-auth";

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
      clearSession: () => {
        set({ token: null, user: null });
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ token, user }) => ({ token, user }),
    },
  ),
);

export { AUTH_STORAGE_KEY, useAuthStore, type TAuthStore, type TAuthUser };
