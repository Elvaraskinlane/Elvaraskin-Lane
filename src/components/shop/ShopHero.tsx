import Image from "next/image";

export default function ShopHero() {
  return (
    <header className="w-full relative h-[409px] md:h-[512px] flex items-center justify-center bg-surface-container-low overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <Image 
          src="/store-sign1.jpg" 
          alt="Elvara Skinlane Store" 
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="relative z-10 text-center px-margin-mobile">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
          Shop All
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Discover our curated collection of high-performance, minimalist skincare.
        </p>
      </div>
    </header>
  );
}
