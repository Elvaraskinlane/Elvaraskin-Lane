"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { WCProduct } from "@/types/woocommerce";
import { useUIStore } from "@/store/useUIStore";
import { useCartStore } from "@/store/useCartStore";
import { Stars, ChevronLeft, ChevronRight, ArrowForward } from '@material-symbols-svg/react';

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
          <Stars className="text-[48px] text-outline-variant mb-4 font-light" />
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
              <ChevronLeft className="text-[20px] font-light" />
            </button>
            <button onClick={scrollRight} className="w-10 h-10 border border-outline-variant flex items-center justify-center rounded-full hover:border-primary hover:text-primary transition-colors">
              <ChevronRight className="text-[20px] font-light" />
            </button>
          </div>
          <Link 
            href="/shop" 
            aria-label={linkText}
            className="inline-flex items-center font-body-md text-sm text-primary hover:text-on-background transition-colors group"
          >
            {linkText} 
            <ArrowForward className="ml-1 text-[18px] group-hover:translate-x-1 transition-transform font-light" />
          </Link>
        </div>
      </div>

      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar px-margin-mobile md:px-margin-desktop pb-8 space-x-4 md:space-x-10 w-full max-w-[1280px] mx-auto scroll-smooth">
        {initialProducts.map((product) => (
          <div key={product.id} className="flex-none w-[70vw] max-w-[280px] md:w-[320px] md:max-w-none snap-start group flex flex-col">
            <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] bg-white mb-3 overflow-hidden rounded-sm flex items-center justify-center border border-outline-variant/15">
              <Image
                src={product.images?.[0]?.src || "/hero-2-fixed.png"}
                alt={product.name}
                fill
                className="object-cover object-top mix-blend-multiply p-6"
                sizes="(max-width: 768px) 70vw, 320px"
              />
            </Link>
            <div className="text-left md:text-center px-0 md:px-2 flex flex-col flex-1">
              <Link href={`/product/${product.slug}`}>
                <h4 className="font-body-md text-sm text-on-surface mb-1 line-clamp-2 leading-snug" dangerouslySetInnerHTML={{ __html: product.name }} />
              </Link>
              <p className="font-headline-sm text-base text-on-surface mb-3">{formatPrice(product.price)}</p>
              {product.stock_status === "instock" ? (
                <button
                  type="button"
                  aria-label={`Add ${product.name} to cart`}
                  className="mt-auto w-full h-11 bg-on-background text-background text-sm rounded-full hover:bg-primary transition-colors"
                  onClick={async () => {
                    try {
                      await addItem(product.id, 1);
                      openCartDrawer();
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Could not add this item.");
                    }
                  }}
                >
                  Add to cart
                </button>
              ) : (
                <button type="button" disabled className="mt-auto w-full h-11 bg-surface-container-high text-on-surface-variant text-sm rounded-full">
                  Out of stock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
