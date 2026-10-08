"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { toast } from "sonner";

export default function AddToCartButton({ productId, compact = false }: { productId: number, productName?: string, compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const { addItem } = useCartStore();
  const { openCartDrawer } = useUIStore();

  const handleAdd = async () => {
    setLoading(true);
    try {
      await addItem(productId, 1);
      openCartDrawer();
    } catch(err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to add to cart. Item might be out of stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={loading}
      className={compact
        ? "w-full h-11 bg-on-background text-background text-sm rounded-full hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50"
        : "w-full bg-on-background text-background font-label-lg text-sm py-5 px-8 uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      }
    >
      {loading ? "Adding..." : "Add to cart"}
    </button>
  );
}
