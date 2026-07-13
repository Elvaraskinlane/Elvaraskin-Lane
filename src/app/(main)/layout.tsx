import { Suspense } from "react";
import TopNavBar from "@/components/layout/TopNavBar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import CartDrawer from "@/components/cart/CartDrawer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-[73px] border-b border-outline-variant/30 bg-background" />}>
        <TopNavBar />
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
