import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-20 pb-10 border-t border-outline-variant bg-surface-container-low dark:bg-surface-container-lowest">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-16">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <div className="font-headline-sm text-headline-sm italic text-primary mb-6">
            Elvara Skinlane
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
            Elevating your daily skincare routine into a moment of pure, mindful luxury.
          </p>
        </div>

        {/* Empty column for spacing on desktop */}
        <div className="hidden md:block"></div>

        {/* Links Column 1 */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-2">Explore</h4>
          <Link href="/shop" className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-all duration-200 w-fit">Shop All</Link>
          <Link href="/skincare" className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-all duration-200 w-fit">Skincare</Link>
          <Link href="/rituals" className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-all duration-200 w-fit">Rituals</Link>
          <Link href="/about" className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-all duration-200 w-fit">Our Story</Link>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-2 mt-8 md:mt-0">Support</h4>
          <Link href="/contact" className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-all duration-200 w-fit">Contact Us</Link>
          <Link href="/shipping" className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-all duration-200 w-fit">Shipping & Returns</Link>
          <Link href="/privacy" className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-all duration-200 w-fit">Privacy Policy</Link>
          <Link href="/terms" className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-all duration-200 w-fit">Terms of Service</Link>
          <Link href="/sustainability" className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-all duration-200 w-fit">Sustainability</Link>
        </div>
      </div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-t border-outline-variant/20 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="font-body-md text-body-md text-on-surface-variant mb-4 md:mb-0">
          © {currentYear} Elvara Skinlane. Beauty that feels like you.
        </p>
        <div className="flex space-x-6 text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">IN</a>
          <a href="#" className="hover:text-primary transition-colors" aria-label="TikTok">TT</a>
          <a href="#" className="hover:text-primary transition-colors" aria-label="Pinterest">PT</a>
        </div>
      </div>
    </footer>
  );
}
