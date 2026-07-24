"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";

export default function WishlistGrid() {
  const { items, toggleItem } = useWishlistStore();
  const { addItem, isLoading } = useCartStore();
  const { openCartDrawer } = useUIStore();
  
  const [mounted, setMounted] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = async (id: number) => {
    setAddingId(id);
    try {
      await addItem(id, 1);
      openCartDrawer();
    } catch (err) {
      console.error(err);
    } finally {
      setAddingId(null);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      maximumFractionDigits: 0 
    }).format(Number(price) || 0);
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 font-light">favorite</span>
        <h2 className="font-headline-md text-on-surface mb-4">Your wishlist is empty</h2>
        <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-8">Discover our collection of high-performance skincare and save your favorite products here.</p>
        <Link href="/shop" className="inline-block border border-on-surface text-on-surface px-8 py-4 font-label-md uppercase tracking-wider hover:bg-on-surface hover:text-on-primary transition-colors">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end animate-fade-in">
        <button
          onClick={() => {
            if (items.length === 0) return;
            const ids = items.map(item => item.id);
            const jsonString = JSON.stringify(ids);
            const base64String = btoa(jsonString);
            const shareUrl = `${window.location.origin}/wishlist/shared?data=${base64String}`;
            
            navigator.clipboard.writeText(shareUrl).then(() => {
              alert("Routine link copied to clipboard! Share your curated skincare routine.");
            });
          }}
          className="bg-transparent border border-outline-variant text-on-surface px-6 py-3 font-label-md tracking-[0.15em] uppercase text-xs hover:bg-surface-container-highest transition-all duration-300 flex items-center gap-2 rounded-sm"
        >
          <span className="material-symbols-outlined text-[16px]">share</span>
          Share My Routine
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-16">
        {items.map((item, index) => (
        <div key={item.id} className="group relative flex flex-col animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="relative w-full aspect-[4/5] bg-surface-container-low overflow-hidden mb-6 rounded-sm">
            <Image src={item.image || "/hero-3.png"} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out p-4 mix-blend-multiply" />
            
            {/* Action Overlay */}
            <div className="absolute inset-0 bg-on-surface/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <button 
                  onClick={() => toggleItem(item)}
                  aria-label="Remove" 
                  className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-on-surface hover:bg-surface hover:text-error transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              <button 
                onClick={() => handleAddToCart(item.id)}
                disabled={isLoading && addingId === item.id}
                className="w-full py-4 bg-on-surface text-on-primary font-label-md uppercase tracking-wider hover:bg-primary transition-colors transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300 ease-out disabled:opacity-50"
              >
                {addingId === item.id ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-start text-center flex-col">
            <h3 className="font-headline-sm text-on-surface w-full mb-2" dangerouslySetInnerHTML={{ __html: item.name }} />
            <p className="font-label-md text-on-surface-variant w-full mt-2">{formatPrice(item.price)}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

