"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchCustomerOrders } from "@/lib/auth";

export default function OrderHistoryPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

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

  if (!isAuthenticated) return null;

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <header className="border-b border-outline-variant/30 pb-6">
        <h1 className="font-headline-md text-on-surface">Order History</h1>
        <p className="font-body-md text-on-surface-variant mt-2">
          View and track your previous orders.
        </p>
      </header>

      <div className="bg-surface/70 backdrop-blur-md border border-outline-variant/20 rounded-xl p-8">
        {loadingOrders ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-6 animate-pulse p-4 border border-outline-variant/10 rounded-md">
                <div className="w-20 h-20 bg-surface-container-highest rounded-md"></div>
                <div className="flex-grow flex flex-col gap-3">
                  <div className="h-5 bg-surface-container-highest rounded-sm w-1/3"></div>
                  <div className="h-4 bg-surface-container-highest rounded-sm w-1/4"></div>
                  <div className="h-3 bg-surface-container-highest rounded-sm w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center flex flex-col items-center py-12">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-4">receipt_long</span>
            <h3 className="font-headline-sm text-on-surface mb-2">No orders yet</h3>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
              When you complete a purchase, your order history and tracking details will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-surface-container-lowest border border-outline-variant/20 hover:border-outline-variant/50 transition-colors rounded-md group">
                <div className="w-full sm:w-24 h-24 bg-surface-container overflow-hidden rounded-md flex-shrink-0 relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-4xl">local_mall</span>
                </div>
                
                <div className="flex-grow flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-headline-sm text-on-surface">Order #{order.id}</h4>
                      <span className="font-body-md text-on-surface-variant text-sm">
                        Placed on {new Date(order.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <span className={`font-label-md text-xs uppercase tracking-widest px-3 py-1 rounded-sm ${
                      order.status === 'completed' ? 'bg-primary-container text-on-primary-container' :
                      order.status === 'processing' ? 'bg-tertiary-container text-on-tertiary-container' :
                      order.status === 'cancelled' ? 'bg-error-container text-on-error-container' :
                      'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span className="font-body-md text-on-surface-variant text-sm">
                      {order.line_items.reduce((acc: number, item: any) => acc + item.quantity, 0)} items
                    </span>
                    <span className="font-headline-sm text-on-surface">
                      {order.currency_symbol}{order.total}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
