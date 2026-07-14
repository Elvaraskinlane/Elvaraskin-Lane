import Link from "next/link";
import { getAllCategories } from "@/lib/woocommerce";

export const metadata = {
  title: 'Categories | Elvara Skinlane',
  description: 'Explore our complete range of skincare categories designed for your unique needs.',
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  // Filter out the "Uncategorized" category and those with 0 products
  const activeCategories = categories
    .filter(c => c.count > 0 && c.slug !== 'uncategorized')
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="w-full bg-background animate-fade-in pb-24">
      {/* Header Section */}
      <div className="bg-surface py-16 md:py-24 px-margin-mobile md:px-margin-desktop text-center">
        <h1 className="font-headline-lg text-4xl md:text-5xl text-on-background uppercase tracking-tight mb-4">
          Shop by Category
        </h1>
        <div className="w-16 h-[2px] bg-primary mx-auto mb-6"></div>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Explore our complete range of skincare categories designed for your unique needs.
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pt-16">
        {activeCategories.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">category</span>
            <p>No categories found at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {activeCategories.map((category) => (
              <Link 
                key={category.id}
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/30 rounded-md p-8 text-center hover:border-primary transition-all duration-300 hover:shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-[28px] text-on-background group-hover:text-primary transition-colors">
                    spa
                  </span>
                </div>
                <h3 className="font-label-lg text-base md:text-lg text-on-background uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs md:text-sm text-on-surface-variant">
                  {category.count} {category.count === 1 ? 'Product' : 'Products'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
