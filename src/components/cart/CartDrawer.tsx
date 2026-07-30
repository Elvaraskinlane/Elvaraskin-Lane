"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { Close, ProgressActivity, ShoppingBag, Delete, Remove, Add } from '@material-symbols-svg/react';

export default function CartDrawer() {
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { cart, isLoading, fetchCart, removeItem } = useCartStore();

  // Fetch cart data when drawer opens
  useEffect(() => {
    if (isCartDrawerOpen) {
      fetchCart();
    }
  }, [isCartDrawerOpen, fetchCart]);

  if (!isCartDrawerOpen) return null;

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      maximumFractionDigits: 0 
    }).format(Number(price) / 100 || 0); // WooCommerce Store API returns prices in minor units (kobo)
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-background/60 backdrop-blur-md transition-all duration-300">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={closeCartDrawer}></div>
      
      {/* Drawer Panel */}
      <div className="relative w-full max-w-[420px] bg-surface h-full shadow-2xl flex flex-col animate-slide-in-right border-l border-outline-variant/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-outline-variant/20">
          <h2 className="font-headline-sm text-xl text-on-surface tracking-tight">
            Shopping Bag ({cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0})
          </h2>
          <button onClick={closeCartDrawer} className="text-on-surface-variant hover:text-error transition-colors p-2 -mr-2">
            <Close className="font-light text-3xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {isLoading && !cart ? (
            <div className="flex justify-center items-center h-full">
              <ProgressActivity className="animate-spin text-primary text-3xl" />
            </div>
          ) : !cart?.items?.length ? (
            <div className="text-center h-full flex flex-col justify-center items-center">
              <ShoppingBag className="text-5xl text-outline-variant mb-4" />
              <p className="font-body-md text-on-surface-variant">Your bag is empty.</p>
              <button onClick={closeCartDrawer} className="mt-6 font-label-md text-primary underline underline-offset-4">Continue Shopping</button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.key} className="flex gap-6 items-start border-b border-outline-variant/10 pb-8 mb-8 last:border-0 last:mb-0 last:pb-0">
                <div className="w-[100px] h-[120px] bg-surface-container-lowest relative flex-shrink-0 rounded-sm overflow-hidden border border-outline-variant/10">
                  <Image 
                    src={item.images?.[0]?.src || "/hero-2-fixed.png"} 
                    alt={item.name} 
                    fill 
                    sizes="100px"
                    className="object-cover mix-blend-multiply p-2" 
                  />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-headline-sm text-lg text-on-surface leading-tight" dangerouslySetInnerHTML={{ __html: item.name }} />
                    <button onClick={() => removeItem(item.key)} className="text-on-surface-variant hover:text-error transition-colors" aria-label="Remove item">
                      <Delete className="text-[20px]" />
                    </button>
                  </div>
                  <p className="font-body-md text-sm text-on-surface-variant/80 uppercase tracking-widest mb-6">{formatPrice(item.prices.price)}</p>
                  
                  <div className="flex items-center border border-outline-variant/50 w-fit rounded-none h-10">
                    <button 
                      onClick={() => useCartStore.getState().updateItemQuantity(item.key, item.quantity - 1)}
                      disabled={isLoading || item.quantity <= 1}
                      className="w-10 h-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                    >
                      <Remove className="text-[16px]" />
                    </button>
                    <span className="font-label-md text-sm w-8 text-center text-on-surface">{item.quantity}</span>
                    <button 
                      onClick={() => useCartStore.getState().updateItemQuantity(item.key, item.quantity + 1)}
                      disabled={isLoading}
                      className="w-10 h-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                    >
                      <Add className="text-[16px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        <div className="p-8 border-t border-outline-variant/20 bg-surface">
          <div className="flex justify-between items-end mb-8">
            <span className="font-body-md text-on-surface-variant uppercase tracking-widest text-sm">Subtotal</span>
            <span className="font-headline-sm text-2xl text-on-surface tracking-tight">
              {cart?.totals?.total_price ? formatPrice(cart.totals.total_price) : "₦ 0"}
            </span>
          </div>
          {cart && cart.items && cart.items.length > 0 && (
            <Link 
              href="/checkout"
              onClick={closeCartDrawer} 
              className="w-full bg-on-background text-background py-5 font-label-lg tracking-[0.2em] uppercase text-sm hover:bg-primary hover:text-on-primary transition-all duration-300 flex justify-center items-center shadow-md mb-4"
            >
              PROCEED TO CHECKOUT
            </Link>
          )}
          <Link 
            href="/cart"
            onClick={closeCartDrawer} 
            className="w-full text-center block py-3 font-label-md text-on-surface-variant hover:text-on-surface uppercase tracking-widest text-xs underline underline-offset-8 decoration-outline-variant/30 hover:decoration-on-surface transition-all"
          >
            View Full Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
