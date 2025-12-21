import { create } from "zustand";

const AUTH_KEY = "posgrestore-auth";

export const useAuthStore = create((set) => ({
  isAuthenticated: localStorage.getItem(AUTH_KEY) === "true",
  login: () => {
    localStorage.setItem(AUTH_KEY, "true");
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    set({ isAuthenticated: false });
  },
}));


