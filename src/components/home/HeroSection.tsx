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
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px]"></div>
        </div>
      ))}

      {/* Carousel Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto mt-20">

        {/* We use a wrapper with a key to trigger animations when the slide changes */}
        <div key={currentSlide} className="animate-fade-in-up">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-6 drop-shadow-sm">
            {slides[currentSlide].title}
          </h1>
          <p className="font-body-lg text-body-lg text-on-background max-w-2xl mb-10 drop-shadow-sm mx-auto">
            {slides[currentSlide].subtitle}
          </p>
          <Link
            href={slides[currentSlide].href}
            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest hover:bg-on-background transition-colors duration-300 shadow-md"
          >
            {slides[currentSlide].cta}
          </Link>
        </div>



      </div>
    </section>
  );
}
