import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: number;
  name: string;
  price: string;
  image: string;
  slug?: string;
}

interface WishlistState {
  items: WishlistItem[];
  slug: string | null;
  isPublic: boolean;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: number) => boolean;
  setItems: (items: WishlistItem[]) => void;
  setSettings: (slug: string | null, isPublic: boolean) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      slug: null,
      isPublic: false,
      toggleItem: (item) => {
        const { items } = get();
        const exists = items.some((i) => i.id === item.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...items, item] });
        }
      },
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some((i) => i.id === productId);
      },
      setItems: (newItems) => set({ items: newItems }),
      setSettings: (slug, isPublic) => set({ slug, isPublic }),
    }),
    {
      name: 'elvara-wishlist-storage', // Key used in localStorage
    }
  )
);
