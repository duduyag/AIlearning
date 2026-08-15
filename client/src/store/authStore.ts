import { create } from "zustand";
import { UserDTO } from "@ai-explorers/shared";

interface AuthState {
  user: UserDTO | null;
  accessToken: string | null;
  isBootstrapped: boolean;
  setAuth: (user: UserDTO, accessToken: string) => void;
  updateUser: (patch: Partial<UserDTO>) => void;
  clearAuth: () => void;
  setBootstrapped: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isBootstrapped: false,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  updateUser: (patch) => set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
  clearAuth: () => set({ user: null, accessToken: null }),
  setBootstrapped: () => set({ isBootstrapped: true }),
}));

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}
