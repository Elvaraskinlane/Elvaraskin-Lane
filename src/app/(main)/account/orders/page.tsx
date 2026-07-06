export const metadata = {
  title: "Order History - Elvara Skinlane",
};

export default function OrderHistoryPage() {
  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <header className="border-b border-outline-variant/30 pb-6">
        <h1 className="font-headline-md text-on-surface">Order History</h1>
        <p className="font-body-md text-on-surface-variant mt-2">
          View and track your previous rituals and purchases.
        </p>
      </header>

      {/* Placeholder for WooCommerce Orders */}
      <div className="bg-surface/70 backdrop-blur-md border border-outline-variant/20 rounded-xl p-12 text-center flex flex-col items-center">
        <span className="material-symbols-outlined text-4xl text-outline-variant mb-4">receipt_long</span>
        <h3 className="font-headline-sm text-on-surface mb-2">No orders yet</h3>
        <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
          When you complete a purchase, your order history and tracking details will appear here.
        </p>
      </div>
    </div>
  );
}
