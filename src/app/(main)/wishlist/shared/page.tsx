"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { WCProduct } from "@/types/woocommerce";

function SharedWishlistHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem, isLoading: isCartLoading } = useCartStore();
  
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = searchParams.get("data");
      if (!data) {
        setError("No shared routine data found in the URL.");
        setIsLoading(false);
        return;
      }

      try {
        const jsonString = atob(data);
        const ids = JSON.parse(jsonString);
        
        if (!Array.isArray(ids) || ids.length === 0) {
          throw new Error("Invalid routine data format.");
        }
        
        // Fetch products via Next.js proxy to WooCommerce Store API
        const res = await fetch(`/api/store/products?include=${ids.join(",")}`);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        
        const fetchedProducts = await res.json();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to decode shared routine:", err);
        setError("This shared link appears to be invalid or corrupted.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      for (const product of products) {
        await addItem(product.id, 1);
      }
      router.push("/cart");
    } catch (err: any) {
      console.error("Error importing routine:", err);
      alert("There was an issue adding some items to your cart.");
      setIsImporting(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      maximumFractionDigits: 0 
    }).format(Number(price) / 100 || 0); // Store API returns minor units
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
        <span className="font-label-md text-on-surface-variant uppercase tracking-widest">Loading Routine...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <span className="material-symbols-outlined text-error text-5xl mb-6">error</span>
        <h3 className="font-headline-md text-on-surface mb-4 tracking-tight">Invalid Link</h3>
        <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-8">
          {error}
        </p>
        <Link href="/shop" className="bg-on-background text-background font-label-lg px-8 py-4 uppercase tracking-[0.2em] text-sm hover:bg-primary hover:text-on-primary transition-colors inline-block shadow-md">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
      <div className="text-center mb-16 animate-fade-in">
        <span className="material-symbols-outlined text-primary text-5xl mb-6 font-light">auto_awesome</span>
        <h1 className="font-headline-md text-3xl md:text-5xl text-on-surface mb-6 tracking-tight">
          A Curated Routine For You
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 text-lg">
          Someone has shared their personal skincare routine with you. Discover the products they love and add them to your own regimen.
        </p>
        
        <button
          onClick={handleImport}
          disabled={isImporting || isCartLoading || products.length === 0}
          className="bg-on-background text-background font-label-lg px-10 py-5 uppercase tracking-[0.2em] text-sm hover:bg-primary hover:text-on-primary transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto"
        >
          {isImporting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              Adding Routine...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              Add Routine to Cart
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-16">
        {products.map((product, index) => {
          const imageSrc = product.images?.[0]?.src || "/hero-3.png";
          return (
            <div key={product.id} className="group relative flex flex-col animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative w-full aspect-[4/5] bg-surface-container-low overflow-hidden mb-6 rounded-sm border border-outline-variant/10">
                <Image 
                  src={imageSrc} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out p-4 mix-blend-multiply" 
                />
              </div>
              
              <div className="flex justify-between items-start text-center flex-col px-2">
                <h3 className="font-headline-sm text-on-surface text-lg w-full mb-2" dangerouslySetInnerHTML={{ __html: product.name }} />
                <p className="font-label-md text-on-surface-variant w-full mt-1 uppercase tracking-widest">{formatPrice(product.prices?.price || product.price)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SharedWishlistPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
        <span className="font-label-md text-on-surface-variant uppercase tracking-widest">Loading...</span>
      </div>
    }>
      <SharedWishlistHandler />
    </Suspense>
  );
}
