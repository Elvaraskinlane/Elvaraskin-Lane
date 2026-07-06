"use client";

import { useState } from "react";

export default function ShopSidebar() {
  const [price, setPrice] = useState(125);

  return (
    <aside className="md:col-span-3 space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4 border-b border-outline-variant pb-2">
          Product Categories
        </h3>
        <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
          {["All Skincare", "Cleansers", "Serums & Oils", "Moisturizers", "Masks & Treatments"].map((category, idx) => (
            <li key={category}>
              <label className="flex items-center cursor-pointer hover:text-primary transition-colors">
                <input 
                  type="checkbox" 
                  defaultChecked={idx === 0}
                  className="form-checkbox rounded-sm text-primary border-outline-variant focus:ring-primary mr-3 w-4 h-4 bg-transparent cursor-pointer" 
                /> 
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4 border-b border-outline-variant pb-2">
          Price Range
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
            <span>$0</span>
            <span>${price}</span>
            <span>$250+</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="250" 
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-1 bg-outline-variant rounded-full appearance-none cursor-pointer accent-primary" 
          />
        </div>
      </div>

      {/* Skin Concerns */}
      <div>
        <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4 border-b border-outline-variant pb-2">
          Skin Concerns
        </h3>
        <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
          {["Hydration", "Brightening", "Anti-Aging", "Sensitivity"].map((concern) => (
            <li key={concern}>
              <label className="flex items-center cursor-pointer hover:text-primary transition-colors">
                <input 
                  type="checkbox" 
                  className="form-checkbox rounded-sm text-primary border-outline-variant focus:ring-primary mr-3 w-4 h-4 bg-transparent cursor-pointer" 
                /> 
                {concern}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
