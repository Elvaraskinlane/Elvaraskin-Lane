"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchCustomerOrders } from "@/lib/auth";
import { useUIStore } from "@/store/useUIStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";

export default function AccountDashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openAuthModal, openCartDrawer } = useUIStore();
  const { items: wishlistItems } = useWishlistStore();
  const { addItem, isLoading: isCartLoading } = useCartStore();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const glassCardClass = "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/15 rounded-md p-8";

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
      <header className="flex flex-col gap-2 border-b border-outline-variant/15 pb-8 relative">
        <h1 className="font-headline-md text-on-surface">Welcome back, {user?.user_display_name?.split(' ')[0] || "User"}.</h1>
        <p className="font-body-md text-on-surface-variant max-w-2xl font-light">
          Your personalized skincare journey continues here. Manage your account, track orders, 
          and discover new luminosity.
        </p>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-8">
        
        {/* Recent Orders */}
        <section className={`${glassCardClass} flex flex-col gap-6 md:col-span-2 lg:col-span-1 min-h-[400px]`}>
          <div className="flex justify-between items-end border-b border-outline-variant/15 pb-4">
            <h3 className="font-headline-sm text-on-surface">Live Orders</h3>
            <Link href="/account/orders" className="font-body-sm text-on-surface-variant hover:text-black transition-colors">View All</Link>
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
                <div key={order.id} className="flex items-center gap-4 p-2 hover:bg-black/5 transition-colors rounded-sm cursor-default">
                  <div className="w-16 h-16 bg-[#fafafa] rounded-sm flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant/40 text-2xl font-light">shopping_bag</span>
                  </div>
                  <div className="flex-grow flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-body-md text-on-surface-variant">Order #{order.id}</span>
                      <span className={`font-label-md text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm ${
                        order.status === 'completed' ? 'bg-primary-container text-on-primary-container' :
                        order.status === 'processing' ? 'bg-tertiary-container text-on-tertiary-container' :
                        order.status === 'cancelled' ? 'bg-error/10 text-error' :
                        'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-on-surface">{order.currency_symbol}{order.total}</h4>
                    <span className="font-body-sm text-on-surface-variant text-xs font-light">
                      Placed on {new Date(order.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Skin Profile */}
        <section className={`${glassCardClass} flex flex-col md:col-span-2 lg:col-span-1 min-h-[400px] justify-center`}>
          <div className="relative z-10 p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-on-surface-variant font-light text-[20px]">person</span>
              <span className="font-label-md text-on-surface-variant tracking-[0.2em] uppercase text-[10px]">Account Details</span>
            </div>
            <h3 className="font-headline-sm text-on-surface leading-tight">{user?.user_display_name}</h3>
            <p className="font-body-md text-on-surface-variant mb-4 font-light">{user?.user_email}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-4 py-1.5 rounded-full border border-outline-variant/30 font-label-md text-on-surface-variant text-[10px] uppercase tracking-widest bg-[#fafafa]">Verified Customer</span>
            </div>
            <button className="w-full md:w-max px-8 py-3.5 bg-[#5e5e5e] text-white rounded-[4px] hover:bg-black font-label-md text-[11px] tracking-[0.1em] transition-colors mt-2 text-center shadow-sm">
              Edit Profile
            </button>
          </div>
        </section>

      </div>

      {/* Wishlist Section */}
      <section className={`${glassCardClass} flex flex-col gap-6 mt-8`}>
        <div className="flex justify-between items-end border-b border-outline-variant/15 pb-4">
          <h3 className="font-headline-sm text-on-surface">Your Wishlist</h3>
          <span className="font-body-sm text-on-surface-variant">{wishlistItems.length} items</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wishlistItems.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center opacity-70">
              <span className="material-symbols-outlined text-4xl mb-4 font-light text-on-surface-variant">favorite</span>
              <p className="font-body-md text-sm text-on-surface-variant">Your wishlist is empty. Start saving your favorite products!</p>
            </div>
          ) : (
            wishlistItems.map((item) => {
              const CardContent = (
                <>
                  <div className="relative aspect-[3/4] bg-white border-b border-outline-variant/10">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover object-top mix-blend-multiply p-4" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#fafafa]">
                        <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl">image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow bg-white">
                    <h4 className="font-label-md text-[11px] text-on-surface line-clamp-2 mb-2 flex-grow uppercase tracking-wider leading-relaxed" dangerouslySetInnerHTML={{ __html: item.name }} />
                    <div className="font-headline-sm text-[14px] text-on-surface-variant/90 mb-4" dangerouslySetInnerHTML={{ __html: item.price }} />
                    
                    <button 
                      onClick={async (e) => {
                        e.preventDefault(); 
                        e.stopPropagation();
                        try {
                          await addItem(item.id, 1);
                          openCartDrawer();
                        } catch (err) {
                          console.error("Failed to add to cart from wishlist", err);
                          alert("Failed to add to cart.");
                        }
                      }}
                      disabled={isCartLoading}
                      className="w-full py-3 bg-black/5 hover:bg-[#e0e0e0] text-black text-[10px] font-label-md uppercase tracking-[0.1em] transition-colors rounded-sm flex items-center justify-center gap-2 mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[14px] font-light">shopping_bag</span>
                      {isCartLoading ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </>
              );

              return item.slug ? (
                <Link 
                  href={`/product/${item.slug}`} 
                  key={item.id} 
                  className="group relative bg-white rounded-sm overflow-hidden border border-outline-variant/15 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all flex flex-col cursor-pointer"
                >
                  {CardContent}
                </Link>
              ) : (
                <div 
                  key={item.id} 
                  className="group relative bg-white rounded-sm overflow-hidden border border-outline-variant/15 flex flex-col"
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
