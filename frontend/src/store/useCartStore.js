import { create } from "zustand";
import toast from "react-hot-toast";

const CART_KEY = "posgrestore-cart";

export const useCartStore = create((set, get) => {
  // Load cart from localStorage on init
  const loadCart = () => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveCart = (cart) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const initialCart = loadCart();

  return {
    cart: initialCart,
    itemCount: initialCart.reduce((sum, item) => sum + item.quantity, 0),

    // Add item to cart
    addToCart: (product) => {
      const cart = get().cart;
      const existingItem = cart.find((item) => item.id === product.id);

      let newCart;
      if (existingItem) {
        // Increase quantity
        newCart = cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        toast.success(`${product.name} miqdori oshirildi`);
      } else {
        // Add new item
        newCart = [
          ...cart,
          {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1,
          },
        ];
        toast.success(`${product.name} savatga qo'shildi`);
      }

      const itemCount = newCart.reduce((sum, item) => sum + item.quantity, 0);
      saveCart(newCart);
      set({ cart: newCart, itemCount });
    },

    // Remove item from cart
    removeFromCart: (productId) => {
      const cart = get().cart;
      const newCart = cart.filter((item) => item.id !== productId);
      const itemCount = newCart.reduce((sum, item) => sum + item.quantity, 0);
      saveCart(newCart);
      set({ cart: newCart, itemCount });
      toast.success("Mahsulot savatdan olib tashlandi");
    },

    // Update quantity
    updateQuantity: (productId, quantity) => {
      if (quantity <= 0) {
        get().removeFromCart(productId);
        return;
      }

      const cart = get().cart;
      const newCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      const itemCount = newCart.reduce((sum, item) => sum + item.quantity, 0);
      saveCart(newCart);
      set({ cart: newCart, itemCount });
    },

    // Clear cart
    clearCart: () => {
      saveCart([]);
      set({ cart: [], itemCount: 0 });
      toast.success("Savat tozalandi");
    },

    // Get total price
    getTotalPrice: () => {
      return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    // Check if item is in cart
    isInCart: (productId) => {
      return get().cart.some((item) => item.id === productId);
    },
  };
});


