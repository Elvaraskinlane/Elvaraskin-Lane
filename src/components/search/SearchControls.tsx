"use client";

export default function SearchControls({ resultCount }: { resultCount: number }) {
  return (
    <section className="w-full px-margin-mobile md:px-margin-desktop border-b border-outline-variant/30 sticky top-[88px] bg-surface/95 backdrop-blur z-40 py-4">
      <div className="w-full max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body-md text-on-surface-variant hidden md:block">{resultCount} results found</p>
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <button className="flex items-center gap-2 text-primary font-label-md hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-[20px]">tune</span>
            Filter
          </button>
          <div className="relative group cursor-pointer flex items-center gap-2 text-primary font-label-md hover:opacity-70 transition-opacity">
            <span>Sort by: Recommended</span>
            <span className="material-symbols-outlined text-[20px]">expand_more</span>
          </div>
        </div>
      </div>
    </section>
  );
}
