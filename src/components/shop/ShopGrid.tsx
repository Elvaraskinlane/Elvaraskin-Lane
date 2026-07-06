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

          return (
            <div key={product.id} className="group cursor-pointer flex flex-col">
              <div className="relative bg-surface-container-low aspect-[4/5] mb-4 overflow-hidden rounded-sm flex items-center justify-center">
                <Image 
                  src={imageUrl} 
                  alt={product.name} 
                  fill
                  className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out p-4" 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-on-background text-background font-label-md text-label-md px-6 py-3 w-11/12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-secondary">
                  ADD TO CART
                </button>
              </div>
              <div className="text-center">
                {/* Dynamically render live product data */}
                <h4 className="font-headline-sm text-headline-sm text-primary mb-1">{product.name}</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  ₦{parseInt(product.price || "0").toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Container */}
      <div className="flex justify-center items-center mt-16 space-x-2 font-label-md text-label-md">
        <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50" disabled>
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary">1</button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
