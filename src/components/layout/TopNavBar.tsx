"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function TopNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { openAuthModal, openCartDrawer } = useUIStore();
  const { cart } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  // Safely calculate total items by reducing the actual items array
  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Shop All", href: "/shop" },
    { name: "Skincare", href: "/category/skincare" },
    { name: "Rituals", href: "/category/rituals" },
    { name: "Gifts", href: "/category/gifts" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-background/80 dark:bg-background/80 backdrop-blur-md border-b border-outline-variant/30 flat no-shadows">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto relative">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-on-background hover:opacity-80 transition-opacity"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="material-symbols-outlined">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`font-label-md text-label-md transition-all duration-300 hover:text-primary dark:hover:text-primary-fixed hover:opacity-80
                ${index === 0 
                  ? "text-on-background dark:text-primary-fixed border-b border-on-background pb-1" 
                  : "text-on-surface-variant dark:text-on-surface-variant/80"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center justify-center">
          <div className="relative h-10 md:h-12 w-32">
            <Image 
              src="/logo.png" 
              alt="Elvara Skinlane" 
              fill
              className="object-contain"
              sizes="(max-width: 768px) 128px, 128px"
              priority
            />
          </div>
          <span className="sr-only">Elvara Skinlane</span>
        </Link>

        {/* Trailing Icons */}
        <div className="flex items-center space-x-4 md:space-x-6 text-on-surface">
          <div className="relative" ref={searchRef}>
            <button 
              aria-label="Search" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:opacity-80 transition-opacity flex items-center"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>

            {/* Inline Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-4 w-72 bg-surface shadow-lg border border-outline-variant/20 rounded-md p-2 animate-fade-in origin-top-right">
                <form onSubmit={handleSearchSubmit} className="flex items-center relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search collection..."
                    autoFocus
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-sm py-2 px-3 pr-10 text-on-surface focus:outline-none focus:border-primary text-sm font-body-md"
                  />
                  <button type="submit" className="absolute right-2 text-on-surface-variant hover:text-primary transition-colors flex items-center">
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </form>
              </div>
            )}
          </div>
          
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleProfileDropdown} 
                aria-label="Account Menu" 
                className={`hover:opacity-80 transition-opacity flex items-center ${isProfileDropdownOpen ? "text-primary" : ""}`}
              >
                <span className="material-symbols-outlined text-2xl">person</span>
              </button>
              
              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-4 w-64 bg-surface shadow-lg rounded-xl border border-outline-variant/20 overflow-hidden animate-fade-in origin-top-right">
                  <div className="p-4 border-b border-outline-variant/20 bg-surface-container-lowest">
                    <p className="font-body-md text-on-surface font-medium truncate">{user?.user_display_name || "User"}</p>
                    <p className="font-body-sm text-on-surface-variant truncate">{user?.user_email}</p>
                  </div>
                  <div className="flex flex-col py-2">
                    <Link 
                      href="/account" 
                      className="px-4 py-2 font-body-md text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[18px]">dashboard</span>
                      Dashboard
                    </Link>
                    <Link 
                      href="/account/settings" 
                      className="px-4 py-2 font-body-md text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                      Account Settings
                    </Link>
                  </div>
                  <div className="border-t border-outline-variant/20 py-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 font-body-md text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={openAuthModal} aria-label="Login" className="hover:opacity-80 transition-opacity flex items-center">
              <span className="material-symbols-outlined text-2xl">person</span>
            </button>
          )}
          
          <button onClick={openCartDrawer} aria-label="Shopping Bag" className="hover:opacity-80 transition-opacity relative flex items-center">
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-fade-in">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-outline-variant/30 px-margin-mobile py-4 shadow-lg flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="font-label-md text-label-md text-on-background py-2 border-b border-outline-variant/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
