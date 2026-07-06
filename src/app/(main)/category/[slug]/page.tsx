import { getProductsByCategorySlug } from "@/lib/woocommerce";
import ShopGrid from "@/components/shop/ShopGrid";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");
  return {
    title: `${title} - Elvara Skinlane`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProductsByCategorySlug(slug);

  const displayTitle = slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <header className="w-full bg-surface-container-low py-16 px-margin-mobile md:px-margin-desktop text-center">
        <h1 className="font-display-lg text-primary">{displayTitle}</h1>
        <p className="font-body-md text-on-surface-variant mt-4 max-w-xl mx-auto">
          Explore our curated collection of {displayTitle.toLowerCase()} products.
        </p>
      </header>

      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* We use md:col-span-12 here because we aren't showing the sidebar on this specific page, or we could add the sidebar. Let's just span 12 and let ShopGrid render */}
        <div className="md:col-span-12">
          {products.length === 0 ? (
            <section className="flex flex-col items-center justify-center py-24 text-center">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 font-light">inventory_2</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Collection is Empty</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
                Check back soon for new additions to this collection. We are constantly curating new rituals.
              </p>
              <Link href="/shop" className="bg-on-background text-background font-label-md px-8 py-4 uppercase tracking-[0.2em] text-sm hover:bg-primary hover:text-on-primary transition-colors">
                Explore All Products
              </Link>
            </section>
          ) : (
            <ShopGrid initialProducts={products} />
          )}
        </div>
      </div>
    </div>
  );
}
