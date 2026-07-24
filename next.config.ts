import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js feature to allow network testing
  allowedDevOrigins: ['192.168.100.37', '193.168.4.230', '193.168.5.146'],
  async rewrites() {
    return [
      {
        source: '/api/store/:path*',
        // Route all client-side cart requests through Next.js proxy to bypass CORS
        destination: `${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://shop.elvaraskinlane.com.ng'}/wp-json/wc/store/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "shop.elvaraskinlane.com.ng",
      },
      {
        protocol: "https",
        hostname: "shop.elvaraskinlane.ng",
      }
    ],
  },
};

export default nextConfig;
