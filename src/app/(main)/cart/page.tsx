"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { cart, isLoading, fetchCart, addItem, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, [fetchCart]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      maximumFractionDigits: 0 
    }).format(Number(price) / 100 || 0);
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  if (isLoading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 font-light">shopping_bag</span>
        <h1 className="font-headline-md text-3xl text-on-surface mb-4 tracking-tight">Your Bag is Empty</h1>
        <p className="font-body-md text-on-surface-variant mb-8 max-w-md text-center">
          Discover our collection of curated skincare essentials and products to find your next favorite.
        </p>
        <Link 
          href="/shop" 
          className="bg-on-background text-background px-10 py-4 font-label-lg tracking-[0.2em] uppercase text-sm hover:bg-primary hover:text-on-primary transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
      <h1 className="font-headline-md text-3xl md:text-4xl text-on-surface mb-12 tracking-tight">
        Shopping Bag ({cart.items.reduce((acc, item) => acc + item.quantity, 0)})
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-8">
          <div className="border-t border-outline-variant/20 pt-8">
            {cart.items.map((item) => (
              <div key={item.key} className="flex gap-6 items-start border-b border-outline-variant/10 pb-8 mb-8">
                <Link href={`/product/${item.id}`} className="w-[120px] md:w-[160px] aspect-[4/5] bg-surface-container-lowest relative flex-shrink-0 rounded-sm overflow-hidden border border-outline-variant/10 group">
                  <Image 
                    src={item.images?.[0]?.src || "/hero-2-fixed.png"} 
                    alt={item.name} 
                    fill 
                    className="object-cover mix-blend-multiply p-2 transition-transform duration-500 group-hover:scale-105" 
                  />
                </Link>
                <div className="flex-1 pt-1 md:pt-2">
                  <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 mb-4">
                    <div>
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-headline-sm text-lg md:text-xl text-on-surface leading-tight hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: item.name }} />
                      </Link>
                      <p className="font-body-md text-sm text-on-surface-variant/80 uppercase tracking-widest mt-2">{formatPrice(item.prices.price)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center border border-outline-variant/50 w-fit rounded-none h-12">
                      <button 
                        onClick={() => useCartStore.getState().updateItemQuantity(item.key, item.quantity - 1)}
                        className="w-12 h-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1 || isLoading}
                      >
                        <span className="material-symbols-outlined text-[18px] font-light">remove</span>
                      </button>
                      <span className="font-label-md text-sm w-10 text-center text-on-surface">{item.quantity}</span>
                      <button 
                        onClick={() => useCartStore.getState().updateItemQuantity(item.key, item.quantity + 1)}
                        className="w-12 h-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <span className="material-symbols-outlined text-[18px] font-light">add</span>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.key)} 
                      className="text-on-surface-variant hover:text-error transition-colors text-sm uppercase tracking-widest font-label-md underline underline-offset-4 decoration-outline-variant/30"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-surface border border-outline-variant/20 p-8 sticky top-32">
            <h2 className="font-headline-sm text-xl text-on-surface tracking-tight mb-6">Order Summary</h2>
            
            <div className="space-y-4 font-body-md text-on-surface-variant border-b border-outline-variant/10 pb-6 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span className="text-on-surface">{formatPrice(cart.totals.total_price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-on-surface">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-8">
              <span className="font-headline-sm text-lg text-on-surface tracking-tight">Total</span>
              <span className="font-headline-sm text-2xl text-on-surface tracking-tight">
                {formatPrice(cart.totals.total_price)}
              </span>
            </div>
            
            <Link 
              href="/checkout"
              className="w-full bg-on-background text-background py-5 font-label-lg tracking-[0.2em] uppercase text-sm hover:bg-primary hover:text-on-primary transition-all duration-300 flex justify-center items-center shadow-md mb-4"
            >
              PROCEED TO CHECKOUT
            </Link>

            <button
              onClick={() => {
                if (!cart || cart.items.length === 0) return;
                const simplifiedCart = cart.items.map(item => ({ id: item.id, quantity: item.quantity }));
                const jsonString = JSON.stringify(simplifiedCart);
                const base64String = btoa(jsonString);
                const shareUrl = `${window.location.origin}/cart/shared?data=${base64String}`;
                
                navigator.clipboard.writeText(shareUrl).then(() => {
                  alert("Cart link copied to clipboard! Share it with a friend.");
                });
              }}
              className="w-full bg-transparent border border-outline-variant text-on-surface py-5 font-label-lg tracking-[0.2em] uppercase text-sm hover:bg-surface-container-highest transition-all duration-300 flex justify-center items-center mb-4 gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              SHARE CART
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">lock</span>
              <span className="text-xs uppercase tracking-widest font-label-md">Secure Checkout</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
