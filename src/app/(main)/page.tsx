import HeroSection from "@/components/home/HeroSection";
import ValueProps from "@/components/home/ValueProps";
import CuratedEssentials from "@/components/home/CuratedEssentials";
import BestsellersCarousel from "@/components/home/BestsellersCarousel";
import BrandStory from "@/components/home/BrandStory";
import Newsletter from "@/components/home/Newsletter";
import { getProducts } from "@/lib/woocommerce";

export default async function Home() {
  // Fetch the top 6 products from WordPress for the carousel
  const liveProducts = await getProducts(6);

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <HeroSection />
      <ValueProps />
      <CuratedEssentials />
      {/* Hydrate the carousel with live database items */}
      <BestsellersCarousel initialProducts={liveProducts} />
      <BrandStory />
      <Newsletter />
    </div>
  );
}
