import Image from "next/image";
import Link from "next/link";

export default function CuratedEssentials() {
  return (
    <section className="py-24 md:py-32 px-margin-mobile md:px-margin-desktop w-full max-w-[1280px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-headline-md text-headline-md text-on-background mb-4">Curated Essentials</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
          Elevate your daily routine with our meticulously crafted collections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-auto md:h-[600px] w-full">
        
        {/* Skincare (Large Left) */}
        <Link href="/shop" className="md:col-span-7 relative group overflow-hidden bg-surface-container h-96 md:h-full flex items-end p-8">
          <div className="absolute inset-0">
            <Image 
              src="/hero-1.png" 
              alt="Skincare Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="relative z-10">
            <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">Skincare</h3>
            <div className="flex items-center text-on-background/80 font-label-md text-label-md group-hover:text-primary transition-colors">
              <span>Explore Category</span>
              <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
            </div>
          </div>
        </Link>

        {/* Right Column Stack */}
        <div className="md:col-span-5 flex flex-col gap-gutter h-full">
          
          {/* Body Care (Top Right) */}
          <Link href="/shop?category=bath-body" className="relative group overflow-hidden bg-surface-container h-64 md:h-1/2 flex items-end p-8">
            <div className="absolute inset-0">
              <Image 
                src="/hero-2-fixed.png" 
                alt="Body Care Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="relative z-10">
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">Body Care</h3>
              <div className="flex items-center text-on-background/80 font-label-md text-label-md group-hover:text-primary transition-colors">
                <span>Explore Category</span>
                <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* Rituals (Bottom Right) */}
          <Link href="/shop" className="relative group overflow-hidden bg-surface-container h-64 md:h-1/2 flex items-end p-8">
            <div className="absolute inset-0">
              <Image 
                src="/hero-3.png" 
                alt="Rituals Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="relative z-10">
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">Rituals</h3>
              <div className="flex items-center text-on-background/80 font-label-md text-label-md group-hover:text-primary transition-colors">
                <span>Explore Category</span>
                <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
