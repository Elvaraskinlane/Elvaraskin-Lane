import WishlistGrid from "@/components/wishlist/WishlistGrid";

export const metadata = {
  title: "Your Wishlist - Elvara Skinlane",
};

export default function WishlistPage() {
  return (
    <div className="pt-16 pb-margin-desktop px-margin-mobile md:px-margin-desktop w-full max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 space-y-6 md:space-y-0">
        <div>
          <p className="font-label-md text-on-surface-variant uppercase tracking-widest mb-4">Curated For You</p>
          <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface">Your Wishlist</h1>
        </div>
      </div>

      <hr className="border-t border-outline-variant/30 mb-16" />
      <WishlistGrid />
    </div>
  );
}
