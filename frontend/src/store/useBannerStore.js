import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// base url will be dynamic depending on the environment
const BASE_URL = import.meta.env.VITE_API_URL;

export const useBannerStore = create((set, get) => ({
  // banners state
  banners: [],
  loading: false,
  error: null,
  currentBanner: null,

  // form state
  formData: {
    title: "",
    image: "",
    link: "",
    is_active: true,
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { title: "", image: "", link: "", is_active: true } }),

  addBanner: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/banners`, formData);
      await get().fetchBanners();
      get().resetForm();
      toast.success("Banner added successfully");
      document.getElementById("add_banner_modal").close();
    } catch (error) {
      console.log("Error in addBanner function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchBanners: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/banners`);
      set({ banners: response.data.data, error: null });
    } catch (err) {
      if (err.status == 429) set({ error: "Rate limit exceeded", banners: [] });
      else set({ error: "Something went wrong", banners: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchAllBanners: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/banners/all`);
      set({ banners: response.data.data, error: null });
    } catch (err) {
      if (err.status == 429) set({ error: "Rate limit exceeded", banners: [] });
      else set({ error: "Something went wrong", banners: [] });
    } finally {
      set({ loading: false });
    }
  },

  deleteBanner: async (id) => {
    console.log("deleteBanner function called", id);
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/banners/${id}`);
      set((prev) => ({ banners: prev.banners.filter((banner) => banner.id !== id) }));
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.log("Error in deleteBanner function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchBanner: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/banners/${id}`);
      set({
        currentBanner: response.data.data,
        formData: response.data.data, // pre-fill form with current banner data
        error: null,
      });
    } catch (error) {
      console.log("Error in fetchBanner function", error);
      set({ error: "Something went wrong", currentBanner: null });
    } finally {
      set({ loading: false });
    }
  },
  updateBanner: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.put(`${BASE_URL}/api/banners/${id}`, formData);
      set({ currentBanner: response.data.data });
      toast.success("Banner updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error in updateBanner function", error);
    } finally {
      set({ loading: false });
    }
  },
}));
