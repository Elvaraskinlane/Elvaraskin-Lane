import Link from "next/link";
import { getAllTags } from "@/lib/woocommerce";

export const metadata = {
  title: 'Skin Concerns | Elvara Skinlane',
  description: 'Find targeted skincare solutions for your specific skin concerns.',
};

export default async function ConcernsPage() {
  const tags = await getAllTags();

  // Filter out concerns with 0 products
  // We exclude the special 'brand-of-the-month' tag as it's an internal tag
  const activeConcerns = tags
    .filter(t => t.count > 0 && t.slug !== 'brand-of-the-month')
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="w-full bg-background animate-fade-in pb-24">
      {/* Header Section */}
      <div className="bg-surface py-16 md:py-24 px-margin-mobile md:px-margin-desktop text-center">
        <h1 className="font-headline-lg text-4xl md:text-5xl text-on-background uppercase tracking-tight mb-4">
          Shop by Concern
        </h1>
        <div className="w-16 h-[2px] bg-primary mx-auto mb-6"></div>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Find targeted skincare solutions carefully curated for your specific skin concerns.
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pt-16">
        {activeConcerns.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">face</span>
            <p>No concerns found at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {activeConcerns.map((concern) => (
              <Link 
                key={concern.id}
                href={`/shop?concern=${concern.slug}`}
                className="group flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/30 rounded-md p-8 text-center hover:border-primary transition-all duration-300 hover:shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-[28px] text-on-background group-hover:text-primary transition-colors">
                    water_drop
                  </span>
                </div>
                <h3 className="font-label-lg text-base md:text-lg text-on-background uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
                  {concern.name}
                </h3>
                <p className="text-xs md:text-sm text-on-surface-variant">
                  {concern.count} {concern.count === 1 ? 'Product' : 'Products'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
