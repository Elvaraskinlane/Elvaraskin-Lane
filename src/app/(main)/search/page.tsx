import Image from "next/image";
import Link from "next/link";
import SearchControls from "@/components/search/SearchControls";
import { searchProducts } from "@/lib/woocommerce";

// Note: In Next.js 15+, searchParams must be awaited if accessed dynamically
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  // Fetch live products based on query, or empty array if no query
  const products = searchQuery ? await searchProducts(searchQuery) : [];

  return (
    <>
      <header className="w-full pt-margin-desktop pb-12 px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center max-w-[1280px] mx-auto">
        <p className="font-label-md text-on-surface-variant mb-4 uppercase tracking-widest">Search Results</p>
        <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-6">"{searchQuery || 'All'}"</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl">
          {products.length > 0 
            ? `Discover our curated selection of formulations matching your search.`
            : `We couldn't find any products matching your search.`}
        </p>
      </header>

      {products.length > 0 && <SearchControls resultCount={products.length} />}

      <section className="w-full px-margin-mobile md:px-margin-desktop py-margin-desktop bg-surface-container-lowest min-h-[50vh]">
        <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-gutter gap-y-16">
          {products.length > 0 ? (
            products.map((product) => {
              const imageUrl = product.images?.[0]?.src || "/hero-2-fixed.png";
              return (
                <Link href={`/product/${product.slug}`} key={product.id} className="group flex flex-col cursor-pointer">
                  <div className="relative w-full aspect-[4/5] bg-surface-container-low overflow-hidden mb-6 rounded-sm">
                    <Image 
                      src={imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply p-4" 
                      sizes="(max-width: 640px) 100vw, 250px"
                    />
                    <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface text-primary px-6 py-3 font-label-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 w-[calc(100%-2rem)] border border-outline-variant/30 hover:bg-surface-container-low shadow-sm">
                      View Details
                    </button>
                  </div>
                  <div className="text-center flex flex-col gap-2">
                    <p className="font-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">
                      {product.categories?.[0]?.name || "Product"}
                    </p>
                    <h3 className="font-headline-sm text-primary">{product.name}</h3>
                    <p className="font-body-md text-on-surface-variant mt-1">
                      ₦{parseInt(product.price || "0").toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">search_off</span>
              <h2 className="font-headline-sm text-on-surface mb-2">No results found</h2>
              <p className="font-body-md text-on-surface-variant mb-8">Try adjusting your search terms or explore our curated collections.</p>
              <Link href="/shop" className="border border-primary text-primary px-10 py-4 font-label-md hover:bg-primary hover:text-on-primary transition-colors duration-300 rounded-sm">
                Shop All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
