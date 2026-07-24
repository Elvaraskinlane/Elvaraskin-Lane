import Link from "next/link";

export default function StoreLocator() {
  return (
    <section className="w-full bg-surface-container-low py-20 px-margin-mobile md:px-margin-desktop border-y border-secondary-fixed-dim/30 mt-16">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: '32px', fontVariationSettings: "'wght' 300" }}>
          location_on
        </span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Visit Our Flagship Store</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-2 max-w-lg mx-auto">
          SUITE A7 DANSARARI PLAZA, NO 5 ZIQUINCHOR STREET, WUSE ZONE 4, ABUJA FCT
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-lg mx-auto">
          Nigeria
        </p>
        <a 
          href="https://maps.app.goo.gl/qYchFivGKiJ7gu6q6" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border border-secondary-fixed-dim text-on-surface hover:bg-secondary-fixed hover:border-secondary-fixed transition-colors duration-300 font-label-md text-label-md rounded-sm"
        >
          Get Directions
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
        </a>
      </div>
    </section>
  );
}
