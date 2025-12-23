import { create } from "zustand";
import toast from "react-hot-toast";

const LIKES_KEY = "posgrestore-likes";

export const useLikesStore = create((set, get) => {
  // Load likes from localStorage on init
  const loadLikes = () => {
    try {
      const stored = localStorage.getItem(LIKES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveLikes = (likes) => {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    } catch (error) {
      console.error("Error saving likes:", error);
    }
  };

  const initialLikes = loadLikes();

  return {
    likedProducts: initialLikes,

    // Toggle like
    toggleLike: (product) => {
      const likedProducts = get().likedProducts;
      const isLiked = likedProducts.some((item) => item.id === product.id);

      let newLikes;
      if (isLiked) {
        newLikes = likedProducts.filter((item) => item.id !== product.id);
        toast.success(`${product.name} yoqtirganlar ro'yxatidan olib tashlandi`);
      } else {
        newLikes = [
          ...likedProducts,
          {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
          },
        ];
        toast.success(`${product.name} yoqtirganlar ro'yxatiga qo'shildi`);
      }

      saveLikes(newLikes);
      set({ likedProducts: newLikes });
    },

    // Check if product is liked
    isLiked: (productId) => {
      return get().likedProducts.some((item) => item.id === productId);
    },

    // Get likes count
    getLikesCount: () => {
      return get().likedProducts.length;
    },
  };
});



