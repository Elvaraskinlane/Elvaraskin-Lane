export default function ElvaraStandard() {
  return (
    <section className="bg-surface-container-low py-margin-desktop mt-16">
      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">The Elvara Standard</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
            Uncompromising quality, radical transparency, and a deep respect for the earth.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-surface p-10 rounded-sm border border-secondary-container shadow-[0_30px_60px_-15px_rgba(44,44,44,0.04)] hover:-translate-y-1 transition-transform duration-300">
            <span className="material-symbols-outlined text-secondary mb-6 text-3xl" style={{ fontVariationSettings: "'wght' 200" }}>eco</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Ethical Sourcing</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We trace every botanical back to its origin, partnering exclusively with farmers who utilize regenerative agricultural practices.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-surface p-10 rounded-sm border border-secondary-container shadow-[0_30px_60px_-15px_rgba(44,44,44,0.04)] hover:-translate-y-1 transition-transform duration-300">
            <span className="material-symbols-outlined text-secondary mb-6 text-3xl" style={{ fontVariationSettings: "'wght' 200" }}>water_drop</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Clean Formulations</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Free from synthetics and fillers. Our ingredient lists are concise, potent, and thoroughly vetted for safety and efficacy.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-surface p-10 rounded-sm border border-secondary-container shadow-[0_30px_60px_-15px_rgba(44,44,44,0.04)] hover:-translate-y-1 transition-transform duration-300">
            <span className="material-symbols-outlined text-secondary mb-6 text-3xl" style={{ fontVariationSettings: "'wght' 200" }}>recycling</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Mindful Packaging</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Housed in infinitely recyclable glass and minimal post-consumer recycled paper, designed to leave the lightest possible footprint.
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
}
