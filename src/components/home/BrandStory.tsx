import Image from "next/image";
import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="py-24 md:py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        
        {/* Editorial Image Composition - Increased Width */}
        <div className="relative h-[600px] lg:h-[800px] w-full lg:col-span-7">
          {/* Main Image (Logo Sign) */}
          <div className="absolute top-0 left-0 w-[80%] h-[75%] z-10 bg-surface">
            <Image 
              src="/store-sign.jpg" 
              alt="Elvara SkinLane glowing logo sign on the wall"
              fill
              className="object-cover rounded-sm shadow-[0_20px_50px_rgb(0,0,0,0.05)]"
              sizes="(max-width: 1024px) 80vw, 50vw"
              priority
            />
          </div>
          {/* Accent Image (Store Shelves) */}
          <div className="absolute bottom-0 right-0 w-[60%] h-[55%] z-20 bg-surface border-[6px] border-background translate-y-8 -translate-x-4 lg:translate-x-8">
            <Image 
              src="/store-shelves.jpg" 
              alt="Elvara SkinLane physical store shelves stocked with premium skincare"
              fill
              className="object-cover rounded-sm shadow-[0_20px_50px_rgb(0,0,0,0.1)]"
              sizes="(max-width: 1024px) 60vw, 35vw"
            />
          </div>
        </div>

        {/* Copywriting */}
        <div className="flex flex-col justify-center max-w-lg lg:col-span-5">
          <span className="font-label-md text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-4">Our Story</span>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-8 leading-[1.1] tracking-tight">
            Beauty That <br/>Feels Like You.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed font-light">
            Welcome to Elvara SkinLane, your premier destination for authentic, high-quality skincare and beauty essentials. Whether you shop online or visit our physical store, we are dedicated to helping you achieve your skin goals.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-12 leading-relaxed font-light opacity-90">
            Explore our curated selection of top-tier brands, dermatologically tested formulations, and luxurious body care products designed to elevate your daily routine and reveal your natural radiance.
          </p>
          <Link 
            href="/shop"
            className="inline-flex items-center text-primary font-label-md text-[11px] uppercase tracking-[0.15em] border-b border-primary/50 pb-2 w-max hover:text-black hover:border-black transition-colors duration-300 group"
          >
            Shop The Collection
            <span className="material-symbols-outlined ml-2 text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
