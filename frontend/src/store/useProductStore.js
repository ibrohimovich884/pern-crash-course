import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,
  formData: { name: "", price: "", image: "", stock: 0, description: "" },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "", stock: 0, description: "" } }),

  // MAHSULOT QO'SHISH
  addProduct: async (e) => {
    if (e) e.preventDefault();
    set({ loading: true });
    try {
      const { formData } = get();
      // Ma'lumotlarni tozalash va songa o'girish
      const dataToSend = {
        ...formData,
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
        name: formData.name.trim(),
      };
      await axios.post(`${BASE_URL}/api/products`, dataToSend);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal")?.close();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding product");
    } finally {
      set({ loading: false });
    }
  },

  // MAHSULOTNI YANGILASH (TAHRIRLASH)
  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      // BU YERDA HAM SONGA O'GIRISH SHART!
      const dataToSend = {
        ...formData,
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
      };
      const response = await axios.put(`${BASE_URL}/api/products/${id}`, dataToSend);
      set({ currentProduct: response.data.data });
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Error updating product");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      set({ error: "Failed to fetch products", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({ currentProduct: response.data.data, formData: response.data.data, error: null });
    } catch (error) {
      set({ error: "Product not found", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({ products: prev.products.filter((p) => p.id !== id) }));
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      set({ loading: false });
    }
  },
}));