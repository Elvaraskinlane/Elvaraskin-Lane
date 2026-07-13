import { Suspense } from "react";
import ShopHero from "@/components/shop/ShopHero";
import ShopAllContainer from "@/components/shop/ShopAllContainer";
import { getProducts } from "@/lib/woocommerce";

export const metadata = {
  title: "Shop All - Elvara Skinlane",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  // Fetch real data from WooCommerce Database
  const products = await getProducts(24, resolvedParams);

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <ShopHero />
      <Suspense fallback={<div className="p-8 text-center">Loading products...</div>}>
        <ShopAllContainer initialProducts={products} />
      </Suspense>
    </div>
  );
}
