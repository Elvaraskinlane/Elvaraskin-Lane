"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { WCProduct } from "@/types/woocommerce";
import { useUIStore } from "@/store/useUIStore";
import { useCartStore } from "@/store/useCartStore";

interface BestsellersProps {
  initialProducts?: WCProduct[];
  title?: string;
  subtitle?: string;
  linkText?: string;
}

export default function BestsellersCarousel({ 
  initialProducts = [],
  title = "The Bestsellers",
  subtitle = "Beloved by our community.",
  linkText = "Shop All Bestsellers"
}: BestsellersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openCartDrawer } = useUIStore();
  const { addItem } = useCartStore();

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  // Format price helper
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      maximumFractionDigits: 0 
    }).format(Number(price) || 0);
  };

  // Improved empty state gracefully handles API latency or empty catalogs
  if (!initialProducts || initialProducts.length === 0) {
    return (
      <section className="py-20 bg-surface-container-lowest border-y border-outline-variant/20">
        <div className="px-margin-mobile md:px-margin-desktop w-full max-w-[1280px] mx-auto text-center flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4 font-light">
            auto_awesome
          </span>
          <h2 className="font-headline-md text-headline-md text-on-background mb-2">{title}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
            Our curated collection is currently being refreshed. Check back soon for our most loved essentials.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-surface-container-lowest border-y border-outline-variant/20">
      <div className="px-margin-mobile md:px-margin-desktop w-full max-w-[1280px] mx-auto mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-background mb-2">{title}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{subtitle}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-2">
            <button onClick={scrollLeft} className="w-10 h-10 border border-outline-variant flex items-center justify-center rounded-full hover:border-primary hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px] font-light">chevron_left</span>
            </button>
            <button onClick={scrollRight} className="w-10 h-10 border border-outline-variant flex items-center justify-center rounded-full hover:border-primary hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px] font-light">chevron_right</span>
            </button>
          </div>
          <Link 
            href="/shop" 
            aria-label={linkText}
            className="hidden md:inline-flex items-center font-label-md text-label-md text-primary hover:text-on-background transition-colors group tracking-widest uppercase text-xs"
          >
            {linkText} 
            <span className="material-symbols-outlined ml-1 text-[18px] group-hover:translate-x-1 transition-transform font-light">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>

      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar px-margin-mobile md:px-margin-desktop pb-8 space-x-6 md:space-x-8 w-full max-w-[1280px] mx-auto scroll-smooth">
        {initialProducts.map((product) => (
          <Link href={`/product/${product.slug}`} key={product.id} className="flex-none w-[280px] md:w-[320px] snap-start group cursor-pointer block">
            <div className="relative aspect-[4/5] bg-white mb-6 overflow-hidden rounded-md flex items-center justify-center border border-outline-variant/10 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
              <Image 
                src={product.images?.[0]?.src || "/hero-2-fixed.png"} 
                alt={product.name}
                fill
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 280px, 320px"
              />
              
              <button 
                aria-label={`Add ${product.name} to cart`}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] bg-white/90 backdrop-blur-sm text-on-background py-3 font-label-md text-label-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-on-primary shadow-sm uppercase tracking-wider"
                onClick={async (e) => {
                  e.preventDefault(); // Prevent navigating to product page
                  try {
                    await addItem(product.id, 1);
                    openCartDrawer();
                  } catch (err) {
                    console.error("Cart error:", err);
                    alert("Failed to add to cart.");
                  }
                }}
              >
                Add to Cart
              </button>
            </div>
            <div className="text-center">
              <h4 className="font-headline-sm text-[20px] leading-tight text-on-background mb-2 line-clamp-1">{product.name}</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
