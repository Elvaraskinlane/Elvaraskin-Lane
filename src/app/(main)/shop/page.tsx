import ShopHero from "@/components/shop/ShopHero";
import ShopAllContainer from "@/components/shop/ShopAllContainer";
import { getProducts } from "@/lib/woocommerce";

export const metadata = {
  title: "Shop All - Elvara Skinlane",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Fetch real data from WooCommerce Database
  const products = await getProducts(24, searchParams);

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <ShopHero />
      <ShopAllContainer initialProducts={products} />
    </div>
  );
}
