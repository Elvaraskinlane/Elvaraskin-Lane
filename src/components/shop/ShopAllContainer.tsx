"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WCProduct } from "@/types/woocommerce";
import { addToCart } from "@/lib/cart";

export default function ShopAllContainer({ initialProducts }: { initialProducts: WCProduct[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]);
  const [sortBy, setSortBy] = useState("recommended");

  // Hardcoded categories mapping to match WooCommerce slugs
  const categories = [
    { name: "All Skincare", slug: "all" },
    { name: "Cleansers", slug: "cleansers" },
    { name: "Serums & Oils", slug: "serums-oils" },
    { name: "Rituals", slug: "rituals" },
  ];

  const handleCategoryChange = (slug: string) => {
    if (slug === "all") {
      setSelectedCategories(["all"]);
      return;
    }
    
    setSelectedCategories(prev => {
      const filtered = prev.filter(item => item !== "all");
      if (filtered.includes(slug)) {
        const updated = filtered.filter(item => item !== slug);
        return updated.length === 0 ? ["all"] : updated;
      }
      return [...filtered, slug];
    });
  };

  // Client-side filter matching for instantaneous UX
  const filteredProducts = initialProducts.filter((product) => {
    const desc = product.description || "";
    const name = product.name || "";
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.includes("all") || 
      (product.categories && product.categories.some(cat => selectedCategories.includes(cat.slug)));
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">
      
      {/* Sidebar Filters */}
      <aside className="md:col-span-3 space-y-8">
        <div>
          <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4 border-b border-outline-variant pb-2">
            Search Collection
          </h3>
          <div className="relative border-b border-outline-variant/60 focus-within:border-primary mb-8 transition-colors">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-2 pl-0 pr-8 font-body-md text-sm outline-none border-0 focus:ring-0 placeholder:text-outline-variant"
            />
            <span className="material-symbols-outlined absolute right-0 top-2 text-on-surface-variant text-xl">search</span>
          </div>

          <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4 border-b border-outline-variant pb-2">
            Product Categories
          </h3>
          <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <label className="flex items-center cursor-pointer hover:text-primary transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => handleCategoryChange(cat.slug)}
                    className="form-checkbox rounded-sm text-primary border-outline-variant focus:ring-primary mr-3 w-4 h-4 bg-transparent cursor-pointer" 
                  />
                  {cat.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Product Canvas */}
      <section className="md:col-span-9">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Showing {filteredProducts.length} of {initialProducts.length} Products
          </span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="font-label-md text-label-md text-primary bg-transparent border-none focus:ring-0 cursor-pointer uppercase tracking-widest outline-none"
          >
            <option value="recommended">Sort by Featured</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>

        {/* Dynamic Grid Mapping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => {
            const imageUrl = product.images?.[0]?.src || "/hero-2-fixed.png";

            return (
              <Link href={`/product/${product.slug}`} key={product.id} className="group cursor-pointer flex flex-col block">
                <div className="relative bg-surface-container-low aspect-[4/5] mb-4 overflow-hidden rounded-sm flex items-center justify-center">
                  <Image 
                    src={imageUrl} 
                    alt={product.name} 
                    fill 
                    className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out p-4"
                    sizes="(max-width: 640px) 100vw, 250px"
                  />
                  <button 
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-on-background text-background font-label-md text-label-md py-3 w-11/12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-on-primary shadow-sm uppercase tracking-wider"
                    onClick={async (e) => {
                      e.preventDefault(); // Prevent navigating to product page
                      try {
                        await addToCart(product.id, 1);
                        alert(`${product.name} added to cart!`);
                      } catch (err) {
                        console.error("Cart error:", err);
                        alert("Failed to add to cart.");
                      }
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
                <div className="text-center">
                  <h4 className="font-headline-sm text-headline-sm text-primary mb-1">{product.name}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    ₦{parseInt(product.price || "0").toLocaleString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
