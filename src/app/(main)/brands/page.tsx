import Link from "next/link";
import Image from "next/image";
import { getAllBrands } from "@/lib/woocommerce";

export const metadata = {
  title: 'Brands | Elvara Skinlane',
  description: 'Discover our curated collection of the world\'s most innovative and effective skincare brands.',
};

export default async function BrandsPage() {
  const brands = await getAllBrands();

  // Filter out brands with 0 products if desired, or keep them.
  // We'll keep them for SEO but you could filter with `.filter(b => b.count > 0)`
  const activeBrands = brands.filter(b => b.count > 0).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="w-full bg-background animate-fade-in pb-24">
      {/* Header Section */}
      <div className="bg-surface py-16 md:py-24 px-margin-mobile md:px-margin-desktop text-center">
        <h1 className="font-headline-lg text-4xl md:text-5xl text-on-background uppercase tracking-tight mb-4">
          Our Brands
        </h1>
        <div className="w-16 h-[2px] bg-primary mx-auto mb-6"></div>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Discover our curated collection of the world's most innovative and effective skincare brands.
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pt-16">
        {activeBrands.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">inventory_2</span>
            <p>No brands found at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {activeBrands.map((brand) => (
              <Link 
                key={brand.id}
                href={`/shop?brand=${brand.slug}`}
                className="group flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/30 rounded-md p-8 text-center hover:border-primary transition-all duration-300 hover:shadow-sm"
              >
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-4 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                  {brand.image ? (
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="font-headline-md text-xl text-on-background group-hover:text-primary transition-colors">
                      {brand.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="font-label-lg text-base md:text-lg text-on-background uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs md:text-sm text-on-surface-variant">
                  {brand.count} {brand.count === 1 ? 'Product' : 'Products'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
