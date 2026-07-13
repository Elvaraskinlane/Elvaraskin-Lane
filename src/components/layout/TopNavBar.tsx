"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      name: "SHOP",
      href: "/shop"
    },
    {
      name: "BRANDS",
      href: "/shop",
      megaMenu: {
        cols: "grid-cols-4",
        sections: [
          {
            title: "A - D",
            links: [
              { name: "Advanced Clinicals", href: "/shop?brand=advanced-clinicals" },
              { name: "Advanced Korean Products", href: "/shop?brand=advanced-korean-products" },
              { name: "AGE-R", href: "/shop?brand=age-r" },
              { name: "Anua", href: "/shop?brand=anua" },
              { name: "Aqua Rich", href: "/shop?brand=aqua-rich" },
              { name: "AVE HAIR", href: "/shop?brand=ave-hair" },
              { name: "Baby Secrets", href: "/shop?brand=baby-secrets" },
              { name: "Balance", href: "/shop?brand=balance" },
              { name: "Caudalie", href: "/shop?brand=caudalie" },
              { name: "Celimax", href: "/shop?brand=celimax" },
              { name: "COSRX", href: "/shop?brand=cosrx" },
              { name: "Dove", href: "/shop?brand=dove" },
              { name: "Dr. Meineair", href: "/shop?brand=dr-meineair" },
              { name: "Dr. Teals", href: "/shop?brand=dr-teals" }
            ]
          },
          {
            title: "E - L",
            links: [
              { name: "EDEN", href: "/shop?brand=eden" },
              { name: "EOS", href: "/shop?brand=eos" },
              { name: "Glow Recipe", href: "/shop?brand=glow-recipe" },
              { name: "Good Molecules", href: "/shop?brand=good-molecules" },
              { name: "Hada Labo", href: "/shop?brand=hada-labo" },
              { name: "IMAGIC", href: "/shop?brand=imagic" },
              { name: "Isntree", href: "/shop?brand=isntree" },
              { name: "Kiss Beauty", href: "/shop?brand=kiss-beauty" },
              { name: "LA Roche Posay", href: "/shop?brand=la-roche-posay" },
              { name: "Lanoline", href: "/shop?brand=lanoline" },
              { name: "LUSH Hair", href: "/shop?brand=lush-hair" }
            ]
          },
          {
            title: "M - Z",
            links: [
              { name: "MARY & MAY", href: "/shop?brand=mary-may" },
              { name: "Medicube", href: "/shop?brand=medicube" },
              { name: "MISSHA", href: "/shop?brand=missha" },
              { name: "Naturium", href: "/shop?brand=naturium" },
              { name: "Olay", href: "/shop?brand=olay" },
              { name: "PanOxyl", href: "/shop?brand=panoxyl" },
              { name: "Paula's Choice", href: "/shop?brand=paulas-choice" },
              { name: "Simple", href: "/shop?brand=simple" },
              { name: "Skin Aqua", href: "/shop?brand=skin-aqua" },
              { name: "The Ordinary", href: "/shop?brand=the-ordinary" },
              { name: "TIAM", href: "/shop?brand=tiam" },
              { name: "VEE BEAUTY", href: "/shop?brand=vee-beauty" }
            ]
          },
          {
            title: "Brand of the Month",
            isCustom: true,
            customContent: (
              <div className="bg-gray-50 dark:bg-surface-container p-4 rounded-md flex flex-col h-full">
                <Image 
                  src="https://shop.elvaraskinlane.ng/wp-content/uploads/2026/07/cosrx-centella-cream.jpg" 
                  alt="COSRX Featured Brand" 
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h4 className="font-bold text-lg mb-1 text-black dark:text-on-surface">COSRX</h4>
                <p className="text-sm text-gray-500 dark:text-on-surface-variant mb-4">Explore the bestselling Snail Mucin collection.</p>
                <Link href="/shop?brand=cosrx" className="mt-auto inline-block font-semibold text-sm hover:underline uppercase tracking-wider text-black dark:text-primary">
                  Shop COSRX
                </Link>
              </div>
            )
          }
        ]
      }
    },
    {
      name: "CATEGORIES",
      href: "/shop",
      megaMenu: {
        cols: "grid-cols-4",
        sections: [
          {
            title: "Face Care",
            links: [
              { name: "Cleansers", href: "/category/cleansers" },
              { name: "Toners & Mists", href: "/category/toners-mists" },
              { name: "Eyes & Lips", href: "/category/eyes-lips" },
              { name: "Masks & Exfoliators", href: "/category/masks-exfoliators" },
              { name: "Moisturisers & Serums", href: "/category/moisturisers-serums" }
            ]
          },
          {
            title: "Body & Hair",
            links: [
              { name: "Bath & Body", href: "/category/bath-body" },
              { name: "Hair Care", href: "/category/hair-care" },
              { name: "Sunscreen", href: "/category/sunscreen" },
              { name: "Oral Care", href: "/category/oral-care" }
            ]
          },
          {
            title: "Specialized Collections",
            links: [
              { name: "Babies & Children", href: "/category/babies-children" },
              { name: "Makeup", href: "/category/makeup" },
              { name: "Men", href: "/category/men" },
              { name: "Gifts", href: "/category/gifts" },
              { name: "Travel Size", href: "/category/travel-size" },
              { name: "Aesthetician Kits", href: "/category/aesthetician-kits" }
            ]
          }
        ]
      }
    },
    {
      name: "CONCERNS",
      href: "/shop",
      megaMenu: {
        cols: "grid-cols-4",
        sections: [
          {
            title: "Targeted Solutions",
            links: [
              { name: "Acne & Breakouts", href: "/shop?concern=acne-breakouts" },
              { name: "Dark Spots & Hyperpigmentation", href: "/shop?concern=dark-spots-hyperpigmentation" },
              { name: "Dry & Dehydrated Skin", href: "/shop?concern=dry-dehydrated-skin" },
              { name: "Oily Skin", href: "/shop?concern=oily-skin" },
              { name: "Sensitive Skin", href: "/shop?concern=sensitive-skin" },
              { name: "Damaged Skin Barrier", href: "/shop?concern=damaged-skin-barrier" }
            ]
          },
          {
            title: "More Concerns",
            links: [
              { name: "Fine Lines & Wrinkles", href: "/shop?concern=fine-lines-wrinkles" },
              { name: "Dull Skin", href: "/shop?concern=dull-skin" },
              { name: "Large Pores & Uneven Texture", href: "/shop?concern=large-pores-uneven-texture" },
              { name: "Body Care Concerns", href: "/shop?concern=body-care-concerns" },
              { name: "Sun Protection", href: "/shop?concern=sun-protection" },
              { name: "Lip & Eye Care", href: "/shop?concern=lip-eye-care" }
            ]
          }
        ]
      }
    }
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
        <div className="hidden md:flex items-center space-x-8 h-full">
          {navMenus.map((link) => {
            let isActive = false;
            if (link.name === "SHOP") {
              isActive = pathname === "/shop" && !searchParams.has("brand") && !searchParams.has("concern");
            } else if (link.name === "BRANDS") {
              isActive = searchParams.has("brand");
            } else if (link.name === "CATEGORIES") {
              isActive = searchParams.has("category") || pathname.startsWith("/category");
            } else if (link.name === "CONCERNS") {
              isActive = searchParams.has("concern");
            }

            return (
            <div key={link.name} className="relative group h-full flex items-center py-4">
              <Link 
                href={link.href}
                className={`font-label-md text-label-md transition-all duration-300 hover:text-black dark:hover:text-primary-fixed hover:opacity-80 flex items-center gap-1
                  ${isActive 
                    ? "text-black dark:text-primary-fixed" 
                    : "text-gray-700 dark:text-on-surface-variant"
                  }`}
              >
                <span className={`relative py-1 ${isActive ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-black dark:after:bg-primary-fixed" : "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black dark:after:bg-primary-fixed after:transition-all after:duration-300 group-hover:after:w-full"}`}>
                  {link.name}
                </span>
                {link.megaMenu && (
                  <span className="material-symbols-outlined text-[16px] mb-[-2px]">expand_more</span>
                )}
              </Link>

              {/* High-Fidelity Mega Menu */}
              {link.megaMenu && (
                <div className="absolute left-0 top-full w-full bg-white dark:bg-surface text-black dark:text-on-surface shadow-xl border-t border-gray-100 dark:border-outline-variant/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 fixed w-screen -left-[calc((100vw-min(1280px,100vw))/2)] px-margin-mobile md:px-margin-desktop">
                  <div className={`max-w-[1280px] mx-auto grid ${link.megaMenu.cols} gap-8 p-8`}>
                    {link.megaMenu.sections.map((section) => (
                      <div key={section.title} className="flex flex-col">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-outline-variant mb-4">
                          {section.title}
                        </h3>
                        {section.isCustom && section.customContent ? (
                          section.customContent
                        ) : (
                          <ul className="flex flex-col space-y-3">
                            {section.links?.map((item) => (
                              <li key={item.name}>
                                <Link 
                                  href={item.href}
                                  className="text-sm text-gray-600 dark:text-on-surface-variant hover:text-black dark:hover:text-primary transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
          })}
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
                onClick={() => !link.megaMenu && setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
              {link.megaMenu && (
                <div className="pl-4 flex flex-col gap-4 mt-2 border-l border-outline-variant/30">
                  {link.megaMenu.sections.map((section) => (
                    <div key={section.title} className="flex flex-col">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{section.title}</h4>
                      {!section.isCustom && section.links && (
                        <div className="pl-2 flex flex-col gap-2">
                          {section.links.map((item) => (
                            <Link 
                              key={item.name}
                              href={item.href}
                              className="font-label-md text-sm text-on-surface-variant"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
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
