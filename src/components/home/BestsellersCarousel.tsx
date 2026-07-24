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

      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar px-margin-mobile md:px-margin-desktop pb-8 space-x-8 md:space-x-10 w-full max-w-[1280px] mx-auto scroll-smooth">
        {initialProducts.map((product) => (
          <Link href={`/product/${product.slug}`} key={product.id} className="flex-none w-[280px] md:w-[320px] snap-start group cursor-pointer flex flex-col block transition-all duration-500">
            <div className="relative aspect-[3/4] bg-white mb-6 overflow-hidden rounded-sm flex items-center justify-center border border-outline-variant/15 group-hover:border-outline-variant/30 transition-all duration-500 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              <Image 
                src={product.images?.[0]?.src || "/hero-2-fixed.png"} 
                alt={product.name}
                fill
                className="object-cover object-top mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.03] p-6"
                sizes="(max-width: 768px) 280px, 320px"
              />
              
              {/* Minimalist Floating Pill Button */}
              <div className="absolute bottom-6 left-0 w-full px-4 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-10">
                <button 
                  aria-label={`Add ${product.name} to cart`}
                  className="bg-black text-white font-label-md text-[11px] py-3.5 px-8 rounded-full shadow-lg hover:bg-primary transition-colors uppercase tracking-[0.15em] flex items-center gap-2"
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
            </div>
            <div className="text-center px-2">
              <h4 className="font-label-md text-[13px] text-on-surface mb-2 uppercase tracking-widest line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.name }} />
              <p className="font-headline-sm text-[15px] text-on-surface-variant/80">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
