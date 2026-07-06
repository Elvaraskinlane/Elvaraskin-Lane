"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isActive 
      ? "flex items-center gap-3 font-label-md text-primary border-r-2 border-primary pr-4 bg-surface-container-low py-2 px-3 rounded-l-md transition-all"
      : "flex items-center gap-3 font-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low py-2 px-3 rounded-md transition-colors";
  };

  const getIconClass = (path: string) => {
    const isActive = pathname === path;
    return isActive 
      ? { fontVariationSettings: "'FILL' 1" }
      : {};
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-3 hidden md:block border-r border-outline-variant/30 pr-8">
        <div className="sticky top-[120px] flex flex-col gap-6">
          <h2 className="font-headline-sm text-on-surface mb-4">My Account</h2>
          <nav className="flex flex-col gap-4">
            <Link href="/account" className={getLinkClass("/account")}>
              <span className="material-symbols-outlined text-[20px]" style={getIconClass("/account")}>dashboard</span>
              Dashboard
            </Link>
            <Link href="/account/orders" className={getLinkClass("/account/orders")}>
              <span className="material-symbols-outlined text-[20px]" style={getIconClass("/account/orders")}>receipt_long</span>
              Order History
            </Link>
            <Link href="/account/settings" className={getLinkClass("/account/settings")}>
              <span className="material-symbols-outlined text-[20px]" style={getIconClass("/account/settings")}>settings</span>
              Account Settings
            </Link>
          </nav>
          
          <div className="mt-8 pt-8 border-t border-outline-variant/30">
            <button 
              onClick={logout}
              className="flex items-center gap-3 font-label-md text-on-surface-variant hover:text-error transition-colors w-full text-left py-2 px-3 rounded-md hover:bg-error-container/20"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:col-span-9 flex flex-col gap-12">
        {children}
      </div>
    </div>
  );
}
