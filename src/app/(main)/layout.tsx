import { Suspense } from "react";
import TopNavBar from "@/components/layout/TopNavBar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import CartDrawer from "@/components/cart/CartDrawer";
import { getProducts } from "@/lib/woocommerce";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the dynamic "Brand of the Month" product
  const featuredProducts = await getProducts(1, { concern: 'brand-of-the-month' });
  const featuredProduct = featuredProducts.length > 0 ? featuredProducts[0] : null;

  return (
    <>
      <Suspense fallback={<div className="h-[73px] border-b border-outline-variant/30 bg-background" />}>
        <TopNavBar featuredProduct={featuredProduct} />
      </Suspense>
      <AuthModal />
      <CartDrawer />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
