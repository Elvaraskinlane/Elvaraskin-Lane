import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/woocommerce";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartPanel from "@/components/product/AddToCartPanel";
import BestsellersCarousel from "@/components/home/BestsellersCarousel";
import ProductShare from "@/components/product/ProductShare";

export const dynamicParams = true; // Allows on-demand generation for new products

export async function generateStaticParams() {
  return []; // Return an empty array or initial slugs. Next.js will build the rest on demand.
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // LIVE DATA FETCH:
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  // Fetch related products for the cross-sell section
  let relatedProducts = [];
  
  if (product.related_ids && product.related_ids.length > 0) {
    relatedProducts = await getProducts(10, { include: product.related_ids.join(',') });
  }
  
  // Fallback: fetch products in the same category
  if (relatedProducts.length === 0 && product.categories && product.categories.length > 0) {
    relatedProducts = await getProducts(10, { category: product.categories[0].slug });
    // Filter out the current product
    relatedProducts = relatedProducts.filter(p => p.id !== product.id);
  }

  // Final fallback: just get latest products
  if (relatedProducts.length === 0) {
    relatedProducts = await getProducts(10);
    relatedProducts = relatedProducts.filter(p => p.id !== product.id);
  }

  return (
    <main className="w-full bg-background animate-fade-in">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-10 font-label-md text-sm text-on-surface-variant uppercase tracking-wider">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[16px] opacity-50">chevron_right</span>
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span className="material-symbols-outlined text-[16px] opacity-50">chevron_right</span>
          {product.categories?.[0] && (
            <>
              <Link href={`/category/${product.categories[0].slug}`} className="hover:text-primary transition-colors">
                {product.categories[0].name}
              </Link>
              <span className="material-symbols-outlined text-[16px] opacity-50">chevron_right</span>
            </>
          )}
          <span className="text-on-background font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images || []} fallbackImage="/hero-1.png" />
          </div>

          {/* Right Column: Product Data */}
          <div className="lg:col-span-5 flex flex-col pt-2 md:pt-6">
            <h1 className="font-headline-lg text-4xl md:text-5xl lg:text-[52px] text-on-background mb-6 leading-[1.1] tracking-tight">
              {product.name}
            </h1>
            
            {/* Render raw HTML description safely */}
            <div 
              className="font-body-md text-lg text-on-surface-variant/90 leading-relaxed prose prose-stone prose-p:mb-6 max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description || product.short_description || "<p>A beautifully crafted product to elevate your routine.</p>" }}
            />

            {/* Key Benefits (Static for now, can map from WC Meta later) */}
            <div className="mt-8 space-y-4 bg-surface-container-lowest p-6 border border-outline-variant/10 rounded-sm">
              <h3 className="font-label-md text-sm text-on-background uppercase tracking-[0.2em] mb-4">Key Benefits</h3>
              <ul className="space-y-4 font-body-md text-on-surface-variant">
                <li className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[20px] text-primary">verified</span>
                  Dermatologically tested and approved for sensitive skin.
                </li>
                <li className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[20px] text-primary">eco</span>
                  Sustainably sourced, cruelty-free botanicals.
                </li>
                <li className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[20px] text-primary">water_drop</span>
                  Deep hydration without stripping natural moisture.
                </li>
              </ul>
            </div>

            {/* Interactive Client Panel */}
            <AddToCartPanel 
              productId={product.id} 
              productName={product.name}
              price={product.price} 
              stockStatus={product.stock_status || "instock"} 
              image={product.images?.[0]?.src || "/hero-2-fixed.png"}
              slug={product.slug}
            />
            
            <ProductShare productName={product.name} />
            
          </div>
        </div>

      </div>

      {/* Related Products Cross-Sell */}
      <BestsellersCarousel 
        initialProducts={relatedProducts} 
        title="Related Products"
        subtitle="Perfect matches for your routine."
        linkText="Shop Collection"
      />
    </main>
  );
}
