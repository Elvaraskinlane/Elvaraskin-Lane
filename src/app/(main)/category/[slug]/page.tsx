import { getProducts } from "@/lib/woocommerce";
import ShopAllContainer from "@/components/shop/ShopAllContainer";
import { Suspense } from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");
  return {
    title: `${title} - Elvara Skinlane`,
  };
}

export default async function CategoryPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  
  // Merge the route slug into the search parameters so WooCommerce filters properly
  const finalParams = { ...resolvedParams, category: slug };
  
  const products = await getProducts(24, finalParams);
  const displayTitle = slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <header className="w-full bg-surface-container-low py-16 px-margin-mobile md:px-margin-desktop text-center">
        <h1 className="font-display-lg text-primary">{displayTitle}</h1>
        <p className="font-body-md text-on-surface-variant mt-4 max-w-xl mx-auto">
          Explore our curated collection of {displayTitle.toLowerCase()} products.
        </p>
      </header>

      <Suspense fallback={<div className="p-8 text-center font-body-md text-on-surface-variant">Loading collection...</div>}>
        <ShopAllContainer initialProducts={products} />
      </Suspense>
    </div>
  );
}
