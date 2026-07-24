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
      ? "flex items-center font-body-md text-black bg-black/5 border-l-[3px] border-black py-3 px-4 rounded-r-sm transition-all"
      : "flex items-center font-body-md text-on-surface-variant hover:text-black hover:bg-black/5 py-3 px-4 rounded-sm transition-colors border-l-[3px] border-transparent";
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-3 hidden md:block pr-8">
        <div className="sticky top-[120px] flex flex-col gap-8">
          <h2 className="font-headline-sm md:font-headline-md text-on-surface mb-2 tracking-tight">My Account</h2>
          <nav className="flex flex-col gap-1">
            <Link href="/account" className={getLinkClass("/account")}>
              Dashboard
            </Link>
            <Link href="/account/orders" className={getLinkClass("/account/orders")}>
              Order History
            </Link>
            <Link href="/account/settings" className={getLinkClass("/account/settings")}>
              Account Settings
            </Link>
          </nav>
          
          <div className="mt-4 pt-8 border-t border-outline-variant/15">
            <button 
              onClick={logout}
              className="flex items-center gap-3 font-body-md text-on-surface-variant hover:text-black hover:translate-x-1 transition-all w-full text-left py-3 px-4 rounded-sm"
            >
              Sign Out
              <span className="material-symbols-outlined text-[16px] ml-auto">logout</span>
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
