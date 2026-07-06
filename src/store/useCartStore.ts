import { create } from 'zustand';
import { getCart, addToCart, removeFromCart, updateCartItem } from '@/lib/cart';

// Define the basic shape of the WooCommerce Store API cart
export interface CartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  prices: {
    price: string;
  };
  images: Array<{
    src: string;
    alt: string;
  }>;
}

export interface CartData {
  items: CartItem[];
  item_count: number;
  totals: {
    total_items: string;
    total_price: string;
    currency_symbol: string;
  };
}

interface CartState {
  cart: CartData | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (itemKey: string) => Promise<void>;
  updateItemQuantity: (itemKey: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const data = await getCart();
      set({ cart: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ isLoading: false });
    }
  },

  addItem: async (productId: number, quantity: number = 1) => {
    set({ isLoading: true });
    try {
      const data = await addToCart(productId, quantity);
      set({ cart: data, isLoading: false });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  removeItem: async (itemKey: string) => {
    set({ isLoading: true });
    try {
      const data = await removeFromCart(itemKey);
      set({ cart: data, isLoading: false });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      set({ isLoading: false });
    }
  },

  updateItemQuantity: async (itemKey: string, quantity: number) => {
    set({ isLoading: true });
    try {
      // We need to import updateCartItem at the top of the file. Wait. I'll do it separately.
      const { updateCartItem } = await import('@/lib/cart');
      const data = await updateCartItem(itemKey, quantity);
      set({ cart: data, isLoading: false });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      set({ isLoading: false });
    }
  },

  clearCart: () => {
    // We optionally remove the token from localStorage here
    if (typeof window !== "undefined") {
      localStorage.removeItem("wc_cart_token");
    }
    set({ cart: null });
  },
}));
