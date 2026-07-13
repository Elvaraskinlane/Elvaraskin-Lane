"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    { name: "Makeup", value: "makeup" },
  ];

  const brands = [
    { name: "COSRX", value: "cosrx" },
    { name: "Anua", value: "anua" },
    { name: "The Ordinary", value: "the-ordinary" },
    { name: "Medicube", value: "medicube" },
  ];

  const concerns = [
    { name: "Acne & Breakouts", value: "acne-breakouts" },
    { name: "Dark Spots", value: "dark-spots" },
    { name: "Dry Skin", value: "dry-skin" },
  ];

  // Helper to create query string
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(name) === value) {
        params.delete(name); // Toggle off if already selected
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const queryString = createQueryString(name, value);
    router.push(`/shop?${queryString}`);
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
          <div className="p-4 border-t border-outline-variant/30 bg-surface">
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.value}>
                  <label className="flex items-center cursor-pointer hover:text-primary transition-colors font-body-md text-on-surface-variant">
                    <input 
                      type="checkbox" 
                      checked={searchParams.get("category") === cat.value}
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
          <div className="p-4 border-t border-outline-variant/30 bg-surface">
            <ul className="space-y-3">
              {brands.map((brand) => (
                <li key={brand.value}>
                  <label className="flex items-center cursor-pointer hover:text-primary transition-colors font-body-md text-on-surface-variant">
                    <input 
                      type="checkbox" 
                      checked={searchParams.get("brand") === brand.value}
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
          <div className="p-4 border-t border-outline-variant/30 bg-surface">
            <ul className="space-y-3">
              {concerns.map((concern) => (
                <li key={concern.value}>
                  <label className="flex items-center cursor-pointer hover:text-primary transition-colors font-body-md text-on-surface-variant">
                    <input 
                      type="checkbox" 
                      checked={searchParams.get("concern") === concern.value}
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
