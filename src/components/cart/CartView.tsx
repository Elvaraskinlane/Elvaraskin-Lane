"use client";

import { useState } from "react";
import Image from "next/image";

// Mock data typed for WooCommerce parity later
interface CartItem {
  id: string;
  name: string;
  details: string;
  price: number;
  quantity: number;
  image: string;
}

const initialCart: CartItem[] = [
  {
    id: "1",
    name: "Luminous Radiance Serum",
    details: "30ml / Vitamin C + Peptides",
    price: 45000,
    quantity: 1,
    image: "/hero-2-fixed.png"
  },
  {
    id: "2",
    name: "Cellular Night Repair Cream",
    details: "50ml / Retinol + Ceramide Blend",
    price: 68000,
    quantity: 1,
    image: "/hero-3.png"
  }
];

export default function CartView() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Format to NGN
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-margin-desktop">
      {/* Cart Items List */}
      <div className="lg:col-span-8 flex flex-col gap-gutter">
        {cartItems.length === 0 ? (
          <p className="font-body-md text-on-surface-variant">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-outline-variant">
              <div className="relative w-full sm:w-32 md:w-40 h-40 flex-shrink-0 bg-surface-container-low rounded overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill
                  className="object-cover mix-blend-multiply" 
                  sizes="(max-width: 640px) 100vw, 160px"
                />
              </div>
              <div className="flex flex-col flex-grow justify-between py-2">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-background">{item.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">{item.details}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} aria-label="Remove item" className="text-on-surface-variant hover:text-error transition-colors p-1">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center border border-outline-variant rounded-full overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity" className="px-3 py-1 text-on-surface-variant hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-[16px] leading-none">remove</span>
                    </button>
                    <span className="font-label-md text-label-md w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity" className="px-3 py-1 text-on-surface-variant hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-[16px] leading-none">add</span>
                    </button>
                  </div>
                  <span className="font-body-lg text-body-lg font-medium text-on-background">{formatPrice(item.price)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-4">
        <div className="bg-surface-container-low p-8 rounded border border-outline-variant sticky top-[100px]">
          <h2 className="font-headline-sm text-headline-sm text-on-background mb-6">Order Summary</h2>
          <div className="flex flex-col gap-4 font-body-md text-body-md text-on-surface-variant border-b border-outline-variant pb-6 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-on-background">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <div className="flex justify-between items-end mb-8">
            <span className="font-headline-sm text-headline-sm text-on-background">Total</span>
            <span className="font-headline-md text-headline-md text-on-background">{formatPrice(subtotal)}</span>
          </div>
          <button 
            disabled={cartItems.length === 0}
            className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded hover:bg-tertiary transition-colors duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
          </button>
          <p className="font-body-md text-body-md text-on-surface-variant text-center mt-4 text-sm opacity-70">
            Secure checkout. Taxes included where applicable.
          </p>
        </div>
      </div>
    </div>
  );
}
