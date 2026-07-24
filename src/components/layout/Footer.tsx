import Link from "next/link";

const footerLinks = {
  explore: [
    { label: "Shop All", href: "/shop" },
    { label: "Brands", href: "/brands" },
    { label: "Categories", href: "/categories" },
    { label: "Concerns", href: "/concerns" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  account: [
    { label: "My Account", href: "/account" },
    { label: "Dashboard", href: "/account" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Order History", href: "/account" },
  ],
  connect: [
    { label: "Instagram", href: "https://www.instagram.com/elvaraskinlane" },
    { label: "WhatsApp", href: "https://wa.me/2347067615908" },
  ],
};

function FooterColumn({
  title,
  links,
  external = false,
}: {
  title: string;
  links: { label: string; href: string }[];
  external?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className="h-8 mb-4 flex items-center justify-center sm:justify-start">
        <h3 className="font-label-md text-[11px] tracking-[0.15em] text-on-surface uppercase leading-none">
          {title}
        </h3>
      </div>

      <ul className="space-y-2.5 flex flex-col items-center sm:items-start">
        {links.map((link) => (
          <li key={link.label}>
            {external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body-sm text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 block"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="font-body-sm text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 block"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-16 pb-8 border-t border-outline-variant bg-surface-container-low dark:bg-surface-container-lowest">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col items-center sm:items-start text-center sm:text-left lg:pr-8">
            <div className="h-8 mb-4 flex items-center">
              <Link href="/" className="inline-block">
                <span className="font-headline-sm text-[22px] italic text-primary leading-none block">
                  Elvara Skinlane
                </span>
              </Link>
            </div>
            <p className="max-w-[240px] font-body-sm text-sm text-on-surface-variant leading-relaxed">
              Elevating your daily skincare routine into a moment of pure, mindful luxury.
            </p>
          </div>

          <FooterColumn title="Explore" links={footerLinks.explore} />
          <FooterColumn title="Support" links={footerLinks.support} />
          <FooterColumn title="Account" links={footerLinks.account} />
          <FooterColumn title="Connect" links={footerLinks.connect} external />
        </div>
      </div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-t border-outline-variant/30 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-body-sm text-xs text-on-surface-variant/70">
            © {currentYear} Elvara Skinlane. Beauty that feels like you.
          </p>
          <p className="font-body-sm text-xs text-on-surface-variant/70 tracking-wide">
            Powered by{" "}
            <a
              href="https://yusufsaka.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-on-surface hover:text-primary transition-colors duration-300"
            >
              emjaay
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
