import Image from "next/image";

export default function ShopHero() {
  return (
    <header className="w-full relative h-[400px] md:h-[480px] flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
      {/* Background Image with elegant fade */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/store-sign1.jpeg" 
          alt="Elvara Skinlane Store" 
          fill
          priority
          className="object-cover object-center opacity-60 mix-blend-overlay"
          sizes="100vw"
        />
        {/* Soft radial gradient to center focus and improve text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10 text-center px-margin-mobile flex flex-col items-center">
        <span className="font-label-md text-[10px] uppercase tracking-[0.3em] text-white/80 mb-4 border-b border-white/30 pb-2">
          The Collection
        </span>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4 tracking-tight">
          Shop All
        </h1>
        <p className="font-body-md md:font-body-lg text-white/90 max-w-xl mx-auto font-light leading-relaxed">
          Discover our curated collection of high-performance, minimalist skincare and beauty essentials.
        </p>
      </div>
    </header>
  );
}
