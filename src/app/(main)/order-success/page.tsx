"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    setReference(searchParams.get("reference"));
  }, [searchParams]);

  return (
    <div className="text-center max-w-2xl mx-auto animate-fade-in">
      <div className="w-24 h-24 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
        <span className="material-symbols-outlined text-4xl text-primary font-light">
          check_circle
        </span>
      </div>
      
      <h1 className="font-headline-md text-4xl md:text-5xl text-on-background uppercase tracking-wide mb-6">
        Order Confirmed
      </h1>
      
      <p className="font-body-lg text-on-surface-variant leading-relaxed mb-8">
        Thank you for your purchase. We have received your order and are currently processing it.
        You will receive an email confirmation shortly.
      </p>

      {reference && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-sm mb-12">
          <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Transaction Reference
          </p>
          <p className="font-body-lg text-on-surface tracking-wider">{reference}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Link 
          href="/shop"
          className="h-14 px-10 bg-on-background text-background font-label-lg uppercase tracking-[0.2em] text-sm hover:bg-primary hover:text-on-primary transition-all duration-300 flex items-center justify-center shadow-md"
        >
          Continue Shopping
        </Link>
        <Link 
          href="/account/orders"
          className="h-14 px-10 border border-outline-variant text-on-surface font-label-lg uppercase tracking-[0.2em] text-sm hover:border-on-surface hover:bg-surface-container-lowest transition-all duration-300 flex items-center justify-center"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-4 flex items-center justify-center">
      <Suspense fallback={<div className="text-center"><div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
