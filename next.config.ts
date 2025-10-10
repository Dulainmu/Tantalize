import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance optimizations */
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Enable React strict mode for better error detection
  reactStrictMode: true,
};

export default nextConfig;
