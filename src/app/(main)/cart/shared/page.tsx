"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

function SharedCartHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem, isLoading } = useCartStore();
  
  const [sharedItems, setSharedItems] = useState<{id: number, quantity: number}[]>([]);
  const [error, setError] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) {
      setError("No shared cart data found in the URL.");
      return;
    }

    try {
      const jsonString = atob(data);
      const items = JSON.parse(jsonString);
      
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Invalid cart data format.");
      }
      
      setSharedItems(items);
    } catch (err) {
      console.error("Failed to decode shared cart:", err);
      setError("This shared link appears to be invalid or corrupted.");
    }
  }, [searchParams]);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      // Add all items sequentially to ensure they are added properly
      for (const item of sharedItems) {
        if (item.id && item.quantity) {
          await addItem(item.id, item.quantity);
        }
      }
      // Redirect to cart upon success
      router.push("/cart");
    } catch (err: any) {
      console.error("Error importing cart:", err);
      alert("There was an issue adding some items to your cart.");
      setIsImporting(false);
    }
  };

  if (error) {
    return (
      <div className="bg-error-container/20 border border-error/30 p-8 rounded-xl text-center max-w-md w-full shadow-md backdrop-blur-md">
        <span className="material-symbols-outlined text-error text-4xl mb-4">error</span>
        <h3 className="font-headline-sm text-on-surface mb-2">Invalid Link</h3>
        <p className="font-body-md text-on-surface-variant text-sm mb-6">
          {error}
        </p>
        <Link href="/" className="bg-on-background text-background font-label-md px-6 py-3 rounded-md uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-colors inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  if (sharedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
        <span className="font-label-md text-on-surface-variant">Reading shared cart...</span>
      </div>
    );
  }

  return (
    <div className="bg-surface/70 backdrop-blur-md border border-outline-variant/30 p-8 md:p-12 rounded-2xl text-center max-w-md w-full shadow-lg">
      <span className="material-symbols-outlined text-primary text-5xl mb-6">redeem</span>
      <h2 className="font-headline-md text-on-surface mb-4">You received a shared cart!</h2>
      <p className="font-body-md text-on-surface-variant mb-8">
        Someone has shared their curated Elvara Skinlane routine with you. It contains {sharedItems.reduce((acc, item) => acc + item.quantity, 0)} items.
      </p>
      
      <button
        onClick={handleImport}
        disabled={isImporting || isLoading}
        className="w-full bg-on-background text-background font-label-lg px-6 py-4 rounded-md uppercase tracking-[0.1em] hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isImporting ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
            Importing Cart...
          </>
        ) : (
          "Add All to My Cart"
        )}
      </button>
      
      <div className="mt-6">
        <Link href="/" className="font-label-md text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4 decoration-outline-variant/30">
          No thanks, return home
        </Link>
      </div>
    </div>
  );
}

export default function SharedCartPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 aspect-square bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 aspect-square bg-tertiary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            <span className="font-label-md text-on-surface-variant">Loading...</span>
          </div>
        }>
          <SharedCartHandler />
        </Suspense>
      </div>
    </div>
  );
}
