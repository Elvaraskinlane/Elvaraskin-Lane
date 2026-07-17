export default function ValueProps() {
  return (
    <section className="w-full bg-surface-container-low border-y border-outline-variant/20 py-8">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-16 space-y-4 md:space-y-0 text-center">

          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-on-surface-variant">verified</span>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">100% Authentic Brands</span>
          </div>

          <div className="hidden md:block w-px h-6 bg-outline-variant/40"></div>

          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-on-surface-variant">auto_awesome</span>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Expertly Curated</span>
          </div>

          <div className="hidden md:block w-px h-6 bg-outline-variant/40"></div>

          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-on-surface-variant">local_shipping</span>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Fast & Secure Delivery</span>
          </div>

        </div>
      </div>
    </section>
  );
}
