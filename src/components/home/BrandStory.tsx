import Image from "next/image";
import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="py-24 md:py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Editorial Image Composition */}
        <div className="relative h-[500px] lg:h-[700px] w-full">
          {/* Main Image (Foreground) */}
          <div className="absolute top-0 left-0 w-3/4 h-3/4 z-10">
            <Image 
              src="https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1974&auto=format&fit=crop" 
              alt="Editorial portrait demonstrating clear, glowing skin"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 75vw, 40vw"
            />
          </div>
          {/* Accent Image (Background/Offset) */}
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 z-0 -translate-y-8 -translate-x-8 lg:translate-y-12 lg:translate-x-12">
            <Image 
              src="https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=1974&auto=format&fit=crop" 
              alt="Lush green leaf covered in morning dew"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 66vw, 30vw"
            />
          </div>
        </div>

        {/* Copywriting */}
        <div className="flex flex-col justify-center max-w-lg lg:ml-auto">
          <h2 className="font-display-lg-mobile md:font-headline-md text-display-lg-mobile md:text-headline-md text-on-background mb-8 leading-tight">
            Nature's Potency,<br/>Elevated by Science.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
            We believe that true radiance begins with honoring your skin's natural balance. Our philosophy is rooted in the meticulous selection of high-performance botanicals, refined through rigorous clinical testing.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-10 leading-relaxed">
            Every formula is a testament to our commitment to purity, efficacy, and the sensory joy of a dedicated skincare ritual.
          </p>
          <Link 
            href="/about"
            className="inline-flex items-center text-primary font-label-md text-label-md border-b border-primary pb-1 w-max hover:text-on-background hover:border-on-background transition-colors duration-300"
          >
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
