import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const AUTH_KEY = "posgrestore-auth-token";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
  isAuthenticated: !!localStorage.getItem(AUTH_KEY),
  token: localStorage.getItem(AUTH_KEY),
  user: null, // Ichida email va isAdmin bo'ladi
  loading: false,
  error: null,

  // LOGIN & AUTO-REGISTER
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem(AUTH_KEY, token);
        set({
          isAuthenticated: true,
          token,
          user,
          error: null,
        });
        toast.success(user.isAdmin ? "Admin sifatida kirildi" : "Xush kelibsiz!");
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Xatolik yuz berdi";
      set({ error: message });
      toast.error(message);
      return { success: false, error: message };
    } finally {
      set({ loading: false });
    }
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    set({
      isAuthenticated: false,
      token: null,
      user: null,
    });
    toast.success("Tizimdan chiqildi");
  },

  // VERIFY TOKEN (Sahifa yangilanganda ishlaydi)
  verifyToken: async () => {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        set({
          isAuthenticated: true,
          user: response.data.data.user,
        });
        return true;
      }
    } catch (error) {
      get().logout();
      return false;
    }
  },

  // CHANGE PASSWORD
  changePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem(AUTH_KEY);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/auth/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Parol o'zgartirildi");
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Xatolik";
      toast.error(message);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },
}));
