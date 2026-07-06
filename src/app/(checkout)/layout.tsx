import Link from "next/link";
import Image from "next/image";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md">
      <header className="w-full top-0 sticky bg-background border-b border-outline-variant/30 py-4 px-margin-mobile md:px-margin-desktop flex justify-between items-center z-50">
        <Link href="/" className="hover:opacity-70 transition-opacity duration-300">
           {/* Replace with your logo */}
           <span className="font-headline-md text-headline-md italic text-primary">Elvara Skinlane</span>
        </Link>
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <span className="font-label-md text-label-md text-on-surface-variant">Secure Checkout</span>
        </div>
      </header>
      
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop">
        {children}
      </main>
    </div>
  );
}
