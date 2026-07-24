"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    image: "/hero-retail-1.png",
    title: "Your Premier Beauty Destination",
    subtitle: "Shop 100+ authentic global skincare, haircare, and makeup brands all in one place. From K-Beauty staples to dermatologist favorites.",
    cta: "Shop All Brands",
    href: "/brands",
  },
  {
    image: "/hero-retail-2.png",
    title: "Curated For Every Routine",
    subtitle: "Whether you need a daily cleanser, a potent serum, or luxury hair extensions, we source the highest quality products for your unique needs.",
    cta: "Explore Categories",
    href: "/categories",
  },
  {
    image: "/hero-retail-3.png",
    title: "Targeted Skin Solutions",
    subtitle: "Struggling with acne, hyperpigmentation, or dullness? Discover proven, authentic products formulated to treat your specific concerns.",
    cta: "Shop by Concern",
    href: "/concerns",
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[85vh] md:h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Carousel Backgrounds */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0} // Only prioritize the first image for LCP
            className="object-cover object-center opacity-70 mix-blend-overlay"
            sizes="100vw"
          />
          {/* Refined gradient overlays for editorial contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      ))}

      {/* Carousel Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto mt-20">

        {/* We use a wrapper with a key to trigger animations when the slide changes */}
        <div key={currentSlide} className="animate-fade-in-up flex flex-col items-center">
          <span className="font-label-md text-[10px] uppercase tracking-[0.3em] text-white/80 mb-6 border-b border-white/30 pb-2">
            The Collection
          </span>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-6 drop-shadow-sm tracking-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="font-body-md md:font-body-lg text-white/90 max-w-2xl mb-12 drop-shadow-sm mx-auto font-light leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>
          <Link
            href={slides[currentSlide].href}
            className="inline-flex items-center justify-center px-12 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-label-md text-[11px] uppercase tracking-[0.15em] rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-md"
          >
            {slides[currentSlide].cta}
          </Link>
        </div>



      </div>
    </section>
  );
}
