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
      <TopNavBar />
      <AuthModal />
      <CartDrawer />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
