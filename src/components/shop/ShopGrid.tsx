"use client";

import Image from "next/image";
import { useState } from "react";
import { WCProduct } from "@/types/woocommerce"; // Import the type we defined

export default function ShopGrid({ initialProducts }: { initialProducts: WCProduct[] }) {
  // Store products in state so we can filter/sort them client-side later
  const [products, setProducts] = useState<WCProduct[]>(initialProducts);

  // Elegant empty state if the WordPress database is empty
  if (!products || products.length === 0) {
    return (
      <section className="md:col-span-9 flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 font-light">inventory_2</span>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Your Catalog is Empty</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
          Add products to your Truehost WooCommerce dashboard to see them appear here instantly.
        </p>
      </section>
    );
  }

  return (
    <section className="md:col-span-9">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant">
        <span className="font-label-md text-label-md text-on-surface-variant">Showing 1-{products.length} Products</span>
        <select className="font-label-md text-label-md text-primary bg-transparent border-none focus:ring-0 cursor-pointer uppercase tracking-widest outline-none">
          <option>Sort by Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>New Arrivals</option>
        </select>
      </div>

      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => {
          // Graceful fallback if a product is published without an image
          const imageUrl = product.images?.[0]?.src || "/hero-1.png";

          // Heuristic to split brand name if it exists (e.g. "LUSH HAIR - Product Name")
          let brandName = "Elvara";
          let displayName = product.name;
          if (product.name.includes(" - ")) {
            const parts = product.name.split(" - ");
            brandName = parts[0].trim();
            displayName = parts.slice(1).join(" - ").trim();
          }

          return (
            <div key={product.id} className="group cursor-pointer flex flex-col">
              {/* Studio Quality Image Container */}
              <div className="relative bg-[#FAFAFA] aspect-[4/5] mb-5 overflow-hidden flex items-center justify-center">
                <Image 
                  src={imageUrl} 
                  alt={product.name} 
                  fill
                  className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out p-6" 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Sleek Quick Add Button */}
                <button className="absolute bottom-0 left-0 w-full bg-black text-white font-label-md text-[11px] uppercase tracking-[0.2em] py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  Quick Add
                </button>
              </div>
              
              {/* Refined Typography (Left Aligned) */}
              <div className="text-left px-1">
                <h4 className="font-label-md text-[10px] tracking-[0.15em] uppercase text-gray-500 mb-1.5 line-clamp-1">{brandName}</h4>
                <h3 className="font-body-md text-sm text-black mb-2 line-clamp-2 leading-relaxed">{displayName}</h3>
                <p className="font-body-md text-sm text-black">₦{parseInt(product.price || "0").toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sleek Load More Button */}
      <div className="flex justify-center items-center mt-20">
        <button className="px-12 py-4 border border-black text-black font-label-md text-[11px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors duration-500">
          Load More Products
        </button>
      </div>
    </section>
  );
}
