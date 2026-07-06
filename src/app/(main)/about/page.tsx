import AboutHero from "@/components/about/AboutHero";
import BrandPhilosophy from "@/components/about/BrandPhilosophy";
import ElvaraStandard from "@/components/about/ElvaraStandard";

// Optional but recommended: Add page-specific metadata for SEO
export const metadata = {
  title: "Our Story - Elvara Skinlane",
  description: "Learn about our commitment to minimal, high-performance botanical skincare and ethical sourcing.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full animate-fade-in">
      <AboutHero />
      <BrandPhilosophy />
      <ElvaraStandard />
    </div>
  );
}
