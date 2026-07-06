"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export default function AddToCartButton({ productId, productName }: { productId: number, productName: string }) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await addToCart(productId, 1);
      alert(`${productName} added to cart!`);
    } catch(err) {
      console.error(err);
      alert('Failed to add to cart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={loading}
      className="w-full bg-on-background text-background font-label-lg text-sm py-5 px-8 uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {loading ? "Adding to Cart..." : "Add to Cart"}
    </button>
  );
}
