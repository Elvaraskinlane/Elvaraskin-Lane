"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchCustomerOrders } from "@/lib/auth";
import { useUIStore } from "@/store/useUIStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function AccountDashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openAuthModal } = useUIStore();
  const { items: wishlistItems } = useWishlistStore();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const glassCardClass = "bg-surface/70 backdrop-blur-md border border-outline-variant/20 shadow-[0_4px_30px_rgba(44,44,44,0.04)] rounded-xl p-8";

  useEffect(() => {
    async function loadOrders() {
      if (user?.token && user?.user_email) {
        try {
          const data = await fetchCustomerOrders(user.token, user.user_email);
          setOrders(data);
        } catch (error: any) {
          if (error.message === "Unauthorized") {
            logout();
          } else {
            console.error("Error loading orders:", error);
            setOrders([]);
          }
        } finally {
          setLoadingOrders(false);
        }
      } else {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-lg mx-auto">
        <span className="material-symbols-outlined text-5xl mb-6 text-on-surface-variant font-light">lock</span>
        <h1 className="font-headline-sm text-2xl mb-4">Account Access Required</h1>
        <p className="font-body-md text-on-surface-variant mb-8">
          Please log in to view your personalized dashboard, track your live orders, and manage your wishlist.
        </p>
        <button 
          onClick={openAuthModal}
          className="bg-on-background text-background px-8 py-4 font-label-lg tracking-[0.2em] uppercase text-sm hover:bg-primary hover:text-on-primary transition-all shadow-md"
        >
          SIGN IN
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Header */}
      <header className="flex flex-col gap-2 border-b border-outline-variant/30 pb-8 relative">
        <button 
          onClick={logout}
          className="absolute right-0 top-0 font-label-md text-xs uppercase tracking-widest text-on-surface hover:text-error transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out
        </button>
        <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface">Welcome back, {user?.user_display_name?.split(' ')[0] || "User"}.</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl">
          Your personalized skincare journey continues here. Manage your rituals, track orders, and discover new luminosity.
        </p>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-8">
        
        {/* Recent Orders */}
        <section className={`${glassCardClass} flex flex-col gap-6 md:col-span-2 lg:col-span-1 min-h-[400px]`}>
          <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
            <h3 className="font-headline-sm text-on-surface">Live Orders</h3>
            <Link href="/account/orders" className="font-label-md text-primary hover:underline cursor-pointer">View All</Link>
          </div>
          
          <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 max-h-[300px]">
            {loadingOrders ? (
              <div className="flex flex-col gap-4 mt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-16 h-16 bg-surface-container-highest rounded-md"></div>
                    <div className="flex-grow flex flex-col gap-2">
                      <div className="h-4 bg-surface-container-highest rounded-sm w-1/3"></div>
                      <div className="h-3 bg-surface-container-highest rounded-sm w-1/4"></div>
                      <div className="h-2 bg-surface-container-highest rounded-sm w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                <span className="material-symbols-outlined text-4xl mb-4 font-light text-on-surface-variant">inventory_2</span>
                <p className="font-body-md text-sm text-on-surface-variant">No orders found. Time to discover new favorites!</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-surface-container transition-colors rounded-md">
                  <div className="w-16 h-16 bg-surface-container overflow-hidden rounded-md flex-shrink-0 relative border border-outline-variant/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant/50 text-2xl">local_mall</span>
                  </div>
                  <div className="flex-grow flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-label-md text-on-surface-variant">Order #{order.id}</span>
                      <span className={`font-label-md text-xs uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                        order.status === 'completed' ? 'bg-primary-container text-on-primary-container' :
                        order.status === 'processing' ? 'bg-tertiary-container text-on-tertiary-container' :
                        order.status === 'cancelled' ? 'bg-error-container text-on-error-container' :
                        'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <h4 className="font-body-md text-on-surface font-medium">{order.currency_symbol}{order.total}</h4>
                    <span className="font-body-md text-on-surface-variant text-xs">
                      Placed on {new Date(order.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Skin Profile */}
        <section className="rounded-xl overflow-hidden relative md:col-span-2 lg:col-span-1 h-full min-h-[400px] flex flex-col justify-end bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
          <div className="relative z-10 p-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              <span className="font-label-md text-primary tracking-widest uppercase">Account Details</span>
            </div>
            <h3 className="font-headline-md text-on-surface leading-tight">{user?.user_display_name}</h3>
            <p className="font-body-md text-on-surface-variant mb-4">{user?.user_email}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-4 py-1.5 rounded-full border border-secondary-fixed-dim bg-secondary-fixed/30 font-label-md text-on-surface-variant text-xs">Verified Customer</span>
            </div>
            <button className="w-full md:w-auto px-8 py-4 bg-primary text-on-primary font-label-md rounded-md hover:bg-tertiary transition-colors self-start">
              Edit Profile
            </button>
          </div>
        </section>

      </div>

      {/* Wishlist Section */}
      <section className={`${glassCardClass} flex flex-col gap-6 mt-8`}>
        <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
          <h3 className="font-headline-sm text-on-surface">Your Wishlist</h3>
          <span className="font-label-md text-on-surface-variant">{wishlistItems.length} items</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wishlistItems.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center opacity-70">
              <span className="material-symbols-outlined text-4xl mb-4 font-light text-on-surface-variant">favorite</span>
              <p className="font-body-md text-sm text-on-surface-variant">Your wishlist is empty. Start saving your favorite rituals!</p>
            </div>
          ) : (
            wishlistItems.map((item) => {
              const CardContent = (
                <>
                  <div className="relative aspect-square bg-surface-container-highest">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl">image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-body-md text-sm text-on-surface line-clamp-2 mb-2 flex-grow" dangerouslySetInnerHTML={{ __html: item.name }} />
                    <div className="font-label-md text-on-surface font-medium mb-4" dangerouslySetInnerHTML={{ __html: item.price }} />
                    
                    {/* Conversion UX: Quick Add to Cart from Wishlist */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigating to the product page
                        import("@/store/useCartStore").then(module => {
                          module.useCartStore.getState().addItem(item.id, 1);
                          import("@/store/useUIStore").then(uiModule => {
                            uiModule.useUIStore.getState().openCartDrawer();
                          });
                        });
                      }}
                      className="w-full py-2.5 bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface text-xs font-label-md uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-2 mt-auto"
                    >
                      <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                      Add to Cart
                    </button>
                  </div>
                </>
              );

              return item.slug ? (
                <Link 
                  href={`/product/${item.slug}`} 
                  key={item.id} 
                  className="group relative bg-surface-container rounded-md overflow-hidden border border-outline-variant/20 hover:border-primary/50 transition-colors flex flex-col cursor-pointer"
                >
                  {CardContent}
                </Link>
              ) : (
                <div 
                  key={item.id} 
                  className="group relative bg-surface-container rounded-md overflow-hidden border border-outline-variant/20 flex flex-col"
                >
                  {CardContent}
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
