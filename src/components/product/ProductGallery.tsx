"use client";

import { useState } from "react";
import Image from "next/image";
import { WCImage } from "@/types/woocommerce";

interface ProductGalleryProps {
  images: WCImage[];
  fallbackImage: string;
}

export default function ProductGallery({ images, fallbackImage }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const imageList = images?.length > 0 ? images : [{ id: 1, src: fallbackImage, alt: "Fallback", name: "Fallback" }];
  const activeImage = imageList[activeIndex]?.src || fallbackImage;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 h-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto hide-scrollbar snap-x py-1 md:py-0 pr-1 md:w-28 flex-shrink-0">
        {imageList.map((img, idx) => (
          <button 
            key={img.id || idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative w-20 h-24 md:w-24 md:h-32 flex-shrink-0 bg-white rounded-sm overflow-hidden border transition-all duration-300 snap-start shadow-sm ${
              activeIndex === idx 
                ? "border-black scale-100 opacity-100" 
                : "border-outline-variant/15 opacity-60 hover:opacity-100 hover:scale-[1.02]"
            }`}
          >
            <Image 
              src={img.src} 
              alt={img.alt || img.name || `Thumbnail ${idx + 1}`} 
              fill 
              className="object-cover mix-blend-multiply p-1" 
              sizes="96px"
            />
          </button>
        ))}
      </div>

      {/* Main Feature Image */}
      <div className="relative w-full aspect-[4/5] md:aspect-[3/4] bg-white rounded-sm overflow-hidden flex-1 cursor-crosshair group shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/15">
        <Image 
          src={activeImage} 
          alt={imageList[activeIndex]?.alt || imageList[activeIndex]?.name || "Main product image"} 
          fill 
          priority
          className="object-cover mix-blend-multiply transition-transform duration-[1.5s] ease-out group-hover:scale-[1.15]" 
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
