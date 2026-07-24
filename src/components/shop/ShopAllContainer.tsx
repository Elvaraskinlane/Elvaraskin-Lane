"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { WCProduct } from "@/types/woocommerce";
import { addToCart } from "@/lib/cart";
import { loadMoreProductsAction } from "@/app/actions/shopActions";
import ShopFilters from "./ShopFilters";

export default function ShopAllContainer({ initialProducts }: { initialProducts: WCProduct[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [visibleProducts, setVisibleProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === 24);
  const [noMoreMessage, setNoMoreMessage] = useState(false);

  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const currentOrderBy = searchParams.get("orderby");
  const currentOrder = searchParams.get("order");
  let sortValue = "recommended";
  if (currentOrderBy === "price" && currentOrder === "asc") sortValue = "low-to-high";
  if (currentOrderBy === "price" && currentOrder === "desc") sortValue = "high-to-low";

  const [sortBy, setSortBy] = useState(sortValue);

  useEffect(() => {
    setVisibleProducts(initialProducts);
    setPage(1);
    setHasMore(initialProducts.length === 24);
    setNoMoreMessage(false);
  }, [initialProducts]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.push(`/shop?${params.toString()}`, { scroll: false });
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortBy(val);
    const params = new URLSearchParams(searchParams.toString());
    
    if (val === "low-to-high") {
      params.set("orderby", "price");
      params.set("order", "asc");
    } else if (val === "high-to-low") {
      params.set("orderby", "price");
      params.set("order", "desc");
    } else {
      params.delete("orderby");
      params.delete("order");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    
    const paramsObj: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });

    try {
      const newProducts = await loadMoreProductsAction(nextPage, paramsObj);
      if (newProducts && newProducts.length > 0) {
        setVisibleProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
        if (newProducts.length < 24) {
          setHasMore(false);
          setNoMoreMessage(true);
        }
      } else {
        setHasMore(false);
        setNoMoreMessage(true);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">
      
      {/* Sidebar Filters */}
      <aside className="md:col-span-3 space-y-8">
        <div>
          <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4 border-b border-outline-variant pb-2">
            Search Collection
          </h3>
          <div className="relative mb-8 transition-colors group">
            <input 
              type="text" 
              placeholder="Search and press Enter..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-surface-container-low rounded-full py-3.5 pl-5 pr-12 font-body-md text-sm outline-none border border-transparent focus:border-outline-variant/30 focus:bg-surface transition-all placeholder:text-outline-variant/70 shadow-sm"
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px] group-focus-within:text-primary transition-colors">search</span>
          </div>

          <Suspense fallback={<div className="font-body-sm text-on-surface-variant py-4">Loading filters...</div>}>
            <ShopFilters />
          </Suspense>
        </div>
      </aside>

      {/* Main Product Canvas */}
      <section className="md:col-span-9">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Showing {visibleProducts.length} Products
          </span>
          <select 
            value={sortBy}
            onChange={handleSortChange}
            className="font-label-md text-label-md text-primary bg-transparent border-none focus:ring-0 cursor-pointer uppercase tracking-widest outline-none"
          >
            <option value="recommended">Sort by Featured</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>

        {/* Dynamic Grid Mapping */}
        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-t border-outline-variant">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 font-light">search_off</span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No Products Found</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              We couldn't find any products matching your current filters. Try adjusting your search or clearing the active filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 mb-16">
            {visibleProducts.map((product) => {
              const imageUrl = product.images?.[0]?.src || "/hero-2-fixed.png";

              return (
                <Link href={`/product/${product.slug}`} key={product.id} className="group cursor-pointer flex flex-col block transition-all duration-500">
                  <div className="relative bg-white aspect-[3/4] mb-6 overflow-hidden rounded-sm flex items-center justify-center border border-outline-variant/15 group-hover:border-outline-variant/30 transition-all duration-500 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <Image 
                      src={imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-700 ease-out p-6"
                      sizes="(max-width: 640px) 100vw, 250px"
                    />
                    
                    {/* Minimalist Floating Pill Button */}
                    <div className="absolute bottom-6 left-0 w-full px-4 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-10">
                      <button 
                        className="bg-black text-white font-label-md text-[11px] py-3.5 px-8 rounded-full shadow-lg hover:bg-primary transition-colors uppercase tracking-[0.15em] flex items-center gap-2"
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
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="text-center px-2">
                    <h4 className="font-label-md text-[13px] text-on-surface mb-2 uppercase tracking-widest line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.name }} />
                    <p className="font-headline-sm text-[15px] text-on-surface-variant/80">
                      ₦{parseInt(product.price || "0").toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && visibleProducts.length > 0 ? (
          <div className="flex justify-center items-center mt-12 border-t border-outline-variant pt-12 pb-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="font-label-lg text-label-lg border border-black dark:border-primary-fixed text-black dark:text-primary-fixed hover:bg-black hover:text-white dark:hover:bg-primary-fixed dark:hover:text-background transition-colors duration-300 py-4 px-12 uppercase tracking-widest disabled:opacity-50"
            >
              {isLoadingMore ? "Loading..." : "Load More Products"}
            </button>
          </div>
        ) : noMoreMessage && visibleProducts.length > 0 ? (
          <div className="flex justify-center items-center mt-12 border-t border-outline-variant pt-12 pb-8">
            <p className="font-body-md text-on-surface-variant italic">You have reached the end of the collection.</p>
          </div>
        ) : null}
      </section>

    </div>
  );
}
