import Image from "next/image";
import Link from "next/link";
import SearchControls from "@/components/search/SearchControls";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { searchProducts, getAllBrands } from "@/lib/woocommerce";
import { SearchOff } from '@material-symbols-svg/react';
import { getLevenshteinDistance } from "@/lib/distance";

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

  let didYouMean = "";
  if (products.length === 0 && searchQuery.length > 2) {
    const brands = await getAllBrands();
    let bestMatch = "";
    let minDistance = 3; // Max allowed distance

    brands.forEach(brand => {
      // Check full name first
      let dist = getLevenshteinDistance(searchQuery.toLowerCase(), brand.name.toLowerCase());
      
      // Also check individual words (e.g. "Timeless Skincare" -> "Timeless", "Skincare")
      const words = brand.name.toLowerCase().split(/[\s-]+/);
      for (const word of words) {
        if (word.length > 3) {
          const wordDist = getLevenshteinDistance(searchQuery.toLowerCase(), word);
          if (wordDist < dist) dist = wordDist;
        }
      }

      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = brand.name;
      }
    });

    if (bestMatch) {
      didYouMean = bestMatch;
    }
  }

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
        {didYouMean && (
          <p className="mt-4 text-lg text-on-surface">
            Did you mean <Link href={`/search?q=${encodeURIComponent(didYouMean)}`} className="text-primary font-bold hover:underline">{didYouMean}</Link>?
          </p>
        )}
      </header>

      {products.length > 0 && <SearchControls resultCount={products.length} />}

      <section className="w-full px-margin-mobile md:px-margin-desktop py-margin-desktop bg-surface-container-lowest min-h-[50vh]">
        <div className="w-full max-w-[1280px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-3 md:gap-x-gutter gap-y-8 md:gap-y-16">
          {products.length > 0 ? (
            products.map((product) => {
              const imageUrl = product.images?.[0]?.src || "/hero-2-fixed.png";
              return (
                <div key={product.id} className="group flex flex-col">
                  <Link href={`/product/${product.slug}`} className="relative w-full aspect-[4/5] bg-surface-container-low overflow-hidden mb-3 rounded-sm">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover mix-blend-multiply p-4"
                      sizes="(max-width: 640px) 50vw, 250px"
                    />
                  </Link>
                  <div className="flex flex-col gap-1 flex-1">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-body-md text-sm text-on-surface line-clamp-2">{product.name}</h3>
                    </Link>
                    <p className="font-headline-sm text-base text-on-surface mb-3">
                      ₦{parseInt(product.price || "0").toLocaleString()}
                    </p>
                    <div className="mt-auto">
                      <AddToCartButton productId={product.id} compact />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <SearchOff className="text-5xl text-outline-variant mb-4" />
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
