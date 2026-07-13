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

  return (
    <div className="w-full space-y-4">
      {/* Categories Accordion */}
      <div className="border border-outline-variant/30 rounded-md overflow-hidden bg-surface">
        <button 
          onClick={() => toggleSection("categories")}
          className="w-full flex justify-between items-center p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
        >
          <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Categories</span>
          <span className="material-symbols-outlined text-on-surface-variant">
            {openSection === "categories" ? "expand_less" : "expand_more"}
          </span>
        </button>
        {openSection === "categories" && (
          <div className="p-4 border-t border-outline-variant/30 bg-surface max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.value}>
                  <label className="flex items-center cursor-pointer hover:text-black transition-colors font-body-md text-gray-600 text-sm">
                    <input 
                      type="checkbox" 
                      checked={activeCategories.includes(cat.value)}
                      onChange={() => handleFilterChange("category", cat.value)}
                      className="form-checkbox rounded-sm text-primary border-outline-variant focus:ring-primary mr-3 w-4 h-4 bg-transparent cursor-pointer" 
                    />
                    {cat.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Brands Accordion */}
      <div className="border border-outline-variant/30 rounded-md overflow-hidden bg-surface">
        <button 
          onClick={() => toggleSection("brands")}
          className="w-full flex justify-between items-center p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
        >
          <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Brands</span>
          <span className="material-symbols-outlined text-on-surface-variant">
            {openSection === "brands" ? "expand_less" : "expand_more"}
          </span>
        </button>
        {openSection === "brands" && (
          <div className="p-4 border-t border-outline-variant/30 bg-surface max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <ul className="space-y-3">
              {brands.map((brand) => (
                <li key={brand.value}>
                  <label className="flex items-center cursor-pointer hover:text-black transition-colors font-body-md text-gray-600 text-sm">
                    <input 
                      type="checkbox" 
                      checked={activeBrands.includes(brand.value)}
                      onChange={() => handleFilterChange("brand", brand.value)}
                      className="form-checkbox rounded-sm text-primary border-outline-variant focus:ring-primary mr-3 w-4 h-4 bg-transparent cursor-pointer" 
                    />
                    {brand.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Skin Concerns Accordion */}
      <div className="border border-outline-variant/30 rounded-md overflow-hidden bg-surface">
        <button 
          onClick={() => toggleSection("concerns")}
          className="w-full flex justify-between items-center p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
        >
          <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Skin Concerns</span>
          <span className="material-symbols-outlined text-on-surface-variant">
            {openSection === "concerns" ? "expand_less" : "expand_more"}
          </span>
        </button>
        {openSection === "concerns" && (
          <div className="p-4 border-t border-outline-variant/30 bg-surface max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <ul className="space-y-3">
              {concerns.map((concern) => (
                <li key={concern.value}>
                  <label className="flex items-center cursor-pointer hover:text-black transition-colors font-body-md text-gray-600 text-sm">
                    <input 
                      type="checkbox" 
                      checked={activeConcerns.includes(concern.value)}
                      onChange={() => handleFilterChange("concern", concern.value)}
                      className="form-checkbox rounded-sm text-primary border-outline-variant focus:ring-primary mr-3 w-4 h-4 bg-transparent cursor-pointer" 
                    />
                    {concern.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
