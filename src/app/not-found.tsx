import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-background text-on-background antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Left Column: Copy & Actions */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative z-10">
        <div className="absolute top-8 left-8 md:top-12 md:left-12">
          <span className="font-headline-sm text-headline-sm text-on-surface">Elvara Skinlane</span>
        </div>

        <div className="max-w-md text-center flex flex-col items-center">
          <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-6 border-b border-outline-variant/50 pb-2">
            Error 404
          </span>
          <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-6">
            Lost in the glow.
          </h1>
          <p className="font-body-md text-on-surface-variant mb-12">
            The ritual you are seeking seems to have faded. The page may have been moved or removed as we refine our collections. Let us guide you back to clarity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              href="/"
              className="px-8 py-3 bg-surface-tint text-on-primary font-label-md rounded-md hover:bg-on-background transition-colors"
            >
              Homepage
            </Link>
            <Link 
              href="/shop"
              className="px-8 py-3 border border-outline-variant text-on-surface font-label-md rounded-md hover:border-primary transition-colors flex items-center justify-center gap-2 group"
            >
              Shop All
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Atmospheric Image */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden bg-surface-container-low">
        <Image 
          src="/hero-3.png" 
          alt="Minimalist glowing sphere reflecting light" 
          fill
          priority
          className="object-cover object-center mix-blend-multiply opacity-90"
        />
        {/* Soft edge gradient to blend the split screen */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent hidden md:block"></div>
      </div>
    </main>
  );
}
