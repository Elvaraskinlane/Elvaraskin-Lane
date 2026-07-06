import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useWishlistStore } from "./useWishlistStore";

export interface User {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user: User) => {
        set({ user, isAuthenticated: true });

        // --- EVENT DRIVEN SYNC ---
        const localWishlist = useWishlistStore.getState().items;
        const { setItems } = useWishlistStore.getState();

        // 1. Fetch remote wishlist
        fetch("/api/wishlist/sync", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user.token}`,
          },
        })
        .then(res => {
          if (!res.ok) return { error: "Failed to fetch" };
          return res.json();
        })
        .then(data => {
          if (data.error) return;
          let mergedItems = [...localWishlist];
          let hasChanges = false;

          // 2. Merge remote items into local items
          if (data.items && Array.isArray(data.items)) {
            data.items.forEach((remoteItem: any) => {
              if (!mergedItems.some(localItem => localItem.id === remoteItem.id)) {
                mergedItems.push(remoteItem);
                hasChanges = true;
              }
            });
          }

          // 3. If there are items, push the merged list back to the server
          if (hasChanges || localWishlist.length > 0) {
            if (hasChanges) {
              setItems(mergedItems);
            }
            
            fetch("/api/wishlist/sync", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`,
              },
              body: JSON.stringify({ items: mergedItems }),
            }).catch((err) => console.error("Wishlist sync post failed:", err));
          }
        })
        .catch(err => console.error("Wishlist sync error:", err));
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "elvara-auth-storage", // name of the item in the storage (must be unique)
    }
  )
);
