import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pt-16 md:pt-32 pb-16">
      <div className="text-center mb-12">
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mb-6">
          Return to Balance
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Elvara Skinlane was born from a desire to strip away the unnecessary, focusing entirely on high-performance botanicals and the quiet luxury of daily self-care.
        </p>
      </div>
      
      <div className="w-full h-[614px] md:h-[819px] overflow-hidden rounded-sm shadow-[0_30px_60px_-15px_rgba(44,44,44,0.04)] relative">
        <Image 
          src="/hero-1.png" 
          alt="Natural skincare ingredients including chamomile and oils" 
          fill
          priority // LCP element, must load immediately
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
