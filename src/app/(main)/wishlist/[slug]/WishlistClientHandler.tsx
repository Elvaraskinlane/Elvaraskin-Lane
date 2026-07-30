"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { toast } from "sonner";
import { Sync, ShoppingBag } from '@material-symbols-svg/react';

interface WishlistClientHandlerProps {
  products?: any[]; // Full list of products for "Add Routine to Cart"
  productId?: number; // Single product ID for individual "Add to Cart"
}

export default function WishlistClientHandler({ products, productId }: WishlistClientHandlerProps) {
  const { addItem, isLoading: isCartLoading } = useCartStore();
  const { openCartDrawer } = useUIStore();
  
  const [isImporting, setIsImporting] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  const handleAddAll = async () => {
    if (!products || products.length === 0) return;
    
    setIsImporting(true);
    try {
      for (const product of products) {
        await addItem(product.id, 1);
      }
      openCartDrawer();
      toast.success("Routine added to cart!");
    } catch (err) {
      console.error("Error importing routine:", err);
      toast.error(err instanceof Error ? err.message : "There was an issue adding some items to your cart.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleAddSingle = async () => {
    if (!productId) return;
    
    setAddingId(productId);
    try {
      await addItem(productId, 1);
      openCartDrawer();
    } catch (err) {
      console.error("Cart error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to add to cart. Item might be out of stock.");
    } finally {
      setAddingId(null);
    }
  };

  if (products) {
    return (
      <button
        onClick={handleAddAll}
        disabled={isImporting || isCartLoading || products.length === 0}
        className="bg-on-background text-background font-label-lg px-10 py-5 uppercase tracking-[0.2em] text-sm hover:bg-primary hover:text-on-primary transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto"
      >
        {isImporting ? (
          <>
            <Sync className="animate-spin text-[20px]" />
            Adding Routine...
          </>
        ) : (
          <>
            <ShoppingBag className="text-[20px]" />
            Add Routine to Cart
          </>
        )}
      </button>
    );
  }

  if (productId) {
    return (
      <button 
        onClick={handleAddSingle}
        disabled={isCartLoading || addingId === productId}
        className="w-full py-4 bg-on-surface text-on-primary font-label-md uppercase tracking-wider hover:bg-primary transition-colors transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300 ease-out disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {addingId === productId ? "Adding..." : "Add to Cart"}
      </button>
    );
  }

  return null;
}
