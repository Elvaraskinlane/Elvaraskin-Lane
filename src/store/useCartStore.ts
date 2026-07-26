import { create } from 'zustand';
import { getCart, addToCart, removeFromCart, updateCartItem } from '@/lib/cart';
import { toast } from 'sonner';

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
    // Only set loading on initial fetch
    if (!useCartStore.getState().cart) set({ isLoading: true });
    try {
      const data = await getCart();
      set({ cart: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ isLoading: false });
    }
  },

  addItem: async (productId: number, quantity: number = 1) => {
    try {
      const data = await addToCart(productId, quantity);
      set({ cart: data });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  removeItem: async (itemKey: string) => {
    const previousCart = useCartStore.getState().cart;
    if (previousCart) {
      // Optimistic remove
      const newItems = previousCart.items.filter((item) => item.key !== itemKey);
      set({ cart: { ...previousCart, items: newItems } });
    }
    
    try {
      const data = await removeFromCart(itemKey);
      set({ cart: data });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      if (previousCart) set({ cart: previousCart });
      toast.error('Failed to remove item. Please try again.');
    }
  },

  updateItemQuantity: async (itemKey: string, quantity: number) => {
    const previousCart = useCartStore.getState().cart;
    if (previousCart) {
      // Optimistic update
      const newItems = previousCart.items.map((item) =>
        item.key === itemKey ? { ...item, quantity } : item
      );
      set({ cart: { ...previousCart, items: newItems } });
    }

    try {
      const data = await updateCartItem(itemKey, quantity);
      set({ cart: data });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      if (previousCart) set({ cart: previousCart });
      toast.error('Failed to update quantity. Stock might be limited.');
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
