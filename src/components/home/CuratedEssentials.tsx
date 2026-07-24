import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/woocommerce";

export default async function CuratedEssentials() {
  // Directly fetch the latest products for each specific category to guarantee an image
  const [faceProducts, bodyProducts, specialProducts] = await Promise.all([
    getProducts(10, { category: 'face' }),
    getProducts(10, { category: 'bath-body,hair-care' }),
    getProducts(10, { category: 'aesthetician-kits-face,aesthetician-kits,gifts' })
  ]);

  const faceImg = faceProducts.find(p => p.images?.length > 0)?.images[0]?.src || "/hero-1.png";
  const bodyImg = bodyProducts.find(p => p.images?.length > 0)?.images[0]?.src || "/hero-2-fixed.png";
  const specialImg = specialProducts.find(p => p.images?.length > 0)?.images[0]?.src || "/hero-3.png";

  return (
    <section className="py-24 md:py-32 px-margin-mobile md:px-margin-desktop w-full max-w-[1280px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-headline-md text-headline-md text-on-background mb-4">Curated Essentials</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
          Elevate your daily routine with our meticulously crafted collections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-auto md:h-[600px] w-full">
        
        {/* Face Care (Large Left) */}
        <Link href="/shop?category=face" className="md:col-span-7 relative group overflow-hidden h-96 md:h-full flex items-end p-8 rounded-xl">
          <div className="absolute inset-0 bg-white">
            <Image 
              src={faceImg} 
              alt="Face Care Collection"
              fill
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {/* Elegant luxury gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          <div className="relative z-10 w-full flex flex-col justify-end">
            <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2">Category</span>
            <h3 className="font-headline-sm text-headline-sm text-white mb-2">Face Care</h3>
            <p className="font-body-md text-white/90 max-w-sm mb-6 text-shadow-sm font-light">
              Nourish, protect, and revitalize your complexion with our premium facial treatments.
            </p>
            <div className="flex items-center text-white/90 font-label-md text-xs tracking-widest uppercase group-hover:text-white transition-colors w-max group/link">
              <span>Explore Collection</span>
              <span className="material-symbols-outlined ml-2 text-[16px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </Link>

        {/* Right Column Stack */}
        <div className="md:col-span-5 flex flex-col gap-gutter h-full">
          
          {/* Body & Hair (Top Right) */}
          <Link href="/shop?category=bath-body,hair-care" className="relative group overflow-hidden h-64 md:h-1/2 flex items-end p-8 rounded-xl">
            <div className="absolute inset-0 bg-white">
              <Image 
                src={bodyImg} 
                alt="Body & Hair Collection"
                fill
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <div className="relative z-10 w-full flex flex-col justify-end">
              <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2">Category</span>
              <h3 className="font-headline-sm text-[20px] text-white mb-2">Body & Hair</h3>
              <p className="font-body-md text-[14px] text-white/90 max-w-sm mb-4 text-shadow-sm font-light">
                Luxurious hydration and restorative care from head to toe.
              </p>
              <div className="flex items-center text-white/90 font-label-md text-[11px] tracking-widest uppercase group-hover:text-white transition-colors w-max group/link">
                <span>Explore</span>
                <span className="material-symbols-outlined ml-2 text-[16px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* Specialized Collections (Bottom Right) */}
          <Link href="/shop?category=aesthetician-kits-face,aesthetician-kits" className="relative group overflow-hidden h-64 md:h-1/2 flex items-end p-8 rounded-xl">
            <div className="absolute inset-0 bg-white">
              <Image 
                src={specialImg} 
                alt="Specialized Collections"
                fill
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <div className="relative z-10 w-full flex flex-col justify-end">
              <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2">Category</span>
              <h3 className="font-headline-sm text-[20px] text-white mb-2">Specialized Collections</h3>
              <p className="font-body-md text-[14px] text-white/90 max-w-sm mb-4 text-shadow-sm font-light">
                Targeted solutions and aesthetician-approved kits for specific needs.
              </p>
              <div className="flex items-center text-white/90 font-label-md text-[11px] tracking-widest uppercase group-hover:text-white transition-colors w-max group/link">
                <span>Explore</span>
                <span className="material-symbols-outlined ml-2 text-[16px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
