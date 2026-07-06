"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { useWishlistStore } from "@/store/useWishlistStore";

interface AddToCartProps {
  productId: number;
  price: string;
  stockStatus: string;
  productName: string;
  image?: string;
}

export default function AddToCartPanel({ productId, price, stockStatus, productName, image = "" }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { openCartDrawer } = useUIStore();
  const { addItem } = useCartStore();
  const { items, toggleItem, isInWishlist } = useWishlistStore();
  
  // Prevent hydration mismatch by defaulting to false on server
  const isWished = mounted ? isInWishlist(productId) : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      maximumFractionDigits: 0 
    }).format(Number(amount) || 0);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem(productId, quantity);
      openCartDrawer();
    } catch (err) {
      console.error("Cart error:", err);
      alert("Failed to add to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = stockStatus === 'outofstock';

  return (
    <div className="flex flex-col gap-8 mt-10 pt-8 border-t border-outline-variant/20">
      <div className="flex items-center justify-between">
        <span className="font-body-lg text-3xl md:text-4xl text-on-background tracking-tight">
          {formatPrice(price)}
        </span>
        <span className={`font-label-md text-xs tracking-widest uppercase px-4 py-2 rounded-full border ${
          isOutOfStock 
            ? 'text-error border-error bg-error-container/10' 
            : 'text-primary border-primary bg-primary-container/10'
        }`}>
          {isOutOfStock ? 'Out of Stock' : 'In Stock'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
        {isOutOfStock ? (
          <a 
            href={`https://wa.me/2348089647342?text=${encodeURIComponent(`Hi Elvara Skinlane! I am interested in the ${productName} but it is out of stock. Could you let me know when it will be restocked or recommend an alternative?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-grow h-14 w-full bg-[#25D366] text-white font-label-lg text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:bg-[#128C7E] transition-all duration-300 flex items-center justify-center gap-2 shadow-md px-2"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            Contact for Restock
          </a>
        ) : (
          <>
            {/* Quantity Selector */}
            <div className="flex items-center border border-outline-variant rounded-none h-14 w-full sm:w-32 flex-shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex-1 h-full text-on-surface-variant hover:text-on-background hover:bg-surface-container-highest transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <span className="font-label-lg text-on-background text-center w-12">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="flex-1 h-full text-on-surface-variant hover:text-on-background hover:bg-surface-container-highest transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-grow h-14 w-full bg-on-background text-background font-label-lg text-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </>
        )}
        
        {/* Wishlist Toggle */}
        <button 
          onClick={() => toggleItem({ id: productId, name: productName, price, image })}
          className={`h-14 w-14 flex-shrink-0 border rounded-none flex items-center justify-center transition-all ${
            isWished 
              ? 'border-error text-error bg-error-container/10 hover:bg-error-container/20' 
              : 'border-outline-variant text-on-surface-variant hover:text-error hover:border-error hover:bg-error-container/5'
          }`}
        >
          {/* Note: 'heart_check' or using filled styles can indicate liked state */}
          <span className={`material-symbols-outlined text-[24px] ${isWished ? 'font-solid text-error fill-error' : 'font-light'}`}>
            favorite
          </span>
        </button>
      </div>
    </div>
  );
}
