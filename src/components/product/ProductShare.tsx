"use client";

import { useState, useEffect } from "react";

interface ProductShareProps {
  productName: string;
}

export default function ProductShare({ productName }: ProductShareProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  // Safely get the URL only after the component mounts on the client
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  // Standard Social Sharing URLs
  const shareToX = () => {
    const text = encodeURIComponent(`I'm obsessing over the ${productName} from Elvara Skinlane. Drop a hint! ✨`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  // Note: Instagram does not allow direct URL sharing via a web link API. 
  // The standard industry practice is to rely on "Copy Link" for Instagram DMs/Stories.

  return (
    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-outline-variant/30">
      <span className="font-label-md text-sm text-on-surface-variant uppercase tracking-widest">Share</span>
      
      <div className="flex gap-3">
        {/* X / Twitter Button */}
        <button 
          onClick={shareToX}
          className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
          aria-label="Share on X"
        >
          {/* Custom SVG for X */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Facebook Button */}
        <button 
          onClick={shareToFacebook}
          className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-[#1877F2] hover:border-[#1877F2] transition-colors"
          aria-label="Share on Facebook"
        >
          {/* Custom SVG for Facebook */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>

        {/* Copy Link Button */}
        <button 
          onClick={handleCopyLink}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${copied ? 'border-primary text-primary bg-primary-container' : 'border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary'}`}
          aria-label="Copy Link"
        >
          <span className="material-symbols-outlined text-[18px]">
            {copied ? 'check' : 'link'}
          </span>
        </button>
      </div>
    </div>
  );
}
