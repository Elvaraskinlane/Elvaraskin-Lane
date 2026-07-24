"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];
  const activeBrands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const activeConcerns = searchParams.get('concern')?.split(',').filter(Boolean) || [];

  // Accordion state
  const [openSection, setOpenSection] = useState<string | null>("categories");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const categories = [
    { name: "Face", value: "face" },
    { name: "Sunscreen", value: "sunscreen" },
    { name: "Bath & Body", value: "bath-body" },
    { name: "Hair Care", value: "hair-care" },
    { name: "Babies & Children", value: "babies-children" },
    { name: "Makeup", value: "makeup" },
    { name: "Oral Care", value: "oral-care" },
    { name: "Gifts", value: "gifts" },
    { name: "Fragrance", value: "fragrance" },
    { name: "Men", value: "men" },
    { name: "Korean Skincare", value: "korean-skincare" },
    { name: "Offers", value: "offers" },
    { name: "Travel Size", value: "travel-size" },
    { name: "Aesthetician Kits", value: "aesthetician-kits" }
  ];

  const brands = [
    { name: "Advanced Korean Products", value: "advanced-korean-products" },
    { name: "Anua", value: "anua" },
    { name: "Aqua Rich", value: "aqua-rich" },
    { name: "AGE-R", value: "age-r" },
    { name: "Advanced Clinicals", value: "advanced-clinicals" },
    { name: "Medicube", value: "medicube" },
    { name: "Baby Secrets", value: "baby-secrets" },
    { name: "Balance", value: "balance" },
    { name: "Dove", value: "dove" },
    { name: "Dr. Meineair", value: "dr-meineair" },
    { name: "EOS", value: "eos" },
    { name: "EDEN", value: "eden" },
    { name: "Celimax", value: "celimax" },
    { name: "COSRX", value: "cosrx" },
    { name: "Dr. Teals", value: "dr-teals" },
    { name: "Skin Aqua", value: "skin-aqua" },
    { name: "Good Molecules", value: "good-molecules" },
    { name: "Glow Recipe", value: "glow-recipe" },
    { name: "Caudalie", value: "caudalie" },
    { name: "Isntree", value: "isntree" },
    { name: "MISSHA", value: "missha" },
    { name: "MARY & MAY", value: "mary-may" },
    { name: "Lanoline", value: "lanoline" },
    { name: "LA Roche Posay", value: "la-roche-posay" },
    { name: "Naturium", value: "naturium" },
    { name: "Olay", value: "olay" },
    { name: "PanOxyl", value: "panoxyl" },
    { name: "TIAM", value: "tiam" },
    { name: "The Ordinary", value: "the-ordinary" },
    { name: "Simple", value: "simple" },
    { name: "VEE BEAUTY", value: "vee-beauty" },
    { name: "Paula’s Choice", value: "paulas-choice" },
    { name: "LUSH Hair", value: "lush-hair" },
    { name: "AVE HAIR", value: "ave-hair" },
    { name: "IMAGIC", value: "imagic" },
    { name: "Kiss Beauty", value: "kiss-beauty" },
    { name: "Hada Labo", value: "hada-labo" }
  ];

  const concerns = [
    { name: "Acne & Breakouts", value: "acne-breakouts" },
    { name: "Dark Spots & Hyperpigmentation", value: "dark-spots-hyperpigmentation" },
    { name: "Dry & Dehydrated Skin", value: "dry-dehydrated-skin" },
    { name: "Oily Skin", value: "oily-skin" },
    { name: "Sensitive Skin", value: "sensitive-skin" },
    { name: "Damaged Skin Barrier", value: "damaged-skin-barrier" },
    { name: "Fine Lines & Wrinkles", value: "fine-lines-wrinkles" },
    { name: "Dull Skin", value: "dull-skin" },
    { name: "Large Pores & Uneven Texture", value: "large-pores-uneven-texture" },
    { name: "Body Care Concerns", value: "body-care-concerns" },
    { name: "Sun Protection", value: "sun-protection" },
    { name: "Lip & Eye Care", value: "lip-eye-care" }
  ];

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let currentValues = params.get(key)?.split(',').filter(Boolean) || [];

    if (currentValues.includes(value)) {
      currentValues = currentValues.filter(v => v !== value);
    } else {
      currentValues.push(value);
    }

    if (currentValues.length > 0) {
      params.set(key, currentValues.join(','));
    } else {
      params.delete(key);
    }

    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    router.push(`/shop`, { scroll: false });
  };

  const hasActiveFilters = activeCategories.length > 0 || activeBrands.length > 0 || activeConcerns.length > 0;

  return (
    <div className="w-full space-y-4">
      {hasActiveFilters && (
        <button 
          onClick={handleResetFilters}
          className="w-full py-3 mb-2 flex items-center justify-center gap-2 border border-black dark:border-primary-fixed text-black dark:text-primary-fixed hover:bg-black hover:text-white dark:hover:bg-primary-fixed dark:hover:text-background transition-colors duration-300 font-label-md uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
          Reset Filters
        </button>
      )}

      {/* Categories Accordion */}
      <div className="border-b border-outline-variant/30 overflow-hidden bg-transparent">
        <button 
          onClick={() => toggleSection("categories")}
          className="w-full flex justify-between items-center py-5 bg-transparent hover:text-primary transition-colors group"
        >
          <span className="font-label-md text-xs text-on-surface uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Categories</span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary transition-colors">
            {openSection === "categories" ? "remove" : "add"}
          </span>
        </button>
        {openSection === "categories" && (
          <div className="pb-5 bg-transparent max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <ul className="space-y-4">
              {categories.map((cat) => {
                const isActive = activeCategories.includes(cat.value);
                return (
                  <li key={cat.value}>
                    <button 
                      onClick={() => handleFilterChange("category", cat.value)}
                      className={`flex items-center text-left w-full cursor-pointer hover:text-black transition-colors font-body-md text-sm ${isActive ? "text-black font-medium" : "text-gray-500"}`}
                    >
                      <span className={`w-3 h-3 border rounded-full mr-3 flex flex-shrink-0 items-center justify-center transition-colors ${isActive ? "border-black" : "border-gray-300"}`}>
                        {isActive && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </span>
                      {cat.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Brands Accordion */}
      <div className="border-b border-outline-variant/30 overflow-hidden bg-transparent">
        <button 
          onClick={() => toggleSection("brands")}
          className="w-full flex justify-between items-center py-5 bg-transparent hover:text-primary transition-colors group"
        >
          <span className="font-label-md text-xs text-on-surface uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Brands</span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary transition-colors">
            {openSection === "brands" ? "remove" : "add"}
          </span>
        </button>
        {openSection === "brands" && (
          <div className="pb-5 bg-transparent max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <ul className="space-y-4">
              {brands.map((brand) => {
                const isActive = activeBrands.includes(brand.value);
                return (
                  <li key={brand.value}>
                    <button 
                      onClick={() => handleFilterChange("brand", brand.value)}
                      className={`flex items-center text-left w-full cursor-pointer hover:text-black transition-colors font-body-md text-sm ${isActive ? "text-black font-medium" : "text-gray-500"}`}
                    >
                      <span className={`w-3 h-3 border rounded-full mr-3 flex flex-shrink-0 items-center justify-center transition-colors ${isActive ? "border-black" : "border-gray-300"}`}>
                        {isActive && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </span>
                      {brand.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Skin Concerns Accordion */}
      <div className="border-b border-outline-variant/30 overflow-hidden bg-transparent">
        <button 
          onClick={() => toggleSection("concerns")}
          className="w-full flex justify-between items-center py-5 bg-transparent hover:text-primary transition-colors group"
        >
          <span className="font-label-md text-xs text-on-surface uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Skin Concerns</span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary transition-colors">
            {openSection === "concerns" ? "remove" : "add"}
          </span>
        </button>
        {openSection === "concerns" && (
          <div className="pb-5 bg-transparent max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <ul className="space-y-4">
              {concerns.map((concern) => {
                const isActive = activeConcerns.includes(concern.value);
                return (
                  <li key={concern.value}>
                    <button 
                      onClick={() => handleFilterChange("concern", concern.value)}
                      className={`flex items-center text-left w-full cursor-pointer hover:text-black transition-colors font-body-md text-sm ${isActive ? "text-black font-medium" : "text-gray-500"}`}
                    >
                      <span className={`w-3 h-3 border rounded-full mr-3 flex flex-shrink-0 items-center justify-center transition-colors ${isActive ? "border-black" : "border-gray-300"}`}>
                        {isActive && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </span>
                      {concern.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
