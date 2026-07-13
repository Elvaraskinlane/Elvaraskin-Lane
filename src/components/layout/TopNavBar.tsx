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

  const navMenus = [
    {
      name: "Shop Categories",
      href: "/shop",
      dropdown: [
        { 
          name: "Face", 
          href: "/category/face",
          subItems: [
            { name: "Cleansers", href: "/category/cleansers" },
            { name: "Toners", href: "/category/toners" },
            { name: "Moisturisers", href: "/category/moisturisers" }
          ]
        },
        { name: "Sunscreen", href: "/category/sunscreen" },
        { name: "Bath & Body", href: "/category/bath-body" },
        { name: "Hair Care", href: "/category/hair-care" },
        { name: "Makeup", href: "/category/makeup" },
      ]
    },
    {
      name: "Brands",
      href: "/shop",
      dropdown: [
        { name: "COSRX", href: "/shop?brand=cosrx" },
        { name: "Anua", href: "/shop?brand=anua" },
        { name: "The Ordinary", href: "/shop?brand=the-ordinary" },
        { name: "Medicube", href: "/shop?brand=medicube" },
      ]
    },
    {
      name: "Shop by Concern",
      href: "/shop",
      dropdown: [
        { name: "Acne & Breakouts", href: "/shop?concern=acne-breakouts" },
        { name: "Dark Spots", href: "/shop?concern=dark-spots" },
        { name: "Dry Skin", href: "/shop?concern=dry-skin" },
      ]
    },
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
          {navMenus.map((link, index) => (
            <div key={link.name} className="relative group">
              <Link 
                href={link.href}
                className={`font-label-md text-label-md transition-all duration-300 hover:text-primary dark:hover:text-primary-fixed hover:opacity-80 flex items-center gap-1
                  ${index === 0 
                    ? "text-on-background dark:text-primary-fixed border-b border-on-background pb-1" 
                    : "text-on-surface-variant dark:text-on-surface-variant/80 pb-1"
                  }`}
              >
                {link.name}
                {link.dropdown && (
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                )}
              </Link>

              {/* Mega Menu / Dropdown Content */}
              {link.dropdown && (
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-[200px]">
                  <div className="bg-surface shadow-lg border border-outline-variant/20 rounded-md p-4 flex flex-col gap-2">
                    {link.dropdown.map((item) => (
                      <div key={item.name} className="flex flex-col">
                        <Link 
                          href={item.href}
                          className="font-label-md text-sm text-on-surface hover:text-primary transition-colors py-1"
                        >
                          {item.name}
                        </Link>
                        {item.subItems && (
                          <div className="pl-4 flex flex-col gap-1 mt-1 border-l border-outline-variant/30">
                            {item.subItems.map((sub) => (
                              <Link 
                                key={sub.name}
                                href={sub.href}
                                className="font-label-md text-xs text-on-surface-variant hover:text-primary transition-colors py-1"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-outline-variant/30 px-margin-mobile py-4 shadow-lg flex flex-col space-y-4 max-h-[80vh] overflow-y-auto">
          {navMenus.map((link) => (
            <div key={link.name} className="flex flex-col border-b border-outline-variant/10 pb-2">
              <Link 
                href={link.href}
                className="font-label-md text-label-md text-on-background py-2"
                onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
              {link.dropdown && (
                <div className="pl-4 flex flex-col gap-2 mt-2 border-l border-outline-variant/30">
                  {link.dropdown.map((item) => (
                    <div key={item.name} className="flex flex-col">
                      <Link 
                        href={item.href}
                        className="font-label-md text-sm text-on-surface-variant py-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      {item.subItems && (
                        <div className="pl-4 flex flex-col gap-1 mt-1">
                          {item.subItems.map((sub) => (
                            <Link 
                              key={sub.name}
                              href={sub.href}
                              className="font-label-md text-xs text-outline-variant py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
