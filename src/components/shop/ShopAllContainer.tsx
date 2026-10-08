"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { WCProduct } from "@/types/woocommerce";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { toast } from "sonner";
import { loadMoreProductsAction } from "@/app/actions/shopActions";
import ShopFilters from "./ShopFilters";
import { Search, SearchOff, Tune, Close } from '@material-symbols-svg/react';

export default function ShopAllContainer({ initialProducts }: { initialProducts: WCProduct[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();
  const { openCartDrawer } = useUIStore();

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
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filterCount =
    (searchParams.get("category")?.split(",").filter(Boolean).length || 0) +
    (searchParams.get("brand")?.split(",").filter(Boolean).length || 0) +
    (searchParams.get("concern")?.split(",").filter(Boolean).length || 0);

  useEffect(() => {
    setVisibleProducts(initialProducts);
    setPage(1);
    setHasMore(initialProducts.length === 24);
    setNoMoreMessage(false);
  }, [initialProducts]);

  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filtersOpen]);

  const applySearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applySearch();
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

  const searchField = (
    <div className="relative transition-colors group">
      <input
        type="search"
        placeholder="Search products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
        className="w-full bg-surface-container-low rounded-full py-3.5 pl-5 pr-12 font-body-md text-sm outline-none border border-transparent focus:border-outline-variant/30 focus:bg-surface transition-all placeholder:text-outline-variant/70 shadow-sm"
      />
      <button
        type="button"
        onClick={applySearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-on-surface-variant"
        aria-label="Search"
      >
        <Search className="text-[20px]" />
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">
      <aside className="hidden md:block md:col-span-3 space-y-8">
        <div>
          <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4 border-b border-outline-variant pb-2">
            Search
          </h3>
          <div className="mb-8">{searchField}</div>
          <Suspense fallback={<div className="font-body-md text-on-surface-variant py-4">Loading filters...</div>}>
            <ShopFilters />
          </Suspense>
        </div>
      </aside>

      {filtersOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div className="absolute inset-0 bg-on-background/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] bg-surface rounded-t-2xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-outline-variant/20">
              <h3 className="font-headline-sm text-lg text-on-surface">Filter</h3>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-11 h-11 flex items-center justify-center"
                aria-label="Close filters"
              >
                <Close className="text-[22px]" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 pb-[max(24px,env(safe-area-inset-bottom))]">
              <div className="mb-6">{searchField}</div>
              <Suspense fallback={<div className="font-body-md text-on-surface-variant py-4">Loading filters...</div>}>
                <ShopFilters />
              </Suspense>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="mt-6 w-full h-12 bg-on-background text-background text-sm rounded-full"
              >
                Show products
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="md:col-span-9">
        <div className="flex justify-between items-center gap-3 mb-6 pb-2 border-b border-outline-variant">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="md:hidden inline-flex items-center gap-2 h-11 px-4 border border-outline-variant rounded-full text-sm text-on-surface"
          >
            <Tune className="text-[18px]" />
            Filter{filterCount > 0 ? ` (${filterCount})` : ""}
          </button>
          <span className="font-body-md text-sm text-on-surface-variant">
            {visibleProducts.length} products
          </span>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="font-body-md text-sm text-on-surface bg-transparent border border-outline-variant/40 rounded-full h-11 px-3 outline-none"
          >
            <option value="recommended">Featured</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>

        {/* Dynamic Grid Mapping */}
        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-t border-outline-variant">
            <SearchOff className="text-6xl text-outline-variant mb-6 font-light" />
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No Products Found</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              We couldn't find any products matching your current filters. Try adjusting your search or clearing the active filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 md:gap-x-8 gap-y-8 md:gap-y-16 mb-16">
            {visibleProducts.map((product) => {
              const imageUrl = product.images?.[0]?.src || "/hero-2-fixed.png";

              return (
                <div key={product.id} className="group flex flex-col">
                  <Link href={`/product/${product.slug}`} className="relative bg-white aspect-[3/4] mb-3 overflow-hidden rounded-sm flex items-center justify-center border border-outline-variant/15">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover mix-blend-multiply p-4 md:p-6"
                      sizes="(max-width: 640px) 50vw, 250px"
                    />
                  </Link>
                  <div className="text-left md:text-center px-0 md:px-2 flex flex-col flex-1">
                    <Link href={`/product/${product.slug}`}>
                      <h4 className="font-body-md text-sm text-on-surface mb-1 line-clamp-2 leading-snug" dangerouslySetInnerHTML={{ __html: product.name }} />
                    </Link>
                    <p className="font-headline-sm text-base text-on-surface mb-3">
                      ₦{parseInt(product.price || "0").toLocaleString()}
                    </p>
                    {product.stock_status === "instock" ? (
                      <button
                        type="button"
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
