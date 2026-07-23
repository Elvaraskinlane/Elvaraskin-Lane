import HeroSection from "@/components/home/HeroSection";
import ValueProps from "@/components/home/ValueProps";
import CuratedEssentials from "@/components/home/CuratedEssentials";
import BestsellersCarousel from "@/components/home/BestsellersCarousel";
import BrandStory from "@/components/home/BrandStory";
import Newsletter from "@/components/home/Newsletter";
import { getProducts } from "@/lib/woocommerce";

export default async function Home() {
  // Fetch products from different categories to ensure a diverse, classy mix
  const [faceProducts, bodyProducts, fragranceProducts, makeupProducts] = await Promise.all([
    getProducts(4, { category: 'face' }),
    getProducts(4, { category: 'bath-body' }),
    getProducts(4, { category: 'fragrance' }),
    getProducts(4, { category: 'makeup' }),
  ]);

  // Combine, deduplicate by ID, and filter only products that have images
  const allProducts = [...faceProducts, ...bodyProducts, ...fragranceProducts, ...makeupProducts]
    .filter(p => p.images && p.images.length > 0)
    .filter((product, index, self) => 
      index === self.findIndex((t) => t.id === product.id)
    );

  // Shuffle the array to make it random but professional
  const shuffled = allProducts.sort(() => 0.5 - Math.random());
  
  // Pick the top 8 for the carousel
  const carouselProducts = shuffled.slice(0, 8);

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <HeroSection />
      <ValueProps />
      <CuratedEssentials />
      {/* Hydrate the carousel with live database items */}
      <BestsellersCarousel initialProducts={carouselProducts} />
      <BrandStory />
      <Newsletter />
    </div>
  );
}
