"use client";
import { Tune, KeyboardArrowDown } from '@material-symbols-svg/react';

export default function SearchControls({ resultCount }: { resultCount: number }) {
  return (
    <section className="w-full px-margin-mobile md:px-margin-desktop border-b border-outline-variant/30 sticky top-[88px] bg-surface/95 backdrop-blur z-40 py-4">
      <div className="w-full max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body-md text-on-surface-variant hidden md:block">{resultCount} results found</p>
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <button className="flex items-center gap-2 text-primary font-label-md hover:opacity-70 transition-opacity">
            <Tune className="text-[20px]" />
            Filter
          </button>
          <div className="relative group cursor-pointer flex items-center gap-2 text-primary font-label-md hover:opacity-70 transition-opacity">
            <span>Sort by: Recommended</span>
            <KeyboardArrowDown className="text-[20px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
