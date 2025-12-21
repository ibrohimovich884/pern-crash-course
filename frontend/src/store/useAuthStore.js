import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const AUTH_KEY = "posgrestore-auth-token";
const BASE_URL = import.meta.env.VITE_API_URL;
export const useAuthStore = create((set, get) => {
  // Check if token exists and is valid

  const token = localStorage.getItem(AUTH_KEY);
  const isAuthenticated = !!token;

  return {
    isAuthenticated,
    token,
    admin: null,
    loading: false,
    error: null,

    login: async (username, password) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
          username,
          password,
        });

        if (response.data.success) {
          const { token, admin } = response.data.data;
          localStorage.setItem(AUTH_KEY, token);
          set({
            isAuthenticated: true,
            token,
            admin,
            error: null,
          });
          toast.success("Muvaffaqiyatli kirildi");
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

    logout: () => {
      localStorage.removeItem(AUTH_KEY);
      set({
        isAuthenticated: false,
        token: null,
        admin: null,
      });
      toast.success("Chiqildi");
    },

    verifyToken: async () => {
      const token = localStorage.getItem(AUTH_KEY);
      if (!token) {
        get().logout();
        return false;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          set({
            isAuthenticated: true,
            admin: response.data.data.admin,
          });
          return true;
        }
      } catch (error) {
        get().logout();
        return false;
      }
    },

    changePassword: async (currentPassword, newPassword) => {
      set({ loading: true, error: null });
      const token = localStorage.getItem(AUTH_KEY);

      try {
        const response = await axios.put(
          `${BASE_URL}/api/auth/change-password`,
          {
            currentPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast.success("Parol muvaffaqiyatli o'zgartirildi");
          set({ error: null });
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
  };
});


