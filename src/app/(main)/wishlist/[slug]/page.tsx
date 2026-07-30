import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductsByIds } from "@/lib/woocommerce";
import { notFound } from "next/navigation";
import WishlistClientHandler from "./WishlistClientHandler";
import { Stars, Favorite } from '@material-symbols-svg/react';

interface PageProps {
  params: { slug: string };
}

export const revalidate = 60; // Revalidate every minute

async function getWishlistData(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/elvara/v1/wishlist/${slug}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    if (res.status === 404 || res.status === 403) {
      return null;
    }
    throw new Error("Failed to fetch wishlist data");
  }

  return res.json();
}

export default async function PublicWishlistPage({ params }: PageProps) {
  const data = await getWishlistData(params.slug);

  if (!data) {
    notFound();
  }

  const { name, items } = data;
  
  let products: any[] = [];
  if (items && items.length > 0) {
    products = await getProductsByIds(items);
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      maximumFractionDigits: 0 
    }).format(Number(price) || 0); 
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
      <div className="text-center mb-16 animate-fade-in">
        <Stars className="text-primary text-5xl mb-6 font-light" />
        <h1 className="font-headline-md text-3xl md:text-5xl text-on-surface mb-6 tracking-tight">
          {name}&apos;s Skincare Routine
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 text-lg">
          Discover the products {name} loves. Add them directly to your cart to build a similar regimen!
        </p>
        
        {products.length > 0 && (
          <WishlistClientHandler products={products} />
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center opacity-70">
          <Favorite className="text-4xl mb-4 font-light text-on-surface-variant" />
          <p className="font-body-md text-sm text-on-surface-variant">This routine is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-16">
          {products.map((product: any, index: number) => {
            const imageSrc = product.images?.[0]?.src || "/hero-3.png";
            return (
              <div key={product.id} className="group relative flex flex-col animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative w-full aspect-[4/5] bg-surface-container-low overflow-hidden mb-6 rounded-sm border border-outline-variant/10">
                  <Image 
                    src={imageSrc} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out p-4 mix-blend-multiply" 
                  />
                  <div className="absolute inset-0 bg-on-surface/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <WishlistClientHandler productId={product.id} />
                  </div>
                </div>
                
                <div className="flex justify-between items-start text-center flex-col px-2">
                  <h3 className="font-headline-sm text-on-surface text-lg w-full mb-2" dangerouslySetInnerHTML={{ __html: product.name }} />
                  <p className="font-label-md text-on-surface-variant w-full mt-1 uppercase tracking-widest">{formatPrice(product.price)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
