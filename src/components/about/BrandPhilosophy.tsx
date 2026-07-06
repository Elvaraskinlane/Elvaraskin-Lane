import Image from "next/image";

export default function BrandPhilosophy() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        
        {/* Copywriting Column */}
        <div className="md:col-span-5 md:pr-12 mb-12 md:mb-0">
          <span className="font-label-md text-label-md text-outline tracking-widest uppercase block mb-6">
            Our Philosophy
          </span>
          <h2 className="font-headline-md text-headline-md text-primary mb-8">
            Modern Elegance,<br/>Rooted in Nature.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            We believe that true beauty is cultivated through intention. In a world of complex routines and fleeting trends, we anchor our approach in minimalism and tactile experiences.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Every formula is a deliberate composition of ethically sourced actives, designed not just to transform the skin, but to elevate the mind through serene, ritualistic application.
          </p>
        </div>

        {/* Image Spread Column */}
        <div className="md:col-span-7 relative h-[500px] md:h-[600px]">
          {/* Background/Top Right Image */}
          <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-sm overflow-hidden shadow-[0_30px_60px_-15px_rgba(44,44,44,0.04)] z-10">
            <Image 
              src="/hero-2-fixed.png" 
              alt="Glowing skin profile" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Foreground/Bottom Left Image */}
          <div className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-sm overflow-hidden shadow-[0_30px_60px_-15px_rgba(44,44,44,0.04)] z-20 border border-surface-container-lowest">
            <Image 
              src="/hero-3.png" 
              alt="Minimalist product still life" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}
