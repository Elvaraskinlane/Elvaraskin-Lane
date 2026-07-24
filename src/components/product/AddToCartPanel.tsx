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
  slug?: string;
}

export default function AddToCartPanel({ productId, price, stockStatus, productName, image = "", slug = "" }: AddToCartProps) {
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
    <div className="flex flex-col gap-8 mt-12 pt-8 border-t border-outline-variant/15">
      <div className="flex items-center justify-between">
        <span className="font-headline-md text-2xl md:text-3xl text-on-background tracking-tight">
          {formatPrice(price)}
        </span>
        <span className={`font-label-md text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full border ${
          isOutOfStock 
            ? 'text-error border-error/20 bg-error/5' 
            : 'text-on-background border-outline-variant/30 bg-transparent'
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
            className="flex-grow h-[52px] w-full bg-[#25D366] text-white font-label-lg text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:bg-[#128C7E] transition-all duration-300 flex items-center justify-center gap-2 shadow-md rounded-full px-4"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Contact for Restock
          </a>
        ) : (
          <>
            {/* Quantity Selector */}
            <div className="flex items-center border border-outline-variant/30 rounded-full h-[52px] w-full sm:w-[140px] flex-shrink-0 bg-transparent overflow-hidden">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex-1 h-full text-on-surface-variant hover:text-black hover:bg-black/5 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="font-label-md text-[13px] text-on-background text-center w-10">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="flex-1 h-full text-on-surface-variant hover:text-black hover:bg-black/5 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-grow h-[52px] w-full bg-black text-white font-label-md text-[11px] uppercase tracking-[0.2em] rounded-full hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </>
        )}
        
        {/* Wishlist Toggle */}
        <button 
          onClick={() => toggleItem({ id: productId, name: productName, price, image, slug })}
          className={`h-[52px] w-[52px] flex-shrink-0 border rounded-full flex items-center justify-center transition-all ${
            isWished 
              ? 'border-error/30 text-error bg-error/5 hover:bg-error/10' 
              : 'border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error/30 hover:bg-error/5'
          }`}
        >
          {/* Note: 'heart_check' or using filled styles can indicate liked state */}
          <span className={`material-symbols-outlined text-[20px] ${isWished ? 'font-solid text-error fill-error' : 'font-light'}`}>
            favorite
          </span>
        </button>
      </div>
    </div>
  );
}
